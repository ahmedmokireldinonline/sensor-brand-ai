import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { insertSupabaseRow } from "@/lib/supabase-admin";

const supportedProviders = new Set(["meta", "google", "reddit", "linkedin", "custom"]);

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  if (provider !== "meta") return NextResponse.json({ error: "Verification is not configured for this provider" }, { status: 404 });

  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.META_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Webhook verification failed" }, { status: 403 });
}

export async function POST(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  if (!supportedProviders.has(provider)) return NextResponse.json({ error: "Unsupported provider" }, { status: 404 });

  const bodyText = await request.text();
  let payload: unknown;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const deliveryId = request.headers.get("x-delivery-id") || request.headers.get("x-fb-webhooks-signature") || createHash("sha256").update(bodyText).digest("hex");
  const eventType = request.headers.get("x-event-type") || `${provider}.delivery`;

  try {
    await insertSupabaseRow("webhook_events", {
      provider,
      delivery_id: deliveryId,
      event_type: eventType,
      payload,
      status: "received",
    });
  } catch (error) {
    console.error("webhook intake failed", error);
    return NextResponse.json({ error: "Webhook accepted for retry" }, { status: 503 });
  }

  return NextResponse.json({ accepted: true, provider, delivery_id: deliveryId }, { status: 202 });
}
