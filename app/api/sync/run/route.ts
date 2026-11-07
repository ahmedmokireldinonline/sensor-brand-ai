import { NextRequest, NextResponse } from "next/server";
import { insertSupabaseRow } from "@/lib/supabase-admin";

const triggerTypes = new Set(["scheduled", "manual", "webhook", "retry"]);

export async function POST(request: NextRequest) {
  let input: { source_id?: string; workspace_id?: string; trigger_type?: string; requested_by?: string };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!input.source_id || !input.workspace_id) {
    return NextResponse.json({ error: "source_id and workspace_id are required" }, { status: 400 });
  }
  const triggerType = input.trigger_type || "manual";
  if (!triggerTypes.has(triggerType)) return NextResponse.json({ error: "Unsupported trigger_type" }, { status: 400 });

  try {
    const rows = await insertSupabaseRow("sync_jobs", {
      source_id: input.source_id,
      workspace_id: input.workspace_id,
      trigger_type: triggerType,
      status: "queued",
      requested_by: input.requested_by || null,
    });
    return NextResponse.json({ queued: true, job: rows?.[0] || null }, { status: 202 });
  } catch (error) {
    console.error("sync enqueue failed", error);
    return NextResponse.json({ error: "Unable to queue sync job" }, { status: 503 });
  }
}
