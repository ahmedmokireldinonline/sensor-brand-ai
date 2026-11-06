const signals = [
  { label: "Mentions tracked", value: "—" },
  { label: "Net sentiment", value: "—" },
  { label: "Open actions", value: "—" },
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">SENSOR BRAND AI / BRAND WORKSPACE</p>
        <div className="hero-grid">
          <div>
            <h1>See what customers are telling you.</h1>
            <p className="lede">
              Customer-opinion intelligence for Arabic and English brands — built to turn recurring feedback into owned action.
            </p>
            <p className="arabic" dir="rtl">
              افهم عملاءك، صنّف آراءهم، وحوّل الشكاوى المتكررة إلى إجراءات واضحة.
            </p>
          </div>
          <div className="signal-card" aria-label="Workspace status">
            <div className="signal-dot" />
            <span>Workspace foundation</span>
            <strong>Ready for source connections</strong>
            <small>Meta · Google · LinkedIn · Reddit</small>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Workspace metrics">
        {signals.map((signal) => (
          <article className="metric" key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </article>
        ))}
      </section>

      <section className="next-step">
        <div>
          <p className="eyebrow">NEXT STEP</p>
          <h2>Connect a source to start listening.</h2>
          <p>Each connected platform will feed one normalized, workspace-scoped intelligence layer.</p>
        </div>
        <button type="button">Add a source</button>
      </section>
    </main>
  );
}
