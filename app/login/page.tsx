"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    if (!supabase) { setError("Supabase is not configured. Add the public URL and publishable key first."); setBusy(false); return; }
    const redirectTo = `${window.location.origin}/auth/callback`;
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
    if (result.error) setError(result.error.message);
    else if (mode === "signup" && !result.data.session) setMessage("Check your email to confirm the account, then return here to sign in.");
    else window.location.assign("/dashboard");
    setBusy(false);
  }

  return <main className="auth-page"><div className="auth-backdrop" /><nav className="auth-nav"><Link className="landing-brand" href="/"><span className="brand-mark">S</span><span><strong>Sensor Brand</strong><small>Opinion intelligence</small></span></Link><Link className="auth-back-link" href="/">← Back to home</Link></nav><section className="auth-layout"><div className="auth-story"><p className="landing-eyebrow">PRIVATE BRAND WORKSPACE</p><h1>Your customer signal is waiting.</h1><p>Sign in to manage workspaces, connect sources, and see the first layer of brand intelligence.</p><p className="landing-arabic" dir="rtl">مساحة عملك الخاصة تبدأ من هنا.</p><div className="auth-story-rule"><span /> Secure by workspace <span /></div></div><div className="auth-card"><div className="auth-card-header"><p className="panel-kicker">{mode === "signin" ? "WELCOME BACK" : "CREATE YOUR ACCOUNT"}</p><h2>{mode === "signin" ? "Enter your workspace." : "Start listening."}</h2><p>{mode === "signin" ? "Use your account email to continue." : "Create an account for the Sensor Brand prototype."}</p></div><form className="auth-form" onSubmit={submit}><label><span>Email</span><input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required type="email" value={email} /></label><label><span>Password</span><input autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={6} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" required type="password" value={password} /></label>{error && <div className="auth-message auth-error" role="alert">{error}</div>}{message && <div className="auth-message auth-success" role="status">{message}</div>}<button className="button button-dark auth-submit" disabled={busy} type="submit">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}<span>→</span></button></form><div className="auth-switch">{mode === "signin" ? "New to Sensor Brand?" : "Already have an account?"}<button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }} type="button">{mode === "signin" ? "Create an account" : "Sign in"}</button></div></div></section></main>;
}
