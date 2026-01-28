import { useQuery } from '@tanstack/react-query';
import api from '@/integrations/backend/api';

export interface CoachDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const useActiveCoaches = () => {
  return useQuery({
    queryKey: ['active-coaches'],
    queryFn: async () => {
      const res = await api.get('/users/coaches');
      return res.data;
    },
  });
};
