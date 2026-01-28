import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { toast } from 'sonner';

export interface Trainer {
  id: number;
  emp_id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'technical' | 'behavioral';
  is_internal: boolean;
  skill: string;
  training_start_date?: string;
  training_end_date?: string;
  avatar_url?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export const useTrainers = (cohortId?: string) => {
  return useQuery({
    queryKey: ['trainers', cohortId],
    queryFn: async () => {
      if (cohortId) {
        const response = await api.get(`/trainers/cohort/${cohortId}`);
        return response.data as Trainer[];
      } else {
        const response = await api.get('/trainers');
        return response.data as Trainer[];
      }
    },
  });
};

export const useCreateTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trainer, cohortId }: { trainer: Omit<Trainer, 'id' | 'createdAt' | 'updatedAt'>; cohortId?: string }) => {
      const url = cohortId ? `/trainers?cohortId=${cohortId}` : '/trainers';
      const response = await api.post(url, trainer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create trainer: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useAssignTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trainerId, cohortId }: { trainerId: number; cohortId: string }) => {
      await api.post(`/trainers/${trainerId}/assign/${cohortId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer assigned to cohort');
    },
    onError: (error: any) => {
      toast.error(`Failed to assign trainer: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUpdateTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Trainer> & { id: number }) => {
      const response = await api.put(`/trainers/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update trainer: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeleteTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/trainers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete trainer: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUnassignTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trainerId, cohortId }: { trainerId: number; cohortId: string }) => {
      await api.delete(`/trainers/${trainerId}/cohort/${cohortId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer unassigned from cohort');
    },
    onError: (error: any) => {
      toast.error(`Failed to unassign trainer: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useReactivateTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/trainers/${id}/reactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer reactivated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to reactivate trainer: ${error.response?.data?.message || error.message}`);
    },
  });
};