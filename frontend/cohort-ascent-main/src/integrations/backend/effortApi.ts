import api from '@/integrations/backend/api';

export interface Effort {
  id: number;
  cohortCode: string;
  trainerMentorName: string;
  effortHours: number;
  weekStartDate: string;
  stakeholderType: string;
  notes?: string;
  submittedAt: string;
}

export interface WeeklySummary {
  id: number;
  cohortCode: string;
  weekStartDate: string;
  totalEffortHours: number;
  stakeholderCount: number;
  averageEffortPerStakeholder: number;
  createdAt: string;
}

export const effortApi = {
  submitEffort: (effort: Omit<Effort, 'id' | 'submittedAt'>) => 
    api.post('/efforts', effort),

  getEfforts: (cohortId?: number, weekStart?: string) => 
    api.get('/efforts', { params: { cohortId, weekStart } }),

  getEffortsByCohortAndDateRange: (cohortId: number, startDate: string, endDate: string) =>
    api.get('/efforts', { params: { cohortId, startDate, endDate } }),

  getWeeklySummaries: (cohortId: number, weekStart: string) => 
    api.get(`/efforts/weekly-summary/${cohortId}/${weekStart}`),

  getAllWeeklySummaries: () => 
    api.get('/efforts/weekly-summary'),
};