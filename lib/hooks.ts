import { useEffect, useMemo, useRef, useState } from "react";
import type { WhatsAppGroup } from "@/types";

type UseWhatsAppGroupsParams = {
  phoneNumber?: string;
  searchTerm?: string;
  projectFilter?: string;
  labelFilter?: string[];
  initialData?: {
    groups: WhatsAppGroup[];
    total: number;
    page: number;
    pageSize: number;
    projects: string[];
    labels: string[];
  };
};

type GroupsApiResponse = {
  groups: WhatsAppGroup[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

const DEFAULT_PAGE_SIZE = 10;

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const data: unknown = await res.json();
  if (!res.ok) {
    const message =
      typeof (data as { error?: unknown } | null)?.error === "string"
        ? (data as { error: string }).error
        : "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export function useWhatsAppGroups(params: UseWhatsAppGroupsParams = {}) {
  const {
    phoneNumber,
    searchTerm = "",
    projectFilter = "",
    labelFilter = [],
    initialData,
  } = params;

  const [groups, setGroups] = useState<WhatsAppGroup[]>(initialData?.groups ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(initialData?.page ?? 1);
  const [pageSize, setPageSize] = useState(initialData?.pageSize ?? DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(initialData?.total ?? 0);

  const [projects, setProjects] = useState<string[]>(initialData?.projects ?? []);
  const [labels, setLabels] = useState<string[]>(initialData?.labels ?? []);
  const [projectsLoading, setProjectsLoading] = useState(!initialData);
  const [labelsLoading, setLabelsLoading] = useState(!initialData);

  const didUseInitialData = useRef(Boolean(initialData));

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const run = async () => {
      try {
        if (didUseInitialData.current) {
          didUseInitialData.current = false;
          return;
        }

        if (page === 1) {
          setLoading(true);
        } else {
          setPaginationLoading(true);
        }
        setError(null);

        const url = new URL("/api/whatsapp-groups", window.location.origin);
        if (phoneNumber) url.searchParams.set("phone", phoneNumber);
        if (searchTerm) url.searchParams.set("q", searchTerm);
        if (projectFilter) url.searchParams.set("project", projectFilter);
        if (labelFilter.length > 0) url.searchParams.set("labels", JSON.stringify(labelFilter));
        url.searchParams.set("page", String(page));
        url.searchParams.set("pageSize", String(pageSize));

        const result = await fetchJson<GroupsApiResponse>(url.toString(), {
          signal: controller.signal,
        });

        if (!isMounted) return;
        setGroups(result.groups);
        setTotal(result.pagination.total);
      } catch (e: unknown) {
        if (!isMounted) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        if (!isMounted) return;
        if (page === 1) {
          setLoading(false);
        } else {
          setPaginationLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, pageSize, phoneNumber, searchTerm, projectFilter, labelFilter]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const run = async () => {
      try {
        setProjectsLoading(true);
        const data = await fetchJson<{ projects: string[] }>("/api/projects", {
          signal: controller.signal,
        });
        if (!isMounted) return;
        setProjects(data.projects);
      } catch {
        // ignore
      } finally {
        if (!isMounted) return;
        setProjectsLoading(false);
      }
    };

    if (!initialData) {
      run();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [initialData]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const run = async () => {
      try {
        setLabelsLoading(true);
        const data = await fetchJson<{ labels: string[] }>("/api/labels", {
          signal: controller.signal,
        });
        if (!isMounted) return;
        setLabels(data.labels);
      } catch {
        // ignore
      } finally {
        if (!isMounted) return;
        setLabelsLoading(false);
      }
    };

    if (!initialData) {
      run();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [initialData]);

  return {
    groups,
    loading,
    paginationLoading,
    error,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
    setPage,
    setPageSize,
    projects,
    labels,
    projectsLoading,
    labelsLoading,
  };
}
