import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, User } from '@/integrations/backend/userApi';
import { toast } from 'sonner';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAllUsers();
      return response.data as User[];
    },
  });
};

export const useCoaches = () => {
  return useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const response = await userApi.getCoaches();
      return response.data as User[];
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      empId: string;
      name: string;
      email: string;
      role: 'ADMIN' | 'COACH';
      employeeType: string;
      skill?: string;
      location?: string;
      password: string;
      trainingStartDate?: string;
      trainingEndDate?: string;
    }) => {
      const response = await userApi.createUser(userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: number } & any) => {
      const { id, ...data } = payload;
      const response = await userApi.updateUser(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    },
  });
};



export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      // Since the API doesn't have a delete endpoint, we'll simulate it
      // In a real app, this would be: await userApi.deleteUser(userId);
      throw new Error('Delete user API not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    },
  });
};