import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
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

const userSchema = z.object({
  empId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  employeeType: z.enum(['INTERNAL', 'EXTERNAL'], {
    required_error: 'Employee type is required',
  }),
  location: z.string().min(1, 'Location is required'),
  password: z.string().optional(),
});


type UserFormData = z.infer<typeof userSchema>;

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  userType: 'coach' | 'admin';
  isLoading?: boolean;
  defaultValues?: Partial<UserFormData>;
  isEdit?: boolean;
}


export const AddUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  userType,
  isLoading,
  defaultValues,
  isEdit,
}: AddUserModalProps) => {
  const form = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
  defaultValues: {
    empId: defaultValues?.empId || '',
    name: defaultValues?.name || '',
    email: defaultValues?.email || '',
    employeeType: defaultValues?.employeeType || 'INTERNAL',
    location: defaultValues?.location || '',
    password: '',
  },
});

useEffect(() => {
  if (defaultValues) {
    form.reset({
      empId: defaultValues.empId || '',
      name: defaultValues.name || '',
      email: defaultValues.email || '',
      employeeType: defaultValues.employeeType || 'INTERNAL',
      location: defaultValues.location || '',
      password: '',
    });
  }
}, [defaultValues, form]);



const handleSubmit = (data: UserFormData) => {
  // Enforce password requirement ONLY when adding
  if (!isEdit && (!data.password || data.password.length < 6)) {
    form.setError('password', {
      type: 'manual',
      message: 'Password must be at least 6 characters',
    });
    return;
  }

  const payload: any = {
    empId: data.empId,
    name: data.name,
    email: data.email,
    employeeType: data.employeeType,
    location: data.location,
  };

  // Only send password if creating
  if (!isEdit) {
    payload.password = data.password;
  }

  onSubmit(payload);
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
            {isEdit ? 'Edit' : 'Add'} {userType === 'coach' ? 'Coach' : 'Administrator'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="empId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP001" className="input-premium" {...field} />
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
                      <Input placeholder="User name" className="input-premium" {...field} />
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
                      <Input type="email" placeholder="emp@cognizant.com" className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Type</FormLabel>
                    <FormControl>
                      <select {...field} className="input-premium w-full">
                        <option value="INTERNAL">Internal</option>
                        <option value="EXTERNAL">External</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Java, React, etc." className="input-premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <select {...field} className="input-premium w-full">
                        <option value="">Select location...</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEdit && (
  <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem className="sm:col-span-2">
        <FormLabel>Initial Password</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="••••••••"
            className="input-premium"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)}

            </div>

            <div className="flex justify-end gap-3 pt-4">
              <GradientButton type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </GradientButton>
              <GradientButton type="submit" variant="primary" disabled={isLoading}>
                {isLoading
  ? isEdit ? 'Updating...' : 'Adding...'
  : `${isEdit ? 'Update' : 'Add'} ${userType === 'coach' ? 'Coach' : 'Admin'}`}
              </GradientButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};