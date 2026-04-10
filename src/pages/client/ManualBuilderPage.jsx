import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { fetchComponents } from '../../api/components'
import { useSaveBuilds } from '../../hooks/useSaveBuilds'

// ─── Maps frontend display names → DB category slugs ──────────────────────────
const TYPE_TO_CATEGORY = {
  CPU:            'cpu',
  GPU:            'video-card',
  Motherboard:    'motherboard',
  RAM:            'memory',
  Storage:        'storage',
  'Power Supply': 'power-supply',
  Case:           'case',
}

const componentTypes = Object.keys(TYPE_TO_CATEGORY)

// ─── Live USD→INR exchange rate ───────────────────────────────────────────────
const useLiveRate = () => {
  const [rate, setRate] = useState(83.5)
  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((r) => r.json())
      .then((d) => { if (d?.rates?.INR) setRate(d.rates.INR) })
      .catch(() => {})
  }, [])
  return rate
}

// ─── Price helpers ────────────────────────────────────────────────────────────
const getPrice = (component, rate = 83.5) => {
  if (!component) return 0
  const usd = typeof component.price === 'number' ? component.price : parseFloat(component.price) || 0
  return Math.round(usd * rate)
}

const getWattage = (component) => {
  if (!component?.specs) return 0
  const s = component.specs
  for (const v of [s.tdp, s.wattage, s.power, s['tdp_(w)'], s['power_(w)']]) {
    const n = parseInt(v)
    if (!isNaN(n) && n > 0) return n
  }
  return 0
}

// ─── Compatibility engine ─────────────────────────────────────────────────────
const checkCompatibility = (candidate, viewingType, build) => {
  const specs = candidate?.specs || {}

  // Motherboard ↔ CPU socket
  if (viewingType === 'Motherboard' && build.CPU) {
    const cpuSocket = build.CPU.specs?.socket
    const mbSocket = specs.socket
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      return { compatible: false, reason: `Socket mismatch: CPU needs ${cpuSocket}, board has ${mbSocket}` }
    }
  }

  if (viewingType === 'CPU' && build.Motherboard) {
    const mbSocket = build.Motherboard.specs?.socket
    const cpuSocket = specs.socket
    if (mbSocket && cpuSocket && mbSocket !== cpuSocket) {
      return { compatible: false, reason: `Socket mismatch: board needs ${mbSocket}, CPU has ${cpuSocket}` }
    }
  }

  // RAM ↔ Motherboard DDR type
  if (viewingType === 'RAM' && build.Motherboard) {
    const mbMemType = build.Motherboard.specs?.memory_type?.toString().toUpperCase() || ''
    const ramType = (specs.type || specs.memory_type || specs.speed || '').toString().toUpperCase()
    if (mbMemType && ramType) {
      if (mbMemType.includes('DDR5') && !ramType.includes('DDR5')) return { compatible: false, reason: 'Board needs DDR5, this is DDR4' }
      if (mbMemType.includes('DDR4') && ramType.includes('DDR5')) return { compatible: false, reason: 'Board needs DDR4, this is DDR5' }
    }
  }

  // CPU brand → Motherboard chipset hint
  if (viewingType === 'Motherboard' && build.CPU) {
    const cpuName = build.CPU.name?.toLowerCase() || ''
    const mbName = candidate.name?.toLowerCase() || ''
    const isAMDcpu = cpuName.includes('amd') || cpuName.includes('ryzen') || cpuName.includes('athlon')
    const isIntelCpu = cpuName.includes('intel') || cpuName.includes('core i') || cpuName.includes('pentium') || cpuName.includes('xeon')
    const isAMDmb = /b[0-9]{3}|x[0-9]{3}|a[0-9]{3}/.test(mbName) && (mbName.includes('am4') || mbName.includes('am5') || mbName.includes('b450') || mbName.includes('b550') || mbName.includes('x570') || mbName.includes('b650') || mbName.includes('x670'))
    const isIntelMb = mbName.includes('z790') || mbName.includes('z690') || mbName.includes('b760') || mbName.includes('h770') || mbName.includes('z590') || mbName.includes('b560') || mbName.includes('h510') || mbName.includes('z490')
    if (isAMDcpu && isIntelMb) return { compatible: false, reason: 'AMD CPU needs AMD chipset motherboard' }
    if (isIntelCpu && isAMDmb) return { compatible: false, reason: 'Intel CPU needs Intel chipset motherboard' }
  }

  return { compatible: true, reason: null }
}

// ─── Component meta ───────────────────────────────────────────────────────────
const componentMeta = {
  CPU: {
    color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.12)',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#c13f3f" strokeWidth="1.5"><rect x="3" y="3" width="10" height="10" rx="1.5" /><rect x="5.5" y="5.5" width="5" height="5" rx="0.5" /><line x1="6" y1="1.5" x2="6" y2="3" /><line x1="10" y1="1.5" x2="10" y2="3" /><line x1="6" y1="13" x2="6" y2="14.5" /><line x1="10" y1="13" x2="10" y2="14.5" /><line x1="1.5" y1="6" x2="3" y2="6" /><line x1="1.5" y1="10" x2="3" y2="10" /><line x1="13" y1="6" x2="14.5" y2="6" /><line x1="13" y1="10" x2="14.5" y2="10" /></svg>,
  },
  GPU: {
    color: 'var(--color-success)', bg: 'rgba(29,158,117,0.12)',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#1d9e75" strokeWidth="1.5"><rect x="1" y="4" width="14" height="8" rx="1.5" /><rect x="4" y="6.5" width="4" height="3" rx="0.5" /><line x1="10" y1="6.5" x2="13" y2="6.5" /><line x1="10" y1="8" x2="13" y2="8" /><line x1="10" y1="9.5" x2="13" y2="9.5" /></svg>,
  },
  Motherboard: {
    color: '#7f77dd', bg: 'rgba(127,119,221,0.12)',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#7f77dd" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1.5" /><rect x="4" y="4" width="4" height="4" rx="0.5" /><line x1="10" y1="4" x2="12" y2="4" /><line x1="10" y1="6" x2="12" y2="6" /><line x1="4" y1="10" x2="6" y2="10" /><line x1="8" y1="10" x2="12" y2="10" /></svg>,
  },
  RAM: {
    color: '#ef9f27', bg: 'rgba(239,159,39,0.12)',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#ef9f27" strokeWidth="1.5"><rect x="2" y="5" width="12" height="6" rx="1" /><line x1="5" y1="5" x2="5" y2="11" /><line x1="8" y1="5" x2="8" y2="11" /><line x1="11" y1="5" x2="11" y2="11" /><line x1="4" y1="3.5" x2="4" y2="5" /><line x1="7" y1="3.5" x2="7" y2="5" /><line x1="10" y1="3.5" x2="10" y2="5" /></svg>,
  },
  Storage: {
    color: '#378add', bg: 'rgba(55,138,221,0.12)',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#378add" strokeWidth="1.5"><ellipse cx="8" cy="8" rx="6" ry="4" /><ellipse cx="8" cy="6" rx="6" ry="4" /><line x1="2" y1="6" x2="2" y2="10" /><line x1="14" y1="6" x2="14" y2="10" /><circle cx="11" cy="6" r="0.8" fill="#378add" /></svg>,
  },
  'Power Supply': {
    color: '#d4537e', bg: 'rgba(212,83,126,0.12)',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#d4537e" strokeWidth="1.5"><rect x="2" y="4" width="12" height="8" rx="1.5" /><path d="M8 6.5L6 9h4l-2 2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  Case: {
    color: '#888780', bg: 'rgba(136,135,128,0.12)',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#888780" strokeWidth="1.5"><rect x="3" y="2" width="10" height="12" rx="1.5" /><line x1="6" y1="5" x2="10" y2="5" /><circle cx="8" cy="10" r="1.2" /></svg>,
  },
}

const Spinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
  </div>
)

// ─── Main ─────────────────────────────────────────────────────────────────────
function ManualBuilderPage() {
  const inrRate = useLiveRate()
  const [selectedType, setSelectedType] = useState(componentTypes[0])
  const [build, setBuild] = useState({})
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const debounceRef = useRef(null)
  const { isSaved, saveBuild, deleteBuild } = useSaveBuilds()

  const loadComponents = useCallback(async (type, searchVal, pageNum, min, max) => {
    setLoading(true)
    setError(null)
    try {
      const minUsd = min ? Math.floor(parseFloat(min) / inrRate) : undefined
      const maxUsd = max ? Math.ceil(parseFloat(max) / inrRate) : undefined
      const result = await fetchComponents({
        category: TYPE_TO_CATEGORY[type],
        search: searchVal || undefined,
        page: pageNum,
        limit: 15,
        sort: 'price_asc',
        minPrice: minUsd,
        maxPrice: maxUsd,
      })
      setComponents(result.data)
      setPagination(result.pagination)
    } catch (err) {
      setError(err.message)
      setComponents([])
    } finally {
      setLoading(false)
    }
  }, [inrRate])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      loadComponents(selectedType, search, page, minPrice, maxPrice)
    }, search ? 400 : 0)
    return () => clearTimeout(debounceRef.current)
  }, [selectedType, search, page, minPrice, maxPrice, loadComponents])

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setSearch('')
    setPage(1)
    setMinPrice('')
    setMaxPrice('')
  }

  const choosePart = (part) => setBuild((prev) => ({ ...prev, [selectedType]: part }))
  const clearBuild = () => setBuild({})

  const selectedCount = Object.keys(build).length
  const progressPct = Math.round((selectedCount / componentTypes.length) * 100)

  const summary = useMemo(() => {
    const parts = Object.values(build)
    const totalPrice = parts.reduce((s, p) => s + getPrice(p, inrRate), 0)
    const totalWattage = parts.reduce((s, p) => s + getWattage(p), 0)
    const allSelected = componentTypes.every((t) => build[t])
    let compatibility = 'incomplete'
    if (allSelected) compatibility = totalWattage < 700 ? 'compatible' : 'check-psu'
    return { totalPrice, totalWattage, compatibility, allSelected }
  }, [build, inrRate])

  const normalizedParts = useMemo(() => (
    Object.fromEntries(
      Object.entries(build).map(([key, part]) => {
        const normalizedKey = key === 'Power Supply' ? 'psu' : key.toLowerCase()
        return [normalizedKey, {
          name: part?.name,
          brand: part?.brand ?? '',
          price: getPrice(part, inrRate),
          specs: part?.specs?.summary || part?.specs?.model || '',
        }]
      })
    )
  ), [build, inrRate])

  const buildId = summary.allSelected
    ? `manual-${Object.values(build).map((p) => p._id || p.name).join('-').slice(0, 40)}`
    : null

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSaveManual = async () => {
    if (!buildId || !summary.allSelected) return
    setSaving(true)
    try {
      if (isSaved(buildId)) {
        await deleteBuild(buildId)
        showToast('Build removed')
      } else {
        await saveBuild({
          buildId,
          title: `Manual Build — ₹${summary.totalPrice.toLocaleString('en-IN')}`,
          parts: normalizedParts,
          totalPrice: summary.totalPrice,
          useCase: 'manual',
        })
        showToast('Build saved!')
      }
    } catch {
      showToast('Could not save')
    } finally {
      setSaving(false)
    }
  }

  const compatBadge = {
    incomplete: {
      bg: 'rgba(239,159,39,0.1)', border: 'rgba(239,159,39,0.35)', text: '#ba7517',
      label: `Incomplete — ${selectedCount} / ${componentTypes.length} parts selected`,
      icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#ef9f27" strokeWidth="1.5"><path d="M8 2L1.5 14h13L8 2z" /><line x1="8" y1="7" x2="8" y2="10" /><circle cx="8" cy="12" r="0.6" fill="#ef9f27" /></svg>,
    },
    compatible: {
      bg: 'rgba(29,158,117,0.1)', border: 'rgba(29,158,117,0.35)', text: '#0f6e56',
      label: 'All parts compatible',
      icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#1d9e75" strokeWidth="2"><polyline points="2,8 6,12 14,4" /></svg>,
    },
    'check-psu': {
      bg: 'rgba(193,63,63,0.08)', border: 'rgba(193,63,63,0.3)', text: '#993c1d',
      label: 'Check PSU headroom',
      icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#c13f3f" strokeWidth="1.5"><path d="M8 2L1.5 14h13L8 2z" /><line x1="8" y1="7" x2="8" y2="10" /><circle cx="8" cy="12" r="0.6" fill="#c13f3f" /></svg>,
    },
  }[summary.compatibility]

  // Show compatibility hint for relevant types
  const compatHint = (selectedType === 'Motherboard' && build.CPU)
    ? `Showing compatibility with ${build.CPU.name}`
    : (selectedType === 'CPU' && build.Motherboard)
    ? `Showing compatibility with ${build.Motherboard.name}`
    : (selectedType === 'RAM' && build.Motherboard)
    ? `Showing compatibility with ${build.Motherboard.name}`
    : null

  return (
    <main className="flex-1 py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <p className="text-accent-dark text-xs font-semibold uppercase tracking-widest">Manual PC Builder</p>
          <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-primary">Compose Your Build With Full Control</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_270px] gap-5 items-start">

          {/* ── Sidebar ── */}
          <aside className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-3">Components</p>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-secondary mb-1.5">
                <span>Progress</span>
                <span className="text-primary font-medium">{selectedCount} / {componentTypes.length}</span>
              </div>
              <div className="h-1 bg-bg rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: progressPct === 100 ? 'var(--color-success)' : 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              {componentTypes.map((type) => {
                const meta = componentMeta[type]
                const done = !!build[type]
                const active = selectedType === type
                return (
                  <button key={type} onClick={() => handleTypeSelect(type)}
                    className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-xl transition-all"
                    style={{ background: active ? 'rgba(193,63,63,0.08)' : 'transparent', border: `0.5px solid ${active ? 'rgba(193,63,63,0.3)' : 'transparent'}` }}
                  >
                    <div className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: meta.bg }}>{meta.icon}</div>
                    <span className="flex-1 text-xs font-medium" style={{ color: active ? 'var(--color-primary)' : 'var(--color-secondary)' }}>{type}</span>
                    {done && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--color-success)' }} />}
                  </button>
                )
              })}
            </div>
          </aside>

          {/* ── Options panel ── */}
          <section className="bg-card border border-border rounded-2xl p-5 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: componentMeta[selectedType]?.bg }}>
                  {componentMeta[selectedType]?.icon}
                </div>
                <h3 className="font-semibold text-primary text-sm">{selectedType} options</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(29,158,117,0.1)', color: '#0f6e56' }}>
                  1$ = ₹{inrRate.toFixed(1)}
                </span>
                <span className="text-xs text-secondary">{pagination ? `${pagination.total.toLocaleString()} results` : ''}</span>
              </div>
            </div>

            {/* Search + Filter toggle */}
            <div className="mb-3 flex gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="6.5" cy="6.5" r="4.5" /><line x1="10" y1="10" x2="14" y2="14" />
                </svg>
                <input type="text" value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder={`Search ${selectedType.toLowerCase()}s…`}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl outline-none"
                  style={{ background: 'var(--color-bg)', border: '0.5px solid var(--color-border)', color: 'var(--color-primary)' }}
                />
              </div>
              <button onClick={() => setShowPriceFilter((v) => !v)}
                className="px-3 py-2 text-xs rounded-xl transition-all flex items-center gap-1.5"
                style={{
                  background: showPriceFilter ? 'rgba(193,63,63,0.08)' : 'var(--color-bg)',
                  border: `0.5px solid ${showPriceFilter ? 'rgba(193,63,63,0.3)' : 'var(--color-border)'}`,
                  color: showPriceFilter ? 'var(--color-accent)' : 'var(--color-secondary)',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="2" y1="4" x2="14" y2="4" /><line x1="4" y1="8" x2="12" y2="8" /><line x1="6" y1="12" x2="10" y2="12" />
                </svg>
                Filter
                {(minPrice || maxPrice) && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />}
              </button>
            </div>

            {/* Price filter panel */}
            {showPriceFilter && (
              <div className="mb-3 flex gap-2 items-center p-3 rounded-xl" style={{ background: 'var(--color-bg)', border: '0.5px solid var(--color-border)' }}>
                <span className="text-[11px] text-secondary shrink-0">Price (₹)</span>
                <input type="number" value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1) }}
                  placeholder="Min"
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg outline-none"
                  style={{ background: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-primary)' }}
                />
                <span className="text-[11px] text-secondary">–</span>
                <input type="number" value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
                  placeholder="Max"
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg outline-none"
                  style={{ background: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-primary)' }}
                />
                {(minPrice || maxPrice) && (
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); setPage(1) }}
                    className="text-[11px] px-2 py-1 rounded-lg"
                    style={{ color: 'var(--color-accent)', background: 'rgba(193,63,63,0.08)' }}
                  >Clear</button>
                )}
              </div>
            )}

            {/* Compatibility hint banner */}
            {compatHint && (
              <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px]"
                style={{ background: 'rgba(127,119,221,0.08)', border: '0.5px solid rgba(127,119,221,0.25)', color: '#7f77dd' }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#7f77dd" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><line x1="8" y1="7" x2="8" y2="11" /><circle cx="8" cy="5" r="0.6" fill="#7f77dd" /></svg>
                {compatHint} — incompatible parts are greyed out
              </div>
            )}

            {/* Results */}
            {loading ? <Spinner /> : error ? (
              <div className="py-8 text-center text-xs text-secondary">
                Failed to load components. Is the server running?<br />
                <span className="opacity-60">{error}</span>
              </div>
            ) : components.length === 0 ? (
              <div className="py-8 text-center text-xs text-secondary">No results found.</div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {components.map((part) => {
                  const isSelected = build[selectedType]?._id === part._id
                  const price = getPrice(part, inrRate)
                  const wattage = getWattage(part)
                  const { compatible, reason } = checkCompatibility(part, selectedType, build)

                  return (
                    <article key={part._id}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                      style={{
                        background: isSelected ? 'rgba(193,63,63,0.04)' : 'var(--color-bg)',
                        border: `0.5px solid ${isSelected ? 'rgba(193,63,63,0.35)' : 'var(--color-border-tertiary, rgba(0,0,0,0.1))'}`,
                        opacity: compatible ? 1 : 0.45,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-primary text-sm truncate">{part.name}</h4>
                        <p className="text-secondary text-xs mt-0.5">
                          {price > 0 ? `₹${price.toLocaleString()}` : 'Price N/A'}
                          {wattage > 0 && <> &bull; {wattage}W TDP</>}
                          {part.brand && <> &bull; {part.brand}</>}
                        </p>
                        {!compatible && reason && (
                          <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: '#c13f3f' }}>
                            <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#c13f3f" strokeWidth="2"><path d="M8 2L1.5 14h13L8 2z" /><line x1="8" y1="7" x2="8" y2="10" /></svg>
                            {reason}
                          </p>
                        )}
                      </div>
                      {isSelected ? (
                        <div className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(29,158,117,0.12)', color: '#0f6e56' }}>
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#1d9e75" strokeWidth="2.5"><polyline points="2,8 6,12 14,4" /></svg>
                          Selected
                        </div>
                      ) : (
                        <button onClick={() => choosePart(part)}
                          className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:-translate-y-0.5"
                          style={{ background: 'var(--color-background-primary, #fff)', border: '0.5px solid var(--color-border-secondary, rgba(0,0,0,0.2))', color: 'var(--color-primary)', cursor: 'pointer' }}
                        >Select</button>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!pagination.hasPrevPage}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
                  style={{ border: '0.5px solid var(--color-border)', color: 'var(--color-primary)', background: 'transparent', cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed' }}
                >← Prev</button>
                <span className="text-xs text-secondary">Page {pagination.page} of {pagination.totalPages}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={!pagination.hasNextPage}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
                  style={{ border: '0.5px solid var(--color-border)', color: 'var(--color-primary)', background: 'transparent', cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed' }}
                >Next →</button>
              </div>
            )}
          </section>

          {/* ── Summary ── */}
          <aside className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-semibold text-primary text-sm">Build summary</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-bg rounded-xl p-3">
                <p className="text-[11px] text-secondary mb-1">Total price</p>
                <p className="text-lg font-semibold text-primary">₹{summary.totalPrice.toLocaleString()}</p>
              </div>
              <div className="bg-bg rounded-xl p-3">
                <p className="text-[11px] text-secondary mb-1">Est. wattage</p>
                <p className="text-lg font-semibold text-primary">{summary.totalWattage}W</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: compatBadge.bg, border: `0.5px solid ${compatBadge.border}` }}>
              {compatBadge.icon}
              <span className="text-xs font-medium" style={{ color: compatBadge.text }}>{compatBadge.label}</span>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-2.5">Selected parts</p>
              <div className="flex flex-col gap-1.5">
                {componentTypes.map((type) => {
                  const meta = componentMeta[type]
                  const part = build[type]
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: part ? meta.color : '#d1cdc9' }} />
                      <span className="text-[11px] text-secondary w-[68px] shrink-0">{type}</span>
                      <span className="text-[11px] truncate" style={{ color: part ? 'var(--color-primary)' : 'var(--color-text-secondary, #aaa)', fontStyle: part ? 'normal' : 'italic', fontWeight: part ? '500' : '400' }}>
                        {part?.name || 'Not selected'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <button disabled={!summary.allSelected}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
              style={{ background: summary.allSelected ? 'var(--color-accent)' : '#d1cdc9', cursor: summary.allSelected ? 'pointer' : 'not-allowed', border: 'none' }}
            >Export build</button>
            <button
              onClick={handleSaveManual}
              disabled={!summary.allSelected || saving}
              className="w-full py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
              style={isSaved(buildId)
                ? { background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }
                : { background: 'var(--color-accent)', color: 'var(--color-bg)', border: 'none' }}
            >
              {saving ? '...' : isSaved(buildId) ? '✓ Saved' : '+ Save build'}
            </button>
            <button onClick={clearBuild}
              className="w-full py-2 text-xs text-secondary rounded-xl transition-all hover:text-primary"
              style={{ background: 'transparent', border: '0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.1))', cursor: 'pointer' }}
            >Clear build</button>
          </aside>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white"
          style={{ background: 'var(--color-primary)', zIndex: 50 }}
        >
          {toast}
        </div>
      )}
    </main>
  )
}

export default ManualBuilderPage