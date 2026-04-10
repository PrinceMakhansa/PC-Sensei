import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const inputCls = 'w-full bg-white border-[1.5px] border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-[#c5bdb6] focus:outline-none focus:border-accent text-sm transition-colors'
const labelCls = 'block text-[10px] font-bold text-primary mb-1.5 uppercase tracking-widest'

function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, logout } = useAuth()
  const navigate = useNavigate()

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Email and password are required.')

    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role !== 'admin') {
        logout()
        setError('Admin access only. Please use an admin account.')
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 bg-bg min-h-screen">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-7 shadow-xl">
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>
              Admin Access
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-primary">Sign in to Admin Panel</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-secondary)' }}>
            Only admin accounts can access this area.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          <label className={labelCls}>
            Email
            <div className="relative mt-1.5">
              <input
                className={inputCls}
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={set('email')}
              />
            </div>
          </label>
          <label className={labelCls}>
            Password
            <div className="relative mt-1.5">
              <input
                className={inputCls}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </label>
        </div>

        <div className="mt-4 rounded-xl p-3 text-xs" style={{ background: 'var(--color-bg)', color: 'var(--color-secondary)', border: '1px solid var(--color-border)' }}>
          <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>Test credentials</p>
          <p>email: test@test.com</p>
          <p>pass: test@123</p>
        </div>

        {error && (
          <div className="mt-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200">
            <p className="text-[12px] text-red-600 font-semibold">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 bg-accent hover:bg-accent-dark text-white font-bold text-sm py-3 rounded-xl transition-all hover:-translate-y-0.5 border-0 cursor-pointer disabled:opacity-60 disabled:translate-y-0"
        >
          {loading ? 'Please wait...' : 'Sign In'}
        </button>

        <div className="mt-4 text-xs" style={{ color: 'var(--color-secondary)' }}>
          Need a regular account?{' '}
          <Link to="/auth" className="text-accent font-semibold hover:text-accent-dark">
            Go to user login
          </Link>
        </div>
      </div>
    </main>
  )
}

export default AdminLoginPage
