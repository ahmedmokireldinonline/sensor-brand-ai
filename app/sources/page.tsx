"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/client";

type Provider = "meta" | "google" | "reddit";
type Workspace = { id: string; name: string };
type Source = { id: string; platform: string; account_ref: string; account_name: string | null; status: string; last_synced_at: string | null };

const providers: Array<{ id: Provider; name: string; arabic: string; description: string; detail: string; icon: string; tone: string }> = [
  { id: "meta", name: "Meta", arabic: "فيسبوك وإنستغرام", description: "Facebook Pages and Instagram Professional accounts", detail: "Comments, replies, mentions", icon: "M", tone: "meta" },
  { id: "google", name: "Google Business", arabic: "جوجل بزنس", description: "Google Business Profile locations and reviews", detail: "Reviews, ratings, replies", icon: "G", tone: "google" },
  { id: "reddit", name: "Reddit", arabic: "ريديت", description: "Subreddits and public brand conversations", detail: "Posts, comments, mentions", icon: "R", tone: "reddit" },
];

const platformFor: Record<Provider, string> = { meta: "meta_facebook", google: "google_business", reddit: "reddit" };

export default function SourcesPage() {
  const supabase = createClient();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadWorkspaces() {
    if (!supabase) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: userData, error: userError }, { data, error: workspaceError }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("workspaces").select("id, name").order("created_at", { ascending: false }),
    ]);
    if (userData.user) setUserEmail(userData.user.email ?? null);
    if (userError) setError(userError.message);
    if (workspaceError) setError(workspaceError.message);
    const nextWorkspaces = (data ?? []) as Workspace[];
    setWorkspaces(nextWorkspaces);
    setWorkspaceId((current) => current || nextWorkspaces[0]?.id || "");
    setLoading(false);
  }

  async function loadSources(targetWorkspaceId: string) {
    if (!supabase || !targetWorkspaceId) { setSources([]); return; }
    const { data, error: sourceError } = await supabase.from("sources").select("id, platform, account_ref, account_name, status, last_synced_at").eq("workspace_id", targetWorkspaceId).order("created_at", { ascending: false });
    if (sourceError) setError(sourceError.message);
    setSources((data ?? []) as Source[]);
  }

  useEffect(() => { void loadWorkspaces(); }, []);
  useEffect(() => { void loadSources(workspaceId); }, [workspaceId]);

  const provider = providers.find((item) => item.id === selectedProvider);

  function openSetup(id: Provider) { setSelectedProvider(id); setSuccess(""); setError(""); }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !provider || !workspaceId) return;
    setSaving(true); setError(""); setSuccess("");
    const form = new FormData(event.currentTarget);
    const { error: insertError } = await supabase.from("sources").insert({
      workspace_id: workspaceId,
      platform: platformFor[provider.id],
      account_ref: String(form.get("accountRef") ?? "").trim(),
      account_name: String(form.get("accountName") ?? "").trim() || null,
      status: "pending",
      capabilities: { permission_mode: String(form.get("permissionMode") ?? "read") },
    });
    if (insertError) setError(insertError.message);
    else { setSelectedProvider(null); setSuccess(`${provider.name} source saved to Supabase as pending authorization.`); await loadSources(workspaceId); }
    setSaving(false);
  }

  return (
    <AppShell>
      <header className="page-header page-header-compact"><div><p className="eyebrow">LISTENING LAYER / طبقة الاستماع</p><h1>Connect your sources.</h1><p className="page-intro">Sources are now loaded and saved from Supabase, scoped to the selected workspace.</p></div><div className="sources-header-status"><span className="status-dot" /> {sources.filter((item) => item.status === "active").length} active sources</div></header>

      {error && <div className="data-alert data-alert-error" role="alert"><strong>Could not load source data</strong><span>{error}</span>{!userEmail && <small>Sign in with Supabase Auth before reading or adding sources.</small>}</div>}
      {success && <div className="data-alert data-alert-success" role="status"><strong>Saved to Supabase</strong><span>{success}</span></div>}

      <section className="source-summary"><div><span className="summary-label">ACTIVE SOURCES</span><strong>{sources.filter((item) => item.status === "active").length}</strong></div><div><span className="summary-label">TOTAL SOURCES</span><strong>{loading ? "…" : sources.length}</strong></div><div><span className="summary-label">CURRENT WORKSPACE</span><strong className="summary-email">{workspaces.find((item) => item.id === workspaceId)?.name ?? "—"}</strong></div><div className="source-summary-note"><span className="shield-icon">◇</span><span>Workspace-scoped. Source credentials are not stored in this form.</span></div></section>

      {workspaces.length > 0 && <div className="workspace-source-toolbar"><label><span>Manage sources for</span><select value={workspaceId} onChange={(event) => setWorkspaceId(event.target.value)}>{workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}</select></label><span className="toolbar-note">{sources.length} saved source{sources.length === 1 ? "" : "s"}</span></div>}

      {sources.length > 0 && <section className="saved-sources-list"><p className="panel-kicker">CONNECTED RECORDS / المصادر المحفوظة</p>{sources.map((source) => <article className="saved-source-row" key={source.id}><span className={`provider-mini ${source.platform === "google_business" ? "google" : source.platform === "reddit" ? "reddit" : "meta"}`}>{source.platform === "google_business" ? "G" : source.platform === "reddit" ? "R" : "M"}</span><div><strong>{source.account_name || source.account_ref}</strong><small>{source.platform} · {source.account_ref}</small></div><span className={`source-status ${source.status}`}>{source.status}</span></article>)}</section>}

      <section className="sources-section-heading"><div><p className="panel-kicker">AVAILABLE CONNECTORS</p><h2>Choose where your customers are talking.</h2></div><span className="sources-count">3 platforms</span></section>
      <section className="provider-grid" aria-label="Available source providers">{providers.map((item) => <article className="provider-card" key={item.id}><div className={`provider-icon ${item.tone}`}>{item.icon}</div><div className="provider-card-copy"><div className="provider-name-row"><h3>{item.name}</h3><span className="provider-arabic" dir="rtl">{item.arabic}</span></div><p>{item.description}</p><span className="provider-detail">{item.detail}</span></div><button className="button button-secondary provider-button" disabled={!workspaceId || !userEmail} onClick={() => openSetup(item.id)} type="button">{!userEmail ? "Sign in first" : !workspaceId ? "Create workspace" : "Add source"} <span>→</span></button></article>)}</section>

      {provider && <section className="panel source-setup-panel"><div className="source-setup-heading"><div className={`provider-icon ${provider.tone}`}>{provider.icon}</div><div><p className="panel-kicker">SAVE {provider.name.toUpperCase()} SOURCE</p><h2>Add a {provider.name} source</h2><p>This creates a pending source record in Supabase. OAuth authorization will activate it in the next integration step.</p></div><button className="close-button" onClick={() => setSelectedProvider(null)} type="button" aria-label="Close">×</button></div><form className="source-form" onSubmit={handleSubmit}><label><span>Account or page reference</span><input name="accountRef" placeholder={provider.id === "meta" ? "Page ID or Instagram account ID" : provider.id === "google" ? "Business Profile location ID" : "Subreddit name or account reference"} required /></label><label><span>Display name <em>Optional</em></span><input name="accountName" placeholder={provider.id === "meta" ? "Brand Facebook Page" : provider.id === "google" ? "Main branch" : "Brand community"} /></label><label className="form-field-wide"><span>Permission mode</span><select name="permissionMode" defaultValue="read"><option value="read">Read and analyze only</option><option value="moderate">Read, analyze, and prepare replies</option></select><small>Only the selected capability metadata is saved; provider tokens are not stored here.</small></label><div className="form-actions"><button className="button button-quiet" onClick={() => setSelectedProvider(null)} type="button">Cancel</button><button className="button button-primary" disabled={saving} type="submit">{saving ? "Saving…" : "Save source"} <span>→</span></button></div></form></section>}

      {workspaces.length === 0 && !loading && <section className="workspace-empty panel"><div className="workspace-empty-art"><span>⌁</span><i /><i /><i /></div><p className="panel-kicker">WORKSPACE REQUIRED</p><h2>Create a workspace before connecting sources.</h2><p>Sources are linked to a specific workspace so brand data stays isolated under RLS.</p><div className="bilingual-caption" dir="rtl">أنشئ مساحة عمل أولاً، ثم أضف مصادر العلامة التجارية.</div></section>}
    </AppShell>
  );
}
