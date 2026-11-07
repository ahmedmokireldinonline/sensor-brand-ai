import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get("sensor_oauth_state")?.value;

  if (error) return NextResponse.redirect(new URL(`/settings/integrations?oauth=error&provider=${provider}&reason=${encodeURIComponent(error)}`, request.url));
  if (!code || !state || storedState !== `${provider}:${state}`) return NextResponse.json({ error: "Invalid or expired OAuth state" }, { status: 400 });

  // Token exchange and encrypted persistence are intentionally server-side follow-up work.
  // Never place the authorization code or provider token in localStorage or the URL.
  const response = NextResponse.redirect(new URL(`/settings/integrations?oauth=ready&provider=${provider}`, request.url));
  response.cookies.delete("sensor_oauth_state");
  return response;
}
