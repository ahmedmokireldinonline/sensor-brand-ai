"use client";

export type Attribution = {
  landingPath: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  firstSeenAt: string;
};

const STORAGE_KEY = "sensor-attribution";
const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;

export function captureAttribution(): Attribution {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  const params = new URLSearchParams(window.location.search);
  const firstTouch = existing ? (JSON.parse(existing) as Attribution) : undefined;
  const attribution: Attribution = {
    landingPath: firstTouch?.landingPath ?? `${window.location.pathname}${window.location.search}`,
    referrer: firstTouch?.referrer ?? document.referrer,
    firstSeenAt: firstTouch?.firstSeenAt ?? new Date().toISOString(),
    ...firstTouch,
  };
  for (const key of TRACKING_KEYS) {
    const value = params.get(key);
    if (value && !attribution[keyToProperty(key)]) attribution[keyToProperty(key)] = value;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}

function keyToProperty(key: (typeof TRACKING_KEYS)[number]): keyof Attribution {
  return ({
    utm_source: "utmSource",
    utm_medium: "utmMedium",
    utm_campaign: "utmCampaign",
    utm_term: "utmTerm",
    utm_content: "utmContent",
    gclid: "gclid",
    fbclid: "fbclid",
  } as const)[key];
}

export async function trackEvent(name: string, properties: Record<string, string | number | boolean> = {}) {
  const attribution = captureAttribution();
  await fetch("/api/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ name, path: window.location.pathname, properties, attribution }),
  }).catch(() => undefined);
}
