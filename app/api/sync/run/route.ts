import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";

const triggerTypes = new Set(["scheduled", "manual", "webhook", "retry"]);
const syncRoles = new Set(["admin", "analyst"]);

export async function POST(request: Request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase || !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  let input: { source_id?: string; trigger_type?: string };
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 }); }
  if (!input.source_id) return NextResponse.json({ error: "source_id is required" }, { status: 400 });
  const triggerType = input.trigger_type || "manual";
  if (!triggerTypes.has(triggerType)) return NextResponse.json({ error: "Unsupported trigger_type" }, { status: 400 });

  const { data: source, error: sourceError } = await supabase.from("sources").select("id, workspace_id").eq("id", input.source_id).maybeSingle();
  if (sourceError || !source) return NextResponse.json({ error: "Source not found" }, { status: 404 });
  const { data: membership, error: membershipError } = await supabase.from("workspace_members").select("role").eq("workspace_id", source.workspace_id).eq("user_id", user.id).maybeSingle();
  if (membershipError || !membership || (triggerType === "manual" && !syncRoles.has(membership.role))) return NextResponse.json({ error: "You are not allowed to run sync for this source" }, { status: 403 });

  const { data: job, error } = await supabase.from("sync_jobs").insert({ source_id: source.id, workspace_id: source.workspace_id, trigger_type: triggerType, status: "queued", requested_by: user.id }).select().single();
  if (error) { console.error("sync enqueue failed", error); return NextResponse.json({ error: "Unable to queue sync job" }, { status: 503 }); }
  return NextResponse.json({ queued: true, job }, { status: 202 });
}
