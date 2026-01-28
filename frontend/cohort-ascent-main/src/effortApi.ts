import api from './api';

export interface EffortSubmission {
  cohortId: number;
  trainerMentorId: number;
  role: 'TRAINER' | 'MENTOR' | 'BUDDY_MENTOR' | 'BH_TRAINER';
  mode: 'VIRTUAL' | 'IN_PERSON';
  reasonVirtual?: string;
  areaOfWork: string;
  effortHours: number;
  effortDate: string;
}

export interface StakeholderEffort {
  id: number;
  cohort: { id: number; code: string };
  trainerMentor: { id: number; name: string; empId: string };
  role: string;
  mode: string;
  reasonVirtual?: string;
  areaOfWork: string;
  effortHours: number;
  effortDate: string;
  month: string;
  updatedBy: { id: number; name: string };
  updatedDate: string;
}

export interface WeeklySummary {
  id: number;
  cohort: { id: number; code: string };
  weekStartDate: string;
  weekEndDate: string;
  totalHours: number;
  summaryDate: string;
}

export interface EffortDetail {
  hours: number;
  notes: string;
}

export interface DayLog {
  date: string;
  isHoliday: boolean;
  trainer: EffortDetail;
  mentor: EffortDetail;
  buddyMentor: EffortDetail;
}

export interface WeeklyEffortSubmission {
  cohortId: number;
  weekStartDate: string;
  weekEndDate: string;
  dayLogs: DayLog[];
}

export const effortApi = {
  submitEffort: (effort: EffortSubmission) => api.post<StakeholderEffort>('/efforts', effort),

  getEffortsByCohort: (cohortId: number) => api.get<StakeholderEffort[]>(`/efforts/cohort/${cohortId}`),

  getEffortsByCohortAndDateRange: (cohortId: number, startDate: string, endDate: string) =>
    api.get<StakeholderEffort[]>(`/efforts/cohort/${cohortId}/range`, {
      params: { startDate, endDate }
    }),

  getEffortsByTrainerMentor: (trainerMentorId: number) =>
    api.get<StakeholderEffort[]>(`/efforts/trainer-mentor/${trainerMentorId}`),

  getEffortById: (id: number) => api.get<StakeholderEffort>(`/efforts/${id}`),

  deleteEffort: (id: number) => api.delete(`/efforts/${id}`),

  getWeeklySummariesByCohort: (cohortId: number) =>
    api.get<WeeklySummary[]>(`/efforts/weekly-summary/cohort/${cohortId}`),

  getWeeklySummary: (cohortId: number, weekStartDate: string) =>
    api.get<WeeklySummary>(`/efforts/weekly-summary/cohort/${cohortId}/week`, {
      params: { weekStartDate }
    }),

  submitWeeklyEffort: (weeklyEffort: WeeklyEffortSubmission) =>
    api.post('/efforts/weekly', weeklyEffort),
};