import { NextResponse } from "next/server";

import { getProjects } from "@/lib/server/whatsapp-groups";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ projects });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
