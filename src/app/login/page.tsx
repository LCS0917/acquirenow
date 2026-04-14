import { login } from './actions'

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-neutral/30 font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-bold p-12 border border-brand-dark/5">
        <div className="flex justify-center mb-8">
          <img src="/assets/logo.png" alt="AcquireNow" className="h-8 w-auto" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-brand-dark mb-3">Admin Login</h1>
          <p className="text-sm text-brand-dark/50 leading-relaxed px-4">
            Enter your credentials to access the digital operations hub.
          </p>
        </div>

        <form action={login} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 ml-4">Identity</label>
            <input 
              name="email" 
              type="email" 
              placeholder="email@example.com" 
              required 
              className="w-full px-6 py-4 rounded-2xl bg-brand-neutral/50 border border-transparent focus:border-brand-gold/30 focus:bg-white transition-all outline-none text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 ml-4">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              className="w-full px-6 py-4 rounded-2xl bg-brand-neutral/50 border border-transparent focus:border-brand-gold/30 focus:bg-white transition-all outline-none text-sm font-medium"
            />
          </div>

          <button className="w-full mt-4 bg-brand-dark text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-lg active:scale-[0.98]">
            Sign In
          </button>
        </form>

        {searchParams.message && (
          <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest text-center italic">
              {searchParams.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}