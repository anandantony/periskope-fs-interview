import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { WhatsAppGroup } from '@/types';

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface UseWhatsAppGroupsResult {
  groups: WhatsAppGroup[];
  loading: boolean;
  paginationLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const DEFAULT_PAGE_SIZE = 10;

export function useWhatsAppGroups(phoneNumber?: string): UseWhatsAppGroupsResult {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Use paginationLoading for pagination updates, loading for initial load
        if (page === 1) {
          setLoading(true);
        } else {
          setPaginationLoading(true);
        }
        
        // If phone number is provided, get its ID first
        let phoneId: number | null = null;
        if (phoneNumber) {
          const { data: phoneData, error: phoneError } = await supabase
            .from('phone_numbers')
            .select('id')
            .eq('number', phoneNumber)
            .single();

          if (phoneError || !phoneData) {
            setError(`Phone number ${phoneNumber} not found`);
            setLoading(false);
            setPaginationLoading(false);
            return;
          }
          phoneId = phoneData.id;
        }

        // Build query with optional phone_id filter
        let countQuery = supabase
          .from('whatsapp_groups')
          .select('*', { count: 'exact', head: true });
        
        let dataQuery = supabase
          .from('whatsapp_groups')
          .select('*');

        // Add phone_id filter if provided
        if (phoneId !== null) {
          countQuery = countQuery.eq('phone_id', phoneId);
          dataQuery = dataQuery.eq('phone_id', phoneId);
        }

        // Get the total count
        const { count, error: countError } = await countQuery;

        if (countError) throw countError;
        setTotal(count || 0);

        // Then fetch the paginated data
        const offset = (page - 1) * pageSize;
        const { data, error: dataError } = await dataQuery
          .order('created_at', { ascending: false })
          .range(offset, offset + pageSize - 1);

        if (dataError) {
          setError(dataError.message);
          return;
        }

        // Transform JSONB labels from database to array format
        const transformedData = (data || []).map((group: any) => ({
          ...group,
          labels: Array.isArray(group.labels)
            ? group.labels
            : typeof group.labels === 'string'
            ? JSON.parse(group.labels)
            : [],
        }));

        setGroups(transformedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (page === 1) {
          setLoading(false);
        } else {
          setPaginationLoading(false);
        }
      }
    };

    fetchGroups();
  }, [page, pageSize, phoneNumber]);

  const totalPages = Math.ceil(total / pageSize);

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
  };
}
