import { NextResponse } from "next/server";

import { getPhoneNumbers } from "@/lib/server/whatsapp-groups";

export async function GET() {
  try {
    const phones = await getPhoneNumbers();
    return NextResponse.json({ phones });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to load phone numbers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
