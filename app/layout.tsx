import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/app-shell";
import { AnalyticsTracker } from "@/components/analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://sensor-brand-ai.vercel.app"),
  title: { default: "Sensor Brand AI — Customer opinion intelligence", template: "%s · Sensor Brand AI" },
  description: "Understand what customers mean, not just what they say. Bring brand signals into one calm workspace.",
  applicationName: "Sensor Brand AI",
  keywords: ["brand intelligence", "customer feedback", "sentiment analysis", "Arabic analytics", "social listening"],
  openGraph: { type: "website", siteName: "Sensor Brand AI", title: "Sensor Brand AI — Customer opinion intelligence", description: "Turn customer conversations into clear brand actions.", url: "https://sensor-brand-ai.vercel.app" },
  twitter: { card: "summary_large_image", title: "Sensor Brand AI — Customer opinion intelligence", description: "Turn customer conversations into clear brand actions." },
  alternates: { canonical: "https://sensor-brand-ai.vercel.app" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" dir="ltr"><body><LanguageProvider><AnalyticsTracker />{children}</LanguageProvider></body></html>;
}
