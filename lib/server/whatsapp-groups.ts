import "server-only";

import { supabaseServer } from "@/lib/supabase/server";
import type { WhatsAppGroup } from "@/types";

const DEFAULT_PAGE_SIZE = 10;

type PhoneRow = { number: string };
type ProjectRow = { project: string | null };
type LabelsRow = { labels: unknown };
type PhoneIdRow = { id: number };

export type GetGroupsParams = {
  phoneNumber?: string;
  searchTerm?: string;
  projectFilter?: string;
  labelFilter?: string[];
  page?: number;
  pageSize?: number;
};

export type GroupsResponse = {
  groups: WhatsAppGroup[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export async function getPhoneNumbers(): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from("phone_numbers")
    .select("number")
    .order("id", { ascending: true });

  if (error) throw error;

  return ((data || []) as PhoneRow[]).map((r) => r.number);
}

export async function getProjects(): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from("whatsapp_groups")
    .select("project")
    .not("project", "is", null)
    .order("project");

  if (error) throw error;

  return Array.from(
    new Set(((data || []) as ProjectRow[]).map((g) => g.project).filter(Boolean)),
  ) as string[];
}

export async function getLabels(): Promise<string[]> {
  const { data, error } = await supabaseServer.from("whatsapp_groups").select("labels");

  if (error) throw error;

  const allLabels = ((data || []) as LabelsRow[])
    .flatMap((g) => (Array.isArray(g.labels) ? g.labels : []))
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  return Array.from(new Set(allLabels));
}

export async function getGroups(params: GetGroupsParams = {}): Promise<GroupsResponse> {
  const {
    phoneNumber,
    searchTerm = "",
    projectFilter = "",
    labelFilter = [],
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = params;

  let phoneId: number | null = null;

  if (phoneNumber) {
    const { data, error } = await supabaseServer
      .from("phone_numbers")
      .select("id")
      .eq("number", phoneNumber)
      .single();

    if (error || !data) {
      throw new Error(`Phone number ${phoneNumber} not found`);
    }

    phoneId = (data as PhoneIdRow).id;
  }

  let query = supabaseServer.from("whatsapp_groups").select("*", { count: "exact" });

  if (phoneId !== null) {
    query = query.eq("phone_id", phoneId);
  }

  if (searchTerm.trim()) {
    query = query.ilike("name", `%${searchTerm.trim()}%`);
  }

  if (projectFilter) {
    query = query.eq("project", projectFilter);
  }

  if (labelFilter.length > 0) {
    query = query.filter("labels", "cs", JSON.stringify(labelFilter));
  }

  const offset = (page - 1) * pageSize;

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  const groups: WhatsAppGroup[] = ((data || []) as Array<WhatsAppGroup & { labels?: unknown }>).map(
    (group) => ({
      ...group,
      labels: Array.isArray(group.labels) ? (group.labels as string[]) : [],
    }),
  );

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    groups,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}
