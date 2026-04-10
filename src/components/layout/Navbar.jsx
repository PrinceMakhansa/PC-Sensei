import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../../hooks/useAuth'

const tools = [
  {
    to: '/builder',
    label: 'Build PC',
    sub: 'Manual part selection',
    bg: 'rgba(193,63,63,0.18)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c13f3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    to: '/ai-build',
    label: 'AI Build',
    sub: 'Generate in seconds',
    bg: 'rgba(99,153,34,0.18)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <circle cx="9" cy="14" r="1" fill="#639922" stroke="none" />
        <circle cx="15" cy="14" r="1" fill="#639922" stroke="none" />
      </svg>
    ),
  },
  {
    to: '/upgrade-planner',
    label: 'Upgrade Planner',
    sub: 'Smart next-step upgrades',
    bg: 'rgba(186,117,23,0.18)',
    dividerBefore: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ba7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
]

/** Get 1–2 initials from a name string */
function getInitial(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0][0].toUpperCase()
}

function AvatarButton({ user, onClick, size = 34 }) {
  return (
    <button
      onClick={onClick}
      aria-label="Account menu"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--color-accent)',
        border: '2px solid rgba(255,255,255,0.18)',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.38,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-0.02em',
        flexShrink: 0,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        boxShadow: '0 2px 8px rgba(193,63,63,0.35)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.07)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(193,63,63,0.5)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(193,63,63,0.35)'
      }}
    >
      {getInitial(user.name)}
    </button>
  )
}

function DropdownItem({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', background: hov ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: 'none', borderRadius: 10, padding: '8px 10px',
        color: danger ? '#e05555' : (hov ? '#f6f2eb' : '#c9c2bb'),
        fontSize: 13, fontWeight: 500, cursor: 'pointer',
        transition: 'background 0.12s, color 0.12s', textAlign: 'left',
      }}
    >
      <span style={{ opacity: 0.75, display: 'flex', alignItems: 'center' }}>{icon}</span>
      {label}
    </button>
  )
}

function UserDropdown({ user, onClose, logout, navigate }) {
  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        minWidth: 210,
        background: 'rgba(28,28,28,0.98)',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(20px)',
        padding: '8px',
        zIndex: 100,
      }}
    >
      {/* User info header */}
      <div style={{ padding: '10px 12px 10px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
          }}>
            {getInitial(user.name)}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: '#f6f2eb', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </p>
            <p style={{ margin: 0, color: '#7a756f', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <DropdownItem
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
        label="My Profile"
        onClick={() => { navigate('/profile'); onClose() }}
      />
      <DropdownItem
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>}
        label="My Builds"
        onClick={() => { navigate('/profile'); onClose() }}
      />
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 0' }} />
      <DropdownItem
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e05555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>}
        label="Sign Out"
        onClick={handleLogout}
        danger
      />
    </div>
  )
}

function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const userMenuRefDesktop = useRef(null)
  const userMenuRefMobile = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  const isToolActive = tools.some((t) => location.pathname.startsWith(t.to))

  const close = () => {
    setIsToolsOpen(false)
    setIsMobileOpen(false)
    setIsUserOpen(false)
  }

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Outside click closes tools dropdown
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Outside click closes user dropdown
  useEffect(() => {
    const handler = (e) => {
      const inDesktop = userMenuRefDesktop.current && userMenuRefDesktop.current.contains(e.target)
      const inMobile = userMenuRefMobile.current && userMenuRefMobile.current.contains(e.target)
      if (!inDesktop && !inMobile) {
        setIsUserOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Route change closes everything
  useEffect(() => {
    close()
  }, [location.pathname])

  const pillLinkCls = ({ isActive }) =>
    `px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ease-out ${isActive
      ? 'bg-white/10 text-accent'
      : 'text-[#c9c2bb] hover:text-[#f6f2eb] hover:bg-white/5'
    }`

  const dropdownItemCls = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ease-out ${isActive
      ? 'bg-white/10 text-[#f6f2eb]'
      : 'text-[#c9c2bb] hover:text-[#f6f2eb] hover:bg-white/5'
    }`

  const mobileItemCls = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ease-out ${isActive
      ? 'bg-white/10 text-[#f6f2eb]'
      : 'text-[#c9c2bb] hover:text-[#f6f2eb] hover:bg-white/5'
    }`

  const loginButtonStyle = {
    fontSize: scrolled ? '12px' : '13px',
    padding: scrolled ? '6px 14px' : '8px 20px',
    borderRadius: '99px',
    background: 'var(--color-accent)',
    boxShadow: scrolled ? 'none' : '0 4px 14px rgba(193,63,63,0.28)',
  }

  return (
    <header
      className="sticky top-0 z-50 px-4 transition-all duration-300 ease-out"
      style={{ paddingTop: scrolled ? '8px' : '12px', paddingBottom: scrolled ? '8px' : '12px' }}
    >
      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <div
          className="max-w-5xl mx-auto flex items-center justify-between transition-all duration-300 ease-out"
          style={scrolled ? {
            background: 'rgba(28,28,28,0.95)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: '99px',
            padding: '5px 6px 5px 16px',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
          } : {
            padding: '0',
          }}
        >
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Logo
              variant={scrolled ? 'light' : 'dark'}
              onClick={() => { close(); scrollToTop() }}
            />
          </div>

          {/* Nav */}
          <nav
            className="flex items-center gap-1 transition-all duration-300 ease-out"
            style={scrolled ? {
              background: 'transparent',
              border: 'none',
              padding: '0',
              boxShadow: 'none',
            } : {
              background: 'rgba(28,28,28,0.92)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: '99px',
              padding: '5px 6px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <NavLink
              to="/"
              end
              onClick={() => { close(); scrollToTop() }}
              className={pillLinkCls}
            >
              Home
            </NavLink>

            {/* Tools dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen((s) => !s)}
                aria-expanded={isToolsOpen}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ease-out bg-transparent border-0 cursor-pointer ${isToolsOpen || isToolActive
                    ? 'bg-white/10 text-accent'
                    : 'text-[#c9c2bb] hover:text-[#f6f2eb] hover:bg-white/5'
                  }`}
              >
                Tools
                <svg
                  className={`w-3 h-3 transition-transform duration-250 ease-out ${isToolsOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 12 12" fill="none" aria-hidden="true"
                >
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-nav border border-white/10 rounded-2xl p-2 shadow-2xl origin-top transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${isToolsOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'
                  }`}
              >
                {tools.map((item) => (
                  <div key={item.to}>
                    {item.dividerBefore && <div className="h-px bg-white/[0.08] my-1.5" />}
                    <NavLink to={item.to} onClick={close} className={dropdownItemCls}>
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                        style={{ background: item.bg }}
                      >
                        {item.icon}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium text-bg leading-tight">{item.label}</span>
                        <span className="text-[11px] text-secondary leading-tight mt-0.5">{item.sub}</span>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>

            <NavLink to="/prebuilds" onClick={close} className={pillLinkCls}>Prebuilds</NavLink>
            <NavLink to="/about" onClick={close} className={pillLinkCls}>About</NavLink>
          </nav>

          {/* Right side — avatar or login */}
          {user ? (
            <div className="relative shrink-0" ref={userMenuRefDesktop}>
              <AvatarButton user={user} onClick={() => setIsUserOpen((s) => !s)} />
              {isUserOpen && (
                <UserDropdown
                  user={user}
                  onClose={() => setIsUserOpen(false)}
                  logout={logout}
                  navigate={navigate}
                />
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="shrink-0 text-white font-semibold transition-all duration-250 ease-out hover:-translate-y-0.5"
              style={loginButtonStyle}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden max-w-5xl mx-auto flex items-center justify-between">
        <div className="shrink-0 flex items-center">
          <Logo variant="dark" onClick={() => { close(); scrollToTop() }} />
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={userMenuRefMobile}>
              <AvatarButton user={user} size={32} onClick={() => setIsUserOpen((s) => !s)} />
              {isUserOpen && (
                <UserDropdown
                  user={user}
                  onClose={() => setIsUserOpen(false)}
                  logout={logout}
                  navigate={navigate}
                />
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-accent text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-accent-dark transition-all"
            >
              Login
            </Link>
          )}
          <button
            className="flex flex-col justify-center gap-[5px] p-1.5 bg-transparent border-0 cursor-pointer w-8 h-8"
            onClick={() => setIsMobileOpen((s) => !s)}
            aria-expanded={isMobileOpen}
            aria-label="Toggle navigation"
          >
            <span className={`block w-5 h-0.5 bg-primary transition-all duration-300 ease-out origin-center ${isMobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-primary transition-all duration-200 ease-out ${isMobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-primary transition-all duration-300 ease-out origin-center ${isMobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden max-w-5xl mx-auto mt-2 bg-nav border border-white/10 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-col p-3 gap-1">
          {[
            { to: '/', label: 'Home', end: true, onClick: () => { close(); scrollToTop() } },
            ...tools.map((t) => ({ to: t.to, label: t.label, icon: t.icon, bg: t.bg })),
            { to: '/prebuilds', label: 'Prebuilds' },
            { to: '/about', label: 'About' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={item.onClick || close}
              className={mobileItemCls}
            >
              {item.icon && (
                <span className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ background: item.bg }}>
                  {item.icon}
                </span>
              )}
              {item.label}
            </NavLink>
          ))}
          <div className="h-px bg-white/[0.08] my-1" />
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={close}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#c9c2bb] hover:text-[#f6f2eb] hover:bg-white/5 transition-all"
              >
                <span
                  style={{
                    width: 28, height: 28, borderRadius: '50%', background: 'var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0,
                  }}
                >
                  {getInitial(user.name)}
                </span>
                My Profile
              </Link>
              <button
                onClick={() => { logout(); close(); navigate('/') }}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-semibold text-white border-0 cursor-pointer transition-all"
                style={{ background: 'rgba(193,63,63,0.15)', color: '#e05555' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={close}
              className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--color-accent)' }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar