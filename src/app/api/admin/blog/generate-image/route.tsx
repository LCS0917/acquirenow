import { NextRequest, NextResponse } from 'next/server'
import { validateAdmin } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ImageResponse } from 'next/og'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  const authError = await validateAdmin(req)
  if (authError) return authError

  try {
    const { title, theme } = await req.json().catch(() => ({}))

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const isDark = theme === 'dark'
    const bgColor = isDark ? '#003B46' : '#FAFAF8'
    const textColor = isDark ? '#FAFAF8' : '#003B46'

    const cleanTitle = title.trim().replace(/\s+/g, ' ')
    // Dynamic font sizing based on length
    const fontSize = cleanTitle.length > 70 ? '54px' : cleanTitle.length > 40 ? '64px' : '76px'

    const hasColon = cleanTitle.includes(':')
    const parts = cleanTitle.split(':')
    const line1 = hasColon ? parts[0] + ':' : cleanTitle
    const line2 = hasColon ? parts.slice(1).join(':').trim() : ''

    const imageRes = new ImageResponse(
      (
        <div
          style={{
            backgroundColor: bgColor,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 120px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              fontSize,
              fontWeight: 800,
              color: textColor,
              textAlign: 'center',
              lineHeight: 1.3,
              wordWrap: 'break-word',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>{line1}</div>
            {line2 && <div>{line2}</div>}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
      }
    )

    const arrayBuffer = await imageRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.png`

    const { error } = await supabaseAdmin.storage
      .from('blog-images')
      .upload(filename, buffer, { contentType: 'image/png', upsert: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from('blog-images').getPublicUrl(filename)
    return NextResponse.json({ url: data.publicUrl })
  } catch (err: any) {
    console.error('Image generation error:', err)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
