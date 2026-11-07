import Link from "next/link";

const capabilities = [
  { number: "01", title: "Listen everywhere", arabic: "استمع من كل مكان", text: "Bring Meta, Google Business, Reddit, and future sources into one brand workspace." },
  { number: "02", title: "Understand the signal", arabic: "افهم الإشارة", text: "Separate sentiment, recurring themes, urgency, language, and Egyptian slang from raw conversation." },
  { number: "03", title: "Move with confidence", arabic: "اتخذ القرار بثقة", text: "Turn customer evidence into owned actions before you automate a single reply." },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link className="landing-brand" href="/"><span className="brand-mark">S</span><span><strong>Sensor Brand</strong><small>Opinion intelligence</small></span></Link>
        <div className="landing-links"><a href="#how-it-works">How it works</a><a href="#capabilities">Capabilities</a><Link href="/dashboard">View prototype</Link></div>
        <Link className="button button-dark landing-login" href="/login">Sign in <span>→</span></Link>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-copy"><p className="landing-eyebrow">CUSTOMER OPINION INTELLIGENCE / ذكاء آراء العملاء</p><h1>Know what your customers mean, not just what they say.</h1><p className="landing-lede">Sensor Brand turns scattered comments, reviews, and mentions into one calm operating picture for every brand you manage.</p><p className="landing-arabic" dir="rtl">اجمع آراء عملائك، افهم مشاعرهم، وحوّل الإشارات إلى قرارات واضحة.</p><div className="landing-actions"><Link className="button button-dark" href="/login">Enter the prototype <span>→</span></Link><a className="landing-text-link" href="#how-it-works">See how it works <span>↓</span></a></div></div>
        <div className="landing-hero-visual"><div className="visual-glow" /><div className="signal-orbit orbit-one" /><div className="signal-orbit orbit-two" /><div className="signal-card-large"><div className="signal-card-topline"><span className="live-pulse" /> LIVE BRAND SIGNAL <span>NOW</span></div><strong>“The product is good, but support is slow.”</strong><div className="signal-meta"><span className="signal-avatar">N</span><span>Customer mention</span><span className="signal-tag">Needs action</span></div></div><div className="visual-float visual-float-top"><span>Sentiment</span><strong>—</strong></div><div className="visual-float visual-float-bottom"><span>Arabic signal</span><strong>جاهز للتحليل</strong></div></div>
      </section>

      <section className="trust-strip"><span>BUILT FOR BRANDS THAT LISTEN</span><div><span>Meta</span><span>Google Business</span><span>Reddit</span><span>Arabic + English</span></div></section>

      <section className="landing-section" id="how-it-works"><div className="section-intro"><p className="landing-eyebrow">FROM NOISE TO SIGNAL / من الضوضاء إلى الإشارة</p><h2>One workspace for the full customer conversation.</h2><p>Start with visibility. Add intelligence. Keep a human in control of every important response.</p></div><div className="steps-grid">{capabilities.map((item) => <article className="landing-step" key={item.number}><span className="step-number">{item.number}</span><h3>{item.title}</h3><span className="step-arabic" dir="rtl">{item.arabic}</span><p>{item.text}</p></article>)}</div></section>

      <section className="landing-split" id="capabilities"><div className="split-panel split-panel-dark"><p className="landing-eyebrow">THE BRAND WORKSPACE</p><h2>Every brand gets its own context.</h2><p>Sources, mentions, taxonomy, response rules, and AI memory stay together inside a workspace built for that brand.</p><div className="workspace-lines"><span>Workspace / Sensor Brand</span><span>Sources connected <b>—</b></span><span>Mentions analyzed <b>—</b></span><span>Open actions <b>—</b></span></div></div><div className="split-panel split-panel-light"><p className="landing-eyebrow">THE PROMISE</p><h2>Evidence before automation.</h2><p>We are building toward agentic responses, but the first version makes the signal visible, reviewable, and safe.</p><div className="promise-quote">“A better reply starts with a better understanding.”<small>Sensor Brand principle</small></div></div></section>

      <section className="landing-cta"><p className="landing-eyebrow">START WITH THE SIGNAL</p><h2>Build your brand’s listening layer.</h2><p>The prototype is ready for your first workspace, source, and customer conversation.</p><Link className="button button-dark" href="/login">Open Sensor Brand <span>→</span></Link></section>

      <footer className="landing-footer"><span>© 2026 Sensor Brand AI</span><span>Customer opinion intelligence for modern brands.</span><Link href="/login">Sign in</Link></footer>
    </main>
  );
}
