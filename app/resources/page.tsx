"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Box, Button, Heading, HStack, Input, Link, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { AppShell, useLanguage } from "@/components/app-shell";

type Category = "All" | "Backend & Auth" | "Email & Alerts" | "Monitoring" | "Automation" | "Hosting" | "Storage" | "AI & APIs";
type Resource = { id: string; name: string; arabic: string; category: Exclude<Category, "All">; description: string; freeTier: string; url: string; recommended?: boolean };

const resources: Resource[] = [
  { id: "supabase", name: "Supabase", arabic: "قاعدة البيانات والمصادقة", category: "Backend & Auth", description: "Postgres, Auth, Realtime, Storage, and Edge Functions for the workspace platform.", freeTier: "Free Auth, database, realtime, and storage", url: "https://supabase.com", recommended: true },
  { id: "resend", name: "Resend", arabic: "البريد التنبيهي", category: "Email & Alerts", description: "Transactional email API for high-risk signal notifications and account messages.", freeTier: "3,000 emails/month, 100/day", url: "https://resend.com", recommended: true },
  { id: "brevo", name: "Brevo", arabic: "الحملات والبريد", category: "Email & Alerts", description: "Email delivery and contact workflows for customer notification campaigns.", freeTier: "9,000 emails/month, 300/day", url: "https://www.brevo.com" },
  { id: "better-stack", name: "Better Stack", arabic: "المراقبة", category: "Monitoring", description: "Uptime, incident management, alerts, and public status pages for sync health.", freeTier: "Free uptime monitors and status pages", url: "https://betterstack.com/better-uptime", recommended: true },
  { id: "healthchecks", name: "Healthchecks.io", arabic: "مراقبة المهام", category: "Monitoring", description: "Heartbeat monitoring for cron jobs and background sync workers.", freeTier: "Up to 20 checks", url: "https://healthchecks.io" },
  { id: "activepieces", name: "Activepieces", arabic: "الأتمتة", category: "Automation", description: "Connect mentions to Slack, Sheets, email, and internal workflows.", freeTier: "Up to 5,000 tasks/month", url: "https://www.activepieces.com", recommended: true },
  { id: "make", name: "Make", arabic: "سيناريوهات الأتمتة", category: "Automation", description: "Visual automation for provider events and operational workflows.", freeTier: "Free operations with interval limits", url: "https://www.make.com" },
  { id: "vercel", name: "Vercel", arabic: "النشر", category: "Hosting", description: "Deploy this Next.js dashboard with preview URLs, SSL, and a global CDN.", freeTier: "Free SSL, CDN, and preview deployments", url: "https://vercel.com", recommended: true },
  { id: "render", name: "Render", arabic: "الخدمات الخلفية", category: "Hosting", description: "Alternative hosting for web services, workers, and managed databases.", freeTier: "Free web services and static sites", url: "https://render.com" },
  { id: "backblaze", name: "Backblaze B2", arabic: "تخزين النسخ الاحتياطية", category: "Storage", description: "S3-compatible object storage for Supabase exports and backup files.", freeTier: "10 GB object storage", url: "https://www.backblaze.com/b2/" },
  { id: "gemini", name: "Google AI Studio", arabic: "الذكاء الاصطناعي", category: "AI & APIs", description: "Prototype classification, summarization, and Arabic sentiment analysis workflows.", freeTier: "Free model access with request limits", url: "https://aistudio.google.com", recommended: true },
  { id: "unkey", name: "Unkey", arabic: "إدارة مفاتيح API", category: "AI & APIs", description: "Issue, revoke, and rate-limit API keys for future public integrations.", freeTier: "Free requests and active API keys", url: "https://www.unkey.com" },
];

const categories: Category[] = ["All", "Backend & Auth", "Email & Alerts", "Monitoring", "Automation", "Hosting", "Storage", "AI & APIs"];

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => { try { const saved = window.localStorage.getItem("sensor-resource-favorites"); if (saved) setFavorites(JSON.parse(saved)); } catch { /* defaults */ } }, []);
  function toggleFavorite(id: string) { setFavorites((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; window.localStorage.setItem("sensor-resource-favorites", JSON.stringify(next)); return next; }); }
  const filtered = useMemo(() => resources.filter((item) => { const haystack = `${item.name} ${item.description} ${item.category} ${item.arabic}`.toLowerCase(); return (category === "All" || item.category === category) && (!recommendedOnly || item.recommended) && haystack.includes(query.toLowerCase()); }), [category, query, recommendedOnly]);

  return <AppShell>
    <header className="page-header resources-header"><div><p className="eyebrow">FREE STACK / أدوات مجانية</p><h1>{t("A practical free stack for your workspace.", "مجموعة أدوات مجانية عملية لمساحة عملك.")}</h1><p className="page-intro">{t("A curated catalog inspired by free-for.dev. Discover infrastructure, email, monitoring, automation, and AI services that fit Sensor Brand.", "كتالوج مختار مستوحى من free-for.dev لاكتشاف خدمات البنية التحتية والبريد والمراقبة والأتمتة والذكاء الاصطناعي المناسبة لـ Sensor Brand.")}</p></div><div className="resources-stat"><strong>{resources.length}</strong><span>curated tools</span></div></header>
    <section className="resource-toolbar"><div className="resource-search"><span>⌕</span><Input aria-label="Search resources" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search tools, categories, or use cases", "ابحث عن أداة أو تصنيف أو استخدام")} /></div><Button variant={recommendedOnly ? "solid" : "outline"} colorPalette="teal" onClick={() => setRecommendedOnly((value) => !value)}>{recommendedOnly ? "Showing recommended" : "Recommended for Sensor Brand"}</Button><Button variant="ghost" onClick={() => setCategory("All")}>Reset</Button></section>
    <div className="resource-categories">{categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>)}</div>
    <div className="resource-meta"><span>{filtered.length} matching tools</span><span>{favorites.length} saved</span></div>
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4} className="resource-grid">{filtered.map((item) => <Box className="resource-card" key={item.id}><HStack justify="space-between" align="start"><Badge colorPalette={item.recommended ? "teal" : "gray"}>{item.category}</Badge><Button aria-label={`Save ${item.name}`} size="sm" variant="ghost" onClick={() => toggleFavorite(item.id)}>{favorites.includes(item.id) ? "★" : "☆"}</Button></HStack><VStack align="stretch" gap={2} mt={4}><Heading size="md">{item.name}</Heading><Text className="resource-arabic" dir="rtl">{item.arabic}</Text><Text color="fg.muted" fontSize="sm" lineHeight="1.6">{item.description}</Text><Text className="resource-free-tier"><strong>Free tier:</strong> {item.freeTier}</Text></VStack><HStack justify="space-between" mt={5}><Link href={item.url} target="_blank" rel="noreferrer" colorPalette="teal" fontWeight="700" fontSize="sm">Open service ↗</Link>{item.recommended && <Text color="teal.fg" fontSize="xs" fontWeight="700">Recommended</Text>}</HStack></Box>)}</SimpleGrid>
    {filtered.length === 0 && <Box className="resource-empty"><Heading size="md">No tools found</Heading><Text color="fg.muted">Try another keyword or reset the filters.</Text></Box>}
    <Stack className="resource-source-note" direction={{ base: "column", md: "row" }} justify="space-between"><Text>Catalog source: <Link href="https://github.com/ripienaar/free-for-dev" target="_blank" rel="noreferrer">free-for.dev ↗</Link></Text><Text>Free tiers change; verify limits and terms before production.</Text></Stack>
  </AppShell>;
}
