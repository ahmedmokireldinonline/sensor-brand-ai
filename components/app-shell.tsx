"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Language = "en" | "ar";
type LanguageContextValue = { language: Language; arabic: boolean; setLanguage: (language: Language) => void; t: (en: string, ar: string) => string };
const LanguageContext = createContext<LanguageContextValue>({ language: "en", arabic: false, setLanguage: () => undefined, t: (en) => en });

export function useLanguage() { return useContext(LanguageContext); }
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => { const stored = window.localStorage.getItem("sensor-language"); if (stored === "ar" || stored === "en") setLanguage(stored); }, []);
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; window.localStorage.setItem("sensor-language", language); }, [language]);
  const value = useMemo<LanguageContextValue>(() => ({ language, arabic: language === "ar", setLanguage, t: (en, ar) => language === "ar" ? ar : en }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

const navigation = [
  { href: "/dashboard", label: "Overview", arabic: "نظرة عامة", icon: "◌", group: "Workspace" },
  { href: "/workspaces", label: "Workspaces", arabic: "مساحات العمل", icon: "▦", group: "Workspace" },
  { href: "/sources", label: "Sources", arabic: "المصادر", icon: "⌁", group: "Workspace" },
  { href: "/sync", label: "Sync Center", arabic: "مركز المزامنة", icon: "↻", group: "Operations" },
  { href: "/analytics", label: "Analytics", arabic: "التحليلات", icon: "◒", group: "Operations" },
  { href: "/settings/integrations", label: "API settings", arabic: "إعدادات API", icon: "⚙", group: "Operations" },
  { href: "/resources", label: "Free tools", arabic: "أدوات مجانية", icon: "✦", group: "Operations" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());
  useEffect(() => { if (!supabase) return; void supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null)); const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user?.email ?? null)); return () => listener.subscription.unsubscribe(); }, [supabase]);
  async function signOut() { if (supabase) await supabase.auth.signOut(); window.location.assign("/"); }
  const current = navigation.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
  const renderNav = (group: string) => navigation.filter((item) => item.group === group).map((item) => { const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)); return <Link className={active ? "nav-link active" : "nav-link"} href={item.href} key={item.href} onClick={() => setMobileOpen(false)}><span className="nav-icon">{item.icon}</span><span>{t(item.label, item.arabic)}</span>{active && <span className="nav-active-dot" />}</Link>; });
  return <div className={`app-shell ${language === "ar" ? "app-shell-arabic" : ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
    <button className="mobile-nav-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} data-open={mobileOpen} type="button" />
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand-row"><Link className="brand-lockup" href="/dashboard" onClick={() => setMobileOpen(false)}><span className="brand-mark">S</span><span><strong>Sensor Brand</strong><small>Opinion intelligence</small></span></Link><span className="prototype-badge">BETA</span></div>
      <div className="workspace-switcher"><span className="section-label">{t("CURRENT WORKSPACE", "مساحة العمل الحالية")}</span><Link className="workspace-select" href="/workspaces" onClick={() => setMobileOpen(false)}><span className="workspace-avatar">S</span><span className="workspace-select-copy"><strong>{t("No workspace yet", "لا توجد مساحة عمل بعد")}</strong><small>{t("Create your first workspace", "أنشئ مساحة عملك الأولى")}</small></span><span className="chevron">⌄</span></Link></div>
      <nav className="primary-nav" aria-label="Primary navigation"><span className="section-label">{t("WORKSPACE", "مساحة العمل")}</span>{renderNav("Workspace")}<span className="section-label nav-section-spaced">{t("OPERATIONS", "التشغيل")}</span>{renderNav("Operations")}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><span className="note-icon">✦</span><div><strong>{t("Ready to connect", "جاهز للربط")}</strong><p>{t("Add a source to start listening.", "أضف مصدراً لبدء الاستماع.")}</p></div></div><div className="language-switcher" role="group" aria-label="Language selector"><button className={language === "en" ? "language-option active" : "language-option"} onClick={() => setLanguage("en")} type="button">EN</button><button className={language === "ar" ? "language-option active" : "language-option"} onClick={() => setLanguage("ar")} type="button">ع</button><span>{t("Language", "اللغة")}</span></div><div className="user-chip"><span className="user-avatar">{userEmail ? userEmail.charAt(0).toUpperCase() : "S"}</span><span><strong>{userEmail ? userEmail.split("@")[0] : "Preview mode"}</strong><small>{t(userEmail ? "Authenticated account" : "Preview workspace", userEmail ? "حساب موثق" : "مساحة تجريبية")}</small></span>{userEmail ? <button className="signout-button" onClick={signOut} type="button">{t("Exit", "خروج")}</button> : <Link className="signout-button" href="/login">{t("Sign in", "دخول")}</Link>}</div></div>
    </aside>
    <div className="app-main-column"><header className="app-topbar"><button className="mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)} type="button">☰</button><div className="topbar-breadcrumb"><span>{t("Workspace", "مساحة العمل")}</span><b>/</b><strong>{current ? t(current.label, current.arabic) : t("Overview", "نظرة عامة")}</strong></div><div className="topbar-actions"><button className="topbar-icon-button" aria-label="Notifications" type="button">♢<i /></button><Link className="topbar-help" href="/sources">{t("Need help?", "تحتاج مساعدة؟")}</Link></div></header><main className="main-content">{children}</main></div>
  </div>;
}
