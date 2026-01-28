import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DailyEffortDB {
  id: string;
  cohort_id: string;
  date: string;
  stakeholder_id: string;
  stakeholder_name: string;
  stakeholder_type: string;
  mode_of_training: string;
  virtual_reason: string | null;
  area_of_work: string;
  effort_hours: number;
  session_start_time: string | null;
  session_end_time: string | null;
  active_genc_count: number | null;
  notes: string | null;
  submitted_by: string;
  created_at: string;
  updated_at: string;
}

export const useDailyEfforts = (cohortId?: string, dateFilter?: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['daily_efforts', cohortId, dateFilter],
    queryFn: async () => {
      let query = supabase
        .from('daily_efforts')
        .select('*')
        .order('date', { ascending: false });
      
      if (cohortId) {
        query = query.eq('cohort_id', cohortId);
      }
      
      if (dateFilter?.start) {
        query = query.gte('date', dateFilter.start);
      }
      
      if (dateFilter?.end) {
        query = query.lte('date', dateFilter.end);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as DailyEffortDB[];
    },
  });
};

export const useCreateDailyEffort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (effort: Omit<DailyEffortDB, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('daily_efforts')
        .insert(effort)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_efforts'] });
      toast.success('Daily effort logged successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to log effort: ${error.message}`);
    },
  });
};

export const useBulkCreateDailyEfforts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (efforts: Omit<DailyEffortDB, 'id' | 'created_at' | 'updated_at'>[]) => {
      const { data, error } = await supabase
        .from('daily_efforts')
        .insert(efforts)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily_efforts'] });
      toast.success(`${data.length} effort entries submitted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit efforts: ${error.message}`);
    },
  });
};

export const useUpdateDailyEffort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DailyEffortDB> & { id: string }) => {
      const { data, error } = await supabase
        .from('daily_efforts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_efforts'] });
      toast.success('Effort updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update effort: ${error.message}`);
    },
  });
};

export const useDeleteDailyEffort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('daily_efforts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_efforts'] });
      toast.success('Effort deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete effort: ${error.message}`);
    },
  });
};