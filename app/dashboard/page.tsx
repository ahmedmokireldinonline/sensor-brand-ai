import Link from "next/link";
import { AppShell } from "@/components/app-shell";

const metrics = [
  { label: "Mentions tracked", arabic: "الإشارات المرصودة", value: "—", detail: "Connect a source to begin" },
  { label: "Net sentiment", arabic: "صافي المشاعر", value: "—", detail: "Waiting for customer opinion data" },
  { label: "Open action items", arabic: "الإجراءات المفتوحة", value: "—", detail: "Actions appear after review" },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <header className="page-header">
        <div>
          <p className="eyebrow">WORKSPACE OVERVIEW / نظرة عامة</p>
          <h1>Good decisions start with better signals.</h1>
          <p className="page-intro">A calm, evidence-first view of what customers are saying about your brand.</p>
        </div>
        <Link className="button button-primary" href="/workspaces">
          <span>＋</span> Create workspace
        </Link>
      </header>

      <section className="metric-grid" aria-label="Workspace metrics">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className="metric-card-top">
              <span>{metric.label}</span>
              <span className="metric-arabic" dir="rtl">{metric.arabic}</span>
            </div>
            <strong className="metric-value">{metric.value}</strong>
            <span className="metric-detail">{metric.detail}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel panel-large">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">SIGNAL HEALTH</p>
              <h2>Sentiment over time</h2>
            </div>
            <button className="select-button" type="button">Last 30 days <span>⌄</span></button>
          </div>
          <div className="chart-empty">
            <div className="chart-lines"><span /><span /><span /><span /></div>
            <div className="empty-orb">◌</div>
            <strong>No signal data yet</strong>
            <p>Connect Facebook, Instagram, Google Reviews, or an import source to see trends here.</p>
            <Link className="text-link" href="/workspaces">Manage sources <span>→</span></Link>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">OPERATIONS</p>
              <h2>Recurring complaints</h2>
            </div>
            <span className="panel-count">0 / 5</span>
          </div>
          <div className="list-empty">
            <span className="empty-icon">◎</span>
            <strong>Nothing to resolve yet</strong>
            <p>Once opinions are classified, recurring operational themes will appear here.</p>
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">INBOX</p>
              <h2>Latest mentions</h2>
            </div>
            <span className="status-pill">No data</span>
          </div>
          <div className="table-empty">
            <div className="table-row table-row-head"><span>Source</span><span>Opinion</span><span>Status</span></div>
            <div className="table-row table-row-empty"><span>—</span><span>Connect a source to populate this view</span><span>—</span></div>
          </div>
        </article>
        <article className="panel action-panel">
          <p className="panel-kicker">NEXT STEP / الخطوة التالية</p>
          <h2>Make this workspace yours.</h2>
          <p>Set up the brand profile, connect a source, and define who should review sensitive customer conversations.</p>
          <Link className="button button-secondary" href="/workspaces">Open workspace settings <span>→</span></Link>
        </article>
      </section>
    </AppShell>
  );
}
