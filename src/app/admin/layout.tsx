import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, FileText, Settings, LogOut, ExternalLink, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

 // Replace your old navLinks with this:
const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard }, 
  { href: '/admin/cms', label: 'CMS', icon: Settings },
  { href: '/admin/blog', label: 'Editorial', icon: FileText },
]

  return (
    <div className="flex min-h-screen bg-brand-neutral/30 font-sans text-brand-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col sticky top-0 h-screen border-r border-white/5 shadow-bold z-50">
        <div className="p-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-6 w-32 transition-transform group-hover:scale-105">
               <img 
                 src="/assets/logo-white.png" 
                 alt="AcquireNow" 
                 className="h-full w-auto object-contain"
               />
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <div className="px-4 py-2 mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Management</div>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center gap-4 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
            >
              <link.icon className="w-4 h-4 text-white/20 group-hover:text-brand-gold transition-colors" />
              {link.label}
            </Link>
          ))}
          
          <div className="pt-10 mt-10 border-t border-white/5">
            <div className="px-4 py-2 mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Site</div>
            <Link 
              href="/" 
              target="_blank"
              className="flex items-center gap-4 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
            >
              <Globe className="w-4 h-4 text-white/20 group-hover:text-brand-gold transition-colors" />
              Live Site
              <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-20" />
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20 rounded-t-3xl mt-auto">
          <div className="px-4 py-4 mb-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 mb-2">Authenticated as</div>
            <div className="text-[11px] font-bold text-white/70 truncate">{user.email}</div>
          </div>
          <form action={signOut}>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group border border-transparent hover:border-red-500/20">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
