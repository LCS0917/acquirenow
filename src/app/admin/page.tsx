import { createClient } from '@/utils/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-brand-dark mb-2">Admin Control Center</h1>
      <p className="text-brand-dark/50 mb-10">Welcome back, {user?.email}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-brand-dark/5 shadow-sm">
          <h2 className="text-lg font-bold mb-2">Editorial</h2>
          <p className="text-sm text-brand-dark/60 mb-6">Manage your blog posts and content.</p>
          <a href="/admin/blog" className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:underline">Go to Blog →</a>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-brand-dark/5 shadow-sm">
          <h2 className="text-lg font-bold mb-2">CMS Settings</h2>
          <p className="text-sm text-brand-dark/60 mb-6">Update site metadata and configuration.</p>
          <a href="/admin/cms" className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:underline">Manage CMS →</a>
        </div>
      </div>
    </div>
  )
}