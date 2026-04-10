import { useState, useEffect, useCallback } from 'react'
import { adminFetchBuilds } from '../../api/admin'

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-border rounded-xl ${className}`} />
}

function BuildsPage() {
  const [builds, setBuilds] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetchBuilds({ page, limit: 20 })
      setBuilds(res.data)
      setPagination(res.pagination)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const formatPrice = (p) =>
    p ? `₹${Math.round(p * 84).toLocaleString('en-IN')}` : '—'

  // Client-side search filter on loaded page
  const filtered = builds.filter((b) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (b.name ?? '').toLowerCase().includes(q) ||
      (b.userId ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">History</p>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Builds</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-7 w-12" />
            </div>
          ))
        ) : (
          <>
            {[
              { label: 'Total Builds', value: pagination?.total ?? builds.length },
              { label: 'This Page', value: builds.length },
              {
                label: 'Avg. Parts',
                value: builds.length
                  ? Math.round(builds.reduce((a, b) => a + (b.parts?.length ?? 0), 0) / builds.length)
                  : '—',
              },
              {
                label: 'Avg. Budget',
                value: builds.length
                  ? formatPrice(builds.reduce((a, b) => a + (b.totalPrice ?? 0), 0) / builds.length)
                  : '—',
              },
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
            placeholder="Search by build name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="text-error text-sm mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['Build Name', 'Parts', 'Total Price', 'Created', 'ID'].map((h) => (
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
              ) : filtered.map((b) => (
                <tr key={b._id} className="border-b border-border/50 hover:bg-bg/60 transition-colors">
                  <td className="py-2.5 px-3 text-primary font-medium">
                    {b.name || <span className="text-secondary italic">Untitled</span>}
                  </td>
                  <td className="py-2.5 px-3 text-secondary">{b.parts?.length ?? 0} parts</td>
                  <td className="py-2.5 px-3 text-primary font-semibold">{formatPrice(b.totalPrice)}</td>
                  <td className="py-2.5 px-3 text-secondary text-xs">
                    {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-2.5 px-3 text-secondary text-xs font-mono truncate max-w-[80px]">
                    {b._id.slice(-6)}
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-secondary text-sm">No builds found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-secondary">{filtered.length} of {pagination.total.toLocaleString()} builds</p>
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

export default BuildsPage