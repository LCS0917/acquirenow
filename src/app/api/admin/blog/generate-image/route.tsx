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
    // Applying AcquireNow Brand Colors
    const bgColor = isDark ? '#222023' : '#EFEBE8'
    const textColor = isDark ? '#EFEBE8' : '#222023'
    const accentColor = '#522A6F' // Brand Plum

    const cleanTitle = title.trim().replace(/\s+/g, ' ')
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
            position: 'relative',
          }}
        >
          {/* Subtle Accent Stripe */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '12px', backgroundColor: accentColor }} />
          
          <div
            style={{
              fontSize,
              fontWeight: 900,
              color: textColor,
              textAlign: 'center',
              lineHeight: 1.1,
              wordWrap: 'break-word',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              letterSpacing: '-0.04em',
            }}
          >
            <div style={{ marginBottom: '10px' }}>{line1}</div>
            {line2 && <div style={{ color: accentColor, opacity: 0.8 }}>{line2}</div>}
          </div>

          <div style={{ 
            position: 'absolute', 
            bottom: '60px', 
            fontSize: '24px', 
            fontWeight: 700, 
            color: textColor, 
            opacity: 0.4,
            textTransform: 'uppercase',
            letterSpacing: '0.3em'
          }}>
            AcquireNow
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
