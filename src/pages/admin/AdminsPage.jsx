import { useEffect, useMemo, useState } from 'react'
import { adminDemoteByEmail, adminFetchUsers, adminPromoteByEmail } from '../../api/admin'
import { useAuth } from '../../hooks/useAuth'

function AdminsPage() {
  const [email, setEmail] = useState('')
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [query, setQuery] = useState('')
  const { user } = useAuth()

  const normalizedEmail = email.trim().toLowerCase()
  const isExistingAdmin = admins.some((u) => u.email?.toLowerCase() === normalizedEmail)
  const selfEmail = user?.email?.toLowerCase()

  const loadAdmins = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetchUsers({ page: 1, limit: 50 })
      setAdmins(res.data.filter((u) => u.role === 'admin'))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  const filteredAdmins = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return admins
    return admins.filter((u) =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    )
  }, [admins, query])

  const promote = async (e) => {
    e.preventDefault()
    const value = normalizedEmail
    if (!value || isExistingAdmin) return

    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      await adminPromoteByEmail(value)
      setNotice('Admin role granted.')
      setEmail('')
      loadAdmins()
    } catch (e2) {
      setError(e2.message)
    } finally {
      setSaving(false)
    }
  }

  const demote = async (emailValue) => {
    if (!emailValue) return
    if (!window.confirm(`Demote ${emailValue} to user?`)) return

    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      await adminDemoteByEmail(emailValue)
      setNotice('Admin role removed.')
      loadAdmins()
    } catch (e2) {
      setError(e2.message)
    } finally {
      setSaving(false)
    }
  }

  const copyEmail = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
      setNotice('Email copied.')
    } catch {
      setNotice('Copy failed. Try manually selecting the email.')
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Management</p>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Admins</h1>
        <p className="text-secondary text-sm mt-2">
          Grant admin access by email. Only existing users can be promoted.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs text-secondary font-medium mb-1">Total Admins</p>
          <p className="text-2xl font-extrabold text-primary">{loading ? '—' : admins.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs text-secondary font-medium mb-1">Status</p>
          <p className={`text-sm font-semibold ${error ? 'text-error' : 'text-primary'}`}>
            {error ? 'Action needed' : (saving ? 'Updating...' : 'Ready')}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <form onSubmit={promote} className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <button
            type="submit"
            disabled={saving || !normalizedEmail || isExistingAdmin}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-accent text-white hover:bg-accent-dark transition-all disabled:opacity-60"
          >
            {saving ? 'Adding...' : 'Add Admin'}
          </button>
        </form>
        {isExistingAdmin && (
          <p className="text-secondary text-xs mt-2">That user is already an admin.</p>
        )}
        {error && <p className="text-error text-sm mt-3">{error}</p>}
        {notice && <p className="text-green-600 text-sm mt-3">{notice}</p>}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-primary">Current Admins</h2>
          <input
            className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
            placeholder="Filter by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-secondary text-sm">Loading admins...</p>
        ) : admins.length === 0 ? (
          <div className="text-secondary text-sm">
            <p>No admins found.</p>
            <p className="text-xs mt-1">Add the first admin using the form above.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAdmins.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-primary text-sm font-medium">{u.name || '—'}</p>
                  <p className="text-secondary text-xs">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyEmail(u.email)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-border text-secondary hover:text-primary hover:bg-bg transition-all"
                  >
                    Copy
                  </button>
                  <button
                    disabled={saving || (selfEmail && u.email?.toLowerCase() === selfEmail)}
                    onClick={() => demote(u.email)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-error/30 text-error hover:bg-error/10 transition-all disabled:opacity-50"
                  >
                    Demote
                  </button>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg border bg-accent/10 text-accent border-accent/20">
                    admin
                  </span>
                </div>
              </div>
            ))}
            {!loading && filteredAdmins.length === 0 && (
              <div className="py-6 text-secondary text-sm">No admins match your filter.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminsPage
