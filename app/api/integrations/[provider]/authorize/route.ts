import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

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
  const clientId = process.env[config.clientEnv];
  const redirectUri = process.env[config.redirectEnv] || `${new URL(request.url).origin}/api/integrations/${provider}/callback`;
  if (!clientId) return NextResponse.json({ error: `Missing ${config.clientEnv}. Add it to the server environment before connecting.` }, { status: 503 });

  const state = randomBytes(24).toString("hex");
  const callback = new URL(config.authorizeUrl);
  callback.searchParams.set("response_type", "code");
  callback.searchParams.set("client_id", clientId);
  callback.searchParams.set("redirect_uri", redirectUri);
  callback.searchParams.set("state", state);
  callback.searchParams.set("scope", config.scopes.join(" "));
  const response = NextResponse.redirect(callback);
  response.cookies.set("sensor_oauth_state", `${provider}:${state}`, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });
  return response;
}
