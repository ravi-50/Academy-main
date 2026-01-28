import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MapPin, Users } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { useToast } from '@/hooks/use-toast';
import { effortApi, EffortSubmission } from '@/effortApi';
import { cohortApi, Cohort } from '@/cohortApi';
import { generateCalendarWeeks, WeekOption } from '@/utils/weekGenerator';

const effortSchema = z.object({
  cohortId: z.number().min(1, 'Please select a cohort'),
  trainerMentorId: z.number().min(1, 'Please select a trainer/mentor'),
  role: z.enum(['TRAINER', 'MENTOR', 'BUDDY_MENTOR', 'BH_TRAINER']),
  mode: z.enum(['VIRTUAL', 'IN_PERSON']),
  reasonVirtual: z.string().optional(),
  areaOfWork: z.string().min(1, 'Area of work is required'),
  effortHours: z.number().min(0.5, 'Minimum 0.5 hours').max(24, 'Maximum 24 hours'),
  weekStartDate: z.string().min(1, 'Please select a week'),
});

type EffortFormData = z.infer<typeof effortSchema>;

export const EffortForm = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [weekOptions, setWeekOptions] = useState<WeekOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EffortFormData>({
    resolver: zodResolver(effortSchema),
  });

  const selectedCohortId = watch('cohortId');
  const selectedMode = watch('mode');

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
    if (selectedCohortId) {
      const cohort = cohorts.find(c => c.id === selectedCohortId);
      setSelectedCohort(cohort || null);

      if (cohort) {
        const weeks = generateCalendarWeeks(new Date(cohort.startDate), new Date(cohort.endDate));
        setWeekOptions(weeks);
      }
    }
  }, [selectedCohortId, cohorts]);

  const onSubmit = async (data: EffortFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const selectedWeek = weekOptions.find(w => w.value === data.weekStartDate);
      if (!selectedWeek) {
        throw new Error('Invalid week selected');
      }

      const effortData: EffortSubmission = {
        cohortId: data.cohortId,
        trainerMentorId: data.trainerMentorId,
        role: data.role,
        mode: data.mode,
        reasonVirtual: data.reasonVirtual,
        areaOfWork: data.areaOfWork,
        effortHours: data.effortHours,
        effortDate: selectedWeek.startDate.toISOString().split('T')[0],
      };

      await effortApi.submitEffort(effortData);

      toast({
        title: 'Success',
        description: 'Effort submitted successfully',
      });

      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit effort',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = user?.role === 'COACH' || user?.role === 'LOCATION_LEAD';

  if (!canSubmit) {
    return (
      <GlassCard className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Only Coaches and Location Leads can submit efforts.
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
      className="max-w-2xl mx-auto"
    >
      <GlassCard className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Submit Daily Effort</h1>
          <p className="text-muted-foreground mt-2">
            Record your training efforts for the selected cohort and week.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cohort Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cohort
            </label>
            <select
              {...register('cohortId', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a cohort</option>
              {cohorts.map(cohort => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.code} - {cohort.skill} ({cohort.trainingLocation})
                </option>
              ))}
            </select>
            {errors.cohortId && (
              <p className="text-sm text-destructive mt-1">{errors.cohortId.message}</p>
            )}
          </div>

          {/* Week Selection */}
          {selectedCohort && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Week
              </label>
              <select
                {...register('weekStartDate')}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a week</option>
                {weekOptions.map(week => (
                  <option key={week.value} value={week.value}>
                    {week.label}
                  </option>
                ))}
              </select>
              {errors.weekStartDate && (
                <p className="text-sm text-destructive mt-1">{errors.weekStartDate.message}</p>
              )}
            </div>
          )}

          {/* Trainer/Mentor Selection */}
          {selectedCohort && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Trainer/Mentor
              </label>
              <select
                {...register('trainerMentorId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select trainer/mentor</option>
                {/* This would need to be populated with actual users */}
                <option value={user.id}>{user.name} (You)</option>
              </select>
              {errors.trainerMentorId && (
                <p className="text-sm text-destructive mt-1">{errors.trainerMentorId.message}</p>
              )}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              {...register('role')}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select role</option>
              <option value="TRAINER">Trainer</option>
              <option value="MENTOR">Mentor</option>
              <option value="BUDDY_MENTOR">Buddy Mentor</option>
              <option value="BH_TRAINER">BH Trainer</option>
            </select>
            {errors.role && (
              <p className="text-sm text-destructive mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Training Mode
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="VIRTUAL"
                  {...register('mode')}
                  className="mr-2"
                />
                Virtual
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="IN_PERSON"
                  {...register('mode')}
                  className="mr-2"
                />
                In-Person
              </label>
            </div>
            {errors.mode && (
              <p className="text-sm text-destructive mt-1">{errors.mode.message}</p>
            )}
          </div>

          {/* Reason for Virtual (conditional) */}
          {selectedMode === 'VIRTUAL' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason for Virtual Training
              </label>
              <textarea
                {...register('reasonVirtual')}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Please explain why this training was conducted virtually..."
              />
            </div>
          )}

          {/* Area of Work */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Area of Work
            </label>
            <input
              type="text"
              {...register('areaOfWork')}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Java Programming, Database Design, Testing..."
            />
            {errors.areaOfWork && (
              <p className="text-sm text-destructive mt-1">{errors.areaOfWork.message}</p>
            )}
          </div>

          {/* Effort Hours */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Effort Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              {...register('effortHours', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 4.5"
            />
            {errors.effortHours && (
              <p className="text-sm text-destructive mt-1">{errors.effortHours.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <GradientButton
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Effort'}
          </GradientButton>
        </form>
      </GlassCard>
    </motion.div>
  );
};