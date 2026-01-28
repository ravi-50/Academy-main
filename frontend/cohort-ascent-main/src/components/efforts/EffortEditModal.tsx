import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/GradientButton';
import { DailyEffortDB } from '@/hooks/useDailyEfforts';
import { useEffect } from 'react';

const effortSchema = z.object({
  stakeholder_name: z.string().min(1, 'Stakeholder name is required'),
  stakeholder_type: z.string().min(1, 'Stakeholder type is required'),
  date: z.string().min(1, 'Date is required'),
  mode_of_training: z.string().min(1, 'Mode is required'),
  virtual_reason: z.string().optional(),
  area_of_work: z.string().min(1, 'Area of work is required'),
  effort_hours: z.number().min(0).max(24),
  session_start_time: z.string().optional(),
  session_end_time: z.string().optional(),
  active_genc_count: z.number().optional(),
  notes: z.string().optional(),
});

type EffortFormData = z.infer<typeof effortSchema>;

interface EffortEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DailyEffortDB> & { id: string }) => void;
  effort: DailyEffortDB | null;
  isLoading?: boolean;
}

export const EffortEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  effort,
  isLoading,
}: EffortEditModalProps) => {
  const form = useForm<EffortFormData>({
    resolver: zodResolver(effortSchema),
    defaultValues: {
      stakeholder_name: '',
      stakeholder_type: '',
      date: '',
      mode_of_training: 'in-person',
      virtual_reason: '',
      area_of_work: '',
      effort_hours: 0,
      session_start_time: '',
      session_end_time: '',
      active_genc_count: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (effort) {
      form.reset({
        stakeholder_name: effort.stakeholder_name,
        stakeholder_type: effort.stakeholder_type,
        date: effort.date,
        mode_of_training: effort.mode_of_training,
        virtual_reason: effort.virtual_reason || '',
        area_of_work: effort.area_of_work,
        effort_hours: Number(effort.effort_hours),
        session_start_time: effort.session_start_time || '',
        session_end_time: effort.session_end_time || '',
        active_genc_count: effort.active_genc_count || undefined,
        notes: effort.notes || '',
      });
    }
  }, [effort, form]);

  const handleSubmit = (data: EffortFormData) => {
    if (!effort) return;
    onSubmit({
      id: effort.id,
      ...data,
      virtual_reason: data.virtual_reason || null,
      session_start_time: data.session_start_time || null,
      session_end_time: data.session_end_time || null,
      active_genc_count: data.active_genc_count || null,
      notes: data.notes || null,
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const mode = form.watch('mode_of_training');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg border-border/50 bg-background/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Effort Entry</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="stakeholder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stakeholder Name</FormLabel>
                    <FormControl>
                      <Input className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stakeholder_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stakeholder Type</FormLabel>
                    <FormControl>
                      <select {...field} className="input-premium w-full">
                        <option value="Technical Trainer">Technical Trainer</option>
                        <option value="Behavioral Trainer">Behavioral Trainer</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Buddy Mentor">Buddy Mentor</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="effort_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effort Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.5"
                        min="0"
                        max="24"
                        className="input-premium" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="session_start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="session_end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode_of_training"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode of Training</FormLabel>
                    <FormControl>
                      <select {...field} className="input-premium w-full">
                        <option value="in-person">In-Person</option>
                        <option value="virtual">Virtual</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active_genc_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active GenC Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="input-premium" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {mode === 'virtual' && (
              <FormField
                control={form.control}
                name="virtual_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Virtual</FormLabel>
                    <FormControl>
                      <Input className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="area_of_work"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area of Work</FormLabel>
                  <FormControl>
                    <Textarea className="input-premium min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea className="input-premium min-h-[60px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <GradientButton type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </GradientButton>
              <GradientButton type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </GradientButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};