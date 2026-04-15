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

    // Brand palette — hex equivalents of the oklch tokens in globals.css
    //   brand-plum    oklch(32% 0.12 301) ≈ #522A6F
    //   brand-neutral oklch(96% 0.01 301) ≈ #F5F2F5
    //   brand-gold    oklch(88% 0.14 88)  ≈ #E8C26A
    const isDark = theme === 'dark'
    const bgColor = isDark ? '#522A6F' : '#F5F2F5' // dark = brand-plum
    const textColor = isDark ? '#F5F2F5' : '#522A6F'
    const accentColor = '#E8C26A' // brand-gold

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
            padding: '80px 120px',
            fontFamily: 'Georgia, serif',
            position: 'relative',
          }}
        >
          {/* Top-left brand mark */}
          <div
            style={{
              position: 'absolute',
              top: 56,
              left: 120,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: accentColor,
            }}
          >
            <div style={{ width: 40, height: 2, backgroundColor: accentColor }} />
            AcquireNow
          </div>

          {/* Title */}
          <div
            style={{
              fontSize,
              fontWeight: 700,
              color: textColor,
              textAlign: 'center',
              lineHeight: 1.2,
              wordWrap: 'break-word',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontStyle: 'italic',
            }}
          >
            <div>{line1}</div>
            {line2 && <div>{line2}</div>}
          </div>

          {/* Bottom accent bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 64,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 3,
              backgroundColor: accentColor,
            }}
          />
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
