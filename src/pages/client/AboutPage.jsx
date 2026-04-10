function AboutPage() {
  const values = [
    {
      color: 'var(--color-accent)',
      bg: 'rgba(193,63,63,0.1)',
      title: 'Compatibility-first',
      desc: 'Every part selection is checked against the rest of your build in real time — no nasty surprises.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="2,8 6,12 14,4" />
        </svg>
      ),
    },
    {
      color: 'var(--color-success)',
      bg: 'rgba(29,158,117,0.1)',
      title: 'Budget-aware',
      desc: 'Set your budget and get builds that actually fit — no surprise overages or hidden costs.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 4.5v1M8 10.5v1M6 6.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5S9 8 8 8s-2 .7-2 1.5S7 11 8 11s2-.7 2-1.5" />
        </svg>
      ),
    },
    {
      color: 'var(--color-nav)',
      bg: 'rgba(28,28,28,0.05)',
      title: 'AI-assisted',
      desc: 'Let the AI suggest a full build or just guide you through the tricky parts — you stay in control.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="10" height="7" rx="2" />
          <path d="M6 11v1.5M10 11v1.5M5 14h6" />
          <circle cx="6" cy="7.5" r="1" fill="currentColor" />
          <circle cx="10" cy="7.5" r="1" fill="currentColor" />
        </svg>
      ),
    },
  ]

  const audiences = [
    { label: 'First-time builders', color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.1)' },
    { label: 'PC enthusiasts', color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.1)' },
    { label: 'Budget-conscious buyers', color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.1)' },
    { label: 'Upgrade planners', color: 'var(--color-accent)', bg: 'rgba(193,63,63,0.1)' },
  ]

  return (
    <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-bg relative overflow-hidden">
      {/* Decorative gradient blur blobs for commercial aesthetic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent-dark/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-border border border-border/50 text-secondary text-xs font-bold tracking-widest uppercase mb-6">
            About Our Platform
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-tight">
            A <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-dark">Compatibility-First</span><br />
            PC Planning Platform
          </h1>
          <p className="text-secondary text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            PCSensei blends real-time compatibility checks, budget guidance, and AI-assisted suggestions to make PC building clear, confident, and fast.
          </p>
        </header>

        {/* Mission Statement Showcase */}
        <div className="relative bg-gradient-to-r from-accent/10 to-accent-dark/10 p-1 rounded-3xl mb-12">
          <div className="bg-card h-full w-full rounded-[20px] p-8 sm:p-10 text-center shadow-lg border border-border">
            <svg className="w-10 h-10 mx-auto text-accent mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
            <p className="text-xl sm:text-2xl font-bold text-primary leading-relaxed max-w-3xl mx-auto">
              Remove the guesswork. Make PC building approachable, transparent, and efficient for everyone.
            </p>
          </div>
        </div>

        {/* Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {values.map((v) => (
            <div 
              key={v.title} 
              className="group bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ background: v.bg, color: v.color }}
              >
                {v.icon}
              </div>
              <h3 className="text-lg font-bold text-primary mb-3">{v.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Why we built this</h2>
            <p className="text-secondary leading-relaxed mb-4">
              Instead of forcing users to compare dozens of confusing specs manually across multiple retailer tabs, we focus on practical guidance: compatibility checks, budget clarity, and upgrade paths that make sense.
            </p>
            <p className="text-secondary leading-relaxed">
              Designed for absolute beginners feeling overwhelmed, and enthusiasts looking for a cleaner drafting tool. Every recommendation highlights trade-offs so you can build with facts, not guesswork.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm h-full">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Designed For</h3>
            <div className="flex flex-col gap-4">
              {audiences.map((a) => (
                <div key={a.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: a.bg, color: a.color }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-primary font-medium">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meet the Creator / Premium Catchy Section */}
        <section className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary">Meet The Developer</h2>
            <p className="text-secondary text-lg mt-3">Driven by code, design, and a passion for great UX.</p>
          </div>
          
          <div className="relative bg-card border border-border rounded-[2.5rem] p-8 sm:p-12 overflow-hidden shadow-2xl shadow-black/10 group hover:shadow-accent/5 transition-all duration-500">
            {/* Animated Glow Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-125"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-dark/10 rounded-full blur-[80px] -ml-20 -mb-20 transition-transform duration-700 group-hover:scale-125"></div>
            
            <div className="relative flex flex-col items-center gap-10">

              <div className="flex-1 text-center">
                <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase">
                  Lead Developer
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-3">Prince Makhansa</h3>
                <p className="text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
                  A full-stack craftsman dedicated to building seamless digital experiences. PCSensei was born from the pure frustration of tedious PC part-picking, transformed into a sleek, intelligent planner. Always exploring, building, and open to impactful new collaborations.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="https://www.pr1nce.tech/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-bg font-bold text-sm hover:scale-105 transition-transform shadow-md"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path><polyline points="21 3 14 3 14 10"></polyline><line x1="21" y1="3" x2="10" y2="14"></line></svg>
                    Visit Portfolio
                  </a>
                  <a 
                    href="https://github.com/PrinceMakhansa" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-bg border-2 border-border text-primary font-bold text-sm hover:border-primary/50 hover:bg-border/30 transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>
                    GitHub
                  </a>
                  <a 
                    href="https://discord.com/users/1039359961530122391" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#5865F2]/10 border-2 border-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2]/20 font-bold text-sm transition-colors"
                  >
                    Discord
                  </a>
                  <a 
                    href="https://www.instagram.com/pr1nce._28/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#E1306C]/10 border-2 border-[#E1306C]/20 text-[#E1306C] hover:bg-[#E1306C]/20 font-bold text-sm transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

export default AboutPage