import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'register'
type Banner = 'confirm_email' | null

interface Props {
  onAuth: () => void | Promise<void>
}

export default function Auth({ onAuth }: Props) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [banner, setBanner] = useState<Banner>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setBanner(null)
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      if (mode === 'register') {
        const { data, error: e } = await supabase.auth.signUp({ email: email.trim(), password })
        if (e) { setError(e.message); return }
        // If session is null, Supabase sent a confirmation email
        if (!data.session) { setBanner('confirm_email'); return }
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (e) {
          if (e.message.toLowerCase().includes('not confirmed')) {
            setBanner('confirm_email')
          } else {
            setError(e.message)
          }
          return
        }
      }
      await onAuth()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[1.75rem] shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:flex bg-[#103d2c] text-white p-12 flex-col justify-between min-h-[38rem]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-xl">☕</div>
            <p className="text-xl font-bold tracking-tight">SourceTrade</p>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight leading-tight max-w-md">Better ingredients, sourced with confidence.</p>
            <p className="text-white/65 mt-4 leading-relaxed max-w-md">Place sourcing requests, follow quality checks, and track every order from one workspace.</p>
            <div className="grid grid-cols-3 gap-3 mt-9">
              {['Verified supply', 'Quality tested', 'Clear tracking'].map(item => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-xs font-semibold text-white/80">{item}</div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/40">Premium ingredients, on demand</p>
        </div>
        <div className="flex flex-col justify-center">

        {/* Logo */}
        <div className="px-8 pt-10 pb-6 text-center border-b border-[#f0f4f2] lg:border-0 lg:pb-4">
          <div className="w-16 h-16 bg-[#f0faf5] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">☕</div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight lg:text-3xl">Welcome to SourceTrade</h1>
          <p className="text-[#8a9e96] text-xs lg:text-sm mt-1">Sign in or create your buyer account</p>
        </div>

        {/* Tab switcher */}
        <div className="flex mx-6 lg:mx-10 mt-6 bg-[#f0f4f2] rounded-xl p-1">
          {(['login', 'register'] as Mode[]).map(m => (
            <button type="button" key={m} onClick={() => { setMode(m); setError(''); setBanner(null) }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-[#8a9e96]'
              }`}>
              {m === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="px-6 lg:px-10 py-6 lg:pb-10 space-y-4">

          {banner === 'confirm_email' && (
            <div className="bg-[#f0faf5] border border-[#a6dfbf] rounded-xl px-4 py-3 flex gap-2.5">
              <span className="text-base shrink-0">📬</span>
              <div>
                <p className="text-xs font-semibold text-[#1b8a5a]">Check your email</p>
                <p className="text-[11px] text-[#4a7a64] mt-0.5 leading-relaxed">
                  We sent a confirmation link to <span className="font-semibold">{email}</span>. Click it, then come back and log in.
                </p>
              </div>
            </div>
          )}

          {!banner && (
            <>
              <Field label="Email" placeholder="you@business.com" value={email} onChange={setEmail} type="email" />
              <Field label="Password" placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'} value={password} onChange={setPassword} type="password" />
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {!banner && (
            <button type="submit" disabled={loading}
              className="w-full bg-[#1b8a5a] disabled:bg-[#c8ddd4] text-white rounded-2xl py-4 text-[15px] font-semibold flex items-center justify-center gap-2 mt-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : mode === 'login' ? 'Log In' : 'Create Account'
              }
            </button>
          )}

          <p className="text-center text-[11px] text-[#b0bdb8] pt-1">
            {mode === 'login'
              ? <>No account? <button type="button" onClick={() => { setMode('register'); setError('') }} className="text-[#1b8a5a] font-semibold">Register</button></>
              : <>Already registered? <button type="button" onClick={() => { setMode('login'); setError('') }} className="text-[#1b8a5a] font-semibold">Log In</button></>
            }
          </p>
        </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, placeholder, value, onChange, type }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; type: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#6a8a7a] mb-1.5 uppercase tracking-wider">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        autoComplete={type === 'email' ? 'email' : 'current-password'}
        className="w-full px-4 py-3.5 rounded-xl text-[15px] border border-[#e4eae7] bg-[#f9fbfa] text-gray-900 focus:border-[#1b8a5a] focus:outline-none transition-colors" />
    </div>
  )
}
