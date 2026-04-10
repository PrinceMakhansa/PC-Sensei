import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useSaveBuilds } from '../../hooks/useSaveBuilds'
import { useNavigate } from 'react-router-dom'

const inputCls =
  'w-full bg-white border-[1.5px] border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-[#c5bdb6] focus:outline-none focus:border-accent text-sm transition-colors'
const labelCls = 'block text-[10px] font-bold text-primary mb-1.5 uppercase tracking-widest'

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0][0].toUpperCase()
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const { getAllSaved, deleteBuild } = useSaveBuilds()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [status, setStatus] = useState(null) // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [savedBuilds, setSavedBuilds] = useState([])
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (activeTab === 'builds') {
      getAllSaved().then(setSavedBuilds).catch(() => {})
    }
  }, [activeTab])

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }))
    setStatus(null)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setErrorMsg('Name cannot be empty.'); setStatus('error'); return }
    setStatus('loading')
    setErrorMsg('')
    try {
      await updateProfile({ name: form.name, email: form.email })
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.')
      setStatus('error')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <main className="flex-1 py-16 px-4 bg-bg min-h-screen">
      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-5 mb-10">
          {/* Avatar circle */}
          <div
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 28,
              boxShadow: '0 4px 20px rgba(193,63,63,0.4)',
              flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.1)',
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight leading-tight">{user?.name}</h1>
            <p className="text-sm text-secondary mt-0.5">{user?.email}</p>
            <span
              style={{
                display: 'inline-block', marginTop: 6,
                padding: '2px 10px', borderRadius: 99,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: user?.role === 'admin' ? 'rgba(193,63,63,0.15)' : 'rgba(255,255,255,0.07)',
                color: user?.role === 'admin' ? 'var(--color-accent)' : '#7a756f',
                border: `1px solid ${user?.role === 'admin' ? 'rgba(193,63,63,0.28)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {user?.role || 'user'}
            </span>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>}
            label="Saved Builds"
            value={user?.savedBuilds?.length ?? 0}
          />
          <StatCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            label="Member Since"
            value={formatDate(user?.createdAt)}
          />
        </div>

        {/* Tab switcher */}
        <div
          className="flex gap-1 mb-6 rounded-xl p-1"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', display: 'inline-flex' }}
        >
          {[{ key: 'profile', label: 'Profile' }, { key: 'builds', label: 'My Builds' }].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-5 py-2 rounded-lg text-[13px] font-semibold transition-all"
              style={activeTab === tab.key
                ? { background: 'var(--color-card)', color: 'var(--color-primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                : { color: 'var(--color-secondary)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'builds' && (
          <div className="flex flex-col gap-3">
            {savedBuilds.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
                No saved builds yet. Try the AI Builder or Prebuilds page!
              </p>
            ) : savedBuilds.map((build) => (
              <div
                key={build.buildId}
                className="rounded-2xl p-4"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[14px] font-bold" style={{ color: 'var(--color-primary)' }}>{build.title}</p>
                    <p className="text-[12px]" style={{ color: 'var(--color-secondary)' }}>
                      ₹{build.totalPrice?.toLocaleString('en-IN')} · {build.useCase}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      await deleteBuild(build.buildId)
                      setSavedBuilds((prev) => prev.filter((b) => b.buildId !== build.buildId))
                    }}
                    className="text-[12px] px-3 py-1.5 rounded-lg"
                    style={{ color: 'var(--color-error)', border: '1px solid var(--color-error)' }}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(build.parts ?? {}).map(([key, part]) => (
                    <p key={key} className="text-[11px] truncate" style={{ color: 'var(--color-secondary)' }}>
                      <span className="font-bold uppercase" style={{ color: 'var(--color-secondary)' }}>
                        {key === 'memory' ? 'RAM' : key}: 
                      </span>
                      {part.name}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <>
            {/* ── Edit form ── */}
            <div
              className="bg-card border border-border rounded-2xl p-7"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              <h2 className="text-base font-bold text-primary mb-5">Account Details</h2>

              <div className="flex flex-col gap-4">
                <label className={labelCls}>
                  Full Name
                  <div className="relative mt-1.5">
                    <input
                      className={inputCls}
                      placeholder="Your full name"
                      value={form.name}
                      onChange={set('name')}
                    />
                  </div>
                </label>

                <label className={labelCls}>
                  Email Address
                  <div className="relative mt-1.5">
                    <input
                      className={inputCls}
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set('email')}
                    />
                  </div>
                </label>
              </div>

              {/* Status feedback */}
              {status === 'success' && (
                <div className="mt-4 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-[12px] text-green-700 font-semibold">✓ Profile updated successfully.</p>
                </div>
              )}
              {status === 'error' && (
                <div className="mt-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-[12px] text-red-600 font-semibold">{errorMsg}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-6 gap-3 flex-wrap">
                <button
                  onClick={handleSave}
                  disabled={status === 'loading'}
                  className="bg-accent hover:bg-accent-dark text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 border-0 cursor-pointer disabled:opacity-60 disabled:translate-y-0"
                >
                  {status === 'loading' ? 'Saving…' : 'Save changes'}
                </button>

                <button
                  onClick={handleLogout}
                  className="text-[13px] font-semibold border-0 bg-transparent cursor-pointer transition-all"
                  style={{ color: '#e05555' }}
                >
                  Sign out
                </button>
              </div>
            </div>

            {/* ── Danger zone ── */}
            <div className="mt-6 border border-red-200/30 rounded-2xl p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#e05555] mb-1">Danger Zone</h3>
              <p className="text-xs text-secondary mb-3">Permanently delete your account and all associated data. This cannot be undone.</p>
              <button
                disabled
                className="text-xs font-semibold px-4 py-2 rounded-lg border border-red-300/40 text-red-400 opacity-50 cursor-not-allowed bg-transparent"
              >
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div
      className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
    >
      <div
        style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'rgba(193,63,63,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-0.5">{label}</p>
        <p className="text-primary font-bold text-sm">{value}</p>
      </div>
    </div>
  )
}
