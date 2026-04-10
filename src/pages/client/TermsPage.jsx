function TermsPage() {
  const lastUpdated = "April 5, 2026";
  const sections = [
    {
      title: '1. Acceptance of Terms',
      body: 'By using PCSensei, you agree to these Terms. If you do not agree, please stop using the service.',
    },
    {
      title: '2. Accounts and Access',
      body: 'You are responsible for maintaining the security of your account. Do not share your credentials or attempt to access admin features without permission.',
    },
    {
      title: '3. Data and Recommendations',
      body: 'Build recommendations are provided for guidance only. Always verify compatibility and pricing before purchase. PCSensei does not guarantee the availability or exact pricing of suggested components.',
    },
    {
      title: '4. User Content',
      body: 'You retain ownership of your builds. You grant PCSensei permission to store, process, and display your build data within the app to provide you with its core features.',
    },
    {
      title: '5. Prohibited Use',
      body: 'Do not abuse the API, attempt to bypass security, reverse engineer the platform, or submit harmful content. We reserve the right to suspend or terminate accounts that violate these terms.',
    },
    {
      title: '6. Changes to Terms',
      body: 'We may update these Terms as the product evolves. Continued use of the platform after updates are made constitutes your acceptance of the latest version.',
    },
  ]

  return (
    <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-bg relative overflow-hidden">
      {/* Background gradient for legal professional vibe */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-accent-dark/10 border border-accent-dark/20 text-accent-dark text-xs font-bold tracking-wider uppercase mb-4">
            Legal & Compliance
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            Terms of Service
          </h1>
          <p className="text-secondary text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            These terms outline the rules and regulations for the use of PCSensei's platform, ensuring a safe and reliable environment for everyone.
          </p>
          <p className="text-sm text-secondary/60 mt-4">Last updated: {lastUpdated}</p>
        </header>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-black/5">
          <div className="bg-border/30 px-6 sm:px-10 py-5 border-b border-border">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Agreement Overview</h2>
          </div>
          <div className="p-6 sm:p-10">
            <div className="text-secondary text-base leading-relaxed mb-8">
              <p>
                Welcome to PCSensei! These Terms of Service ("Terms") govern your use of the PCSensei website and services. Please read them carefully.
              </p>
            </div>
            
            <div className="flex flex-col gap-8">
              {sections.map((s, idx) => (
                <section key={idx} className="relative pl-6 sm:pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-0 before:w-1 before:bg-border hover:before:bg-accent-dark before:transition-colors before:rounded-full">
                  <h3 className="text-lg font-bold text-primary mb-3">{s.title}</h3>
                  <p className="text-secondary text-base leading-relaxed text-justify">
                    {s.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TermsPage
