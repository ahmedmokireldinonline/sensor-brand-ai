import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { findSourceByAccount, insertSupabaseRow } from "@/lib/supabase-admin";

const providerSecrets: Record<string, string | undefined> = {
  meta: process.env.META_WEBHOOK_SECRET,
  google: process.env.GOOGLE_WEBHOOK_SECRET,
  reddit: process.env.REDDIT_WEBHOOK_SECRET,
  linkedin: process.env.LINKEDIN_WEBHOOK_SECRET,
  custom: process.env.CUSTOM_WEBHOOK_SECRET,
};
const providerPlatforms: Record<string, string[]> = {
  meta: ["meta_facebook", "meta_instagram"], google: ["google_business"], reddit: ["reddit"], linkedin: ["linkedin"], custom: ["other"],
};

function validSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const supplied = (signature.startsWith("sha256=") ? signature.slice(7) : signature).trim();
  if (!/^[a-f0-9]{64}$/i.test(supplied)) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(supplied, "hex"));
}

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  if (provider !== "meta") return NextResponse.json({ error: "Verification is not configured for this provider" }, { status: 404 });
  const url = new URL(request.url);
  if (url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === process.env.META_VERIFY_TOKEN) return new NextResponse(url.searchParams.get("hub.challenge") || "", { status: 200 });
  return NextResponse.json({ error: "Webhook verification failed" }, { status: 403 });
}

export async function POST(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  const secret = providerSecrets[provider];
  if (!secret || !providerPlatforms[provider]) return NextResponse.json({ error: "Webhook provider is not configured" }, { status: 503 });
  const rawBody = await request.text();
  if (!validSignature(rawBody, request.headers.get("x-hub-signature-256") || request.headers.get("x-webhook-signature"), secret)) return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });

  let payload: Record<string, unknown>;
  try { payload = JSON.parse(rawBody) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 }); }
  const timestamp = Number(request.headers.get("x-webhook-timestamp") || 0);
  if (timestamp && Math.abs(Date.now() - timestamp * 1000) > 5 * 60 * 1000) return NextResponse.json({ error: "Stale webhook" }, { status: 401 });
  const deliveryId = request.headers.get("x-delivery-id") || request.headers.get("x-request-id") || String(payload.id || payload.event_id || "");
  const accountRef = request.headers.get("x-source-account-id") || String(payload.account_id || payload.page_id || (payload.entry && Array.isArray(payload.entry) && (payload.entry[0] as Record<string, unknown>)?.id) || "");
  if (!deliveryId || !accountRef) return NextResponse.json({ error: "Missing delivery or source identifier" }, { status: 400 });

  try {
    const source = await findSourceByAccount(providerPlatforms[provider][0], accountRef);
    if (!source) return NextResponse.json({ error: "Unknown webhook source" }, { status: 404 });
    const rows = await insertSupabaseRow("webhook_events", { source_id: source.id, provider, delivery_id: deliveryId, event_type: request.headers.get("x-event-type") || `${provider}.delivery`, payload, status: "received" });
    return NextResponse.json({ accepted: true, provider, delivery_id: deliveryId, event_id: rows?.[0]?.id || null }, { status: 202 });
  } catch (error) {
    console.error("verified webhook intake failed", error);
    return NextResponse.json({ error: "Webhook accepted for retry" }, { status: 503 });
  }
}
