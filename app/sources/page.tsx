"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/app-shell";

type Provider = "meta" | "google" | "reddit";

const providers: Array<{
  id: Provider;
  name: string;
  arabic: string;
  description: string;
  detail: string;
  icon: string;
  tone: string;
}> = [
  { id: "meta", name: "Meta", arabic: "فيسبوك وإنستغرام", description: "Facebook Pages and Instagram Professional accounts", detail: "Comments, replies, mentions", icon: "M", tone: "meta" },
  { id: "google", name: "Google Business", arabic: "جوجل بزنس", description: "Google Business Profile locations and reviews", detail: "Reviews, ratings, replies", icon: "G", tone: "google" },
  { id: "reddit", name: "Reddit", arabic: "ريديت", description: "Subreddits and public brand conversations", detail: "Posts, comments, mentions", icon: "R", tone: "reddit" },
];

export default function SourcesPage() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const provider = providers.find((item) => item.id === selectedProvider);

  function openSetup(id: Provider) {
    setSelectedProvider(id);
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <AppShell>
      <header className="page-header page-header-compact">
        <div>
          <p className="eyebrow">LISTENING LAYER / طبقة الاستماع</p>
          <h1>Connect your sources.</h1>
          <p className="page-intro">Bring customer conversations into one workspace. Credentials stay protected and source data remains isolated to its brand.</p>
        </div>
        <div className="sources-header-status"><span className="status-dot" /> 0 active sources</div>
      </header>

      <section className="source-summary">
        <div><span className="summary-label">ACTIVE SOURCES</span><strong>0</strong></div>
        <div><span className="summary-label">LAST SYNC</span><strong>—</strong></div>
        <div><span className="summary-label">COMMENTS READY</span><strong>—</strong></div>
        <div className="source-summary-note"><span className="shield-icon">◇</span><span>Read-only by default. Reply permissions are enabled separately.</span></div>
      </section>

      <section className="sources-section-heading">
        <div><p className="panel-kicker">AVAILABLE CONNECTORS</p><h2>Choose where your customers are talking.</h2></div>
        <span className="sources-count">3 platforms</span>
      </section>

      <section className="provider-grid" aria-label="Available source providers">
        {providers.map((item) => (
          <article className="provider-card" key={item.id}>
            <div className={`provider-icon ${item.tone}`}>{item.icon}</div>
            <div className="provider-card-copy">
              <div className="provider-name-row"><h3>{item.name}</h3><span className="provider-arabic" dir="rtl">{item.arabic}</span></div>
              <p>{item.description}</p>
              <span className="provider-detail">{item.detail}</span>
            </div>
            <button className="button button-secondary provider-button" onClick={() => openSetup(item.id)} type="button">Connect <span>→</span></button>
          </article>
        ))}
      </section>

      {provider && (
        <section className="panel source-setup-panel">
          <div className="source-setup-heading">
            <div className={`provider-icon ${provider.tone}`}>{provider.icon}</div>
            <div><p className="panel-kicker">CONNECT {provider.name.toUpperCase()}</p><h2>Set up your {provider.name} source</h2><p>We will save the connection to the current workspace after the integration is authorized.</p></div>
            <button className="close-button" onClick={() => setSelectedProvider(null)} type="button" aria-label="Close">×</button>
          </div>
          {submitted ? (
            <div className="form-success"><span>✓</span><div><strong>Connection request captured</strong><p>The OAuth and provider API flow will be connected next. No credentials have been stored yet.</p></div></div>
          ) : (
            <form className="source-form" onSubmit={handleSubmit}>
              <label><span>Account or page reference</span><input name="accountRef" placeholder={provider.id === "meta" ? "Page ID or Instagram account ID" : provider.id === "google" ? "Business Profile location ID" : "Subreddit name or account reference"} required /></label>
              <label><span>Display name <em>Optional</em></span><input name="accountName" placeholder={provider.id === "meta" ? "Brand Facebook Page" : provider.id === "google" ? "Main branch" : "Brand community"} /></label>
              <label className="form-field-wide"><span>Permission mode</span><select name="permissionMode" defaultValue="read"><option value="read">Read and analyze only</option><option value="moderate">Read, analyze, and prepare replies</option></select><small>Publishing or moderation permissions will require an explicit confirmation later.</small></label>
              <div className="form-actions"><button className="button button-quiet" onClick={() => setSelectedProvider(null)} type="button">Cancel</button><button className="button button-primary" type="submit">Continue authorization <span>→</span></button></div>
            </form>
          )}
        </section>
      )}

      <section className="sources-lower-grid">
        <article className="panel source-security-panel"><p className="panel-kicker">ACCESS CONTROL / التحكم في الوصول</p><h2>Designed for safe listening.</h2><div className="security-row"><span className="security-mark">✓</span><div><strong>Workspace-scoped</strong><p>Every source belongs to one brand workspace.</p></div></div><div className="security-row"><span className="security-mark">✓</span><div><strong>Read-only starting point</strong><p>We collect insight before enabling actions.</p></div></div><div className="security-row"><span className="security-mark">✓</span><div><strong>Revocable anytime</strong><p>Disconnect a provider and stop future syncs.</p></div></div></article>
        <article className="panel source-help-panel"><p className="panel-kicker">WHAT HAPPENS NEXT?</p><h2>Connect once. Keep learning.</h2><p>After authorization, new conversations are normalized into your mentions inbox and prepared for language, sentiment, topic, and urgency analysis.</p><div className="bilingual-caption" dir="rtl">اربط المصدر مرة واحدة، ودع النظام يتعلم من آراء عملائك.</div></article>
      </section>
    </AppShell>
  );
}
