import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cohortApi, Cohort } from '@/integrations/backend/cohortApi';
import { toast } from 'sonner';
import { CreateCohortRequest } from '@/integrations/backend/cohortApi';

export const useCohorts = () => {
  return useQuery({
    queryKey: ['cohorts'],
    queryFn: async () => {
      const response = await cohortApi.getAllCohorts();
      return response.data as Cohort[];
    },
  });
};

export const useCohort = (id: number) => {
  return useQuery({
    queryKey: ['cohorts', id],
    queryFn: async () => {
      const response = await cohortApi.getCohortById(id);
      return response.data as Cohort;
    },
    enabled: !!id,
  });
};

export const useCreateCohort = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cohortData: CreateCohortRequest) => {
      const response = await cohortApi.createCohort(cohortData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      toast.success('Cohort created successfully');
    },
    onError: (error) => {
      console.error('Failed to create cohort:', error);
      toast.error('Failed to create cohort');
    },
  });
};

export const useUpdateCohort = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Cohort> }) => {
      const response = await cohortApi.updateCohort(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      toast.success('Cohort updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update cohort:', error);
      toast.error('Failed to update cohort');
    },
  });
};

export const useDeleteCohort = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await cohortApi.deleteCohort(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      toast.success('Cohort deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete cohort:', error);
      toast.error('Failed to delete cohort');
    },
  });
};