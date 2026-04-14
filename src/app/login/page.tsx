import { login } from './actions'
import { Sparkles } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-brand-neutral/10">
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto py-20">
        <div className="text-center mb-12">
          <div className="relative h-16 w-48 mx-auto mb-10 transition-transform hover:scale-105">
             <img 
               src="/assets/logo-color.png" 
               alt="AcquireNow" 
               className="h-full w-auto object-contain mx-auto"
             />
          </div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-4">Admin Authentication</h1>
          <p className="text-gray-500 font-medium italic">Secure access for Lena Shaw's digital operations hub.</p>
        </div>

        <div className="bg-white p-10 border border-brand-neutral/50 rounded-sm shadow-2xl shadow-brand-dark/5">
          <form className="flex flex-col w-full gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400" htmlFor="email">
                Identity
              </label>
              <input
                className="w-full rounded-sm px-4 py-3 bg-brand-neutral/20 border-transparent focus:bg-white focus:border-brand-plum/30 transition-all text-sm outline-none"
                name="email"
                type="email"
                placeholder="operator@acquirenow.com"
                required
              />
            </div>
            
            <button
              formAction={login}
              className="brand-button-primary w-full py-4 flex items-center justify-center gap-3"
            >
              <Sparkles className="w-4 h-4" />
              Request Magic Link
            </button>
            
            {message && (
              <div className="mt-4 p-4 bg-brand-plum/5 text-brand-plum text-center rounded-sm text-xs font-bold uppercase tracking-widest border border-brand-plum/10">
                {message}
              </div>
            )}
          </form>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-neutral/40">
            Unauthorized access is strictly monitored.
          </p>
        </div>
      </div>
    </div>
  )
}
