import { Link } from 'react-router-dom'
import Logo from './Logo'

const exploreLinks = [
  { label: 'Home',            to: '/'                },
  { label: 'Manual Builder',  to: '/builder'         },
  { label: 'AI Build',        to: '/ai-build'        },
  { label: 'Upgrade Planner', to: '/upgrade-planner' },
]

const platformLinks = [
  { label: 'About',            to: '/about' },
  { label: 'Terms',            to: '/terms' },
  { label: 'Privacy',          to: '/privacy' },
  { label: 'Login / Register', to: '/auth'  },
  { label: 'Admin Panel',      to: '/admin-login' },
]

const socials = [
  {
    label: 'Portfolio',
    href: 'https://www.pr1nce.tech/',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 3h7v7" />
        <path d="M10 14L21 3" />
        <path d="M21 14v7h-7" />
        <path d="M3 10V3h7" />
        <path d="M3 21h7" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/PrinceMakhansa',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/pr1nce._28/',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.com/users/1039359961530122391',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7.5 17c2.5 2 6.5 2 9 0" />
        <path d="M7 7c3-2 7-2 10 0" />
        <circle cx="9.5" cy="12" r="1" />
        <circle cx="14.5" cy="12" r="1" />
      </svg>
    ),
  },
]

function Footer() {
  return (
    <footer className="bg-nav mt-auto">
      {/* Red accent top bar */}
      <div className="h-[3px] bg-gradient-to-r from-accent to-accent-dark" />

      <div className="max-w-5xl mx-auto px-6 pt-14 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-12">

          {/* Brand column */}
          <div>
            <Logo variant="light" />
            <p className="text-[#9f9891] text-sm mt-4 mb-6 leading-relaxed max-w-[240px]">
              Build smarter PCs with compatibility-first guidance and AI-powered recommendations.
            </p>
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-[#333] flex items-center justify-center text-[#9f9891] hover:border-accent hover:text-bg transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-bg text-[11px] font-semibold uppercase tracking-widest mb-5">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {exploreLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[#9f9891] text-sm hover:text-bg transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-3 h-px bg-accent inline-block flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-bg text-[11px] font-semibold uppercase tracking-widest mb-5">
              Platform
            </h4>
            <ul className="flex flex-col gap-3">
              {platformLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[#9f9891] text-sm hover:text-bg transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-3 h-px bg-accent inline-block flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-5xl mx-auto px-6 mt-12 py-5 border-t border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[#5a5550] text-xs">
          © {new Date().getFullYear()} PCSensei. All rights reserved.
        </p>
        <p className="text-[#5a5550] text-xs">
          Built for PC builders, by PC builders.
        </p>
      </div>
    </footer>
  )
}

export default Footer