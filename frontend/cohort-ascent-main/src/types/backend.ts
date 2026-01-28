export interface Cohort {
  id: number;
  name: string;
  skill: string;
  location: string;
  candidateCount: number;
  progress: number;
  status: "active" | "inactive";
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  cohort: {
    id: number;
    name: string;
  };
  coach: {
    id: number;
    name: string;
  };
}
