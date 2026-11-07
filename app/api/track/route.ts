import { NextResponse } from "next/server";

const allowedEvents = new Set(["page_view", "interaction", "signup_started", "workspace_created", "source_connected"]);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const name = typeof payload?.name === "string" ? payload.name : "";
    if (!allowedEvents.has(name)) return NextResponse.json({ ok: false }, { status: 400 });
    const path = typeof payload?.path === "string" ? payload.path.slice(0, 300) : "/";
    const properties = payload?.properties && typeof payload.properties === "object" ? payload.properties : {};
    const attribution = payload?.attribution && typeof payload.attribution === "object" ? payload.attribution : {};
    console.info("sensor_event", JSON.stringify({ name, path, properties, attribution }));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
