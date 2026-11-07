import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getAuthenticatedUser } from "@/lib/supabase/server";

const oauth: Record<string, { clientEnv: string; redirectEnv: string; authorizeUrl: string; scopes: string[] }> = {
  linkedin: { clientEnv: "LINKEDIN_CLIENT_ID", redirectEnv: "LINKEDIN_REDIRECT_URI", authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization", scopes: ["openid", "profile", "email", "w_member_social"] },
  meta: { clientEnv: "META_APP_ID", redirectEnv: "META_REDIRECT_URI", authorizeUrl: "https://www.facebook.com/v21.0/dialog/oauth", scopes: ["pages_show_list", "pages_read_engagement", "instagram_basic"] },
  google: { clientEnv: "GOOGLE_CLIENT_ID", redirectEnv: "GOOGLE_REDIRECT_URI", authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth", scopes: ["https://www.googleapis.com/auth/business.manage"] },
  reddit: { clientEnv: "REDDIT_CLIENT_ID", redirectEnv: "REDDIT_REDIRECT_URI", authorizeUrl: "https://www.reddit.com/api/v1/authorize", scopes: ["identity", "read", "history"] },
};

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  const config = oauth[provider];
  if (!config) return NextResponse.json({ error: "OAuth is not supported for this provider" }, { status: 404 });
  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase || !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const workspaceId = new URL(request.url).searchParams.get("workspace_id");
  if (!workspaceId) return NextResponse.json({ error: "workspace_id is required" }, { status: 400 });
  const { data: membership } = await supabase.from("workspace_members").select("role").eq("workspace_id", workspaceId).eq("user_id", user.id).maybeSingle();
  if (!membership || membership.role !== "admin") return NextResponse.json({ error: "Workspace administrator access required" }, { status: 403 });
  const clientId = process.env[config.clientEnv];
  const redirectUri = process.env[config.redirectEnv] || `${new URL(request.url).origin}/api/integrations/${provider}/callback`;
  if (!clientId) return NextResponse.json({ error: `Missing ${config.clientEnv}` }, { status: 503 });
  const state = randomBytes(32).toString("hex");
  const callback = new URL(config.authorizeUrl);
  callback.searchParams.set("response_type", "code"); callback.searchParams.set("client_id", clientId); callback.searchParams.set("redirect_uri", redirectUri); callback.searchParams.set("state", state); callback.searchParams.set("scope", config.scopes.join(" "));
  const response = NextResponse.redirect(callback);
  response.cookies.set("sensor_oauth_state", `${provider}:${workspaceId}:${state}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
  return response;
}
