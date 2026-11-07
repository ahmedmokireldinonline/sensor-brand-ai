"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";

const jobs = [
  { label: "Webhook deliveries", value: "0", detail: "No events received" },
  { label: "Queued sync jobs", value: "0", detail: "Worker queue is clear" },
  { label: "Last successful sync", value: "—", detail: "Connect a source to begin" },
];

export default function SyncPage() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  function runTest() {
    setRunning(true);
    setMessage("Test mode is ready. Connect a source before enqueueing a real job.");
    window.setTimeout(() => setRunning(false), 500);
  }

  return (
    <AppShell>
      <header className="page-header page-header-compact">
        <div><p className="eyebrow">AUTOMATION / التشغيل الآلي</p><h1>Sync Center</h1><p className="page-intro">Monitor incoming webhooks and keep customer comments and reviews fresh with incremental background sync.</p></div>
        <button className="button button-primary" onClick={runTest} type="button">{running ? "Preparing…" : "Run sync test"} <span>→</span></button>
      </header>

      <section className="metric-grid sync-metric-grid">{jobs.map((job) => <article className="metric-card" key={job.label}><div className="metric-card-top"><span>{job.label}</span></div><strong className="metric-value">{job.value}</strong><span className="metric-detail">{job.detail}</span></article>)}</section>
      {message && <div className="sync-toast" role="status"><span>✓</span>{message}</div>}

      <section className="sync-layout">
        <article className="panel webhook-panel"><div className="panel-heading"><div><p className="panel-kicker">REAL-TIME INTAKE</p><h2>Webhook endpoints</h2></div><span className="status-pill">Listening when configured</span></div><p className="panel-intro">Provider events arrive here first. Each delivery is stored with an idempotency key before processing begins.</p>{["Meta", "Google", "Reddit"].map((provider) => <div className="endpoint-row" key={provider}><span className={`provider-mini ${provider.toLowerCase()}`}>{provider[0]}</span><div><strong>{provider} webhook</strong><code>/api/webhooks/{provider.toLowerCase()}</code></div><span className="endpoint-status">Not configured</span></div>)}</article>
        <article className="panel schedule-panel"><p className="panel-kicker">BACKGROUND WORKER</p><h2>Incremental sync</h2><p className="panel-intro">The worker uses each source cursor to fetch only new comments, reviews, and replies. Failed jobs remain retryable.</p><div className="schedule-control"><span className="schedule-icon">↻</span><div><strong>Recommended cadence</strong><small>Every 15 minutes for active sources</small></div><span className="schedule-value">15m</span></div><div className="schedule-control"><span className="schedule-icon">⌁</span><div><strong>Cursor strategy</strong><small>Provider timestamp + external ID</small></div><span className="schedule-value">Safe</span></div></article>
      </section>

      <section className="sync-lower-grid"><article className="panel sync-activity-panel"><div className="panel-heading"><div><p className="panel-kicker">ACTIVITY LOG</p><h2>Recent sync jobs</h2></div><span className="panel-count">0 jobs</span></div><div className="sync-table"><div className="sync-table-row sync-table-head"><span>Source</span><span>Trigger</span><span>Status</span><span>Records</span></div><div className="sync-table-row sync-table-empty"><span>—</span><span>—</span><span>No sync activity yet</span><span>—</span></div></div></article><article className="panel sync-safety-panel"><p className="panel-kicker">DELIVERY SAFETY</p><h2>Built to retry safely.</h2><div className="safety-item"><span>01</span><p>Webhook deliveries are deduplicated before processing.</p></div><div className="safety-item"><span>02</span><p>Sync cursors prevent duplicate imports during retries.</p></div><div className="safety-item"><span>03</span><p>Every job keeps its status, counts, and failure reason.</p></div></article></section>
    </AppShell>
  );
}
