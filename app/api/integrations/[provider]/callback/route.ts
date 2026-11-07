import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stored = request.cookies.get("sensor_oauth_state")?.value?.split(":");
  const valid = stored?.length === 3 && stored[0] === provider && stored[2] === state;
  if (error) return NextResponse.redirect(new URL(`/settings/integrations?oauth=error&provider=${encodeURIComponent(provider)}&reason=${encodeURIComponent(error)}`, request.url));
  if (!code || !state || !valid) return NextResponse.json({ error: "Invalid or expired OAuth state" }, { status: 400 });
  // Token exchange must be implemented per provider before a source can be marked active.
  const response = NextResponse.redirect(new URL(`/settings/integrations?oauth=pending&provider=${encodeURIComponent(provider)}`, request.url));
  response.cookies.delete("sensor_oauth_state");
  return response;
}
