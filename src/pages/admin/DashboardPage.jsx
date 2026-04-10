import { useEffect, useState } from 'react'
import { fetchDashboardStats } from '../../api/admin'

const statusColors = {
  Gaming: 'bg-blue-50 text-blue-700 border-blue-200',
  Budget: 'bg-green-50 text-green-700 border-green-200',
  Workstation: 'bg-purple-50 text-purple-700 border-purple-200',
  Upgrade: 'bg-amber-50 text-amber-700 border-amber-200',
}

function StatCard({ label, value, sub, up }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <p className="text-xs text-secondary font-medium mb-2">{label}</p>
      <p className="text-2xl font-extrabold text-primary tracking-tight mb-1">{value}</p>
      {sub && <p className={`text-[11px] font-semibold ${up ? 'text-success' : 'text-secondary'}`}>{sub}</p>}
    </div>
  )
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-border rounded-xl ${className}`} />
}

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    return (
      <div className="p-8">
        <p className="text-error text-sm">Failed to load dashboard: {error}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Overview</p>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Components" value={stats.totals.components.toLocaleString()} up={true} />
            <StatCard label="Registered Users" value={stats.totals.users.toLocaleString()} up={true} />
            <StatCard label="Total Builds" value={stats.totals.builds.toLocaleString()} up={true} />
            <StatCard
              label="Categories"
              value={stats.componentsByCategory.length}
              sub={`Top: ${stats.componentsByCategory[0]?._id ?? '—'}`}
              up={true}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Recent Builds */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold text-primary mb-5 text-sm">Recent Builds</h2>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
            </div>
          ) : stats.recentBuilds.length === 0 ? (
            <p className="text-secondary text-sm py-6 text-center">No builds yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Parts', 'Total Price', 'Date'].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-secondary font-medium text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBuilds.map((b) => (
                    <tr key={b._id} className="border-b border-border/50 hover:bg-bg/60 transition-colors">
                      <td className="py-2.5 px-3 text-primary font-medium">{b.name || 'Untitled Build'}</td>
                      <td className="py-2.5 px-3 text-secondary">{b.parts?.length ?? 0} parts</td>
                      <td className="py-2.5 px-3 text-primary font-semibold">
                        {b.totalPrice ? `₹${Math.round(b.totalPrice * 84).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-secondary text-xs">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Components by Category */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold text-primary mb-5 text-sm">Components by Category</h2>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.componentsByCategory.slice(0, 8).map((c, i) => (
                <div key={c._id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-lg bg-accent/10 text-accent text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary truncate capitalize">{c._id}</p>
                  </div>
                  <span className="text-xs font-bold text-secondary flex-shrink-0">
                    {c.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      {!loading && stats.recentUsers.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 mt-6">
          <h2 className="font-bold text-primary mb-5 text-sm">Recently Joined Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['User', 'Email', 'Role', 'Joined'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-secondary font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((u) => (
                  <tr key={u._id} className="border-b border-border/50 hover:bg-bg/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-accent/10 text-accent text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                          {(u.name || u.email).slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-primary">{u.name || '—'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-secondary">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
                        u.role === 'admin' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {u.role ?? 'user'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-secondary text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage