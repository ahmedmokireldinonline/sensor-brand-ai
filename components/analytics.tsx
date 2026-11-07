"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/attribution";

export function AnalyticsTracker() {
  useEffect(() => {
    void trackEvent("page_view", { title: document.title });
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a,button");
      if (!target) return;
      const label = (target.textContent ?? "").trim().slice(0, 80);
      if (label) void trackEvent("interaction", { label, element: target.tagName.toLowerCase() });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
