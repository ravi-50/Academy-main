import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Send,
  Lock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  History,
  Save,
  Check,
  Info,
  ShieldCheck,
  Target,
  Sparkles,
  MapPin,
  TrendingUp,
  Layout,
  AlertCircle,
  Users,
  Search as SearchIcon,
  Filter,
  Download
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { useCohorts, useCohort } from '@/hooks/useCohortsBackend';
import { useSubmitWeeklyEffort, useWeeklySummaries, useEffortsByCohortAndRange } from '@/hooks/useEffortsBackend';
import { generateCalendarWeeks } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  format,
  isAfter,
  isSameDay,
  startOfToday,
  eachDayOfInterval,
  addDays,
  isBefore,
  startOfWeek,
  endOfWeek,
  parseISO
} from 'date-fns';
import { DayLog, WeeklyEffortSubmission } from '@/effortApi';
import { useAuthStore } from '@/stores/authStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock location-based holidays for demonstration
const GET_HOLIDAYS = (location: string) => {
  const holidays: Record<string, string[]> = {
    'Bangalore': ['2026-01-26', '2026-03-08'],
    'Chennai': ['2026-01-26', '2026-04-14'],
    'Pune': ['2026-01-26', '2026-05-01'],
  };
  return holidays[location] || ['2026-01-26'];
};

export const DailyEfforts = () => {
  const { user } = useAuthStore();
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [localDayLogs, setLocalDayLogs] = useState<Record<string, DayLog>>({});
  const [savedDays, setSavedDays] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allCohorts = [] } = useCohorts();
  const { data: cohortDetail } = useCohort(selectedCohortId || 0);
  const submitWeeklyMutation = useSubmitWeeklyEffort();

  // Filter cohorts based on coach role
  const allowedCohorts = useMemo(() => {
    let cohorts = allCohorts;
    if (user?.role === 'COACH') {
      cohorts = allCohorts.filter(c => c.coach?.id === user.id);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cohorts = cohorts.filter(c =>
        c.code.toLowerCase().includes(query) ||
        c.skill.toLowerCase().includes(query) ||
        c.trainingLocation.toLowerCase().includes(query)
      );
    }
    return cohorts;
  }, [allCohorts, user, searchQuery]);

  const calendarWeeks = useMemo(() => {
    if (!cohortDetail) return [];
    return generateCalendarWeeks(cohortDetail.startDate, cohortDetail.endDate);
  }, [cohortDetail]);

  const selectedWeek = useMemo(() => {
    const today = startOfToday();
    if (calendarWeeks.length === 0) return null;

    if (selectedWeekId) {
      return calendarWeeks.find(w => w.id === selectedWeekId) || calendarWeeks[0];
    }

    // Default to current week
    const currentWeek = calendarWeeks.find(week =>
      (isSameDay(today, week.startDate) || isAfter(today, week.startDate)) &&
      (isSameDay(today, week.endDate) || isBefore(today, week.endDate))
    );
    return currentWeek || calendarWeeks[0];
  }, [calendarWeeks, selectedWeekId]);

  const { data: weeklySummaries = [] } = useWeeklySummaries(selectedCohortId || 0);
  const { data: existingEfforts = [] } = useEffortsByCohortAndRange(
    selectedCohortId || 0,
    selectedWeek ? format(selectedWeek.startDate, 'yyyy-MM-dd') : '',
    selectedWeek ? format(selectedWeek.endDate, 'yyyy-MM-dd') : ''
  );

  const holidays = useMemo(() => {
    if (!cohortDetail) return [];
    return GET_HOLIDAYS(cohortDetail.trainingLocation);
  }, [cohortDetail]);

  // Initialize local day logs
  useEffect(() => {
    if (selectedWeek && cohortDetail) {
      const days = eachDayOfInterval({
        start: selectedWeek.startDate,
        end: addDays(selectedWeek.startDate, 4), // Monday to Friday
      });

      const initialLogs: Record<string, DayLog> = {};
      const initialSaved: Record<string, boolean> = {};

      days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayEfforts = (existingEfforts as any[]).filter(e => e.effortDate === dateStr);
        const isHoliday = holidays.includes(dateStr);

        initialLogs[dateStr] = {
          date: dateStr,
          isHoliday: isHoliday,
          technicalTrainer: {
            hours: dayEfforts.find(e => e.role === 'TRAINER')?.effortHours || 0,
            notes: dayEfforts.find(e => e.role === 'TRAINER')?.areaOfWork || '',
          },
          behavioralTrainer: {
            hours: dayEfforts.find(e => e.role === 'BH_TRAINER')?.effortHours || 0,
            notes: dayEfforts.find(e => e.role === 'BH_TRAINER')?.areaOfWork || '',
          },
          mentor: {
            hours: dayEfforts.find(e => e.role === 'MENTOR')?.effortHours || 0,
            notes: dayEfforts.find(e => e.role === 'MENTOR')?.areaOfWork || '',
          },
          buddyMentor: {
            hours: dayEfforts.find(e => e.role === 'BUDDY_MENTOR')?.effortHours || 0,
            notes: dayEfforts.find(e => e.role === 'BUDDY_MENTOR')?.areaOfWork || '',
          },
        };

        // If data exists, mark as saved
        if (dayEfforts.length > 0) {
          initialSaved[dateStr] = true;
        }
      });
      setLocalDayLogs(initialLogs);
      setSavedDays(initialSaved);
    }
  }, [selectedWeek, existingEfforts, cohortDetail, holidays]);

  const weekStats = useMemo(() => {
    let tech = 0, behavioral = 0, mentor = 0, buddy = 0;
    Object.values(localDayLogs).forEach(log => {
      if (!log.isHoliday) {
        tech += Number(log.technicalTrainer?.hours || 0);
        behavioral += Number(log.behavioralTrainer?.hours || 0);
        mentor += Number(log.mentor?.hours || 0);
        buddy += Number(log.buddyMentor?.hours || 0);
      }
    });
    return {
      tech,
      behavioral,
      mentor,
      buddy,
      total: tech + behavioral + mentor + buddy
    };
  }, [localDayLogs]);

  const handleUpdateLog = (date: string, role: keyof Omit<DayLog, 'date' | 'isHoliday'>, field: 'hours' | 'notes', value: any) => {
    if (field === 'hours' && value > 9) {
      toast.error('Daily effort cannot exceed 9 hours per person (Work Policy)');
      return;
    }

    setLocalDayLogs(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [role]: {
          ...prev[date][role],
          [field]: value
        }
      } as DayLog
    }));
    setSavedDays(prev => ({ ...prev, [date]: false }));
  };

  const handleSaveDay = (date: string) => {
    setSavedDays(prev => ({ ...prev, [date]: true }));
    toast.success(`Progress saved for ${format(parseISO(date), 'EEEE, MMM dd')}`, {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    });
  };

  const isWeekCompleted = useMemo(() => {
    if (!selectedWeek) return false;
    const weekStartStr = format(selectedWeek.startDate, 'yyyy-MM-dd');
    return weeklySummaries.some(s => s.weekStartDate === weekStartStr);
  }, [weeklySummaries, selectedWeek]);

  const handleFinalSubmit = () => {
    if (!selectedCohortId || !selectedWeek || !cohortDetail || !user) return;

    // Validation: check if all non-holiday days are "saved" (staged)
    const days = Object.values(localDayLogs);
    const unsavedDays = days.filter(d => !d.isHoliday && !savedDays[d.date]);

    if (unsavedDays.length > 0) {
      toast.error('Please save all daily logs before final submission.');
      return;
    }

    const submission: WeeklyEffortSubmission = {
      cohortId: selectedCohortId,
      coachId: user.id,
      location: cohortDetail.trainingLocation,
      weekStartDate: format(selectedWeek.startDate, 'yyyy-MM-dd'),
      weekEndDate: format(selectedWeek.endDate, 'yyyy-MM-dd'),
      holidays: holidays,
      dayLogs: days,
      submittedBy: user.name,
      status: 'COMPLETED'
    };

    submitWeeklyMutation.mutate(submission, {
      onSuccess: () => {
        toast.success('Weekly efforts submitted and locked.');
      }
    });
  };

  // 1. Role-Based Entry Point (Cohort Selection)
  if (!selectedCohortId) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-6 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-black text-foreground flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Layout className="h-8 w-8 text-primary" />
              </div>
              Log Efforts
            </h1>
            <p className="mt-2 text-muted-foreground font-medium">Select an assigned cohort to manage workforce development logs.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80 group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search cohorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/20 border border-border/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm"
              />
            </div>
            <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
              <div className="text-right">
                <p className="text-xs font-bold uppercase text-muted-foreground">Logged in as</p>
                <p className="text-sm font-black text-foreground">{user?.name}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-neon-blue flex items-center justify-center font-bold text-white shadow-lg">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allowedCohorts.map((cohort, index) => {
            const today = startOfToday();
            const start = parseISO(cohort.startDate);
            const end = parseISO(cohort.endDate);

            let status = 'Upcoming';
            let statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            let progress = 0;

            if (isAfter(today, end)) {
              status = 'Completed';
              statusColor = 'bg-muted text-muted-foreground border-border/50';
              progress = 100;
            } else if (isAfter(today, start) || isSameDay(today, start)) {
              status = 'Active';
              statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              const totalDays = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
              const currentDay = Math.max(0, (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
              progress = Math.min(100, Math.round((currentDay / totalDays) * 100));
            }

            return (
              <motion.div
                key={cohort.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard
                  variant="hover"
                  glow={status === 'Active' ? "cyan" : "none"}
                  className="cursor-pointer p-6 h-full flex flex-col group relative overflow-hidden ring-1 ring-white/5"
                  onClick={() => setSelectedCohortId(cohort.id)}
                >
                  <div className="absolute top-0 right-0 p-4">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                      statusColor
                    )}>
                      {status}
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 mb-1">{cohort.skill}</p>
                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{cohort.code}</h3>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
                        <MapPin className="h-3.5 w-3.5 text-primary/60" />
                        {cohort.trainingLocation}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
                        <Users className="h-3.5 w-3.5 text-primary/60" />
                        {(cohort as any).primaryTrainer?.name || (cohort as any).trainerName || "No Trainer"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5 text-primary/60" />
                          Progress
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase text-muted-foreground uppercase">{cohort.bu}</span>
                    </div>
                    <div className="flex items-center text-primary font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                      Log Efforts <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
          {allowedCohorts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-card/10 rounded-3xl border-2 border-dashed border-border/50">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground">No cohorts assigned</h3>
              <p className="text-muted-foreground">You don't have any cohorts assigned for effort logging.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Effort Logging Workspace
  return (
    <div className="min-h-screen">
      {/* 2. Enterprise Workflow UI */}
      <div className="sticky top-16 z-30 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedCohortId(null)}
            className="p-2 rounded-xl bg-muted/30 hover:bg-primary/20 hover:text-primary transition-all group"
          >
            <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground">{cohortDetail?.code}</h1>
              <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 tracking-widest uppercase">
                Effort Workspace
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight flex items-center gap-2">
              <MapPin className="h-3 w-3" /> {cohortDetail?.trainingLocation} • {cohortDetail?.skill}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GradientButton
            variant="ghost"
            className={cn("gap-2", showHistory && "bg-primary/10 text-primary")}
            onClick={() => setShowHistory(!showHistory)}
            icon={<History className="h-4 w-4" />}
          >
            {showHistory ? "Back to Logs" : "View Log History"}
          </GradientButton>
          {!showHistory && (
            <GradientButton
              variant="primary"
              className="px-6 shadow-neon-blue"
              onClick={handleFinalSubmit}
              disabled={isWeekCompleted || submitWeeklyMutation.isPending}
              icon={isWeekCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              iconPosition="right"
            >
              {isWeekCompleted ? "Week Submitted" : "Submit Week"}
            </GradientButton>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px,1fr] xl:grid-cols-[320px,1fr] gap-8 p-6 lg:p-8">
        {/* 3. Weekly Timeline Panel (Left) - Now Sticky */}
        {!showHistory && (
          <aside className="space-y-6 sticky top-[100px] self-start hidden lg:block">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Weekly Timeline</h3>
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(calendarWeeks.filter(w => weeklySummaries.some(s => s.weekStartDate === format(w.startDate, 'yyyy-MM-dd'))).length / calendarWeeks.length) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-primary">
                  {calendarWeeks.filter(w => weeklySummaries.some(s => s.weekStartDate === format(w.startDate, 'yyyy-MM-dd'))).length}/{calendarWeeks.length}
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-3 custom-scrollbar px-1">
              {calendarWeeks.map((week) => {
                const weekStartStr = format(week.startDate, 'yyyy-MM-dd');
                const isCompleted = weeklySummaries.some(s => s.weekStartDate === weekStartStr);
                const today = startOfToday();
                const isActive = (isSameDay(today, week.startDate) || isAfter(today, week.startDate)) && (isSameDay(today, week.endDate) || isBefore(today, week.endDate));
                const isLocked = isAfter(week.startDate, today);
                const isSelected = selectedWeek?.id === week.id;

                return (
                  <TooltipProvider key={week.id}>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <motion.button
                          whileHover={!isLocked || isCompleted ? { x: 4 } : {}}
                          whileTap={!isLocked || isCompleted ? { scale: 0.98 } : {}}
                          disabled={isLocked && !isCompleted}
                          onClick={() => setSelectedWeekId(week.id)}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all duration-300 relative group",
                            isSelected
                              ? "bg-primary/15 border-primary/50 shadow-[0_0_25px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/20"
                              : "bg-card/30 border-border/40 hover:bg-card/50 hover:border-border/80",
                            isLocked && !isCompleted && "opacity-30 cursor-not-allowed grayscale",
                            isActive && !isCompleted && "border-primary/30"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={cn(
                              "text-xs font-black uppercase tracking-wider transition-colors",
                              isSelected ? "text-primary" : "text-foreground/70 group-hover:text-foreground"
                            )}>
                              Week {week.weekNumber}
                            </span>
                            {isCompleted ? (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <Check className="h-3 w-3" />
                              </div>
                            ) : isLocked ? (
                              <Lock className="h-3 w-3 text-muted-foreground/50" />
                            ) : isActive ? (
                              <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                              </span>
                            ) : null}
                          </div>

                          <p className="text-[10px] font-bold text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                            {format(week.startDate, 'MMM dd')} — {format(week.endDate, 'MMM dd')}
                          </p>

                          {isSelected && !isCompleted && (
                            <motion.div
                              layoutId="active-indicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"
                            />
                          )}
                        </motion.button>
                      </TooltipTrigger>
                      {isLocked && !isCompleted && (
                        <TooltipContent side="right" className="bg-background/95 border-border/50 backdrop-blur-md">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Status: Locked</p>
                          <p className="text-xs text-muted-foreground mt-1">This week unlocks on {format(week.startDate, 'PPPP')}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </aside>
        )}

        {/* 4. Daily Log Panel (Main Panel) */}
        <div className={cn("space-y-10", showHistory && "lg:col-span-2 max-w-6xl mx-auto w-full")}>
          <AnimatePresence mode="wait">
            {showHistory ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/50 pb-8 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-neon-blue/5">
                      <History className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-foreground tracking-tight">Effort History</h3>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider opacity-70">Verified audit log of compliance records</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="Filter history..."
                        value={historySearchQuery}
                        onChange={(e) => setHistorySearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-background/40 border border-border/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 w-64 transition-all"
                      />
                    </div>
                    <div className="px-5 py-2.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-3">
                      <div>
                        <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest leading-none">Total Hours</p>
                        <p className="text-lg font-black text-primary">{weeklySummaries.reduce((acc, s) => acc + Number(s.totalHours), 0)}</p>
                      </div>
                      <div className="w-px h-8 bg-primary/20" />
                      <div>
                        <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest leading-none">Verified</p>
                        <p className="text-lg font-black text-primary">{weeklySummaries.length} Weeks</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {weeklySummaries.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-card/10 rounded-3xl border border-dashed border-border/50">
                      <History className="h-16 w-16 text-muted-foreground/10 mx-auto mb-4" />
                      <p className="text-muted-foreground font-bold uppercase tracking-widest">No submission history found</p>
                    </div>
                  ) : (
                    weeklySummaries
                      .filter(s => {
                        const query = historySearchQuery.toLowerCase();
                        const weekNumber = calendarWeeks.find(w => format(w.startDate, 'yyyy-MM-dd') === s.weekStartDate)?.weekNumber;
                        const weekNumberString = weekNumber ? `Week ${weekNumber}` : '';
                        const weekDates = s.weekStartDate && s.weekEndDate ?
                          `${format(parseISO(s.weekStartDate), 'MMM dd')} - ${format(parseISO(s.weekEndDate), 'MMM dd, yyyy')}` : '';

                        return (
                          s.weekStartDate.toLowerCase().includes(query) ||
                          weekNumberString.toLowerCase().includes(query) ||
                          weekDates.toLowerCase().includes(query) ||
                          s.submittedBy?.toLowerCase().includes(query) ||
                          s.totalHours.toString().includes(query)
                        );
                      })
                      .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))
                      .map(summary => (
                        <GlassCard key={summary.id} className="p-8 border border-border/40 flex flex-col hover:border-primary/40 hover:shadow-neon-blue/10 transition-all duration-500 group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-primary/10" />

                          <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">Entry Locked</span>
                                <h4 className="text-2xl font-black text-foreground tracking-tight">Week {calendarWeeks.find(w => format(w.startDate, 'yyyy-MM-dd') === summary.weekStartDate)?.weekNumber || '?'}</h4>
                              </div>
                              <p className="text-xs text-muted-foreground font-bold flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                {summary.weekStartDate && summary.weekEndDate ?
                                  `${format(parseISO(summary.weekStartDate), 'MMM dd')} - ${format(parseISO(summary.weekEndDate), 'MMM dd, yyyy')}`
                                  : 'Dates Unavailable'}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                Verified Record
                              </div>
                              <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tighter opacity-60">
                                {summary.summaryDate ? format(parseISO(summary.summaryDate), 'MMM dd, HH:mm') : 'Verification Pending'}
                              </p>
                            </div>
                          </div>

                          {/* Breakdown Grid */}
                          <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8 p-5 rounded-2xl bg-muted/20 border border-border/30 relative z-10">
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">Technical Tr.</p>
                              <p className="text-lg font-black text-foreground flex items-baseline gap-1">
                                {summary.technicalTrainerHours} <span className="text-[10px] text-muted-foreground/60 uppercase">hrs</span>
                              </p>
                            </div>
                            <div className="space-y-1.5 text-right">
                              <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">Behavioral Tr.</p>
                              <p className="text-lg font-black text-foreground flex items-baseline gap-1 justify-end">
                                {summary.behavioralTrainerHours} <span className="text-[10px] text-muted-foreground/60 uppercase">hrs</span>
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">Mentorship</p>
                              <p className="text-lg font-black text-foreground flex items-baseline gap-1">
                                {summary.mentorHours} <span className="text-[10px] text-muted-foreground/60 uppercase">hrs</span>
                              </p>
                            </div>
                            <div className="space-y-1.5 text-right">
                              <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">Buddy Mentor</p>
                              <p className="text-lg font-black text-foreground flex items-baseline gap-1 justify-end">
                                {summary.buddyMentorHours} <span className="text-[10px] text-muted-foreground/60 uppercase">hrs</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/30 relative z-10">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-neon-blue/10 flex items-center justify-center text-sm font-black text-primary border border-primary/20 shadow-inner">
                                {summary.submittedBy?.charAt(0) || 'S'}
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.1em] leading-none mb-1">Approved By</p>
                                <p className="text-sm font-black text-foreground">{summary.submittedBy || 'System Lead'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => toast.success('Report generation started...')}
                                className="p-2 rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-all group/btn"
                                title="Download Report"
                              >
                                <Download className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                              </button>
                              <div className="text-right">
                                <p className="text-[9px] font-black text-primary/60 uppercase tracking-[0.2em] mb-1">Total Verified</p>
                                <div className="flex items-baseline gap-1.5 justify-end">
                                  <p className="text-3xl font-black text-primary tracking-tighter">{summary.totalHours}</p>
                                  <span className="text-xs font-black text-primary/60 uppercase">h</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedWeek?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* 5. Weekly Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <GlassCard className="p-4 border-b-2 border-b-primary bg-primary/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Week</p>
                    <p className="text-2xl font-black text-foreground">{weekStats.total} <span className="text-xs text-muted-foreground leading-none">HRS</span></p>
                  </GlassCard>
                  <GlassCard className="p-4 border-b-2 border-b-blue-500 bg-blue-500/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Tech Trainer</p>
                    <p className="text-xl font-black text-foreground">{weekStats.tech} <span className="text-xs text-muted-foreground leading-none">HRS</span></p>
                  </GlassCard>
                  <GlassCard className="p-4 border-b-2 border-b-purple-500 bg-purple-500/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">BH Trainer</p>
                    <p className="text-xl font-black text-foreground">{weekStats.behavioral} <span className="text-xs text-muted-foreground leading-none">HRS</span></p>
                  </GlassCard>
                  <GlassCard className="p-4 border-b-2 border-b-emerald-500 bg-emerald-500/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Mentorship</p>
                    <p className="text-xl font-black text-foreground">{weekStats.mentor} <span className="text-xs text-muted-foreground leading-none">HRS</span></p>
                  </GlassCard>
                  <GlassCard className="p-4 border-b-2 border-b-amber-500 bg-amber-500/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Buddy Mentor</p>
                    <p className="text-xl font-black text-foreground">{weekStats.buddy} <span className="text-xs text-muted-foreground leading-none">HRS</span></p>
                  </GlassCard>
                </div>

                {selectedWeek && eachDayOfInterval({
                  start: selectedWeek.startDate,
                  end: addDays(selectedWeek.startDate, 4), // Monday to Friday
                }).map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const log: DayLog = localDayLogs[dateStr] || {
                    date: dateStr,
                    isHoliday: false,
                    technicalTrainer: { hours: 0, notes: '' },
                    behavioralTrainer: { hours: 0, notes: '' },
                    mentor: { hours: 0, notes: '' },
                    buddyMentor: { hours: 0, notes: '' }
                  };
                  const today = startOfToday();
                  const isFuture = isAfter(day, today);
                  const isToday = isSameDay(day, today);
                  const isHoliday = holidays.includes(dateStr);
                  const isSaved = savedDays[dateStr];
                  const isDisabled = isFuture || isHoliday || isWeekCompleted;

                  return (
                    <GlassCard
                      key={dateStr}
                      className={cn(
                        "relative p-8 transition-all duration-500",
                        isToday && "ring-2 ring-primary/40 shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]",
                        isDisabled && !isWeekCompleted && "opacity-70 grayscale-[0.5]",
                        isWeekCompleted && "border-emerald-500/30"
                      )}
                      glow={isToday ? "cyan" : "none"}
                    >
                      {/* 6. Holiday Logic */}
                      {isHoliday && (
                        <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-[2px] rounded-3xl flex items-center justify-center">
                          <div className="bg-orange-500/15 border border-orange-500/30 px-8 py-4 rounded-3xl flex items-center gap-4 shadow-xl">
                            <div className="p-3 bg-orange-500/20 rounded-2xl">
                              <AlertCircle className="h-6 w-6 text-orange-400" />
                            </div>
                            <div>
                              <p className="font-black text-orange-400 uppercase tracking-[0.2em] text-sm">Public Holiday</p>
                              <p className="text-xs font-bold text-orange-400/70 mt-0.5">Corporate compliance: Non-working day</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <h4 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter uppercase">{format(day, 'EEEE')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {isToday && (
                                <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded shadow-neon-blue tracking-widest">Today</span>
                              )}
                              {isFuture && (
                                <span className="px-3 py-1 bg-muted/50 text-muted-foreground text-[10px] font-black uppercase rounded border border-border/50 flex items-center gap-1">
                                  <Lock className="h-3 w-3" /> Future
                                </span>
                              )}
                              {isWeekCompleted && (
                                <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase rounded border border-emerald-500/20 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Logged
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground font-black text-sm uppercase tracking-widest">
                            <Calendar className="h-4 w-4 text-primary" />
                            {format(day, 'MMMM dd, yyyy')}
                          </div>
                        </div>

                        {!isDisabled && (
                          <GradientButton
                            variant={isSaved ? "ghost" : "primary"}
                            size="sm"
                            icon={isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            onClick={() => handleSaveDay(dateStr)}
                            className={cn(
                              "px-5 h-10",
                              isSaved ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5 font-bold" : "font-bold"
                            )}
                          >
                            {isSaved ? "SAVED" : "SAVE DAY LOG"}
                          </GradientButton>
                        )}
                      </div>

                      {/* Sections Grid */}
                      <div className="grid gap-8">
                        <LogRoleSection
                          title="Technical Trainer"
                          name={cohortDetail?.primaryTrainer?.name || (cohortDetail as any)?.trainerName || "Unassigned"}
                          hours={log.technicalTrainer?.hours || 0}
                          notes={log.technicalTrainer?.notes || ""}
                          disabled={isDisabled}
                          onChangeHours={(h) => handleUpdateLog(dateStr, 'technicalTrainer', 'hours', h)}
                          onChangeNotes={(n) => handleUpdateLog(dateStr, 'technicalTrainer', 'notes', n)}
                        />

                        <LogRoleSection
                          title="Behavioral Trainer"
                          name={cohortDetail?.behavioralTrainer?.name || "Unassigned"}
                          hours={log.behavioralTrainer?.hours || 0}
                          notes={log.behavioralTrainer?.notes || ""}
                          disabled={isDisabled}
                          onChangeHours={(h) => handleUpdateLog(dateStr, 'behavioralTrainer', 'hours', h)}
                          onChangeNotes={(n) => handleUpdateLog(dateStr, 'behavioralTrainer', 'notes', n)}
                        />

                        <LogRoleSection
                          title="Primary Mentor"
                          name={cohortDetail?.primaryMentor?.name || "Unassigned"}
                          hours={log.mentor?.hours || 0}
                          notes={log.mentor?.notes || ""}
                          disabled={isDisabled}
                          onChangeHours={(h) => handleUpdateLog(dateStr, 'mentor', 'hours', h)}
                          onChangeNotes={(n) => handleUpdateLog(dateStr, 'mentor', 'notes', n)}
                        />

                        <LogRoleSection
                          title="Buddy Mentor"
                          name={cohortDetail?.buddyMentor?.name || "Unassigned"}
                          hours={log.buddyMentor?.hours || 0}
                          notes={log.buddyMentor?.notes || ""}
                          disabled={isDisabled}
                          onChangeHours={(h) => handleUpdateLog(dateStr, 'buddyMentor', 'hours', h)}
                          onChangeNotes={(n) => handleUpdateLog(dateStr, 'buddyMentor', 'notes', n)}
                        />
                      </div>
                    </GlassCard>
                  );
                })}

                {/* 11. Final Submission UI */}
                {!isWeekCompleted && (
                  <GlassCard className="p-12 text-center bg-gradient-to-br from-primary/10 via-background to-accent/5 border-primary/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                    <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                      <div className="p-5 bg-primary/10 rounded-3xl w-fit mx-auto border border-primary/20 shadow-neon-blue/20">
                        <Send className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-4xl font-black text-foreground tracking-tight">Ready to Finalize Week {selectedWeek?.weekNumber}?</h3>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                          Submitting will lock the current week's records for mandatory training compliance and auditor review.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <GradientButton
                          variant="primary"
                          size="md"
                          className="w-full sm:w-72 font-black shadow-neon-blue transition-all h-12"
                          onClick={handleFinalSubmit}
                          disabled={submitWeeklyMutation.isPending}
                          icon={<Send className="h-4 w-4" />}
                          iconPosition="right"
                        >
                          SUBMIT WEEKLY LOGS
                        </GradientButton>
                      </div>
                      <div className="pt-4 flex items-center justify-center gap-8 text-muted-foreground">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Compliance Secure
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                          <Lock className="h-4 w-4 text-primary" /> Immutable Records
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface LogRoleSectionProps {
  title: string;
  name: string;
  hours: number;
  notes: string;
  disabled: boolean;
  onChangeHours: (val: number) => void;
  onChangeNotes: (val: string) => void;
}

const LogRoleSection = ({ title, name, hours, notes, disabled, onChangeHours, onChangeNotes }: LogRoleSectionProps) => (
  <div className={cn(
    "relative flex flex-col lg:grid lg:grid-cols-[220px,140px,1fr] gap-8 p-8 rounded-[2rem] border transition-all duration-500 group",
    hours > 0
      ? "bg-primary/[0.03] border-primary/20 shadow-[0_10px_40px_-15px_rgba(var(--primary-rgb),0.1)]"
      : "bg-muted/5 border-border/40 hover:border-primary/20 hover:bg-muted/10",
    disabled && "opacity-40 grayscale pointer-events-none"
  )}>
    {/* Decorative corner accent */}
    {hours > 0 && (
      <div className="absolute top-0 right-0 p-3">
        <Sparkles className="h-4 w-4 text-primary/40" />
      </div>
    )}

    <div className="flex flex-col justify-center">
      <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-2">{title}</p>
      <div className="space-y-1">
        <h5 className="text-base font-black text-foreground leading-tight">{name}</h5>
        <div className="flex items-center gap-2">
          <div className={cn("h-1.5 w-1.5 rounded-full", hours > 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-muted-foreground/30")} />
          <p className="text-[10px] font-bold text-muted-foreground uppercase">{hours > 0 ? "Entry Active" : "No Entry"}</p>
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-center">
      <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-3 flex items-center gap-2">
        <Clock className="h-3 w-3" /> Hours (Max 9.0)
      </label>
      <div className="relative group/input">
        <input
          type="number"
          value={hours || ""}
          onChange={(e) => onChangeHours(parseFloat(e.target.value) || 0)}
          className={cn(
            "w-full h-14 bg-background/40 border border-border/40 rounded-2xl px-5 text-lg font-black focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-center placeholder:text-muted-foreground/20",
            hours > 0 && "border-primary/30 text-primary"
          )}
          placeholder="0.0"
          min="0"
          max="9"
          step="0.5"
        />
        {/* Unit indicator */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/30 group-hover/input:text-primary transition-colors">HRS</span>
      </div>
    </div>

    <div className="flex flex-col justify-center">
      <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-3 flex items-center gap-2">
        <Target className="h-3 w-3" /> Work Description
      </label>
      <div className="relative group/textarea">
        <textarea
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          className={cn(
            "w-full h-24 lg:h-20 bg-background/40 border border-border/40 rounded-2xl p-5 text-sm font-bold resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all custom-scrollbar placeholder:text-muted-foreground/30",
            notes.length > 0 && "border-primary/20"
          )}
          placeholder={`Document ${title.toLowerCase()} contributions...`}
        />
        {/* Character count or status */}
        <div className="absolute bottom-3 right-4 opacity-0 group-hover/textarea:opacity-100 transition-opacity">
          <div className="p-1 rounded bg-primary/10 border border-primary/20">
            <Check className="h-3 w-3 text-primary" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
