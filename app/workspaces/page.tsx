"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/client";

type Workspace = {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description: string | null;
  default_language: string;
  status: string;
};

export default function WorkspacesPage() {
  const supabase = createClient();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [sourceCount, setSourceCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    if (!supabase) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    const [{ data: userData, error: userError }, { data: workspaceData, error: workspaceError }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("workspaces").select("id, organization_id, name, slug, description, default_language, status").order("created_at", { ascending: false }),
    ]);

    if (userError) setError(userError.message);
    if (userData.user) setUserEmail(userData.user.email ?? null);
    if (workspaceError) setError(workspaceError.message);
    const nextWorkspaces = (workspaceData ?? []) as Workspace[];
    setWorkspaces(nextWorkspaces);

    if (nextWorkspaces.length > 0) {
      const { count, error: sourceError } = await supabase.from("sources").select("id", { count: "exact", head: true }).in("workspace_id", nextWorkspaces.map((item) => item.id));
      if (sourceError) setError(sourceError.message);
      setSourceCount(count ?? 0);
    } else {
      setSourceCount(0);
    }
    setLoading(false);
  }

  useEffect(() => { void loadData(); }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const organizationName = String(form.get("brandName") ?? "").trim();
    const workspaceName = String(form.get("workspaceName") ?? organizationName).trim();
    const slug = String(form.get("slug") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();

    const { error: createError } = await supabase.rpc("create_organization_with_workspace", {
      p_organization_name: organizationName,
      p_organization_slug: slug,
      p_workspace_name: workspaceName,
      p_workspace_slug: slug,
      p_description: description || null,
      p_default_language: "both",
    });

    if (createError) {
      setError(createError.message);
    } else {
      setShowForm(false);
      setSuccess("Workspace created and assigned to your account as admin.");
      await loadData();
    }
    setSaving(false);
  }

  return (
    <AppShell>
      <header className="page-header page-header-compact">
        <div><p className="eyebrow">ORGANIZATION / المؤسسة</p><h1>Brand workspaces</h1><p className="page-intro">Keep every brand’s sources, customer opinions, policies, and AI context safely separated.</p></div>
        <button className="button button-primary" onClick={() => { setShowForm(true); setSuccess(""); }} type="button"><span>＋</span> New workspace</button>
      </header>

      {error && <div className="data-alert data-alert-error" role="alert"><strong>Could not load workspace data</strong><span>{error}</span>{!userEmail && <small>Sign in with Supabase Auth before creating or reading workspace data.</small>}</div>}
      {success && <div className="data-alert data-alert-success" role="status"><strong>Saved to Supabase</strong><span>{success}</span></div>}

      <section className="workspace-summary">
        <div><span className="summary-label">WORKSPACES</span><strong>{loading ? "…" : workspaces.length}</strong></div>
        <div><span className="summary-label">CONNECTED SOURCES</span><strong>{loading ? "…" : sourceCount}</strong></div>
        <div><span className="summary-label">AUTHENTICATED AS</span><strong className="summary-email">{userEmail ?? "—"}</strong></div>
        <div className="summary-help"><span className="help-mark">?</span><span>Data is loaded from Supabase and filtered by RLS.</span></div>
      </section>

      {showForm && <section className="panel create-workspace-panel"><div className="form-heading"><div><p className="panel-kicker">NEW WORKSPACE / مساحة عمل جديدة</p><h2>Create your brand workspace</h2><p>This creates the Organization, Owner membership, Workspace, and Admin membership in one transaction.</p></div><button className="close-button" onClick={() => setShowForm(false)} type="button" aria-label="Close">×</button></div><form className="workspace-form" onSubmit={handleSubmit}><label><span>Brand name</span><input name="brandName" placeholder="e.g. Sensor Brand" required /></label><label><span>Workspace name</span><input name="workspaceName" placeholder="e.g. Sensor Brand Workspace" /></label><label><span>Workspace slug</span><input name="slug" placeholder="sensor-brand" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><small>Lowercase letters, numbers, and hyphens only.</small></label><label><span>Language mode</span><input value="Arabic + English" readOnly /></label><label className="form-field-wide"><span>Short description <em>Optional</em></span><textarea name="description" placeholder="What does this brand do?" rows={3} /></label><div className="form-actions"><button className="button button-quiet" onClick={() => setShowForm(false)} type="button">Cancel</button><button className="button button-primary" disabled={saving || !userEmail} type="submit">{saving ? "Saving…" : "Create workspace"} <span>→</span></button></div></form></section>}

      {workspaces.length > 0 ? <section className="workspace-list-grid">{workspaces.map((workspace) => <article className="panel workspace-live-card" key={workspace.id}><div className="workspace-live-icon">{workspace.name.charAt(0).toUpperCase()}</div><div><p className="panel-kicker">ACTIVE WORKSPACE</p><h2>{workspace.name}</h2><p>{workspace.description || "No description added yet."}</p><code>{workspace.slug}</code></div><span className="live-status">{workspace.status}</span></article>)}</section> : <section className="workspace-empty panel"><div className="workspace-empty-art"><span>◈</span><i /><i /><i /></div><p className="panel-kicker">YOUR BRAND OPERATING SYSTEM</p><h2>{loading ? "Loading your workspaces…" : "One workspace per brand."}</h2><p>{loading ? "Checking your authenticated Supabase session and memberships." : "Create your first workspace to begin connecting sources and collecting customer opinion data."}</p>{!loading && <button className="button button-secondary" disabled={!userEmail} onClick={() => setShowForm(true)} type="button">Create a workspace <span>→</span></button>}<div className="bilingual-caption" dir="rtl">مساحة مستقلة لكل Brand، بكل بياناته وقواعد الرد الخاصة به.</div></section>}
    </AppShell>
  );
}
