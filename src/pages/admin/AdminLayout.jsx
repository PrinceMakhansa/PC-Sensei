  import { NavLink, Outlet, useNavigate } from 'react-router-dom'

  const navItems = [
    {
      to: '/admin',
      end: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      label: 'Dashboard',
    },
    {
      to: '/admin/components',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      ),
      label: 'Components',
    },
    {
      to: '/admin/users',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      label: 'Users',
    },
    {
      to: '/admin/admins',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
          <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
          <path d="M21 7v6" />
          <path d="M18 10h6" />
        </svg>
      ),
      label: 'Admins',
    },
    {
      to: '/admin/builds',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: 'Builds',
    },
  ]

  function AdminLayout() {
    const navigate = useNavigate()

    return (
      <div className="flex min-h-screen bg-bg">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 bg-card border-r border-border flex flex-col">
          {/* Logo */}
          <div className="w-full py-6 flex flex-col items-center gap-1 border-b border-border">
            <p className="text-primary font-extrabold text-lg leading-none tracking-tight">PCSensei</p>
            <p className="text-[10px] text-secondary font-medium">Admin Panel</p>
          </div>


          {/* Nav */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-secondary hover:text-primary hover:bg-bg'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Back to site */}
          <div className="px-3 py-4 border-t border-border">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-bg transition-all cursor-pointer border-0 bg-transparent"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to site
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    )
  }

  export default AdminLayout