import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/workspaces", "/sources", "/sync", "/analytics", "/api/"] }], sitemap: "https://sensor-brand-ai.vercel.app/sitemap.xml" };
}
