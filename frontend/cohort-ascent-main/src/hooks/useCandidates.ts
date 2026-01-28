import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { toast } from 'sonner';

export interface Candidate {
  id: number;
  candidateId: string;
  name: string;
  email: string | null;
  skill: string;
  location: string;
  cohort: {
    id: number;
    code: string;
    bu: string;
    skill: string;
    activeGencCount: number;
    trainingLocation: string;
    startDate: string;
    endDate: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export const useCandidates = (cohortId?: string) => {
  return useQuery({
    queryKey: ['candidates', cohortId],
    queryFn: async () => {
      if (cohortId) {
        const response = await api.get(`/candidates/cohort/${cohortId}`);
        return response.data as Candidate[];
      } else {
        const response = await api.get('/candidates');
        return response.data as Candidate[];
      }
    },
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post('/candidates', candidate);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success('Candidate added successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to add candidate: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Candidate> & { id: number }) => {
      const response = await api.put(`/candidates/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success('Candidate updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update candidate: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/candidates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success('Candidate deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete candidate: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useBulkCreateCandidates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidates: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>[]) => {
      const response = await api.post('/candidates/bulk', candidates);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success(`${data.length} candidates imported successfully`);
    },
    onError: (error: any) => {
      toast.error(`Failed to import candidates: ${error.response?.data?.message || error.message}`);
    },
  });
};