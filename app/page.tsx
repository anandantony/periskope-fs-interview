import HomePageClient from "@/app/HomePageClient";
import { getGroups, getLabels, getPhoneNumbers, getProjects } from "@/lib/server/whatsapp-groups";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getStringParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function getNumberParam(value: string | string[] | undefined, fallback: number): number {
  const str = getStringParam(value);
  if (!str) return fallback;
  const n = Number(str);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default async function HomePage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};

  const phone = getStringParam(sp.phone);
  const q = getStringParam(sp.q) ?? "";
  const project = getStringParam(sp.project) ?? "";
  const page = getNumberParam(sp.page, 1);
  const pageSize = getNumberParam(sp.pageSize, 10);

  const labelsParam = getStringParam(sp.labels);
  let labels: string[] = [];
  if (labelsParam) {
    try {
      const parsed = JSON.parse(labelsParam);
      if (Array.isArray(parsed)) {
        labels = parsed.filter((v): v is string => typeof v === "string");
      }
    } catch {
      labels = labelsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  const [phones, projects, allLabels] = await Promise.all([
    getPhoneNumbers(),
    getProjects(),
    getLabels(),
  ]);

  const initialPhone = phone ?? phones[0];

  const groupsResult = await getGroups({
    phoneNumber: initialPhone,
    searchTerm: q,
    projectFilter: project,
    labelFilter: labels,
    page,
    pageSize,
  });

  return (
    <HomePageClient
      initialPhones={phones}
      initialPhone={initialPhone}
      initialGroups={groupsResult.groups}
      initialTotal={groupsResult.pagination.total}
      initialPage={groupsResult.pagination.page}
      initialPageSize={groupsResult.pagination.pageSize}
      initialProjects={projects}
      initialLabels={allLabels}
    />
  );
}
