import { NextRequest, NextResponse } from 'next/server'
import { validateAdmin } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: NextRequest) {
  const authError = await validateAdmin(req)
  if (authError) return authError

  try {
    const { draft_id } = await req.json()
    if (!draft_id) {
      return NextResponse.json({ error: 'Missing draft_id' }, { status: 400 })
    }

    // Get the draft idea metadata
    const { data: draft } = await supabaseAdmin
      .from('blog_posts')
      .select('raw_feed_id, target_audience, core_theme, title')
      .eq('id', draft_id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Idea record not found' }, { status: 404 })
    }

    // Get the raw text from the ingestion phase
    const { data: rawFeed } = await supabaseAdmin
      .from('raw_content_feeds')
      .select('raw_text')
      .eq('id', draft.raw_feed_id)
      .single()

    if (!rawFeed || !rawFeed.raw_text) {
      return NextResponse.json({ error: 'Raw source content not found' }, { status: 404 })
    }

    const SYSTEM_PROMPT = `You are a healthcare marketing editor for AcquireNow (Lena Shaw). 
Write a high-impact blog post based on the provided text, targeting ${draft.target_audience} about ${draft.core_theme}.

Editorial Principles:
1. Product-Minded: Focus on how operations and strategy drive real product outcomes.
2. Expertise-Led: Use authoritative, founder-led framing.
3. No Fluff: Get straight to the strategic implications.

Structure:
- Hook: Validate a specific healthcare pain point.
- Context: Explain 'The Problem' and 'What Changed' in the landscape.
- Mechanics: Break down the solution/approach in bullet points.
- Action Plan: Provide 2-3 immediate takeaways for the reader.

Formatting Rules:
- Output CLEAN HTML (h2, p, ul, li, blockquote).
- Include 1-2 relevant quotes from the original source.
- Hyperlinks: If you include them, use target="_blank" rel="noopener noreferrer".

Output format — use EXACTLY these delimiters:
###TITLE###
Your compelling title here
###BODY###
Your HTML body here
###END###`

    const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_LLM_MODEL || 'gemini-1.5-flash' })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Original Source Text:\n${rawFeed.raw_text.substring(0, 20000)}` }] }],
      systemInstruction: SYSTEM_PROMPT,
    })

    const textResponse = result.response.text()

    const titleMatch = textResponse.match(/###TITLE###\s*([\s\S]*?)\s*###BODY###/)
    const bodyMatch = textResponse.match(/###BODY###\s*([\s\S]*?)\s*###END###/)

    if (!titleMatch?.[1] || !bodyMatch?.[1]) {
      console.error('Draft parse failure. Raw response:', textResponse)
      throw new Error('AI did not return expected structure. Please try again.')
    }

    const llmTitle = titleMatch[1].trim()
    const llmBody = bodyMatch[1].trim()

    // Update the record from 'idea' to 'draft'
    const { data: updatedDraft, error: updateError } = await supabaseAdmin
      .from('blog_posts')
      .update({
        draft_title: llmTitle,
        draft_body: llmBody,
        status: 'draft',
        // Update slug to reflect real title
        slug: `${llmTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${draft_id.substring(0, 4)}`
      })
      .eq('id', draft_id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ success: true, draft: updatedDraft })
  } catch (err: any) {
    console.error('Draft generation error:', err)
    return NextResponse.json({ error: err.message || 'Failed to generate draft' }, { status: 500 })
  }
}
