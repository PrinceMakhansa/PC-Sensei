import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../../components/common/Reveal'

const card = 'bg-card border border-border rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200'
const btnPri = 'inline-flex items-center gap-2 bg-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer border-0'
const btnSec = 'inline-flex items-center gap-2 bg-white border border-border text-primary font-semibold px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer'

const steps = [
  { title: 'Choose your goal', description: 'Pick whether you want a fresh build or a smarter upgrade path.', num: '01' },
  { title: 'Share your specs', description: 'Enter budget, performance targets, or current PC details.', num: '02' },
  { title: 'Get your plan', description: 'Receive compatible components and practical recommendations.', num: '03' },
]

const coreFeatures = [
  {
    title: 'Manual PC Builder',
    description: 'Select every part yourself and instantly verify compatibility, wattage, and budget balance.',
    path: '/builder',
    bg: 'rgba(193,63,63,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: 'AI Build Generator',
    description: 'Input your budget and usage goals. PCSensei assembles a performance-optimized build in seconds.',
    path: '/ai-build',
    bg: 'rgba(99,153,34,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <circle cx="9" cy="14" r="1" fill="#639922" stroke="none" /><circle cx="15" cy="14" r="1" fill="#639922" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Upgrade Planner',
    description: 'Analyze your existing setup and get targeted upgrades ranked by value and impact.',
    path: '/upgrade-planner',
    bg: 'rgba(186,117,23,0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ba7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
]

const benefits = [
  {
    label: 'Avoid incompatible components',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    label: 'Save money on unnecessary upgrades',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  },
  {
    label: 'AI-powered recommendations',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" /><circle cx="9" cy="14" r="1" fill="#c13f3f" stroke="none" /><circle cx="15" cy="14" r="1" fill="#c13f3f" stroke="none" /></svg>,
  },
  {
    label: 'Beginner-friendly interface',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>,
  },
]

const chips = [
  {
    label: 'CPU', sub: 'Ryzen 7 7800X3D', pos: 'top-9 left-9', bg: 'rgba(193,63,63,0.12)',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" /></svg>,
  },
  {
    label: 'GPU', sub: 'RTX 4070', pos: 'top-14 right-8', bg: 'rgba(99,153,34,0.12)',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="12" rx="2" /><path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" /><circle cx="8" cy="13" r="1" fill="#639922" stroke="none" /><circle cx="16" cy="13" r="1" fill="#639922" stroke="none" /></svg>,
  },
  {
    label: 'RAM', sub: '32GB DDR5', pos: 'bottom-20 left-7', bg: 'rgba(186,117,23,0.12)',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ba7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="1" /><path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" /></svg>,
  },
  {
    label: 'Motherboard', sub: 'B650 ATX', pos: 'bottom-12 right-7', bg: 'rgba(83,74,183,0.12)',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" /><path d="M7 7h.01M12 7h.01M17 7h.01M7 12h10M7 17h10" /></svg>,
  },
]

const brands = [
  { name: 'Intel', color: '#0071c5' },
  { name: 'AMD', color: '#ed1c24' },
  { name: 'Nvidia', color: '#76b900' },
  { name: 'ASUS', color: '#1a1a1a' },
  { name: 'MSI', color: '#e4002b' },
  { name: 'Gigabyte', color: '#e6232a' },
  { name: 'Corsair', color: '#f6c700' },
  { name: 'NZXT', color: '#e1251b' },
  { name: 'Samsung', color: '#1428a0' },
  { name: 'Seagate', color: '#00b140' },
  { name: 'Fractal', color: '#2d2d2d' },
  { name: 'be quiet!', color: '#1a1a1a' },
]

const featuredBuilds = [
  {
    title: 'The Mid-Range Gaming Beast',
    tag: 'Gaming',
    price: '~₹111,600',
    wattage: '487W',
    parts: [
      { label: 'CPU', val: 'Ryzen 7 7800X3D', color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.08)' },
      { label: 'GPU', val: 'RTX 4070 Super', color: 'var(--color-success)', bg: 'rgba(29,158,117,0.08)' },
      { label: 'RAM', val: '32GB DDR5 6000', color: '#ef9f27', bg: 'rgba(239,159,39,0.08)' },
      { label: 'Storage', val: '1TB NVMe Gen4', color: '#378add', bg: 'rgba(55,138,221,0.08)' },
      { label: 'Motherboard', val: 'B650 Tomahawk', color: '#7f77dd', bg: 'rgba(127,119,221,0.08)' },
      { label: 'PSU', val: '750W 80+ Gold', color: '#d4537e', bg: 'rgba(212,83,126,0.08)' },
    ],
  },
  {
    title: 'The Budget Starter Build',
    tag: 'Budget',
    price: '~₹55,800',
    wattage: '310W',
    parts: [
      { label: 'CPU', val: 'Intel Core i5-12400', color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.08)' },
      { label: 'GPU', val: 'RX 6600', color: 'var(--color-success)', bg: 'rgba(29,158,117,0.08)' },
      { label: 'RAM', val: '16GB DDR4 3200', color: '#ef9f27', bg: 'rgba(239,159,39,0.08)' },
      { label: 'Storage', val: '500GB NVMe SSD', color: '#378add', bg: 'rgba(55,138,221,0.08)' },
      { label: 'Motherboard', val: 'B660M mATX', color: '#7f77dd', bg: 'rgba(127,119,221,0.08)' },
      { label: 'PSU', val: '550W 80+ Bronze', color: '#d4537e', bg: 'rgba(212,83,126,0.08)' },
    ],
  },
  {
    title: 'The High-End Workstation',
    tag: 'Workstation',
    price: '~₹232,500',
    wattage: '620W',
    parts: [
      { label: 'CPU', val: 'Intel Core i9-14900K', color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.08)' },
      { label: 'GPU', val: 'RTX 4080 Super', color: 'var(--color-success)', bg: 'rgba(29,158,117,0.08)' },
      { label: 'RAM', val: '64GB DDR5 6000', color: '#ef9f27', bg: 'rgba(239,159,39,0.08)' },
      { label: 'Storage', val: '2TB NVMe Gen4 SSD', color: '#378add', bg: 'rgba(55,138,221,0.08)' },
      { label: 'Motherboard', val: 'Z790 Creator WiFi', color: '#7f77dd', bg: 'rgba(127,119,221,0.08)' },
      { label: 'PSU', val: '1000W 80+ Platinum', color: '#d4537e', bg: 'rgba(212,83,126,0.08)' },
    ],
  },
]

const testimonials = [
  {
    name: 'Arjun M.', role: 'First-time builder', color: 'var(--color-accent)',
    text: 'I had no idea where to start. PCSensei helped me put together a ₹83,700 gaming build that runs everything I play at high settings.',
  },
  {
    name: 'Priya S.', role: 'Video editor', color: 'var(--color-success)',
    text: 'The AI Build Generator suggested an upgrade path I never would have thought of. Saved me ₹18,600 compared to what I was planning to buy.',
  },
  {
    name: 'Rohan K.', role: 'CS student', color: '#7f77dd',
    text: 'Clean interface, no bloat. I used the Manual Builder and had my full parts list checked for compatibility in under 5 minutes.',
  },
]

function HeroVisual() {
  return (
    <div
      className="relative rounded-[2rem] border border-border shadow-md overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f1ebe6 0%, #e3ddd6 100%)', minHeight: '360px' }}
      aria-hidden
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 420 360">
        <line x1="115" y1="68" x2="210" y2="180" stroke="#c13f3f" strokeWidth="1.2" strokeOpacity="0.35" />
        <line x1="318" y1="84" x2="210" y2="180" stroke="#c13f3f" strokeWidth="1.2" strokeOpacity="0.35" />
        <line x1="80" y1="268" x2="210" y2="180" stroke="#c13f3f" strokeWidth="1.2" strokeOpacity="0.35" />
        <line x1="342" y1="278" x2="210" y2="180" stroke="#c13f3f" strokeWidth="1.2" strokeOpacity="0.35" />
      </svg>

      {chips.map((c) => (
        <div key={c.label} className={`absolute ${c.pos} bg-white border border-border rounded-2xl px-3 py-2 flex items-center gap-2 shadow-md`}>
          <span className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ background: c.bg }}>{c.icon}</span>
          <div>
            <div className="text-[12px] font-bold text-primary leading-tight">{c.label}</div>
            <div className="text-[10px] text-secondary leading-tight">{c.sub}</div>
          </div>
        </div>
      ))}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white rounded-2xl px-5 py-3 text-center shadow-[0_4px_20px_rgba(193,63,63,0.35)] whitespace-nowrap">
        <div className="text-[13px] font-bold flex items-center gap-1.5 justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Compatible Build
        </div>
        <div className="text-[10px] opacity-80 mt-0.5">All parts verified</div>
      </div>
    </div>
  )
}

function FeaturedBuildSlider() {
  const [current, setCurrent] = useState(0)
  const build = featuredBuilds[current]

  const prev = () => setCurrent((i) => (i - 1 + featuredBuilds.length) % featuredBuilds.length)
  const next = () => setCurrent((i) => (i + 1) % featuredBuilds.length)

  const tagColors = {
    Gaming: { color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.1)' },
    Budget: { color: 'var(--color-success)', bg: 'rgba(29,158,117,0.1)' },
    Workstation: { color: '#7f77dd', bg: 'rgba(127,119,221,0.1)' },
  }
  const tag = tagColors[build.tag] ?? tagColors.Gaming

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="text-sm font-semibold text-primary truncate">{build.title}</h3>
          <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: tag.bg, color: tag.color }}>{build.tag}</span>
          <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(29,158,117,0.1)', color: 'var(--color-success)' }}>{build.price}</span>
        </div>

        {/* Arrows + dots */}
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            onClick={prev}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-accent/10 border border-border"
            style={{ background: 'transparent', cursor: 'pointer' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex gap-1">
            {featuredBuilds.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? '16px' : '6px',
                  height: '6px',
                  background: i === current ? 'var(--color-accent)' : '#d1cdc9',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-accent/10 border border-border"
            style={{ background: 'transparent', cursor: 'pointer' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8 6l-3.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {/* Parts grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        {build.parts.map((p) => (
          <div key={p.label} className="rounded-xl p-3" style={{ background: p.bg }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: p.color }}>{p.label}</p>
            <p className="text-[13px] font-semibold text-primary">{p.val}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="text-xs font-medium" style={{ color: 'var(--color-success)' }}>All parts compatible · {build.wattage} total</span>
        </div>
        <Link to="/builder" className="text-xs font-semibold text-accent-dark hover:underline inline-flex items-center gap-1">
          Try this build
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <main className="flex-1">

      {/* ── Hero ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-dark">AI-guided PC planning</span>
            </div>
            <h1 className="text-4xl lg:text-[3.4rem] font-bold text-primary leading-[1.08] tracking-tight">
              Build the <span className="text-accent">Perfect PC</span><br />Without the Guesswork
            </h1>
            <p className="mt-5 text-secondary max-w-xl leading-relaxed">
              PCSensei helps beginners confidently choose parts, avoid compatibility mistakes, and spend smarter on hardware that actually fits their goals.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/builder" className={btnPri}>Start Building</Link>
              <Link to="/ai-build" className={btnSec}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                  <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
                </svg>
                Generate AI Build
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              <span className="text-xs text-secondary">Built for</span>
              {['Beginners', 'Enthusiasts', 'Budget builders'].map((t) => (
                <span key={t} className="text-xs font-semibold text-secondary bg-card border border-border rounded-full px-3 py-0.5">{t}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}><HeroVisual /></Reveal>
        </div>
      </section>

      {/* ── Brand Ticker ── */}
      <section className="py-10 overflow-hidden">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary text-center mb-5">Compatible with parts from</p>
        </Reveal>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-bg, #f8f5f2), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-bg, #f8f5f2), transparent)' }} />
          <div className="flex" style={{ animation: 'pcTicker 28s linear infinite', width: 'max-content' }}>
            {/* triple the brands so there's always content filling the screen */}
            {[...brands, ...brands, ...brands].map((b, i) => (
              <span
                key={i}
                className="text-[13px] font-semibold bg-card border border-border rounded-full px-4 py-1.5 whitespace-nowrap mx-1.5"
                style={{ color: b.color }}  
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
        <style>{`@keyframes pcTicker { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal><h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8">How It Works</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 90}>
                <article className={card}>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent font-bold text-sm mb-3 border border-accent/20">
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-primary mb-2">{step.title}</h3>
                  <p className="text-secondary text-sm">{step.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Features ── */}
      <section className="py-16 px-4 bg-card/40">
        <div className="max-w-5xl mx-auto">
          <Reveal><h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8">Core Features</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {coreFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <article className={`${card} flex flex-col min-h-[200px]`}>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3" style={{ background: f.bg }}>{f.icon}</span>
                  <h3 className="font-semibold text-primary mb-2">{f.title}</h3>
                  <p className="text-secondary text-sm flex-1">{f.description}</p>
                  <Link className="mt-4 inline-flex items-center gap-1 text-accent-dark font-semibold text-sm hover:underline" to={f.path}>
                    Open tool
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Builds Slider ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-1">Featured builds</p>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary">Explore Pre-Made Builds</h2>
            </div>
            <FeaturedBuildSlider />
          </Reveal>
        </div>
      </section>

      {/* ── Why PCSensei ── */}
      <section className="py-16 px-4 bg-card/40">
        <div className="max-w-5xl mx-auto">
          <Reveal><h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8">Why PCSensei</h2></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <Reveal key={b.label} delay={i * 80}>
                <article className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
                  <span className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(193,63,63,0.1)' }}>{b.icon}</span>
                  <p className="text-primary font-medium text-sm">{b.label}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal><h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8">What Builders Say</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <article className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4 h-full">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#ef9f27" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-secondary text-sm leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${t.color}22`, color: t.color }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary leading-tight">{t.name}</p>
                      <p className="text-xs text-secondary">{t.role}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="bg-nav rounded-3xl p-10 md:p-14 border border-primary">
              <h2 className="text-2xl lg:text-3xl font-bold text-bg max-w-[24ch]">
                Stop guessing your PC parts. Let PCSensei guide you.
              </h2>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link to="/builder" className={btnPri}>Start Your Build</Link>
                <Link to="/ai-build" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-bg font-semibold px-5 py-2.5 rounded-xl hover:bg-white/15 hover:-translate-y-0.5 transition-all cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                    <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  Try AI Builder
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  )
}

export default HomePage