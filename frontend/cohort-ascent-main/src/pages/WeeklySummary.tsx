import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatsCard } from '@/components/ui/StatsCard';
import { useToast } from '@/hooks/use-toast';
import { effortApi, WeeklySummary as BackendWeeklySummary } from '@/integrations/backend/effortApi';
import { cohortApi, Cohort } from '@/integrations/backend/cohortApi';
import { generateCalendarWeeks, WeekOption } from '@/utils/weekGenerator';

interface WeeklySummary {
  id: number;
  cohort: { id: number; code: string };
  weekStartDate: string;
  weekEndDate: string;
  totalHours: number;
  summaryDate: string;
  activeTrainers: number;
  trainingDays: number;
  avgDaily: number;
  utilization: number;
}

export const WeeklySummaryPage = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [weekOptions, setWeekOptions] = useState<WeekOption[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<WeekOption | null>(null);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load cohorts
    cohortApi.getAllCohorts()
      .then(response => setCohorts(response.data))
      .catch(error => {
        toast({
          title: 'Error',
          description: 'Failed to load cohorts',
          variant: 'destructive',
        });
      });
  }, []);

  useEffect(() => {
    // Update selected cohort and generate weeks when cohort changes
    if (selectedCohort) {
      const weeks = generateCalendarWeeks(new Date(selectedCohort.startDate), new Date(selectedCohort.endDate));
      setWeekOptions(weeks);
      setSelectedWeek(null);
      setWeeklySummaries([]);
    }
  }, [selectedCohort]);

  const handleCohortChange = (cohortId: number) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    setSelectedCohort(cohort || null);
  };

  const handleWeekChange = (weekValue: string) => {
    const week = weekOptions.find(w => w.value === weekValue);
    setSelectedWeek(week || null);
    if (week && selectedCohort) {
      loadWeeklySummaries(selectedCohort.id, week.startDate, week.endDate);
    }
  };

  const loadWeeklySummaries = async (cohortId: number, startDate: Date, endDate: Date) => {
    setLoading(true);
    try {
      const response = await effortApi.getEffortsByCohortAndDateRange(
        cohortId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      // Group efforts by week and calculate summaries
      const efforts = response.data;
      const summaries: WeeklySummary[] = [];

      if (efforts.length > 0 && selectedCohort) {
        // Calculate total hours
        const totalHours = efforts.reduce((sum: number, effort: any) => sum + effort.effortHours, 0);
        
        // Calculate unique trainers
        const uniqueTrainers = new Set(efforts.map((effort: any) => effort.trainerMentorName));
        const activeTrainers = uniqueTrainers.size;
        
        // Calculate training days (assuming 5 days/week)
        const trainingDays = 5;
        
        // Calculate avg daily hours
        const avgDaily = totalHours / trainingDays;
        
        // Calculate utilization (assuming 8 hours/day per trainer)
        const utilization = (totalHours / (activeTrainers * trainingDays * 8)) * 100;

        summaries.push({
          id: Date.now(), // Temporary ID for frontend
          cohort: { id: selectedCohort.id, code: selectedCohort.code },
          weekStartDate: startDate.toISOString().split('T')[0],
          weekEndDate: endDate.toISOString().split('T')[0],
          totalHours,
          summaryDate: new Date().toISOString().split('T')[0],
          activeTrainers,
          trainingDays,
          avgDaily,
          utilization,
        });
      }

      setWeeklySummaries(summaries);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load weekly summaries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const canView = user?.role === 'COACH' || user?.role === 'LOCATION_LEAD' || user?.role === 'ADMIN';

  if (!canView) {
    return (
      <GlassCard className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to view weekly summaries.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Weekly Effort Summaries</h1>
          <p className="text-muted-foreground mt-2">
            View consolidated effort reports by cohort and week
          </p>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Cohort
            </label>
            <select
              value={selectedCohort?.id || ''}
              onChange={(e) => handleCohortChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a cohort</option>
              {cohorts.map(cohort => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.code} - {cohort.skill} ({cohort.trainingLocation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Week
            </label>
            <select
              value={selectedWeek?.value || ''}
              onChange={(e) => handleWeekChange(e.target.value)}
              disabled={!selectedCohort}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
            >
              <option value="">Select a week</option>
              {weekOptions.map(week => (
                <option key={week.value} value={week.value}>
                  {week.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Summary Cards */}
      {selectedWeek && weeklySummaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Hours"
            value={weeklySummaries[0].totalHours.toFixed(1)}
            icon={Clock}
            change="+12%"
            changeType="positive"
          />
          <StatsCard
            title="Active Trainers"
            value={weeklySummaries[0].activeTrainers.toString()}
            icon={Users}
            change="+2"
            changeType="positive"
          />
          <StatsCard
            title="Avg Hours/Day"
            value={weeklySummaries[0].avgDaily.toFixed(1)}
            icon={TrendingUp}
            change="+8%"
            changeType="positive"
          />
        </div>
      )}

      {/* Weekly Summary Details */}
      {loading ? (
        <GlassCard className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading weekly summaries...</p>
          </div>
        </GlassCard>
      ) : weeklySummaries.length > 0 ? (
        <div className="space-y-4">
          {weeklySummaries.map((summary) => (
            <GlassCard key={summary.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {summary.cohort.code} - Week Summary
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(summary.weekStartDate).toLocaleDateString()} - {new Date(summary.weekEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{summary.totalHours.toFixed(1)}h</p>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{summary.trainingDays}</p>
                  <p className="text-sm text-muted-foreground">Training Days</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{summary.activeTrainers}</p>
                  <p className="text-sm text-muted-foreground">Active Trainers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{summary.avgDaily.toFixed(1)}h</p>
                  <p className="text-sm text-muted-foreground">Avg Daily</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{summary.utilization.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : selectedWeek ? (
        <GlassCard className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
            <p className="text-muted-foreground">
              No effort data found for the selected week.
            </p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Select Cohort and Week</h3>
            <p className="text-muted-foreground">
              Choose a cohort and week to view effort summaries.
            </p>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
};