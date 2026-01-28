import { create } from 'zustand';

export interface Trainer {
  id: string;
  name: string;
  email: string;
  type: 'technical' | 'behavioral';
  skill: string;
  avatar?: string;
  isInternal: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  type: 'mentor' | 'buddy';
  skill: string;
  avatar?: string;
}

export interface Candidate {
  id: string;
  name: string;
  skill: string;
  location: string;
  status: 'active' | 'inactive' | 'completed';
  joinDate: string;
}

export interface Cohort {
  id: string;
  code: string;
  name: string;
  bu: string;
  skill: string;
  location: string;
  coachId: string;
  coachName: string;
  trainers: Trainer[];
  mentors: Mentor[];
   primaryTrainer?: {
    id: number;
    name: string;
    email?: string;
  };
  candidates: Candidate[];
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'upcoming';
  candidateCount: number;
  progress: number;
}

interface CohortState {
  cohorts: Cohort[];
  selectedCohort: Cohort | null;
  setCohorts: (cohorts: Cohort[]) => void;
  selectCohort: (cohort: Cohort | null) => void;
  addCohort: (cohort: Cohort) => void;
  updateCohort: (id: string, updates: Partial<Cohort>) => void;
}

// Mock data
const mockCohorts: Cohort[] = [
  {
    id: '1',
    code: 'COH-2024-001',
    name: 'GenC Batch Alpha',
    bu: 'Digital Engineering',
    skill: 'Full Stack Development',
    location: 'Bangalore',
    coachId: 'c1',
    coachName: 'Sarah Chen',
    trainers: [
      { id: 't1', name: 'Alex Kumar', email: 'alex@company.com', type: 'technical', skill: 'React/Node.js', isInternal: true },
      { id: 't2', name: 'Priya Sharma', email: 'priya@company.com', type: 'behavioral', skill: 'Communication', isInternal: true },
    ],
    mentors: [
      { id: 'm1', name: 'Raj Patel', email: 'raj@company.com', type: 'mentor', skill: 'Architecture' },
      { id: 'm2', name: 'Lisa Wong', email: 'lisa@company.com', type: 'buddy', skill: 'DevOps' },
    ],
    candidates: [],
    startDate: '2024-01-15',
    status: 'active',
    candidateCount: 28,
    progress: 65,
  },
  {
    id: '2',
    code: 'COH-2024-002',
    name: 'GenC Batch Beta',
    bu: 'Cloud Solutions',
    skill: 'AWS/Azure',
    location: 'Chennai',
    coachId: 'c2',
    coachName: 'Michael Ross',
    trainers: [
      { id: 't3', name: 'David Kim', email: 'david@company.com', type: 'technical', skill: 'Cloud Architecture', isInternal: true },
    ],
    mentors: [
      { id: 'm3', name: 'Nina Gupta', email: 'nina@company.com', type: 'mentor', skill: 'AWS' },
    ],
    candidates: [],
    startDate: '2024-02-01',
    status: 'active',
    candidateCount: 24,
    progress: 42,
  },
  {
    id: '3',
    code: 'COH-2024-003',
    name: 'GenC Batch Gamma',
    bu: 'AI/ML',
    skill: 'Machine Learning',
    location: 'Hyderabad',
    coachId: 'c3',
    coachName: 'Emily Zhang',
    trainers: [
      { id: 't4', name: 'Arun Nair', email: 'arun@company.com', type: 'technical', skill: 'Python/TensorFlow', isInternal: false },
    ],
    mentors: [
      { id: 'm4', name: 'James Wilson', email: 'james@company.com', type: 'mentor', skill: 'Data Science' },
      { id: 'm5', name: 'Anita Roy', email: 'anita@company.com', type: 'buddy', skill: 'MLOps' },
    ],
    candidates: [],
    startDate: '2024-03-01',
    status: 'upcoming',
    candidateCount: 32,
    progress: 0,
  },
  {
    id: '4',
    code: 'COH-2023-015',
    name: 'GenC Batch Omega',
    bu: 'Quality Engineering',
    skill: 'Test Automation',
    location: 'Pune',
    coachId: 'c1',
    coachName: 'Sarah Chen',
    trainers: [
      { id: 't5', name: 'Vikram Singh', email: 'vikram@company.com', type: 'technical', skill: 'Selenium/Cypress', isInternal: true },
    ],
    mentors: [
      { id: 'm6', name: 'Sandra Lee', email: 'sandra@company.com', type: 'mentor', skill: 'QA Strategy' },
    ],
    candidates: [],
    startDate: '2023-10-01',
    endDate: '2024-01-15',
    status: 'completed',
    candidateCount: 22,
    progress: 100,
  },
];

export const useCohortStore = create<CohortState>((set) => ({
  cohorts: mockCohorts,
  selectedCohort: null,
  setCohorts: (cohorts) => set({ cohorts }),
  selectCohort: (cohort) => set({ selectedCohort: cohort }),
  addCohort: (cohort) => set((state) => ({ cohorts: [...state.cohorts, cohort] })),
  updateCohort: (id, updates) =>
    set((state) => ({
      cohorts: state.cohorts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
}));
