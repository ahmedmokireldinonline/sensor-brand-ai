"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/dashboard", label: "Overview", arabic: "نظرة عامة", icon: "◌" },
  { href: "/workspaces", label: "Workspaces", arabic: "مساحات العمل", icon: "▦" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [arabic, setArabic] = useState(false);

  return (
    <div className={arabic ? "app-shell app-shell-arabic" : "app-shell"} dir={arabic ? "rtl" : "ltr"}>
      <aside className="sidebar">
        <Link className="brand-lockup" href="/dashboard">
          <span className="brand-mark">S</span>
          <span>
            <strong>Sensor Brand</strong>
            <small>Opinion intelligence</small>
          </span>
        </Link>

        <div className="workspace-switcher">
          <span className="section-label">{arabic ? "مساحة العمل الحالية" : "CURRENT WORKSPACE"}</span>
          <button className="workspace-select" type="button">
            <span className="workspace-avatar">—</span>
            <span className="workspace-select-copy">
              <strong>{arabic ? "لا توجد مساحة عمل" : "No workspace yet"}</strong>
              <small>{arabic ? "أنشئ أول مساحة عمل" : "Create your first workspace"}</small>
            </span>
            <span className="chevron">⌄</span>
          </button>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <span className="section-label">{arabic ? "المنتج" : "PRODUCT"}</span>
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link className={active ? "nav-link active" : "nav-link"} href={item.href} key={item.href}>
                <span className="nav-icon">{item.icon}</span>
                <span>{arabic ? item.arabic : item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-icon">✦</span>
            <div>
              <strong>{arabic ? "جاهز للربط" : "Ready to connect"}</strong>
              <p>{arabic ? "أضف أول مصدر للبدء في الاستماع." : "Add your first source to start listening."}</p>
            </div>
          </div>
          <button className="language-toggle" onClick={() => setArabic((current) => !current)} type="button">
            <span>文</span>
            {arabic ? "English" : "العربية"}
          </button>
          <div className="user-chip">
            <span className="user-avatar">A</span>
            <span>
              <strong>Account owner</strong>
              <small>{arabic ? "مدير المؤسسة" : "Organization admin"}</small>
            </span>
            <span className="more">•••</span>
          </div>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
