import { useState, useEffect, useCallback } from 'react'
import {
  adminFetchComponents,
  adminCreateComponent,
  adminUpdateComponent,
  adminDeleteComponent,
} from '../../api/admin'

const inputCls = 'w-full mt-1.5 bg-bg border border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-secondary focus:outline-none focus:border-accent text-sm transition-colors'
const labelCls = 'block text-xs font-bold text-primary uppercase tracking-widest mb-0.5'

const CATEGORIES = ['cpu', 'cpu-cooler', 'motherboard', 'memory', 'storage', 'video-card', 'case', 'power-supply', 'monitor']

const categoryColors = {
  'cpu': 'bg-blue-50 text-blue-700 border-blue-200',
  'video-card': 'bg-purple-50 text-purple-700 border-purple-200',
  'motherboard': 'bg-amber-50 text-amber-700 border-amber-200',
  'memory': 'bg-green-50 text-green-700 border-green-200',
  'storage': 'bg-orange-50 text-orange-700 border-orange-200',
  'power-supply': 'bg-red-50 text-red-700 border-red-200',
  'case': 'bg-gray-50 text-gray-700 border-gray-200',
  'cpu-cooler': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'monitor': 'bg-pink-50 text-pink-700 border-pink-200',
}

const emptyForm = { category: 'cpu', name: '', brand: '', price: '', specs: '' }

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-border rounded-xl ${className}`} />
}

function ComponentsPage() {
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetchComponents({ category: filterCategory, search, page, limit: 20 })
      setRows(res.data)
      setPagination(res.pagination)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filterCategory, search, page])

  useEffect(() => { load() }, [load])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [filterCategory, search])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        specs: form.specs ? JSON.parse(form.specs) : undefined,
      }
      if (editingId) {
        await adminUpdateComponent(editingId, payload)
      } else {
        await adminCreateComponent(payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      load()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (row) => {
    setEditingId(row._id)
    setForm({
      category: row.category,
      name: row.name,
      brand: row.brand ?? '',
      price: String(row.price ?? ''),
      specs: row.specs ? JSON.stringify(row.specs, null, 2) : '',
    })
  }

  const cancel = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const deleteRow = async (id) => {
    if (!window.confirm('Delete this component?')) return
    try {
      await adminDeleteComponent(id)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  const formatPrice = (p) => p ? `₹${Math.round(p * 84).toLocaleString('en-IN')}` : '—'

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Database</p>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Components</h1>
        {pagination && (
          <p className="text-secondary text-xs mt-1">{pagination.total.toLocaleString()} total components in DB</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Form */}
        <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-bold text-primary text-sm">{editingId ? 'Edit Component' : 'Add Component'}</h3>

          <label className={labelCls}>
            Category
            <select className={inputCls} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label className={labelCls}>
            Name
            <input className={inputCls} value={form.name} placeholder="e.g. AMD Ryzen 5 7600" onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </label>

          <label className={labelCls}>
            Brand
            <input className={inputCls} value={form.brand} placeholder="e.g. AMD" onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
          </label>

          <label className={labelCls}>
            Price (USD)
            <input className={inputCls} type="number" step="0.01" value={form.price} placeholder="0.00" onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-accent text-white text-sm font-bold py-2.5 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer border-0 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Component'}
            </button>
            {editingId && (
              <button type="button" onClick={cancel} className="px-4 py-2.5 rounded-xl border border-border text-secondary text-sm font-medium hover:bg-bg transition-colors cursor-pointer bg-transparent">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="bg-bg border border-border rounded-xl px-4 py-2 text-sm text-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {error && <p className="text-error text-sm mb-4">{error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Category', 'Name', 'Brand', 'Price', 'Actions'].map((h) => (
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
                ) : rows.map((row) => (
                  <tr key={row._id} className="border-b border-border/50 hover:bg-bg/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${categoryColors[row.category] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-primary font-medium max-w-[180px] truncate">{row.name}</td>
                    <td className="py-2.5 px-3 text-secondary">{row.brand ?? '—'}</td>
                    <td className="py-2.5 px-3 text-primary font-semibold">{formatPrice(row.price)}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(row)} className="px-3 py-1 text-xs font-semibold rounded-lg border border-border text-primary hover:bg-bg transition-all cursor-pointer bg-transparent">
                          Edit
                        </button>
                        <button onClick={() => deleteRow(row._id)} className="px-3 py-1 text-xs font-semibold rounded-lg bg-error/10 border border-error/30 text-error hover:bg-error/20 transition-all cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-secondary text-sm">No components found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-secondary">{rows.length} of {pagination.total.toLocaleString()} components</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-xs font-semibold rounded-lg border border-border text-secondary hover:bg-bg transition-all disabled:opacity-40 cursor-pointer bg-transparent"
                >
                  Prev
                </button>
                <span className="text-xs text-secondary font-medium">
                  {page} / {pagination.totalPages}
                </span>
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
    </div>
  )
}

export default ComponentsPage