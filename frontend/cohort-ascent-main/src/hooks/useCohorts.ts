import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CohortDB {
  id: string;
  code: string;
  name: string;
  bu: string;
  skill: string;
  location: string;
  coach_id: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  candidate_count: number;
  progress: number;
  created_at: string;
  updated_at: string;
}

export const useCohorts = () => {
  return useQuery({
    queryKey: ['cohorts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CohortDB[];
    },
  });
};

export const useCohort = (id: string) => {
  return useQuery({
    queryKey: ['cohorts', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as CohortDB;
    },
    enabled: !!id,
  });
};

export const useCreateCohort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cohort: Omit<CohortDB, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cohorts')
        .insert(cohort)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      toast.success('Cohort created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create cohort: ${error.message}`);
    },
  });
};

export const useUpdateCohort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CohortDB> & { id: string }) => {
      const { data, error } = await supabase
        .from('cohorts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      toast.success('Cohort updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update cohort: ${error.message}`);
    },
  });
};

export const useDeleteCohort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cohorts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      toast.success('Cohort deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete cohort: ${error.message}`);
    },
  });
};