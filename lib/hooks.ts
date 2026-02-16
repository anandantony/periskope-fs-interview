import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { WhatsAppGroup } from '@/types';

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface UseWhatsAppGroupsParams {
  phoneNumber?: string;
  searchTerm?: string;
  projectFilter?: string;
  labelFilter?: string[];
}

const DEFAULT_PAGE_SIZE = 10;

export function useWhatsAppGroups(params: UseWhatsAppGroupsParams = {}) {
  const { phoneNumber, searchTerm = '', projectFilter = '', labelFilter = [] } = params;

  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);

  const [projects, setProjects] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [labelsLoading, setLabelsLoading] = useState(true);

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  // --------------------------
  // Main Data Fetch
  // --------------------------

  useEffect(() => {
    let isMounted = true;

    const fetchGroups = async () => {
      try {
        page === 1 ? setLoading(true) : setPaginationLoading(true);
        setError(null);

        let phoneId: number | null = null;

        // Get phone ID if needed
        if (phoneNumber) {
          const { data, error } = await supabase
            .from('phone_numbers')
            .select('id')
            .eq('number', phoneNumber)
            .single();

          if (error || !data) {
            throw new Error(`Phone number ${phoneNumber} not found`);
          }

          phoneId = data.id;
        }

        // Build single query with count
        let query = supabase
          .from('whatsapp_groups')
          .select('*', { count: 'exact' });

        if (phoneId !== null) {
          query = query.eq('phone_id', phoneId);
        }

        if (searchTerm.trim()) {
          query = query.ilike('name', `%${searchTerm.trim()}%`);
        }

        if (projectFilter) {
          query = query.eq('project', projectFilter);
        }

        if (labelFilter.length > 0) {
          query = query.filter('labels', 'cs', JSON.stringify(labelFilter));
        }

        const offset = (page - 1) * pageSize;

        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(offset, offset + pageSize - 1);

        if (error) throw error;

        if (!isMounted) return;

        setGroups(
          (data || []).map((group: any) => ({
            ...group,
            labels: Array.isArray(group.labels) ? group.labels : [],
          }))
        );

        setTotal(count || 0);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || 'An error occurred');
      } finally {
        if (!isMounted) return;
        page === 1 ? setLoading(false) : setPaginationLoading(false);
      }
    };

    fetchGroups();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, phoneNumber, searchTerm, projectFilter, labelFilter]);

  // --------------------------
  // Load Projects
  // --------------------------

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);

        const { data, error } = await supabase
          .from('whatsapp_groups')
          .select('project')
          .not('project', 'is', null)
          .order('project');

        if (error) throw error;

        const unique = Array.from(
          new Set((data || []).map((g) => g.project).filter(Boolean))
        );

        setProjects(unique);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // --------------------------
  // Load Labels
  // --------------------------

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        setLabelsLoading(true);

        const { data, error } = await supabase
          .from('whatsapp_groups')
          .select('labels');

        if (error) throw error;

        const allLabels = (data || [])
          .flatMap((g) => (Array.isArray(g.labels) ? g.labels : []))
          .filter(Boolean);

        const unique = Array.from(new Set(allLabels));

        setLabels(unique);
      } catch (err) {
        console.error('Error loading labels:', err);
      } finally {
        setLabelsLoading(false);
      }
    };

    fetchLabels();
  }, []);

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
