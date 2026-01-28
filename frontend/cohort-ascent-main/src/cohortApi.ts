import api from './api';

export interface Cohort {
  id: number;
  code: string;
  bu: string;
  skill: string;
  activeGencCount: number;
  trainingLocation: string;
  startDate: string;
  endDate: string;
}

export const cohortApi = {
  getAllCohorts: () => api.get<Cohort[]>('/cohorts'),

  getCohortById: (id: number) => api.get<Cohort>(`/cohorts/${id}`),

  getCohortByCode: (code: string) => api.get<Cohort>(`/cohorts/code/${code}`),

  createCohort: (cohort: Omit<Cohort, 'id'>) => api.post<Cohort>('/cohorts', cohort),

  updateCohort: (id: number, cohort: Partial<Cohort>) => api.put<Cohort>(`/cohorts/${id}`, cohort),

  deleteCohort: (id: number) => api.delete(`/cohorts/${id}`),

  // Trainer management
  assignPrimaryTrainer: (cohortId: number, trainerId: number) =>
    api.post(`/cohorts/${cohortId}/trainers/primary/${trainerId}`),

  addAdditionalTrainer: (cohortId: number, trainerId: number, role: string) =>
    api.post(`/cohorts/${cohortId}/trainers/additional`, null, { params: { trainerId, role } }),

  removeAdditionalTrainer: (cohortId: number, trainerId: number) =>
    api.delete(`/cohorts/${cohortId}/trainers/additional/${trainerId}`),

  getAdditionalTrainers: (cohortId: number) =>
    api.get(`/cohorts/${cohortId}/trainers/additional`),

  // Mentor management
  assignPrimaryMentor: (cohortId: number, mentorId: number) =>
    api.post(`/cohorts/${cohortId}/mentors/primary/${mentorId}`),

  assignBuddyMentor: (cohortId: number, buddyMentorId: number) =>
    api.post(`/cohorts/${cohortId}/mentors/buddy/${buddyMentorId}`),

  addAdditionalMentor: (cohortId: number, mentorId: number, role: string) =>
    api.post(`/cohorts/${cohortId}/mentors/additional`, null, { params: { mentorId, role } }),

  removeAdditionalMentor: (cohortId: number, mentorId: number) =>
    api.delete(`/cohorts/${cohortId}/mentors/additional/${mentorId}`),

  getAdditionalMentors: (cohortId: number) =>
    api.get(`/cohorts/${cohortId}/mentors/additional`),
};