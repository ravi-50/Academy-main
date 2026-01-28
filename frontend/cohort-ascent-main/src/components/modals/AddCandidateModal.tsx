import { useEffect } from 'react';
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
import { GradientButton } from '@/components/ui/GradientButton';

const candidateSchema = z.object({
  candidate_id: z.string().min(1, 'Candidate ID is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  skill: z.string().min(1, 'Skill is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['active', 'inactive', 'completed']),
  join_date: z.string().optional(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CandidateFormData) => void;
  cohortId: string;
  isLoading?: boolean;
  initialData?: Partial<CandidateFormData>;
  mode?: 'add' | 'edit';
}

export const AddCandidateModal = ({
  isOpen,
  onClose,
  onSubmit,
  cohortId,
  isLoading,
  initialData,
  mode = 'add',
}: AddCandidateModalProps) => {
  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      candidate_id: initialData?.candidate_id || '',
      name: initialData?.name || '',
      email: initialData?.email || '',
      skill: initialData?.skill || '',
      location: initialData?.location || '',
      status: initialData?.status || 'active',
      join_date: initialData?.join_date || new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        candidate_id: initialData?.candidate_id || '',
        name: initialData?.name || '',
        email: initialData?.email || '',
        skill: initialData?.skill || '',
        location: initialData?.location || '',
        status: initialData?.status || 'active',
        join_date: initialData?.join_date || new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = (data: CandidateFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === 'add' ? 'Add Candidate' : 'Edit Candidate'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="candidate_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate ID</FormLabel>
                    <FormControl>
                      <Input placeholder="GC-2024-001" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill / Technology</FormLabel>
                    <FormControl>
                      <Input placeholder="React, Node.js" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Bangalore" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select {...field} className="input-premium w-full">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="join_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <GradientButton type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </GradientButton>
              <GradientButton type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : mode === 'add' ? 'Add Candidate' : 'Save Changes'}
              </GradientButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};