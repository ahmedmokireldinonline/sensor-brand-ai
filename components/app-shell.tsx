"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMessage, type Language, type TranslationKey } from "@/lib/translations";

type LanguageContextValue = { language: Language; arabic: boolean; setLanguage: (language: Language) => void; tKey: (key: TranslationKey) => string };
const LanguageContext = createContext<LanguageContextValue>({ language: "en", arabic: false, setLanguage: () => undefined, tKey: (key) => getMessage(key).en });

export function useLanguage() { return useContext(LanguageContext); }
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    const stored = window.localStorage.getItem("sensor-language");
    if (stored === "ar" || stored === "en") setLanguage(stored);
    else if (window.navigator.language.toLowerCase().startsWith("ar")) setLanguage("ar");
  }, []);
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; window.localStorage.setItem("sensor-language", language); }, [language]);
  const value = useMemo<LanguageContextValue>(() => ({ language, arabic: language === "ar", setLanguage, tKey: (key) => getMessage(key)[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

type NavigationItem = { href: string; key: TranslationKey; icon: string; group: "workspace" | "operations" };
const navigation: NavigationItem[] = [
  { href: "/dashboard", key: "common.overview", icon: "◌", group: "workspace" },
  { href: "/workspaces", key: "common.workspaces", icon: "▦", group: "workspace" },
  { href: "/sources", key: "common.sources", icon: "⌁", group: "workspace" },
  { href: "/sync", key: "common.syncCenter", icon: "↻", group: "operations" },
  { href: "/analytics", key: "common.analytics", icon: "◒", group: "operations" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage, tKey } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());
  useEffect(() => { if (!supabase) return; void supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null)); const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user?.email ?? null)); return () => listener.subscription.unsubscribe(); }, [supabase]);
  async function signOut() { if (supabase) await supabase.auth.signOut(); window.location.assign("/"); }
  const current = navigation.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
  const renderNav = (group: NavigationItem["group"]) => navigation.filter((item) => item.group === group).map((item) => { const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)); return <Link className={active ? "nav-link active" : "nav-link"} href={item.href} key={item.href} onClick={() => setMobileOpen(false)}><span className="nav-icon">{item.icon}</span><span>{tKey(item.key)}</span>{active && <span className="nav-active-dot" />}</Link>; });
  return <div className={`app-shell ${language === "ar" ? "app-shell-arabic" : ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
    <button className="mobile-nav-backdrop" aria-label={tKey("shell.closeNavigation")} onClick={() => setMobileOpen(false)} data-open={mobileOpen} type="button" />
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand-row"><Link className="brand-lockup" href="/dashboard" onClick={() => setMobileOpen(false)}><span className="brand-mark">S</span><span><strong>Sensor Brand</strong><small>Opinion intelligence</small></span></Link><span className="prototype-badge">BETA</span></div>
      <div className="workspace-switcher"><span className="section-label">{tKey("shell.currentWorkspace")}</span><Link className="workspace-select" href="/workspaces" onClick={() => setMobileOpen(false)}><span className="workspace-avatar">S</span><span className="workspace-select-copy"><strong>{tKey("shell.noWorkspace")}</strong><small>{tKey("shell.createFirstWorkspace")}</small></span><span className="chevron">⌄</span></Link></div>
      <nav id="primary-navigation" className="primary-nav" aria-label={tKey("shell.primaryNavigation")}><span className="section-label">{tKey("shell.workspaceGroup")}</span>{renderNav("workspace")}<span className="section-label nav-section-spaced">{tKey("shell.operationsGroup")}</span>{renderNav("operations")}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><span className="note-icon">✦</span><div><strong>{tKey("shell.readyToConnect")}</strong><p>{tKey("shell.addSourceToListen")}</p></div></div><div className="language-switcher" role="group" aria-label={tKey("common.language")}><button aria-pressed={language === "en"} className={language === "en" ? "language-option active" : "language-option"} onClick={() => setLanguage("en")} type="button">EN<span className="sr-only"> English</span></button><button aria-pressed={language === "ar"} className={language === "ar" ? "language-option active" : "language-option"} onClick={() => setLanguage("ar")} type="button">ع<span className="sr-only"> العربية</span></button><span>{tKey("common.language")}</span></div><div className="user-chip"><span className="user-avatar">{userEmail ? userEmail.charAt(0).toUpperCase() : "S"}</span><span><strong>{userEmail ? userEmail.split("@")[0] : tKey("shell.previewMode")}</strong><small>{userEmail ? tKey("shell.authenticatedAccount") : tKey("shell.previewWorkspace")}</small></span>{userEmail ? <button className="signout-button" onClick={signOut} type="button">{tKey("common.exit")}</button> : <Link className="signout-button" href="/login">{tKey("common.signIn")}</Link>}</div></div>
    </aside>
    <div className="app-main-column"><header className="app-topbar"><button className="mobile-menu-button" aria-expanded={mobileOpen} aria-controls="primary-navigation" aria-label={tKey("shell.openNavigation")} onClick={() => setMobileOpen(true)} type="button">☰</button><div className="topbar-breadcrumb"><span>{tKey("common.workspace")}</span><b>/</b><strong>{current ? tKey(current.key) : tKey("common.overview")}</strong></div><div className="topbar-actions"><Link className="topbar-action-link" href="/workspaces">＋ {tKey("common.newWorkspace")}</Link><Link className="topbar-action-link topbar-action-primary" href="/sources">⌁ {tKey("common.connectSource")}</Link><button className="topbar-icon-button" aria-label={tKey("common.notifications")} type="button">♢<i /></button><Link className="topbar-help" href="/sources">{tKey("common.needHelp")}</Link></div></header><main className="main-content">{children}</main></div>
  </div>;
}
