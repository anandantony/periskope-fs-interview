import { NextResponse } from "next/server";

import { getLabels } from "@/lib/server/whatsapp-groups";

export async function GET() {
  try {
    const labels = await getLabels();
    return NextResponse.json({ labels });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load labels";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
