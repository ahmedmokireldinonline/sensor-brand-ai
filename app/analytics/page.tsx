"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";

const metrics = [
  { label: "Total mentions", arabic: "إجمالي الإشارات", value: "—", detail: "No source data yet" },
  { label: "Positive sentiment", arabic: "مشاعر إيجابية", value: "—", detail: "Waiting for classification" },
  { label: "Negative sentiment", arabic: "مشاعر سلبية", value: "—", detail: "Waiting for classification" },
  { label: "Unresolved themes", arabic: "موضوعات تحتاج متابعة", value: "—", detail: "Themes appear after analysis" },
];

const sentimentLegend = [
  { label: "Positive", arabic: "إيجابي", color: "positive" },
  { label: "Neutral", arabic: "محايد", color: "neutral" },
  { label: "Negative", arabic: "سلبي", color: "negative" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30 days");
  const [source, setSource] = useState("All sources");

  return (
    <AppShell>
      <header className="page-header analytics-header">
        <div>
          <p className="eyebrow">CUSTOMER SIGNALS / إشارات العملاء</p>
          <h1>Know what the brand is feeling.</h1>
          <p className="page-intro">A focused view of volume, sentiment, themes, and language across every connected source.</p>
        </div>
        <div className="analytics-filters">
          <label><span>Period</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>7 days</option><option>30 days</option><option>90 days</option></select></label>
          <label><span>Source</span><select value={source} onChange={(event) => setSource(event.target.value)}><option>All sources</option><option>Meta</option><option>Google</option><option>Reddit</option></select></label>
        </div>
      </header>

      <section className="analytics-metric-grid" aria-label="Analytics summary">
        {metrics.map((metric) => <article className="metric-card analytics-metric-card" key={metric.label}><div className="metric-card-top"><span>{metric.label}</span><span className="metric-arabic" dir="rtl">{metric.arabic}</span></div><strong className="metric-value">{metric.value}</strong><span className="metric-detail">{metric.detail}</span></article>)}
      </section>

      <section className="analytics-main-grid">
        <article className="panel sentiment-panel">
          <div className="panel-heading"><div><p className="panel-kicker">SENTIMENT TREND / اتجاه المشاعر</p><h2>How the conversation is moving</h2></div><span className="analytics-period">{period}</span></div>
          <div className="analytics-chart-empty"><div className="chart-lines"><span /><span /><span /><span /><span /></div><div className="analytics-chart-orb">◒</div><strong>Sentiment needs mentions first</strong><p>Connect a source and the classified conversation will appear here over time.</p><div className="sentiment-legend">{sentimentLegend.map((item) => <span key={item.label}><i className={item.color} />{item.label}<small dir="rtl">{item.arabic}</small></span>)}</div></div>
        </article>
        <article className="panel distribution-panel">
          <div className="panel-heading"><div><p className="panel-kicker">MIX</p><h2>Sentiment mix</h2></div><span className="panel-count">0 mentions</span></div>
          <div className="donut-empty"><div className="donut-ring"><div>—<small>classified</small></div></div><p>There is no classified sentiment in this period yet.</p></div>
        </article>
      </section>

      <section className="analytics-secondary-grid">
        <article className="panel theme-panel"><div className="panel-heading"><div><p className="panel-kicker">TOP THEMES / أهم الموضوعات</p><h2>What customers are talking about</h2></div><span className="panel-count">0 themes</span></div><div className="theme-empty"><span className="theme-empty-icon">✦</span><strong>Topics will appear here</strong><p>AI will group recurring subjects such as delivery, quality, support, and pricing after mentions are classified.</p></div></article>
        <article className="panel language-panel"><div className="panel-heading"><div><p className="panel-kicker">LANGUAGE SIGNAL</p><h2>Arabic & English</h2></div></div><div className="language-bars"><div><div className="bar-label"><span>Arabic</span><strong>—</strong></div><div className="bar-track"><i className="bar-arabic" /></div></div><div><div className="bar-label"><span>English</span><strong>—</strong></div><div className="bar-track"><i className="bar-english" /></div></div><div><div className="bar-label"><span>Egyptian slang</span><strong>—</strong></div><div className="bar-track"><i className="bar-slang" /></div></div></div><p className="language-note">Dialect detection will separate Egyptian Arabic, Modern Standard Arabic, and English signals.</p></article>
      </section>

      <section className="analytics-bottom-grid"><article className="panel source-performance-panel"><div className="panel-heading"><div><p className="panel-kicker">SOURCE PERFORMANCE</p><h2>Where the signal comes from</h2></div><span className="panel-count">{source}</span></div><div className="analytics-table"><div className="analytics-row analytics-row-head"><span>Source</span><span>Mentions</span><span>Sentiment</span><span>Last sync</span></div><div className="analytics-row analytics-row-empty"><span>—</span><span>—</span><span>—</span><span>Connect a source</span></div></div></article><article className="panel analyst-note-panel"><p className="panel-kicker">ANALYST NOTE / ملاحظة المحلل</p><h2>Start with the signal, then decide.</h2><p>Analytics will help your team distinguish volume from urgency and recurring themes from one-off noise.</p><div className="bilingual-caption" dir="rtl">ابدأ بالإشارة، ثم اتخذ القرار المناسب.</div></article></section>
    </AppShell>
  );
}
