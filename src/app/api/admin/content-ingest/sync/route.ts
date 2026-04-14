import { NextRequest, NextResponse } from 'next/server'
import { validateAdmin } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Parser from 'rss-parser'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

const SYSTEM_PROMPT = `You are a healthcare marketing and GTM strategist for AcquireNow (Lena Shaw).
Read this article. Determine if it is relevant to digital health products, healthcare operations, or GTM strategy.

If YES, determine the primary audience and the core theme based on these priorities:

Independent/private practice: Focus on operational leverage, tech adoption, and practice efficiency.

Digital health vendors: Focus on GTM strategy, product-market fit, reimbursement pathways, and growth.

Health systems: Focus on enterprise transformation, stakeholder alignment, and scaling innovation.

Return a JSON object with: is_relevant (boolean), target_audience (string from the three options above), core_theme (string, max 5 words), and headline (string, proposed editorial title).`

const FEEDS = [
  { name: "Beckers", url: "https://www.beckershospitalreview.com/rss.xml" },
  { name: "MobiHealthNews", url: "https://www.mobihealthnews.com/feed" },
  { name: "KFF", url: "https://kffhealthnews.org/feed/" },
  { name: "Fierce Healthcare", url: "https://www.fiercehealthcare.com/rss/digital-health.xml" }
]

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchPageText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  return stripHtml(html)
}

async function triageContent(rawText: string) {
  const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_LLM_MODEL || 'gemini-1.5-flash' })
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `Text:\n${rawText.substring(0, 15000)}` }] }],
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { responseMimeType: "application/json" }
  })
  return JSON.parse(result.response.text())
}

export async function POST(req: NextRequest) {
  const authError = await validateAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json().catch(() => ({}))
    const directUrl = body.url

    let processedCount = 0
    let ideasCount = 0

    const processUrl = async (url: string, sourceName: string) => {
      const { data: existing } = await supabaseAdmin
        .from('raw_content_feeds')
        .select('id')
        .eq('source_url', url)
        .maybeSingle()

      if (existing) return

      let rawText = ''
      try {
        rawText = await fetchPageText(url)
      } catch (e) {
        console.error(`Failed to fetch ${url}:`, e)
        return
      }

      if (!rawText.trim()) return
      processedCount++

      let isRelevant = false
      let llmResult: any = null
      try {
        llmResult = await triageContent(rawText)
        isRelevant = llmResult?.is_relevant
      } catch (e) {
        console.error('LLM triage error:', e)
      }

      if (!isRelevant || !llmResult) {
        await supabaseAdmin.from('raw_content_feeds').insert({
          source_url: url,
          source_name: sourceName,
          raw_text: rawText,
          status: 'discarded'
        })
      } else {
        const { data: newFeed, error: insertError } = await supabaseAdmin
          .from('raw_content_feeds')
          .insert({
            source_url: url,
            source_name: sourceName,
            raw_text: rawText,
            status: 'processed'
          })
          .select('id')
          .single()

        if (newFeed && !insertError) {
          await supabaseAdmin.from('blog_posts').insert({
            raw_feed_id: newFeed.id,
            target_audience: llmResult.target_audience,
            core_theme: llmResult.core_theme,
            title: llmResult.headline, // This is the Idea title
            slug: `idea-${newFeed.id.substring(0, 8)}`,
            status: 'idea'
          })
          ideasCount++
        }
      }
    }

    if (directUrl) {
      await processUrl(directUrl, "Direct URL Scrape")
    } else {
      const parser = new Parser()
      const urlsToProcess: { url: string; name: string }[] = []

      for (const feedConfig of FEEDS) {
        try {
          const feed = await parser.parseURL(feedConfig.url)
          for (const item of feed.items.slice(0, 2)) {
            if (item.link) urlsToProcess.push({ url: item.link, name: feedConfig.name })
          }
        } catch (e) {
          console.error(`Failed to parse feed ${feedConfig.name}:`, e)
        }
      }

      for (const target of urlsToProcess) {
        await processUrl(target.url, target.name)
      }
    }

    return NextResponse.json({ success: true, processed: processedCount, ingested: ideasCount })
  } catch (err) {
    console.error('Sync ingest error:', err)
    return NextResponse.json({ error: 'Failed to sync feeds' }, { status: 500 })
  }
}
