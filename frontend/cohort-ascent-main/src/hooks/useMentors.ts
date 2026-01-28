import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { toast } from 'sonner';

export interface Mentor {
  id: number;
  emp_id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'mentor' | 'buddy';
  is_internal: boolean;
  skill: string;
  training_start_date?: string;
  training_end_date?: string;
  avatar_url?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export const useMentors = (cohortId?: string) => {
  return useQuery({
    queryKey: ['mentors', cohortId],
    queryFn: async () => {
      if (cohortId) {
        const response = await api.get(`/mentors/cohort/${cohortId}`);
        return response.data as Mentor[];
      } else {
        const response = await api.get('/mentors');
        return response.data as Mentor[];
      }
    },
  });
};

export const useCreateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mentor, cohortId }: { mentor: Omit<Mentor, 'id' | 'createdAt' | 'updatedAt'>; cohortId?: string }) => {
      const url = cohortId ? `/mentors?cohortId=${cohortId}` : '/mentors';
      const response = await api.post(url, mentor);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast.success('Mentor created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create mentor: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useAssignMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mentorId, cohortId }: { mentorId: number; cohortId: string }) => {
      await api.post(`/mentors/${mentorId}/assign/${cohortId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast.success('Mentor assigned to cohort');
    },
    onError: (error: any) => {
      toast.error(`Failed to assign mentor: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUpdateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Mentor> & { id: number }) => {
      const response = await api.put(`/mentors/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast.success('Mentor updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update mentor: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeleteMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/mentors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast.success('Mentor deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete mentor: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUnassignMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mentorId, cohortId }: { mentorId: number; cohortId: string }) => {
      await api.delete(`/mentors/${mentorId}/cohort/${cohortId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast.success('Mentor unassigned from cohort');
    },
    onError: (error: any) => {
      toast.error(`Failed to unassign mentor: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useReactivateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/mentors/${id}/reactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast.success('Mentor reactivated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to reactivate mentor: ${error.response?.data?.message || error.message}`);
    },
  });
};