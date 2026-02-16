import { NextRequest, NextResponse } from "next/server";

import { getGroups } from "@/lib/server/whatsapp-groups";

function parseString(value: string | null): string {
  return value ?? "";
}

function parseNumber(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseLabels(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((v) => typeof v === "string");
    }
  } catch {
    // ignore
  }
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const phoneNumber = url.searchParams.get("phone") ?? undefined;
    const searchTerm = parseString(url.searchParams.get("q"));
    const projectFilter = parseString(url.searchParams.get("project"));
    const labelFilter = parseLabels(url.searchParams.get("labels"));
    const page = parseNumber(url.searchParams.get("page"), 1);
    const pageSize = parseNumber(url.searchParams.get("pageSize"), 10);

    const result = await getGroups({
      phoneNumber,
      searchTerm,
      projectFilter,
      labelFilter,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load groups";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
