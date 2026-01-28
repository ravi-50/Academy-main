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
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { useCohorts, useCohort } from '@/hooks/useCohortsBackend';
import { useSubmitWeeklyEffort, useWeeklySummaries, useEffortsByCohortAndRange } from '@/hooks/useEffortsBackend';
import { generateCalendarWeeks } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, isAfter, isSameDay, startOfToday, eachDayOfInterval, addDays, isBefore } from 'date-fns';
import { DayLog } from '@/effortApi';

export const DailyEfforts = () => {
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [localDayLogs, setLocalDayLogs] = useState<Record<string, DayLog>>({});

  const { data: cohorts = [] } = useCohorts();
  const { data: cohortDetail } = useCohort(selectedCohortId || 0);
  const submitWeekly = useSubmitWeeklyEffort();

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

    // Default to current week if possible
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

  // Initialize local day logs from existing efforts or defaults
  useEffect(() => {
    if (selectedWeek) {
      const days = eachDayOfInterval({
        start: selectedWeek.startDate,
        end: addDays(selectedWeek.startDate, 4), // Mon-Fri
      });

      const initialLogs: Record<string, DayLog> = {};
      days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayEfforts = existingEfforts.filter(e => e.effortDate === dateStr);

        initialLogs[dateStr] = {
          date: dateStr,
          isHoliday: false,
          trainer: {
            hours: dayEfforts.find(e => e.role === 'TRAINER')?.effortHours || 0,
            notes: dayEfforts.find(e => e.role === 'TRAINER')?.areaOfWork || '',
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
      });
      setLocalDayLogs(initialLogs);
    }
  }, [selectedWeek, existingEfforts]);

  const handleUpdateLog = (date: string, role: 'trainer' | 'mentor' | 'buddyMentor', field: 'hours' | 'notes', value: any) => {
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
  };

  const handleSaveWeek = () => {
    if (!selectedCohortId || !selectedWeek) return;

    const dayLogsList = Object.values(localDayLogs);
    submitWeekly.mutate({
      cohortId: selectedCohortId,
      weekStartDate: format(selectedWeek.startDate, 'yyyy-MM-dd'),
      weekEndDate: format(selectedWeek.endDate, 'yyyy-MM-dd'),
      dayLogs: dayLogsList,
    });
  };

  if (!selectedCohortId) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-neon-blue/20">
            <Calendar className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Effort Logging</h1>
          <p className="mt-4 text-lg text-muted-foreground">Select a cohort to begin logging weekly efforts</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cohorts.map((cohort, index) => (
            <motion.div
              key={cohort.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard
                variant="hover"
                glow="cyan"
                className="cursor-pointer p-8 h-full flex flex-col justify-between"
                onClick={() => setSelectedCohortId(cohort.id)}
              >
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{cohort.code}</h3>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{cohort.skill}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{cohort.trainingLocation}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end text-primary font-semibold group">
                  Select Cohort <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-card/40 p-6 rounded-2xl border border-border/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedCohortId(null)}
            className="rounded-full p-3 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{cohortDetail?.code}</h1>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {showHistory ? "Viewing History" : `Logging Week ${selectedWeek?.weekNumber || 1} of ${calendarWeeks.length}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <GradientButton
            variant="ghost"
            className="flex-1 sm:flex-none"
            icon={<History className="h-4 w-4" />}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Back to Logging" : "Log History"}
          </GradientButton>
          {!showHistory && (
            <GradientButton
              variant="primary"
              className="px-8 flex-1 sm:flex-none shadow-neon-blue"
              icon={<Send className="h-4 w-4" />}
              onClick={handleSaveWeek}
              disabled={submitWeekly.isPending}
            >
              Submit Week
            </GradientButton>
          )}
        </div>
      </div>

      {/* Week Selector Section (Natural Scrollable Horizontal List) */}
      {!showHistory && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Week</h3>
            <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">Mon - Fri Logs</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {calendarWeeks.map((week) => {
              const weekStartStr = format(week.startDate, 'yyyy-MM-dd');
              const isCompleted = weeklySummaries.some(s => s.weekStartDate === weekStartStr);
              const today = startOfToday();
              const isActive = (isSameDay(today, week.startDate) || isAfter(today, week.startDate)) && (isSameDay(today, week.endDate) || isBefore(today, week.endDate));
              const isLocked = isAfter(week.startDate, today);
              const isSelected = selectedWeek?.id === week.id;

              return (
                <button
                  key={week.id}
                  disabled={isLocked && !isCompleted}
                  onClick={() => setSelectedWeekId(week.id)}
                  className={cn(
                    "flex-shrink-0 snap-center min-w-[140px] rounded-xl p-4 text-left transition-all border",
                    isSelected ? "bg-primary/20 border-primary/50 shadow-neon-cyan" : "bg-card/40 border-border/50 hover:bg-muted/30",
                    isLocked && !isCompleted && "opacity-40 cursor-not-allowed grayscale"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground">Week {week.weekNumber}</span>
                    {isCompleted && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium">
                    {format(week.startDate, 'MMM dd')} - {format(week.endDate, 'MMM dd')}
                  </div>
                  {isActive && !isCompleted && <div className="mt-2 h-1 w-full bg-primary/30 rounded-full overflow-hidden"><div className="h-full bg-primary animate-progress-glow" style={{ width: '60%' }} /></div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area (Naturally Scrollable) */}
      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <History className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Submission History</h3>
            </div>
            {weeklySummaries.length === 0 ? (
              <GlassCard className="p-12 text-center bg-card/20">
                <History className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg text-muted-foreground font-medium">No submission history found for this cohort.</p>
              </GlassCard>
            ) : (
              <div className="grid gap-4">
                {weeklySummaries.sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate)).map((summary) => {
                  const weekNum = calendarWeeks.find(w => format(w.startDate, 'yyyy-MM-dd') === summary.weekStartDate)?.weekNumber;
                  return (
                    <GlassCard key={summary.id} className="p-6 border-l-4 border-l-primary/50 group hover:shadow-neon-blue transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-xl font-bold text-foreground">Week {weekNum || '?'}</h4>
                            <span className="badge-active bg-success/20 text-success text-[10px] uppercase font-bold tracking-tighter">Verified</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(summary.weekStartDate), 'MMM dd')} - {format(new Date(summary.weekEndDate), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto p-4 bg-muted/20 rounded-xl border border-border/50">
                          <p className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">{summary.totalHours} <span className="text-sm font-bold text-muted-foreground">hrs</span></p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Submitted: {format(new Date(summary.summaryDate), 'MMM dd, HH:mm')}</p>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={selectedWeek?.id || 'empty'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {selectedWeek && eachDayOfInterval({
              start: selectedWeek.startDate,
              end: addDays(selectedWeek.startDate, 4), // Mon-Fri
            }).map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const log = localDayLogs[dateStr] || { trainer: { hours: 0, notes: '' }, mentor: { hours: 0, notes: '' }, buddyMentor: { hours: 0, notes: '' } };
              const today = startOfToday();
              const isFuture = isAfter(day, today);
              const isToday = isSameDay(day, today);

              return (
                <GlassCard
                  key={dateStr}
                  className={cn(
                    "p-8 transition-all relative group",
                    isFuture && "opacity-60 saturate-50",
                    isToday && "border-primary/40 ring-1 ring-primary/20"
                  )}
                  glow={isToday ? "cyan" : "none"}
                >
                  {isToday && <div className="absolute top-0 right-0 py-1 px-4 bg-primary text-[10px] font-black uppercase text-primary-foreground rounded-bl-xl shadow-lg">Today's Log</div>}

                  <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h4 className="text-3xl font-black text-foreground tracking-tight">
                        {format(day, 'EEEE')}
                      </h4>
                      <p className="text-lg text-muted-foreground font-medium">
                        {format(day, 'MMMM dd, yyyy')}
                      </p>
                    </div>
                    {isFuture && (
                      <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-xs font-bold text-muted-foreground border border-border/50">
                        <Lock className="h-4 w-4" />
                        <span>Day Not Started</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <LogEntrySection
                      title="Primary Trainer"
                      name={cohortDetail?.primaryTrainer?.name || "Unassigned"}
                      hours={log.trainer.hours}
                      notes={log.trainer.notes}
                      disabled={isFuture}
                      onChangeHours={(h) => handleUpdateLog(dateStr, 'trainer', 'hours', h)}
                      onChangeNotes={(n) => handleUpdateLog(dateStr, 'trainer', 'notes', n)}
                    />
                    <LogEntrySection
                      title="Primary Mentor"
                      name={cohortDetail?.primaryMentor?.name || "Unassigned"}
                      hours={log.mentor.hours}
                      notes={log.mentor.notes}
                      disabled={isFuture}
                      onChangeHours={(h) => handleUpdateLog(dateStr, 'mentor', 'hours', h)}
                      onChangeNotes={(n) => handleUpdateLog(dateStr, 'mentor', 'notes', n)}
                    />
                    <LogEntrySection
                      title="Buddy Mentor"
                      name={cohortDetail?.buddyMentor?.name || "Unassigned"}
                      hours={log.buddyMentor.hours}
                      notes={log.buddyMentor.notes}
                      disabled={isFuture}
                      onChangeHours={(h) => handleUpdateLog(dateStr, 'buddyMentor', 'hours', h)}
                      onChangeNotes={(n) => handleUpdateLog(dateStr, 'buddyMentor', 'notes', n)}
                    />
                  </div>

                  <div className="mt-10 pt-6 border-t border-border/30 flex justify-end">
                    <GradientButton
                      variant="ghost"
                      size="sm"
                      disabled={isFuture}
                      className="text-xs group"
                      icon={<Save className="h-4 w-4 group-hover:scale-125 transition-transform" />}
                      onClick={() => toast.success(`Staged logs for ${format(day, 'EEEE')}`)}
                    >
                      Save Draft for this Day
                    </GradientButton>
                  </div>
                </GlassCard>
              );
            })}

            {/* Final Submission Card at the bottom of the list */}
            <GlassCard className="p-8 text-center bg-gradient-to-br from-primary/5 to-neon-blue/5 border-primary/20">
              <Send className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground">Finalize Week {selectedWeek?.weekNumber}</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Ensure all Monday to Friday efforts are capped at 8 hours per day before final submission.
              </p>
              <div className="mt-8 flex justify-center">
                <GradientButton
                  variant="primary"
                  size="lg"
                  className="px-12 py-6 text-xl shadow-neon-blue"
                  icon={<Send className="h-6 w-6" />}
                  onClick={handleSaveWeek}
                  disabled={submitWeekly.isPending}
                >
                  Submit All Daily Logs
                </GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface LogEntrySectionProps {
  title: string;
  name: string;
  hours: number;
  notes: string;
  disabled: boolean;
  onChangeHours: (val: number) => void;
  onChangeNotes: (val: string) => void;
}

const LogEntrySection = ({ title, name, hours, notes, disabled, onChangeHours, onChangeNotes }: LogEntrySectionProps) => (
  <div className="flex flex-col lg:flex-row gap-6 p-6 rounded-2xl bg-muted/10 border border-border/30 hover:border-primary/20 transition-all">
    <div className="lg:w-1/4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{title}</span>
        {hours > 0 && <CheckCircle2 className="h-3 w-3 text-success" />}
      </div>
      <p className="text-lg font-bold text-foreground truncate">{name}</p>
    </div>

    <div className="lg:w-48">
      <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-tight">Daily Hours</label>
      <div className="relative">
        <input
          type="number"
          value={hours || ""}
          disabled={disabled}
          onChange={(e) => onChangeHours(parseFloat(e.target.value) || 0)}
          className="input-premium w-full bg-background/50 pr-8 text-lg font-black"
          placeholder="0.0"
          min="0"
          max="24"
          step="0.5"
        />
        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>

    <div className="flex-1">
      <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-tight">Detailed Progress / Work Description</label>
      <textarea
        value={notes}
        disabled={disabled}
        onChange={(e) => onChangeNotes(e.target.value)}
        className="input-premium w-full h-[88px] bg-background/50 py-3 text-sm resize-none leading-relaxed"
        placeholder="E.g., Covered Spring Security, handled doubt sessions..."
      />
    </div>
  </div>
);