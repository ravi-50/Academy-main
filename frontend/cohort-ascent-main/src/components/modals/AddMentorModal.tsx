import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Briefcase, Upload } from 'lucide-react';
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

const mentorSchema = z.object({
  emp_id: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  type: z.enum(['mentor', 'buddy']),
  is_internal: z.boolean(),
  skill: z.string().min(1, 'Skill is required'),
  training_start_date: z.string().optional(),
  training_end_date: z.string().optional(),
});

type MentorFormData = z.infer<typeof mentorSchema>;

interface AddMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  cohortId?: string;
  isLoading?: boolean;
  mode?: 'add' | 'edit';
  initialData?: any;
}

export const AddMentorModal = ({
  isOpen,
  onClose,
  onSubmit,
  cohortId,
  isLoading,
  mode = 'add',
  initialData,
}: AddMentorModalProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<MentorFormData>({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      emp_id: '',
      name: '',
      email: '',
      phone: '',
      type: 'mentor',
      is_internal: true,
      skill: '',
      training_start_date: '',
      training_end_date: '',
    },
  });

  useEffect(() => {
    if (initialData && isOpen) {
      form.reset({
        ...initialData,
        training_start_date: initialData.training_start_date || '',
        training_end_date: initialData.training_end_date || '',
      });
      setAvatarPreview(initialData.avatar_url || null);
    } else if (!isOpen) {
      form.reset();
      setAvatarPreview(null);
    }
  }, [initialData, isOpen, form]);

  const handleSubmit = (data: MentorFormData) => {
    onSubmit({
      ...data,
      avatar_url: avatarPreview || undefined,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    form.reset();
    setAvatarPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === 'edit' ? 'Edit Mentor' : 'Add Mentor'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <label className="group relative cursor-pointer">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/30 transition-all group-hover:border-primary">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <span className="mt-2 block text-center text-xs text-muted-foreground">
                  {avatarPreview ? 'Change Photo' : 'Upload Photo'}
                </span>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="emp_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP-001" className="input-premium" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentor Type</FormLabel>
                    <FormControl>
                      <select {...field} className="input-premium w-full">
                        <option value="mentor">Mentor</option>
                        <option value="buddy">Buddy Mentor</option>
                      </select>
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
                    <FormLabel>Skill / Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="Architecture, DevOps" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_internal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Type</FormLabel>
                    <FormControl>
                      <select
                        value={field.value ? 'internal' : 'external'}
                        onChange={(e) => field.onChange(e.target.value === 'internal')}
                        className="input-premium w-full"
                      >
                        <option value="internal">Internal</option>
                        <option value="external">External</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="training_start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="training_end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
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
                {isLoading ? (mode === 'edit' ? 'Saving...' : 'Adding...') : (mode === 'edit' ? 'Save Changes' : 'Add Mentor')}
              </GradientButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};