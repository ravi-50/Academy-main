import api from "@/integrations/backend/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Cohort {
  id: number;
  code: string;
  bu: string;
  skill: string;
  activeGencCount: number;
  trainingLocation: string;
  startDate: string;
  endDate: string;
  coach?: {
    id: number;
    name: string;
    email?: string;
  };
  primaryTrainer?: {
    id: number;
    name: string;
  };
  behavioralTrainer?: {
    id: number;
    name: string;
  };
  primaryMentor?: User;
  buddyMentor?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCohortRequest {
  code: string;
  bu: string;
  skill: string;
  trainingLocation: string;
  startDate: string;
  endDate?: string | null;
  activeGencCount: number;
  coachId?: number | null;
  primaryTrainerId?: string | null;
}


export const cohortApi = {
  getAllCohorts: () => api.get('/cohorts'),
  getCohortById: (id: number) => api.get(`/cohorts/${id}`),
  createCohort: (cohort: CreateCohortRequest) => api.post('/cohorts', cohort),
  updateCohort: (id: number, cohort: Partial<Cohort>) => api.put(`/cohorts/${id}`, cohort),
  deleteCohort: (id: number) => api.delete(`/cohorts/${id}`),
};
