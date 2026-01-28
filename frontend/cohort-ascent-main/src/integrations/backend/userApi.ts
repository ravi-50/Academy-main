import api from "@/integrations/backend/api";

export interface User {
  id: number;
  empId: string;
  name: string;
  email: string;
  role: 'COACH' | 'LOCATION_LEAD' | 'ADMIN';
  employeeType: 'INTERNAL' | 'EXTERNAL';
  location?: string;
  assignedCohorts?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  trainingStartDate?: string;
  trainingEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const userApi = {
  getAllUsers: () => api.get('/users'),
  getCoaches: () => api.get('/users/coaches'),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: number, data: any) => {
  return api.put(`/users/${id}`, data);
},
};