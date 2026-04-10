import { useState, useCallback, useEffect, useRef } from 'react'
import { fetchComponents } from '../../api/components'
import { generateUpgradeAdvice } from '../../api/gemini'

// Constants
const LOADING_DELAY = 1100
const STORAGE_KEY = 'pcsensei_upgrade_specs'

const USAGE_TYPES = [
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'workstation', label: 'Workstation', icon: '💼' },
  { value: 'general', label: 'General Use', icon: '🖥️' },
]

// Map spec keys → DB category strings (match your seeded data)
const CATEGORY_MAP = {
  cpu: 'cpu',
  gpu: 'video-card',
  ram: 'memory',
  storage: 'storage',
}

const COMPONENT_ICONS = {
  cpu: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  ),
  gpu: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="12" rx="2" />
      <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <circle cx="8" cy="13" r="1" fill="#639922" stroke="none" />
      <circle cx="16" cy="13" r="1" fill="#639922" stroke="none" />
    </svg>
  ),
  ram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ba7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="1" />
      <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
    </svg>
  ),
  storage: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
}

const SPEC_FIELDS = [
  { key: 'cpu', label: 'Current CPU', placeholder: 'Search CPU...', color: 'var(--color-accent)', bg: 'rgba(193, 63, 63, 0.08)', border: '1px solid rgba(193, 63, 63, 0.25)' },
  { key: 'gpu', label: 'Current GPU', placeholder: 'Search GPU...', color: 'var(--color-success)', bg: 'rgba(29, 158, 117, 0.08)', border: '1px solid rgba(29, 158, 117, 0.25)' },
  { key: 'ram', label: 'Current RAM', placeholder: 'Search RAM...', color: '#ba7517', bg: 'rgba(186, 117, 23, 0.08)', border: '1px solid rgba(186, 117, 23, 0.25)' },
  { key: 'storage', label: 'Current Storage', placeholder: 'Search Storage...', color: '#0F6E56', bg: 'rgba(15, 110, 86, 0.08)', border: '1px solid rgba(15, 110, 86, 0.25)' },
]

const upgradeMeta = [
  {
    key: 'gpu', label: 'GPU',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="12" rx="2" />
        <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        <circle cx="8" cy="13" r="1" fill="#639922" stroke="none" />
        <circle cx="16" cy="13" r="1" fill="#639922" stroke="none" />
      </svg>
    ),
    bg: 'rgba(99,153,34,0.1)', impact: 'High Impact', impactColor: '#639922', impactBg: 'rgba(99,153,34,0.1)',
    reason: 'GPU is the single biggest factor in gaming and rendering performance. Upgrading here gives the most visible FPS and quality gains.',
  },
  {
    key: 'ram', label: 'RAM',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ba7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="1" />
        <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
      </svg>
    ),
    bg: 'rgba(186,117,23,0.1)', impact: 'Medium Impact', impactColor: '#ba7517', impactBg: 'rgba(186,117,23,0.1)',
    reason: 'More RAM reduces stuttering in multitasking, modern games, and content creation. DDR5 also brings bandwidth improvements.',
  },
  {
    key: 'storage', label: 'Storage',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    bg: 'rgba(15,110,86,0.1)', impact: 'Medium Impact', impactColor: '#0F6E56', impactBg: 'rgba(15,110,86,0.1)',
    reason: 'Switching from HDD to NVMe SSD dramatically reduces load times. Going from SATA SSD to NVMe also gives a solid boost.',
  },
  {
    key: 'cpu', label: 'CPU',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
      </svg>
    ),
    bg: 'rgba(193,63,63,0.1)', impact: 'Situational', impactColor: 'var(--color-accent)', impactBg: 'rgba(193,63,63,0.1)',
    reason: 'CPU upgrades matter most for streaming, simulation, and CPU-bottlenecked games. Often requires a new motherboard.',
  },
]

// ─── ComponentSearchInput ───────────────────────────────────────────────────
// Replaces plain <input> with a search + dropdown that fetches from DB
function ComponentSearchInput({ field, selectedComponent, onSelect }) {
  const [query, setQuery] = useState(selectedComponent?.name ?? '')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Sync display when selectedComponent cleared externally
  useEffect(() => {
    if (!selectedComponent) setQuery('')
  }, [selectedComponent])

  const search = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setFetching(true)
    try {
      const res = await fetchComponents({
        category: CATEGORY_MAP[field.key],
        search: q,
        limit: 8,
        sort: 'price_asc',
      })
      setResults(res.data ?? [])
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setFetching(false)
    }
  }, [field.key])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    // If user clears the field, also clear the selected component
    if (!val) onSelect(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 350)
  }

  const handleSelect = (component) => {
    setQuery(component.name)
    onSelect(component)
    setOpen(false)
    setResults([])
  }

  const formatPrice = (p) =>
    p ? `₹${Math.round(p * 84).toLocaleString('en-IN')}` : ''

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <label htmlFor={field.key} className="block text-[13px] font-semibold text-primary mb-1.5">
        {field.label}
      </label>
      <div className="flex items-center gap-2">
        {/* Icon box */}
        <div
          className="flex items-center justify-center shrink-0 rounded-lg"
          style={{ width: 42, height: 42, background: field.bg, border: field.border }}
        >
          {COMPONENT_ICONS[field.key]}
        </div>

        {/* Input */}
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            id={field.key}
            autoComplete="off"
            className="w-full rounded-xl text-[13px] text-primary outline-none"
            style={{
              background: 'var(--color-bg)',
              border: `1px solid ${isFocused ? field.color : 'var(--color-border)'}`,
              padding: '10px 36px 10px 14px',
            }}
            value={query}
            onChange={handleChange}
            placeholder={field.placeholder}
            onFocus={() => { setIsFocused(true); if (query.length >= 2) search(query) }}
            onBlur={() => setIsFocused(false)}
            aria-label={field.label}
            aria-autocomplete="list"
            aria-expanded={open}
          />

          {/* Spinner / checkmark indicator */}
          <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
            {fetching ? (
              <span
                style={{
                  display: 'block', width: 14, height: 14,
                  borderRadius: '50%',
                  border: '2px solid var(--color-border)',
                  borderTopColor: field.color,
                  animation: 'spin 0.7s linear infinite',
                }}
              />
            ) : selectedComponent ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={field.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            zIndex: 50,
            overflow: 'hidden',
          }}
          role="listbox"
        >
          {results.map((comp) => (
            <button
              key={comp._id}
              type="button"
              role="option"
              onMouseDown={() => handleSelect(comp)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                gap: 8,
                borderBottom: '1px solid var(--color-border)',
              }}
              className="hover:bg-accent/5 transition-colors"
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="text-[12px] font-semibold text-primary truncate">{comp.name}</p>
                {comp.brand && (
                  <p className="text-[11px] text-secondary truncate">{comp.brand}</p>
                )}
              </div>
              {comp.price && (
                <span className="text-[11px] font-bold shrink-0" style={{ color: 'var(--color-accent)' }}>
                  {formatPrice(comp.price)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {open && !fetching && results.length === 0 && query.length >= 2 && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: '#fff', border: '1px solid var(--color-border)',
            borderRadius: 12, padding: '12px 14px', zIndex: 50,
          }}
        >
          <p className="text-[12px] text-secondary">No {field.label.replace('Current ', '')} found for "{query}"</p>
        </div>
      )}

      {/* CSS for spinner */}
      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
function UpgradePlannerPage() {
  // selectedComponents stores the full DB objects (or null)
  const [selectedComponents, setSelectedComponents] = useState({ cpu: null, gpu: null, ram: null, storage: null })
  const [budget, setBudget] = useState('')
  const [usageType, setUsageType] = useState('gaming')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)
  const [resetHover, setResetHover] = useState(false)
  // Suggested upgrades from DB (one per category)
  const [suggestedUpgrades, setSuggestedUpgrades] = useState({})

  const hasSpecs = Object.values(selectedComponents).some((v) => v !== null)
  // AI-generated advice text
  const [aiAdvice, setAiAdvice] = useState({})


  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { components: saved_comps, budget: savedBudget, usageType: savedUsage } = JSON.parse(saved)
        if (saved_comps) setSelectedComponents(saved_comps)
        if (savedBudget) setBudget(savedBudget)
        if (savedUsage) setUsageType(savedUsage)
      } catch (e) {
        console.error('Failed to load saved specs:', e)
      }
    }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (hasSpecs || budget) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ components: selectedComponents, budget, usageType }))
    }
  }, [selectedComponents, budget, usageType])

  const handleSelect = useCallback((key) => (component) => {
    setSelectedComponents((prev) => ({ ...prev, [key]: component }))
  }, [])

  const handleReset = useCallback(() => {
    setSelectedComponents({ cpu: null, gpu: null, ram: null, storage: null })
    setBudget('')
    setUsageType('gaming')
    setSubmitted(false)
    setLoading(false)
    setSuggestedUpgrades({})
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const handleEdit = useCallback(() => {
    setSubmitted(false)
    setLoading(false)
  }, [])

  // Fetch suggested upgrades: for each selected component, find one that's ~60% higher price in same category
  const fetchSuggestedUpgrades = useCallback(async () => {
    const upgrades = {}
    await Promise.all(
      Object.entries(selectedComponents).map(async ([key, comp]) => {
        if (!comp) return
        const minPrice = comp.price ? comp.price * 1.2 : 0
        const maxBudget = budget ? Number(budget) / 84 : undefined // convert INR → USD for DB query
        try {
          const res = await fetchComponents({
            category: CATEGORY_MAP[key],
            minPrice,
            ...(maxBudget ? { maxPrice: maxBudget } : {}),
            sort: 'price_asc',
            limit: 1,
          })
          if (res.data?.length) upgrades[key] = res.data[0]
        } catch {
          // silent fail — just won't show suggestion
        }
      })
    )
    setSuggestedUpgrades(upgrades)
  }, [selectedComponents, budget])

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!hasSpecs) return
    setLoading(true)
    setSubmitted(false)
    setAiAdvice({})

    // Run both in parallel
    const [, advice] = await Promise.all([
      fetchSuggestedUpgrades(),
      generateUpgradeAdvice({
        currentComponents: selectedComponents,
        budget,
        usageType,
      }).catch(() => null), // never block on AI failure
    ])

    if (advice) setAiAdvice(advice)

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }, [hasSpecs, fetchSuggestedUpgrades, selectedComponents, budget, usageType])

  const formatPrice = (p) => p ? `₹${Math.round(p * 84).toLocaleString('en-IN')}` : ''

  // Only show upgrade cards for components the user actually selected
  const activeUpgradeMeta = upgradeMeta.filter((m) => selectedComponents[m.key] !== null)

  return (
    <main className="flex-1 py-14 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-dark">Upgrade Planner</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary">Get Smart Next-Step Upgrades</h1>
          <p className="mt-3 text-secondary text-sm leading-relaxed max-w-lg">
            Search and select your current components, and we'll rank the upgrades that give you the most value for money.
          </p>
        </header>

        {/* Form */}
        {!submitted && (
          <form
            onSubmit={onSubmit}
            className="rounded-[20px] p-6 mb-6"
            style={{ background: '#fff', border: '1px solid var(--color-border)' }}
            aria-label="PC specs form"
          >
            {/* Usage Type Selector */}
            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-primary mb-2">
                What will you use your PC for?
              </label>
              <div className="flex gap-2 flex-wrap">
                {USAGE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setUsageType(type.value)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all"
                    style={{
                      background: usageType === type.value ? 'var(--color-accent)' : 'var(--color-bg)',
                      color: usageType === type.value ? '#fff' : 'var(--color-secondary)',
                      border: usageType === type.value ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                    }}
                    aria-pressed={usageType === type.value}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Component Search Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {SPEC_FIELDS.map((field) => (
                <ComponentSearchInput
                  key={field.key}
                  field={field}
                  selectedComponent={selectedComponents[field.key]}
                  onSelect={handleSelect(field.key)}
                />
              ))}
            </div>

            {/* Budget Input */}
            <div className="mb-5">
              <label htmlFor="budget" className="block text-[13px] font-semibold text-primary mb-1.5">
                Upgrade Budget (Optional)
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center shrink-0 rounded-lg"
                  style={{ width: 42, height: 42, background: 'rgba(193, 63, 63, 0.08)', border: '1px solid rgba(193, 63, 63, 0.25)' }}
                >
                  <span className="text-[15px] font-bold" style={{ color: 'var(--color-accent)' }}>₹</span>
                </div>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  className="w-full rounded-xl text-[13px] text-primary outline-none"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '10px 14px' }}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 50000"
                  aria-label="Budget in rupees"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-white text-[14px] font-bold rounded-xl transition-all"
                style={{
                  background: buttonHover ? 'var(--color-accent-dark)' : 'var(--color-accent)',
                  padding: '12px 28px',
                  transform: buttonHover ? 'translateY(-1px)' : 'none',
                  opacity: !hasSpecs ? 0.5 : 1,
                  cursor: !hasSpecs ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={() => setButtonHover(true)}
                onMouseLeave={() => setButtonHover(false)}
                disabled={loading || !hasSpecs}
                aria-busy={loading}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                {loading ? 'Analyzing...' : 'Plan Upgrades'}
              </button>

              {hasSpecs && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-[14px] font-bold rounded-xl transition-all"
                  style={{
                    background: resetHover ? 'var(--color-border)' : 'var(--color-bg)',
                    color: 'var(--color-secondary)',
                    padding: '12px 24px',
                    border: '1px solid var(--color-border)',
                  }}
                  onMouseEnter={() => setResetHover(true)}
                  onMouseLeave={() => setResetHover(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>

            {!hasSpecs && (
              <p className="mt-3 text-[12px] text-secondary italic">
                Search and select at least one component to get upgrade recommendations.
              </p>
            )}
          </form>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-14" role="status" aria-live="polite">
            <span className="block w-10 h-10 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Analyzing your setup and finding best upgrades...</p>
          </div>
        )}

        {/* Results */}
        {!loading && submitted && (
          <section aria-label="Upgrade recommendations">

            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full inline-flex items-center justify-center" style={{ background: 'rgba(99,153,34,0.15)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <p className="text-[14px] font-bold text-primary">Upgrades ranked by impact</p>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              {activeUpgradeMeta.map((meta, index) => {
                const currentComp = selectedComponents[meta.key]
                const suggested = suggestedUpgrades[meta.key]

                return (
                  <div
                    key={meta.key}
                    className="flex items-start gap-3 rounded-2xl stagger"
                    style={{
                      background: '#fff',
                      border: '1px solid var(--color-border)',
                      padding: '16px',
                      animationDelay: `${index * 80}ms`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center shrink-0 mt-0.5"
                      style={{ width: 38, height: 38, borderRadius: 10, background: meta.bg }}
                      aria-hidden="true"
                    >
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-[13px] font-bold" style={{ color: 'var(--color-primary)' }}>
                          Upgrade your {meta.label}
                        </p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ color: meta.impactColor, background: meta.impactBg }}
                        >
                          {meta.impact}
                        </span>
                      </div>

                      {/* Current component */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[11px] text-secondary">Current:</span>
                        <span className="text-[11px] font-semibold text-primary truncate max-w-[200px]">
                          {currentComp.name}
                        </span>
                        {currentComp.price && (
                          <span className="text-[11px] text-secondary">· {formatPrice(currentComp.price)}</span>
                        )}
                      </div>

                      <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-secondary)' }}>
                        {meta.reason}
                      </p>

                      {/* Suggested upgrade from DB */}
                      {suggested ? (
                        <div
                          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg"
                          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          <span className="text-[11px] font-semibold" style={{ color: '#888' }}>Suggested: </span>
                          <span className="text-[11px] font-bold truncate max-w-[160px]" style={{ color: 'var(--color-primary)' }}>
                            {suggested.name}
                          </span>
                          <span className="text-[11px]" style={{ color: '#aaa' }} aria-hidden="true">·</span>
                          <span className="text-[11px] font-semibold" style={{ color: 'var(--color-accent)' }}>
                            {formatPrice(suggested.price)}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg"
                          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                        >
                          <span className="text-[11px] text-secondary italic">
                            No upgrade found{budget ? ' within your budget' : ''}
                          </span>
                        </div>
                      )}

                      {aiAdvice[meta.key] && (
                        <div
                          className="flex items-start gap-1.5 mt-2 px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(193,63,63,0.05)', border: '1px solid rgba(193,63,63,0.15)' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}>
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                          <div>
                            <p className="text-[11px] font-semibold" style={{ color: 'var(--color-accent)' }}>
                              AI: {aiAdvice[meta.key].reason}
                            </p>
                            {aiAdvice[meta.key].tip && (
                              <p className="text-[10px] mt-0.5" style={{ color: '#aaa' }}>
                                Tip: {aiAdvice[meta.key].tip}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Rank */}
                    <div
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{ background: '#f1ede8', color: '#888' }}
                      aria-label={`Rank ${index + 1}`}
                    >
                      {index + 1}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-[18px] py-[14px] mb-4"
              style={{ background: 'var(--color-primary)' }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: '#888' }}>Current CPU</span>
                <span className="text-sm font-bold truncate max-w-[120px]" style={{ color: 'var(--color-bg)' }}>
                  {selectedComponents.cpu?.name ?? '—'}
                </span>
              </div>
              <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: '#888' }}>Current GPU</span>
                <span className="text-sm font-bold truncate max-w-[120px]" style={{ color: 'var(--color-bg)' }}>
                  {selectedComponents.gpu?.name ?? '—'}
                </span>
              </div>
              <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: '#888' }}>Components Selected</span>
                <span className="text-base font-bold" style={{ color: 'var(--color-bg)' }}>
                  {Object.values(selectedComponents).filter(Boolean).length}
                </span>
              </div>
              <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: '#888' }}>Top Priority</span>
                <span className="text-sm font-bold" style={{ color: 'var(--color-success)' }}>
                  {activeUpgradeMeta[0]?.label ?? '—'} Upgrade
                </span>
              </div>
            </div>

            {/* Edit button */}
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-2 text-[14px] font-bold rounded-xl transition-all"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-secondary)',
                padding: '12px 24px',
                border: '1px solid var(--color-border)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Specs
            </button>

          </section>
        )}
      </div>
    </main>
  )
}

export default UpgradePlannerPage