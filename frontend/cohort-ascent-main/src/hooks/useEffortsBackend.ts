import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { effortApi, WeeklyEffortSubmission, WeeklySummary } from '@/effortApi';
import { toast } from 'sonner';

export const useEffortsByCohort = (cohortId: number) => {
    return useQuery({
        queryKey: ['efforts', 'cohort', cohortId],
        queryFn: async () => {
            const response = await effortApi.getEffortsByCohort(cohortId);
            return response.data;
        },
        enabled: !!cohortId,
    });
};

export const useEffortsByCohortAndRange = (cohortId: number, startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['efforts', 'cohort', cohortId, 'range', startDate, endDate],
        queryFn: async () => {
            const response = await effortApi.getEffortsByCohortAndDateRange(cohortId, startDate, endDate);
            return response.data;
        },
        enabled: !!cohortId && !!startDate && !!endDate,
    });
};

export const useWeeklySummaries = (cohortId: number) => {
    return useQuery({
        queryKey: ['weekly_summaries', cohortId],
        queryFn: async () => {
            const response = await effortApi.getWeeklySummariesByCohort(cohortId);
            return response.data;
        },
        enabled: !!cohortId,
    });
};

export const useSubmitWeeklyEffort = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (weeklyEffort: WeeklyEffortSubmission) => {
            const response = await effortApi.submitWeeklyEffort(weeklyEffort);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['efforts'] });
            queryClient.invalidateQueries({ queryKey: ['weekly_summaries'] });
            toast.success('Weekly effort submitted successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to submit weekly effort: ${error.response?.data?.message || error.message}`);
        },
    });
};
