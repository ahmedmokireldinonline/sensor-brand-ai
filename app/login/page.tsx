"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/app-shell";

export default function LoginPage() {
  const { tKey } = useLanguage();
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    if (!supabase) { setError(tKey("login.supabaseMissing")); setBusy(false); return; }
    const redirectTo = `${window.location.origin}/auth/callback`;
    const result = mode === "signin" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
    if (result.error) setError(result.error.message); else if (mode === "signup" && !result.data.session) setMessage(tKey("login.confirmEmail")); else window.location.assign("/dashboard");
    setBusy(false);
  }
  return <main className="auth-page"><div className="auth-backdrop" /><nav className="auth-nav"><Link className="landing-brand" href="/"><span className="brand-mark">S</span><span><strong>Sensor Brand</strong><small>Opinion intelligence</small></span></Link><Link className="auth-back-link" href="/">{tKey("login.backHome")}</Link></nav><section className="auth-layout"><div className="auth-story"><p className="landing-eyebrow">{tKey("login.privateWorkspace")}</p><h1>{tKey("login.waiting")}</h1><p>{tKey("login.story")}</p><p className="landing-arabic" dir="rtl">{tKey("login.privateLine")}</p><div className="auth-story-rule"><span /> {tKey("login.secure")} <span /></div></div><div className="auth-card"><div className="auth-card-header"><p className="panel-kicker">{mode === "signin" ? tKey("login.welcome") : tKey("login.createAccountTitle")}</p><h2>{mode === "signin" ? tKey("login.enterWorkspace") : tKey("login.startListening")}</h2><p>{mode === "signin" ? tKey("login.signInIntro") : tKey("login.signUpIntro")}</p></div><form className="auth-form" onSubmit={submit}><label><span>{tKey("login.email")}</span><input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required type="email" value={email} /></label><label><span>{tKey("login.password")}</span><input autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={6} onChange={(event) => setPassword(event.target.value)} placeholder={tKey("login.passwordHint")} required type="password" value={password} /></label>{error && <div className="auth-message auth-error" role="alert">{error}</div>}{message && <div className="auth-message auth-success" role="status">{message}</div>}<button className="button button-dark auth-submit" disabled={busy} type="submit">{busy ? tKey("login.wait") : mode === "signin" ? tKey("common.signIn") : tKey("login.createAccount")}<span>→</span></button></form><div className="auth-switch">{mode === "signin" ? tKey("login.newUser") : tKey("login.existingUser")}<button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }} type="button">{mode === "signin" ? tKey("login.createAccount") : tKey("common.signIn")}</button></div></div></section></main>;
}
