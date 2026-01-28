import api from "@/integrations/backend/api";
import { Activity } from "@/types/backend";

export async function fetchActivitiesByCohort(cohortId: number): Promise<Activity[]> {
  const res = await api.get(`/activities/cohort/${cohortId}`);
  return res.data;
}
