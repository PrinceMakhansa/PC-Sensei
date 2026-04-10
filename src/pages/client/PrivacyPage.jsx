function PrivacyPage() {
  const lastUpdated = "April 5, 2026";
  const sections = [
    {
      title: 'Information We Collect',
      body: 'We collect basic account details like name, email, and saved builds. We do not store payment data in this app.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      )
    },
    {
      title: 'How We Use Data',
      body: 'Your data is used to personalize builds, store your configurations, and secure your account access.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      )
    },
    {
      title: 'Data Storage',
      body: 'Builds and account data are stored securely in our database. Passwords are hashed before storage.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
      )
    },
    {
      title: 'Cookies and Local Storage',
      body: 'We store a login token in your browser to keep you signed in. You can clear it by logging out.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
      )
    },
    {
      title: 'Your Choices',
      body: 'You can update your profile or request account removal. Contact the creator to process removals.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
      )
    },
  ]

  return (
    <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-bg relative overflow-hidden">
      {/* Background blobs for a premium commercial look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wider uppercase mb-4">
            Legal & Compliance
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-secondary text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            We believe your data is yours. Here is exactly how we handle, store, and protect your information when you use PCSensei.
          </p>
          <p className="text-sm text-secondary/60 mt-4">Last updated: {lastUpdated}</p>
        </header>

        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Quick Navigation / Summary Side */}
            <div className="md:col-span-4 hidden md:block border-r border-border pr-6">
              <div className="sticky top-24">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-4">In this Policy</h3>
                <ul className="space-y-3">
                  {sections.map((s, idx) => (
                    <li key={idx}>
                      <a href={`#section-${idx}`} className="text-sm text-secondary hover:text-accent font-medium transition-colors flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-8 flex flex-col gap-10">
              {sections.map((s, idx) => (
                <section key={s.title} id={`section-${idx}`} className="scroll-mt-24 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-border/50 text-accent group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                      {s.icon}
                    </div>
                    <h2 className="text-xl font-bold text-primary">{s.title}</h2>
                  </div>
                  <p className="text-secondary text-base leading-relaxed pl-12 border-l-2 border-transparent group-hover:border-accent/20 transition-all">
                    {s.body}
                  </p>
                </section>
              ))}

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-secondary text-center">
                  Have questions about our privacy practices? Reach out to the creator directly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPage
