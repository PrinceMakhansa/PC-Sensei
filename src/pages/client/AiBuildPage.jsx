import { useMemo, useState } from 'react'
import { generateBuildWithGemini } from '../../api/gemini'
import { useSaveBuilds } from '../../hooks/useSaveBuilds'

const usageOptions = [
  { value: 'gaming',      label: 'Gaming',      emoji: '🎮' },
  { value: 'editing',     label: 'Editing',     emoji: '🎬' },
  { value: 'programming', label: 'Programming', emoji: '💻' },
  { value: 'office',      label: 'Office',      emoji: '📋' },
]

const CATEGORY_SLOTS = [
  { key: 'cpu',         label: 'CPU',         dbCategory: 'cpu' },
  { key: 'gpu',         label: 'GPU',         dbCategory: 'video-card' },
  { key: 'motherboard', label: 'Motherboard', dbCategory: 'motherboard' },
  { key: 'memory',      label: 'RAM',         dbCategory: 'memory' },
  { key: 'storage',     label: 'Storage',     dbCategory: 'storage' },
  { key: 'psu',         label: 'PSU',         dbCategory: 'power-supply' },
  { key: 'case',        label: 'Case',        dbCategory: 'case' },
]

const componentMeta = {
  cpu:         { bg: 'rgba(193,63,63,0.1)',   color: '#c13f3f' },
  gpu:         { bg: 'rgba(99,153,34,0.1)',   color: '#639922' },
  motherboard: { bg: 'rgba(83,74,183,0.1)',   color: '#534AB7' },
  memory:      { bg: 'rgba(186,117,23,0.1)',  color: '#ba7517' },
  storage:     { bg: 'rgba(15,110,86,0.1)',   color: '#0F6E56' },
  psu:         { bg: 'rgba(186,117,23,0.08)', color: '#ba7517' },
  case:        { bg: 'rgba(95,94,90,0.08)',   color: '#888' },
}

const ICONS = {
  cpu: (color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  ),
  gpu: (color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="12" rx="2" />
      <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <circle cx="8" cy="13" r="1" fill={color} stroke="none" />
      <circle cx="16" cy="13" r="1" fill={color} stroke="none" />
    </svg>
  ),
  motherboard: (color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M7 7h.01M12 7h.01M17 7h.01M7 12h10M7 17h10" />
    </svg>
  ),
  memory: (color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="1" />
      <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
    </svg>
  ),
  storage: (color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  psu: (color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  case: (color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M8 3v18M15 8h2M15 12h2" />
    </svg>
  ),
}

const formatPrice = (inr) => inr ? `₹${Math.round(inr).toLocaleString('en-IN')}` : '—'

function AIBuildPage() {
  const [form, setForm]       = useState({ budget: 80000, usage: 'gaming', priority: 'balanced' })
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult]   = useState(null) // { cpu: {...}, gpu: {...}, ... }
  const [error, setError]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState('')
  const { isSaved, saveBuild, deleteBuild } = useSaveBuilds()

  const totalPriceINR = useMemo(() => {
    if (!result) return 0
    return Object.values(result).reduce((sum, comp) => sum + Math.round(comp?.price ?? 0), 0)
  }, [result])

  const buildId = result
    ? `ai-${form.usage}-${form.budget}-${Object.values(result).map((c) => c.name).join('-').slice(0, 40)}`
    : null

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSaveAIBuild = async () => {
    if (!buildId || !result) return
    setSaving(true)
    try {
      if (isSaved(buildId)) {
        await deleteBuild(buildId)
        showToast('Build removed')
      } else {
        await saveBuild({
          buildId,
          title: `${form.usage} Build — ₹${form.budget.toLocaleString('en-IN')}`,
          parts: result,
          totalPrice: totalPriceINR,
          useCase: form.usage,
        })
        showToast('Build saved to profile!')
      }
    } catch {
      showToast('Could not save')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      setLoadingMsg('Searching the web for best parts...')
      const build = await generateBuildWithGemini({
        budget: form.budget,
        usage: form.usage,
        priority: form.priority,
      })

      const total = Object.values(build).reduce((sum, c) => sum + (c?.price ?? 0), 0)
      if (total > form.budget * 1.05) {
        console.warn(`Build over budget: ₹${total} vs ₹${form.budget}`)
      }

      setResult(build)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMsg('')
    }
  }

  return (
    <main className="flex-1 py-14 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Badge + heading */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
          style={{ background: 'rgba(193,63,63,0.1)', border: '1px solid rgba(193,63,63,0.22)' }}
        >
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#9b2c2c' }}>
            AI Build Generator
          </span>
        </div>

        <h1 className="text-[2rem] font-extrabold text-primary leading-tight tracking-tight mb-2">
          Generate a Balanced Build<br />in Seconds
        </h1>
        <p className="text-sm mb-6 leading-relaxed max-w-lg" style={{ color: 'var(--color-secondary)' }}>
          Tell us your budget and goals — Gemini AI will pick the best compatible parts from our real component database.
        </p>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[20px] p-6 mb-6"
          style={{ background: '#fff', border: '1px solid var(--color-border)' }}
        >
          {/* Budget + Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-[13px] font-semibold text-primary">Budget (INR)</label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] pointer-events-none select-none" style={{ color: '#999' }}>₹</span>
                <input
                  type="number"
                  min="20000"
                  step="1000"
                  value={form.budget}
                  onChange={(e) => setForm((p) => ({ ...p, budget: Number(e.target.value) }))}
                  className="w-full rounded-xl text-[13px] text-primary outline-none"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '10px 14px 10px 26px' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                />
              </div>
              <p className="text-[11px] mt-1" style={{ color: '#aaa' }}>
                ≈ ${Math.round(form.budget / 84).toLocaleString()} USD
              </p>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-primary">Performance Priority</label>
              <div className="relative mt-1.5">
                <select
                  value={form.priority}
                  onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                  className="w-full rounded-xl text-[13px] text-primary outline-none appearance-none cursor-pointer"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '10px 32px 10px 14px' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                >
                  <option value="balanced">Balanced</option>
                  <option value="max-fps">Max FPS</option>
                  <option value="silent">Silent / Efficient</option>
                  <option value="future-proof">Future-proof</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#999" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Usage pills */}
          <p className="text-[13px] font-semibold text-primary mb-2">Usage Type</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {usageOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, usage: opt.value }))}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
                style={
                  form.usage === opt.value
                    ? { border: '1.5px solid var(--color-accent)', background: 'rgba(193,63,63,0.07)', color: 'var(--color-accent)', fontWeight: 600 }
                    : { border: '1.5px solid var(--color-border)', background: '#fff', color: 'var(--color-secondary)' }
                }
              >
                <span style={{ fontSize: 15 }}>{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 text-white text-[14px] font-bold rounded-xl transition-all disabled:opacity-60"
            style={{ background: 'var(--color-accent)', padding: '12px 28px', cursor: loading ? 'not-allowed' : 'pointer' }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'var(--color-accent-dark)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.transform = 'none' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            {loading ? 'Generating...' : 'Generate Build'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-[13px] text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-14" role="status" aria-live="polite">
            <span className="block w-10 h-10 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>{loadingMsg || 'Working on it...'}</p>
          </div>
        )}

        {/* Results */}
        {!loading && result && (
          <section aria-label="Generated build">

            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full inline-flex items-center justify-center" style={{ background: 'rgba(99,153,34,0.15)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <p className="text-[14px] font-bold text-primary">AI-selected build from real components</p>
            </div>

            {/* Component cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {CATEGORY_SLOTS.map((slot, index) => {
                const comp = result[slot.key]
                if (!comp) return null
                const meta = componentMeta[slot.key]
                const IconFn = ICONS[slot.key]

                return (
                  <div
                    key={slot.key}
                    className="flex items-start gap-2.5 rounded-2xl stagger"
                    style={{
                      background: '#fff',
                      border: '1px solid var(--color-border)',
                      padding: '14px',
                      animationDelay: `${index * 70}ms`,
                    }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 34, height: 34, borderRadius: 10, background: meta.bg }}
                    >
                      {IconFn(meta.color)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#999' }}>
                        {slot.label}
                      </div>
                      <div className="text-[13px] font-semibold mt-0.5 truncate" style={{ color: 'var(--color-primary)' }}>
                        {comp.name}
                      </div>
                      {comp.specs ? (
                        <div className="text-[11px]" style={{ color: '#aaa' }}>{comp.specs}</div>
                      ) : comp.brand ? (
                        <div className="text-[11px]" style={{ color: '#aaa' }}>{comp.brand}</div>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[12px] font-bold" style={{ color: 'var(--color-accent)' }}>
                        {formatPrice(comp.price)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-[18px] py-[14px]"
              style={{ background: 'var(--color-primary)' }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: '#888' }}>Total Price</span>
                <span
                  className="text-base font-bold"
                  style={{
                    color: totalPriceINR <= form.budget
                      ? 'var(--color-success)'
                      : '#e57373',
                  }}
                >
                  ₹{totalPriceINR.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: '#888' }}>Budget</span>
                <span className="text-base font-bold" style={{ color: totalPriceINR <= form.budget ? 'var(--color-success)' : '#e57373' }}>
                  ₹{form.budget.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: '#888' }}>Use Case</span>
                <span className="text-base font-bold capitalize" style={{ color: 'var(--color-bg)' }}>{form.usage}</span>
              </div>
              <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px]" style={{ color: '#888' }}>Parts</span>
                <span className="text-base font-bold" style={{ color: 'var(--color-success)' }}>
                  {Object.values(result).filter(Boolean).length} / {CATEGORY_SLOTS.length}
                </span>
              </div>
            </div>

            {/* Regenerate */}
            <button
              onClick={handleSubmit}
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold rounded-xl transition-all"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-secondary)',
                padding: '10px 20px',
                border: '1px solid var(--color-border)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Regenerate
            </button>
            <button
              onClick={handleSaveAIBuild}
              disabled={saving}
              className="mt-4 ml-2 inline-flex items-center gap-2 text-[13px] font-bold rounded-xl transition-all disabled:opacity-60"
              style={isSaved(buildId)
                ? { background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', padding: '10px 20px' }
                : { background: 'var(--color-accent)', color: 'var(--color-bg)', padding: '10px 20px' }}
            >
              {saving ? '...' : isSaved(buildId) ? '✓ Saved' : '+ Save Build'}
            </button>

          </section>
        )}
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

export default AIBuildPage