import { useState, useMemo } from 'react'
import { PREBUILDS, TIERS, USE_CASES } from '../data/prebuilds'
import { useSaveBuilds } from '../hooks/useSaveBuilds'

const componentMeta = {
  cpu:         { color: 'var(--color-accent)' },
  gpu:         { color: 'var(--color-success)' },
  motherboard: { color: 'var(--color-primary)' },
  memory:      { color: 'var(--color-accent-dark)' },
  storage:     { color: 'var(--color-success)' },
  psu:         { color: 'var(--color-accent)' },
  case:        { color: 'var(--color-secondary)' },
}

function PrebuildsPage() {
  const [activeTier, setActiveTier] = useState('all')
  const [activeUseCase, setActiveUseCase] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [saving, setSaving] = useState(null)
  const [toast, setToast] = useState('')
  const { isSaved, saveBuild, deleteBuild } = useSaveBuilds()

  const filtered = useMemo(() => PREBUILDS.filter((b) => {
    const tierOk = activeTier === 'all' || b.tier === activeTier
    const useCaseOk = activeUseCase === 'all' || b.useCase === activeUseCase
    return tierOk && useCaseOk
  }), [activeTier, activeUseCase])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSave = async (build) => {
    setSaving(build.id)
    try {
      if (isSaved(build.id)) {
        await deleteBuild(build.id)
        showToast('Build removed')
      } else {
        await saveBuild({
          buildId: build.id,
          title: build.title,
          parts: build.parts,
          totalPrice: build.totalPrice,
          useCase: build.useCase,
        })
        showToast('Build saved!')
      }
    } catch {
      showToast('Something went wrong')
    } finally {
      setSaving(null)
    }
  }

  return (
    <main className="flex-1 py-14 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
        >
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>
            Curated Builds
          </span>
        </div>
        <h1 className="text-[2rem] font-extrabold text-primary leading-tight mb-2">
          Ready-Made PC Builds
        </h1>
        <p className="text-sm mb-8 max-w-lg" style={{ color: 'var(--color-secondary)' }}>
          Handpicked builds for every budget and use case. Save any build to your profile.
        </p>

        {/* Tier tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTier(t.key)}
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all"
              style={activeTier === t.key
                ? { background: 'var(--color-accent)', color: 'var(--color-bg)' }
                : { background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-secondary)' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Use case filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {USE_CASES.map((u) => (
            <button
              key={u.key}
              onClick={() => setActiveUseCase(u.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all"
              style={activeUseCase === u.key
                ? { border: '1.5px solid var(--color-accent)', background: 'var(--color-bg)', color: 'var(--color-accent)' }
                : { border: '1.5px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-secondary)' }}
            >
              <span>{u.emoji}</span>
              {u.label}
            </button>
          ))}
        </div>

        {/* Build cards */}
        {filtered.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>No builds match this filter.</p>
        ) : (
          <div className="columns-1 sm:columns-2 gap-4 [column-fill:_balance]">
            {filtered.map((build) => (
              <div
                key={build.id}
                className="rounded-2xl overflow-hidden break-inside-avoid mb-4 transition-all duration-300"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                      >
                        ₹{build.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span
                      className="text-[11px] capitalize px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                    >
                      {build.useCase}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold mt-2" style={{ color: 'var(--color-primary)' }}>
                    {build.title}
                  </h3>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-secondary)' }}>{build.description}</p>
                </div>

                {/* Key parts preview */}
                <div className="px-5 pb-4 flex flex-col gap-1.5">
                  {['cpu', 'gpu', 'memory'].map((key) => {
                    const part = build.parts[key]
                    if (!part) return null
                    return (
                      <div key={key} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[10px] font-bold uppercase w-8 shrink-0"
                            style={{ color: componentMeta[key]?.color }}
                          >
                            {key === 'memory' ? 'RAM' : key.toUpperCase()}
                          </span>
                          <span className="text-[12px] truncate" style={{ color: 'var(--color-primary)', maxWidth: 160 }}>
                            {part.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold shrink-0" style={{ color: 'var(--color-accent)' }}>
                          {part.price > 0 ? `₹${part.price.toLocaleString('en-IN')}` : 'Integrated'}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex items-center gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === build.id ? null : build.id)}
                    className="flex-1 text-[13px] font-semibold rounded-xl py-2 transition-all"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-secondary)' }}
                  >
                    {expandedId === build.id ? 'Hide parts ▲' : 'View all parts ▼'}
                  </button>
                  <button
                    onClick={() => handleSave(build)}
                    disabled={saving === build.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all disabled:opacity-60"
                    style={isSaved(build.id)
                      ? { background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }
                      : { background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    {saving === build.id ? '...' : isSaved(build.id) ? '✓ Saved' : '+ Save'}
                  </button>
                </div>

                {/* Expanded parts */}
                <div
                  className={`border-t transition-all duration-400 overflow-hidden ${expandedId === build.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'var(--color-bg)',
                    maxHeight: expandedId === build.id ? 520 : 0,
                  }}
                >
                  <div className="px-5 py-4 flex flex-col gap-2">
                    {Object.entries(build.parts).map(([key, part]) => (
                      <div key={key} className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className="text-[10px] font-bold uppercase block"
                            style={{ color: componentMeta[key]?.color }}
                          >
                            {key === 'memory' ? 'RAM' : key}
                          </span>
                          <span className="text-[12px]" style={{ color: 'var(--color-primary)' }}>{part.name}</span>
                          <span className="text-[11px] block" style={{ color: 'var(--color-secondary)' }}>{part.specs}</span>
                        </div>
                        <span className="text-[12px] font-bold shrink-0" style={{ color: 'var(--color-accent)' }}>
                          {part.price > 0 ? `₹${part.price.toLocaleString('en-IN')}` : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white shadow-lg"
          style={{ background: 'var(--color-primary)', zIndex: 50 }}
        >
          {toast}
        </div>
      )}
    </main>
  )
}

export default PrebuildsPage
