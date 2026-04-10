import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import senseiImg from '../../assets/sensei.png'

const inputCls = 'w-full bg-white border-[1.5px] border-border rounded-xl px-4 py-2.5 pl-9 text-primary placeholder:text-[#c5bdb6] focus:outline-none focus:border-accent text-sm transition-colors'
const labelCls = 'block text-[10px] font-bold text-primary mb-1.5 uppercase tracking-widest'

const FieldIcon = ({ d, extra }) => (
  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {extra}
      <path d={d} />
    </svg>
  </span>
)

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async () => {
    setError('')

    // Basic validation
    if (!form.email || !form.password) return setError('Email and password are required.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')

    if (mode === 'register') {
      if (form.password !== form.confirm) return setError('Passwords do not match.')
    }

    setLoading(true)
    try {
      let user
      if (mode === 'login') {
        user = await login(form.email, form.password)
      } else {
        const name = `${form.firstName} ${form.lastName}`.trim()
        user = await register(name, form.email, form.password)
      }

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setForm({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 bg-bg min-h-screen">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-border shadow-xl grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">

        {/* ── Left panel ── */}
        <div
          className="auth-left hidden lg:flex flex-col justify-between relative overflow-hidden"
          style={{
            background: '#222426',
            clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)',
            padding: '40px 64px 40px 40px',
            zIndex: 2,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          />

          <div className="flex items-center z-10">
            <img src="/PCSensei.png" alt="PCSensei logo" className="h-9 w-auto object-contain" />
          </div>

          <div className="flex flex-col items-center flex-1 justify-center z-10 gap-3">
            <img
              src={senseiImg}
              alt="PCSensei Sensei Mascot"
              className="w-full max-w-[340px] object-contain"
              style={{ background: 'transparent' }}
            />
            <div className="mt-5 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 max-w-[280px] text-center">
              <p className="text-bg font-['Yuji_Syuku'] text-[15px] leading-relaxed mb-1">
                "The right GPU is not chosen — it is <span className="text-accent">understood.</span>"
              </p>
              <p className="text-[#5a5550] text-[10px] uppercase tracking-widest font-semibold">— The Sensei</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 z-10">
            {[
              'AI-powered build recommendations',
              'Real-time compatibility checks',
              'Save, export & share your builds',
            ].map((p) => (
              <div key={p} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span className="text-secondary text-[11px]">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="bg-bg flex flex-col justify-center px-10 py-11" style={{ zIndex: 1 }}>

          {/* Tabs */}
          <div className="flex bg-card border border-border rounded-xl p-1 mb-7">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => switchMode(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === t
                  ? 'bg-white border border-accent/25 text-accent-dark'
                  : 'text-secondary border border-transparent'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {mode === 'login' ? (
            <>
              <h2 className="text-[22px] font-extrabold text-primary tracking-tight mb-1">Welcome back</h2>
              <p className="text-sm text-secondary mb-6">
                No account?{' '}
                <button onClick={() => switchMode('register')} className="text-accent font-semibold hover:text-accent-dark">
                  Sign up free
                </button>
              </p>

              <div className="flex flex-col gap-3.5">
                <label className={labelCls}>
                  Email
                  <div className="relative mt-1.5">
                    <FieldIcon d="M2 4h20v16H2z M2 4l10 9 10-9" />
                    <input className={inputCls} type="email" placeholder="you@example.com"
                      value={form.email} onChange={set('email')} />
                  </div>
                </label>
                <label className={labelCls}>
                  Password
                  <div className="relative mt-1.5">
                    <FieldIcon d="M7 11V7a5 5 0 0 1 10 0v4" extra={<rect x="3" y="11" width="18" height="11" rx="2" />} />
                    <input className={inputCls} type="password" placeholder="••••••••"
                      value={form.password} onChange={set('password')}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
                  </div>
                </label>
              </div>
              <div className="mt-2 mb-5" />
            </>
          ) : (
            <>
              <h2 className="text-[22px] font-extrabold text-primary tracking-tight mb-1">Join PCSensei</h2>
              <p className="text-sm text-secondary mb-6">
                Have an account?{' '}
                <button onClick={() => switchMode('login')} className="text-accent font-semibold hover:text-accent-dark">
                  Sign in
                </button>
              </p>

              <div className="grid grid-cols-2 gap-3 mb-0">
                <label className={labelCls}>
                  First name
                  <div className="relative mt-1.5">
                    <FieldIcon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" extra={<circle cx="12" cy="7" r="4" />} />
                    <input className={inputCls} placeholder="Alex"
                      value={form.firstName} onChange={set('firstName')} />
                  </div>
                </label>
                <label className={labelCls}>
                  Last name
                  <div className="relative mt-1.5">
                    <FieldIcon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" extra={<circle cx="12" cy="7" r="4" />} />
                    <input className={inputCls} placeholder="Smith"
                      value={form.lastName} onChange={set('lastName')} />
                  </div>
                </label>
              </div>

              <div className="flex flex-col gap-3.5 mt-3.5">
                <label className={labelCls}>
                  Email
                  <div className="relative mt-1.5">
                    <FieldIcon d="M2 4h20v16H2z M2 4l10 9 10-9" />
                    <input className={inputCls} type="email" placeholder="you@example.com"
                      value={form.email} onChange={set('email')} />
                  </div>
                </label>
                <label className={labelCls}>
                  Password
                  <div className="relative mt-1.5">
                    <FieldIcon d="M7 11V7a5 5 0 0 1 10 0v4" extra={<rect x="3" y="11" width="18" height="11" rx="2" />} />
                    <input className={inputCls} type="password" placeholder="Min. 8 characters"
                      value={form.password} onChange={set('password')} />
                  </div>
                </label>
                <label className={labelCls}>
                  Confirm password
                  <div className="relative mt-1.5">
                    <FieldIcon d="M7 11V7a5 5 0 0 1 10 0v4" extra={<rect x="3" y="11" width="18" height="11" rx="2" />} />
                    <input className={inputCls} type="password" placeholder="••••••••"
                      value={form.confirm} onChange={set('confirm')}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
                  </div>
                </label>
              </div>
              <div className="mt-5" />
            </>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200">
              <p className="text-[12px] text-red-600 font-semibold">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-white font-bold text-sm py-3 rounded-xl transition-all hover:-translate-y-0.5 border-0 cursor-pointer disabled:opacity-60 disabled:translate-y-0"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-[#bdb6af] font-bold uppercase tracking-widest">or</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <button
            disabled
            className="w-full bg-white border-[1.5px] border-border rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-secondary opacity-50 cursor-not-allowed"
            title="Google OAuth coming soon"
          >
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {mode === 'register' && (
            <p className="text-[11px] text-[#bdb6af] text-center mt-4 leading-relaxed">
              By signing up you agree to our{' '}
              <Link to="/terms" className="text-accent hover:text-accent-dark">Terms</Link>
              {' '}&{' '}
              <Link to="/privacy" className="text-accent hover:text-accent-dark">Privacy Policy</Link>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

export default AuthPage