"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/app-shell";

export default function WorkspacesPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <AppShell>
      <header className="page-header page-header-compact">
        <div>
          <p className="eyebrow">ORGANIZATION / المؤسسة</p>
          <h1>Brand workspaces</h1>
          <p className="page-intro">Keep every brand’s sources, customer opinions, policies, and AI context safely separated.</p>
        </div>
        <button className="button button-primary" onClick={() => { setShowForm(true); setSubmitted(false); }} type="button">
          <span>＋</span> New workspace
        </button>
      </header>

      <section className="workspace-summary">
        <div><span className="summary-label">WORKSPACES</span><strong>0</strong></div>
        <div><span className="summary-label">CONNECTED SOURCES</span><strong>0</strong></div>
        <div><span className="summary-label">TEAM MEMBERS</span><strong>—</strong></div>
        <div className="summary-help"><span className="help-mark">?</span><span>Each workspace is an isolated brand environment.</span></div>
      </section>

      {showForm && (
        <section className="panel create-workspace-panel">
          <div className="form-heading">
            <div>
              <p className="panel-kicker">NEW WORKSPACE / مساحة عمل جديدة</p>
              <h2>Create your first brand workspace</h2>
              <p>Start with the brand basics. Sources, taxonomy, and AI policies can be added next.</p>
            </div>
            <button className="close-button" onClick={() => setShowForm(false)} type="button" aria-label="Close">×</button>
          </div>
          {submitted ? (
            <div className="form-success">
              <span>✓</span>
              <div><strong>Workspace details captured</strong><p>The Supabase create action will be connected next. No data has been written yet.</p></div>
            </div>
          ) : (
            <form className="workspace-form" onSubmit={handleSubmit}>
              <label><span>Brand name</span><input name="brandName" placeholder="e.g. Sensor Brand" required /></label>
              <label><span>Workspace slug</span><input name="slug" placeholder="sensor-brand" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><small>Lowercase letters, numbers, and hyphens only.</small></label>
              <label className="form-field-wide"><span>Short description <em>Optional</em></span><textarea name="description" placeholder="What does this brand do?" rows={3} /></label>
              <div className="form-actions"><button className="button button-quiet" onClick={() => setShowForm(false)} type="button">Cancel</button><button className="button button-primary" type="submit">Continue setup <span>→</span></button></div>
            </form>
          )}
        </section>
      )}

      <section className="workspace-empty panel">
        <div className="workspace-empty-art"><span>◈</span><i /><i /><i /></div>
        <p className="panel-kicker">YOUR BRAND OPERATING SYSTEM</p>
        <h2>One workspace per brand.</h2>
        <p>Use a workspace to keep customer conversations, source connections, response rules, and improvement actions in one focused place.</p>
        {!showForm && <button className="button button-secondary" onClick={() => setShowForm(true)} type="button">Create a workspace <span>→</span></button>}
        <div className="bilingual-caption" dir="rtl">مساحة مستقلة لكل Brand، بكل بياناته وقواعد الرد الخاصة به.</div>
      </section>
    </AppShell>
  );
}
