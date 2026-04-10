import { useState, useEffect, useCallback } from 'react'
import { adminFetchUsers, adminDeleteUser } from '../../api/admin'

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-border rounded-xl ${className}`} />
}

function UsersPage() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetchUsers({ search, page, limit: 20 })
      setUsers(res.data)
      setPagination(res.pagination)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search])

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await adminDeleteUser(id)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  const initials = (u) => {
    if (u.name) return u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    return u.email.slice(0, 2).toUpperCase()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Management</p>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Users</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-7 w-12" />
            </div>
          ))
        ) : (
          <>
            {[
              { label: 'Total Users', value: pagination?.total ?? users.length },
              { label: 'Admins', value: users.filter((u) => u.role === 'admin').length },
              { label: 'Regular Users', value: users.filter((u) => u.role !== 'admin').length },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs text-secondary font-medium mb-1">{s.label}</p>
                <p className="text-2xl font-extrabold text-primary">{s.value}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex gap-3 mb-5">
          <input
            className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="text-error text-sm mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['User', 'Email', 'Role', 'Joined', 'Action'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-secondary font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array(5).fill(0).map((_, j) => (
                      <td key={j} className="py-3 px-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : users.map((u) => (
                <tr key={u._id} className="border-b border-border/50 hover:bg-bg/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-accent/10 text-accent text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                        {initials(u)}
                      </div>
                      <span className="font-semibold text-primary">{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-secondary">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
                      u.role === 'admin'
                        ? 'bg-accent/10 text-accent border-accent/20'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      {u.role ?? 'user'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-secondary text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => deleteUser(u._id, u.name || u.email)}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-error/10 border border-error/30 text-error hover:bg-error/20 transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-secondary text-sm">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-secondary">{users.length} of {pagination.total.toLocaleString()} users</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-xs font-semibold rounded-lg border border-border text-secondary hover:bg-bg transition-all disabled:opacity-40 cursor-pointer bg-transparent"
              >
                Prev
              </button>
              <span className="text-xs text-secondary font-medium">{page} / {pagination.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 text-xs font-semibold rounded-lg border border-border text-secondary hover:bg-bg transition-all disabled:opacity-40 cursor-pointer bg-transparent"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage