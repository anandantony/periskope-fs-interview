"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";
import { GroupsTable } from "@/components/GroupsTable";
import { SidePanel } from "@/components/SidePanel";
import { useWhatsAppGroups } from "@/lib/hooks";
import type { WhatsAppGroup } from "@/types";
import { Loader } from "lucide-react";

type HomePageClientProps = {
  initialPhones: string[];
  initialPhone: string;
  initialSearchTerm: string;
  initialProject: string;
  initialSelectedLabels: string[];
  initialGroups: WhatsAppGroup[];
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
  initialProjects: string[];
  initialLabels: string[];
};

export default function HomePageClient({
  initialPhones,
  initialPhone,
  initialSearchTerm,
  initialProject,
  initialSelectedLabels,
  initialGroups,
  initialTotal,
  initialPage,
  initialPageSize,
  initialProjects,
  initialLabels,
}: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedGroup, setSelectedGroup] = useState<WhatsAppGroup | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string>(initialPhone);
  const [searchTerm, setSearchTermState] = useState(initialSearchTerm);
  const [selectedProject, setSelectedProjectState] = useState(initialProject);
  const [selectedLabels, setSelectedLabelsState] = useState<string[]>(initialSelectedLabels);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const urlState = useMemo(() => {
    const phone = searchParams.get("phone") ?? "all";
    const q = searchParams.get("q") ?? "";
    const project = searchParams.get("project") ?? "";
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");

    const labelsRaw = searchParams.get("labels");
    let labels: string[] = [];
    if (labelsRaw) {
      try {
        const parsed = JSON.parse(labelsRaw);
        if (Array.isArray(parsed)) {
          labels = parsed.filter((v): v is string => typeof v === "string");
        }
      } catch {
        labels = labelsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    return {
      phone: phone === "all" ? "all" : phone,
      q,
      project,
      labels,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
    };
  }, [searchParams]);

  const {
    groups,
    loading,
    error,
    paginationLoading,
    pagination,
    setPage,
    setPageSize,
    projects,
    labels,
    projectsLoading,
    labelsLoading,
  } = useWhatsAppGroups({
    phoneNumber: selectedPhone,
    searchTerm,
    projectFilter: selectedProject,
    labelFilter: selectedLabels,
    initialData: {
      groups: initialGroups,
      total: initialTotal,
      page: initialPage,
      pageSize: initialPageSize,
      projects: initialProjects,
      labels: initialLabels,
    },
  });

  useEffect(() => {
    const phoneFromUrl = urlState.phone;
    const qFromUrl = urlState.q;
    const projectFromUrl = urlState.project;
    const labelsFromUrl = urlState.labels;

    if (selectedPhone !== phoneFromUrl) {
      setSelectedPhone(phoneFromUrl);
      setSelectedGroup(null);
    }

    if (searchTerm !== qFromUrl) {
      setSearchTermState(qFromUrl);
    }

    if (selectedProject !== projectFromUrl) {
      setSelectedProjectState(projectFromUrl);
    }

    if (JSON.stringify(selectedLabels) !== JSON.stringify(labelsFromUrl)) {
      setSelectedLabelsState(labelsFromUrl);
    }

    if (pagination.page !== urlState.page) {
      setPage(urlState.page);
    }

    if (pagination.pageSize !== urlState.pageSize) {
      setPageSize(urlState.pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("phone", selectedPhone || "all");

    if (debouncedSearchTerm) params.set("q", debouncedSearchTerm);
    else params.delete("q");

    if (selectedProject) params.set("project", selectedProject);
    else params.delete("project");

    if (selectedLabels.length > 0) params.set("labels", JSON.stringify(selectedLabels));
    else params.delete("labels");

    params.set("page", String(pagination.page));
    params.set("pageSize", String(pagination.pageSize));

    const next = `${pathname}?${params.toString()}`;
    const current = `${pathname}?${searchParams.toString()}`;
    if (next !== current) {
      router.replace(next, { scroll: false });
    }
  }, [
    debouncedSearchTerm,
    pathname,
    pagination.page,
    pagination.pageSize,
    router,
    searchParams,
    selectedLabels,
    selectedPhone,
    selectedProject,
  ]);

  const handleSearchChange = (term: string) => {
    setSearchTermState(term);
    setPage(1);
  };

  const handleProjectFilterChange = (project: string) => {
    setSelectedProjectState(project);
    setPage(1);
  };

  const handleLabelFilterChange = (labels: string[]) => {
    setSelectedLabelsState(labels);
    setPage(1);
  };

  const handleGroupClick = (group: WhatsAppGroup | null) => {
    setSelectedGroup(group);
  };

  const showFullLoader = loading && groups.length === 0;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopNav
        phones={initialPhones}
        phoneNumber={selectedPhone}
        onPhoneNumberChange={(phone) => {
          setPage(1);
          setSelectedPhone(phone);
          setSelectedGroup(null);
        }}
      />

      <div className="flex-1 flex">
        <Sidebar />

        <div className="flex-1 flex">
          <div className="flex-1 overflow-auto flex flex-col">
            {showFullLoader && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-4">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-gray-600">Loading WhatsApp groups...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <p className="font-semibold">Error loading groups</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!showFullLoader && !error && (
              <GroupsTable
                groups={groups}
                onGroupClick={handleGroupClick}
                selectedPhone={selectedPhone}
                searchTerm={searchTerm}
                selectedProject={selectedProject}
                selectedLabels={selectedLabels}
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                totalPages={pagination.totalPages}
                paginationLoading={paginationLoading || loading}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                onSearchChange={handleSearchChange}
                onProjectFilterChange={handleProjectFilterChange}
                onLabelFilterChange={handleLabelFilterChange}
                projects={projects}
                labels={labels}
                projectsLoading={projectsLoading}
                labelsLoading={labelsLoading}
                className="rounded-none pb-0 border-0"
              />
            )}
          </div>

          <SidePanel selectedGroup={selectedGroup} />
        </div>
      </div>
    </div>
  );
}
