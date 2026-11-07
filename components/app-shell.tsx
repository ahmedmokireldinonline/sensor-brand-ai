"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { href: "/dashboard", label: "Overview", arabic: "نظرة عامة", icon: "◌" },
  { href: "/workspaces", label: "Workspaces", arabic: "مساحات العمل", icon: "▦" },
  { href: "/sources", label: "Sources", arabic: "المصادر", icon: "⌁" },
  { href: "/sync", label: "Sync Center", arabic: "مركز المزامنة", icon: "↻" },
  { href: "/analytics", label: "Analytics", arabic: "التحليلات", icon: "◒" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [arabic, setArabic] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user?.email ?? null));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    window.location.assign("/");
  }

  const accountLabel = userEmail ? userEmail.split("@")[0] : "Prototype mode";

  return (
    <div className={arabic ? "app-shell app-shell-arabic" : "app-shell"} dir={arabic ? "rtl" : "ltr"}>
      <aside className="sidebar">
        <div className="sidebar-brand-row"><Link className="brand-lockup" href="/dashboard"><span className="brand-mark">S</span><span><strong>Sensor Brand</strong><small>Opinion intelligence</small></span></Link><span className="prototype-badge">BETA</span></div>
        <div className="workspace-switcher"><span className="section-label">{arabic ? "مساحة العمل الحالية" : "CURRENT WORKSPACE"}</span><Link className="workspace-select" href="/workspaces"><span className="workspace-avatar">—</span><span className="workspace-select-copy"><strong>{arabic ? "لا توجد مساحة عمل" : "No workspace yet"}</strong><small>{arabic ? "أنشئ أول مساحة عمل" : "Create your first workspace"}</small></span><span className="chevron">⌄</span></Link></div>
        <nav className="primary-nav" aria-label="Primary navigation"><span className="section-label">{arabic ? "المنتج" : "PRODUCT"}</span>{navigation.map((item) => { const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)); return <Link className={active ? "nav-link active" : "nav-link"} href={item.href} key={item.href}><span className="nav-icon">{item.icon}</span><span>{arabic ? item.arabic : item.label}</span></Link>; })}</nav>
        <div className="sidebar-bottom"><div className="sidebar-note"><span className="note-icon">✦</span><div><strong>{arabic ? "جاهز للربط" : "Ready to connect"}</strong><p>{arabic ? "أضف أول مصدر للبدء في الاستماع." : "Add your first source to start listening."}</p></div></div><button className="language-toggle" onClick={() => setArabic((current) => !current)} type="button"><span>文</span>{arabic ? "English" : "العربية"}</button><div className="user-chip"><span className="user-avatar">{userEmail ? userEmail.charAt(0).toUpperCase() : "S"}</span><span><strong>{accountLabel}</strong><small>{userEmail ? "Authenticated account" : "Preview workspace"}</small></span>{userEmail ? <button className="signout-button" onClick={signOut} type="button">Exit</button> : <Link className="signout-button" href="/login">Sign in</Link>}</div></div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
