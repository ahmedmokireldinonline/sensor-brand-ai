import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const allowedRedirects = new Set(["/dashboard", "/workspaces", "/sources", "/analytics", "/sync", "/settings/integrations"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requested = url.searchParams.get("next") || "/dashboard";
  const next = allowedRedirects.has(requested) ? requested : "/dashboard";
  if (code) {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (items) => { try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* no-op */ } },
        },
      });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return NextResponse.redirect(new URL("/login?error=auth_callback_failed", url.origin));
    }
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
