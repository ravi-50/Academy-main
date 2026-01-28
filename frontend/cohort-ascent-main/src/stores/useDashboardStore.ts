import { create } from 'zustand';
import { Cohort } from '../integrations/backend/cohortApi'; //

interface Activity {
  type: string;
  message: string;
  timestamp: string;
}

interface DashboardState {
  cohorts: Cohort[];
  activities: Activity[];
  setCohorts: (cohorts: Cohort[]) => void;
  addActivity: (activity: Activity) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  cohorts: [],
  activities: [],
  setCohorts: (cohorts) => set({ cohorts }),
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities].slice(0, 10) // Keep latest 10
  })),
}));