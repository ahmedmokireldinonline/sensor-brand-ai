import { NextResponse } from "next/server";

const providers = ["meta", "google", "reddit", "linkedin"] as const;

export async function GET() {
  const status = Object.fromEntries(providers.map((provider) => {
    const prefix = provider === "linkedin" ? "LINKEDIN" : provider === "meta" ? "META" : provider === "google" ? "GOOGLE" : "REDDIT";
    return [provider, Boolean(process.env[`${prefix}_CLIENT_ID`] || process.env[`${prefix}_APP_ID`])];
  }));
  return NextResponse.json({ status, custom: true });
}
