  import { useState } from 'react';
  import { useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import {
    Users,
    Search,
    Plus,
    Mail,
    Phone,
    MapPin,
    Shield,
    Edit2,
    Trash2,
    UserPlus,
    User,
    Award,
  } from 'lucide-react';
  import { GlassCard } from '@/components/ui/GlassCard';
  import { GradientButton } from '@/components/ui/GradientButton';
  import { ActionMenu } from '@/components/ui/ActionMenu';
  import { AddUserModal } from '@/components/modals/AddUserModal';
  import { useUsers, useCreateUser, useDeleteUser, useUpdateUser} from '@/hooks/useUsers';
  import { useAuthStore } from '@/stores/authStore';
  import { toast } from 'sonner';

  export const Coaches = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'coaches' | 'admins'>('coaches');
    const [showAddUser, setShowAddUser] = useState(false);
    const [addUserType, setAddUserType] = useState<'coach' | 'admin'>('coach');
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const { user } = useAuthStore();
    const isAdmin = user?.role === 'ADMIN';

    // Use backend data only
    const { data: users = [], isLoading: loadingUsers, error: usersError } = useUsers();
    const createUser = useCreateUser();
    const deleteUser = useDeleteUser();
    const updateUser = useUpdateUser();


    // Debug logging
    console.log('Coaches page - User:', user);
    console.log('Coaches page - Is Admin:', isAdmin);
    console.log('Coaches page - Users data:', users);
    console.log('Coaches page - Users error:', usersError);
    console.log('Coaches page - Loading:', loadingUsers);

    // Separate coaches and admins from DB data
    const coaches = users.filter(u => u.role === 'COACH');
    const admins = users.filter(u => u.role === 'ADMIN');

    const filteredCoaches = coaches.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.empId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredAdmins = admins.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.empId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddUser = (data: any) => {
      createUser.mutate({
        empId: data.empId,
        name: data.name,
        email: data.email,
        role: addUserType === 'coach' ? 'COACH' : 'ADMIN',
        employeeType: data.employeeType,
        location: data.location,
        password: data.password,
      }, {
        onSuccess: () => {
          setShowAddUser(false);
          toast.success(`${addUserType === 'coach' ? 'Coach' : 'Admin'} added successfully`);
        },
      });
    };

    const handleEdit = (user: any) => {
      setEditingUser(user);
      setAddUserType(user.role === 'ADMIN' ? 'admin' : 'coach');
      setShowAddUser(true);
    };


    const handleDelete = (user: any) => {
      if (confirm(`Are you sure you want to remove ${user.name}?`)) {
        deleteUser.mutate(user.id);
      }
    };

    const handleUpdateUser = (data: any) => {
  updateUser.mutate(
    {
      id: editingUser.id,
      ...data, // Role should not be changed in edit
    },
    {
      onSuccess: () => {
        setShowAddUser(false);
        setEditingUser(null);
        toast.success('User updated successfully');
      },
    }
  );
};

    return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="mt-2 text-muted-foreground">
              Manage coaches and administrators
            </p>
          </div>
          <div className="flex gap-3">
            <GradientButton
              variant="outline"
              icon={<Shield className="h-4 w-4" />}
              onClick={() => {
                setAddUserType('admin');
                setShowAddUser(true);
              }}
            >
              Add Admin
            </GradientButton>
            <GradientButton
              variant="primary"
              icon={<UserPlus className="h-4 w-4" />}
              onClick={() => {
                setAddUserType('coach');
                setShowAddUser(true);
              }}
            >
              Add Coach
            </GradientButton>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4"
        >
          <button
            onClick={() => setActiveTab('coaches')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'coaches'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Coaches ({filteredCoaches.length})
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'admins'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Administrators ({filteredAdmins.length})
          </button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or location..."
              className="input-premium w-full pl-12"
            />
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'coaches' ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredCoaches.map((coach, index) => (
                <motion.div
                  key={coach.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <GlassCard variant="hover" glow="cyan" className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-neon-blue/30 text-xl font-bold text-primary">
                          {coach.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{coach.name}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Shield className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium text-primary">Coach</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              coach.employeeType === 'INTERNAL' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {coach.employeeType}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              coach.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {coach.status || 'ACTIVE'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ActionMenu
                        onEdit={() => handleEdit(coach)}
                        onDelete={() => handleDelete(coach)}
                      />
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {coach.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {coach.empId}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        {coach.employeeType}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {coach.location ?? 'Bangalore'}
                      </div>
                      {/* {coach.skill && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-4 w-4" />
                          {coach.skill}
                        </div>
                      )} */}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                      <span className="text-sm text-muted-foreground">Assigned Cohorts</span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {coach.assignedCohorts || 0}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredAdmins.map((admin, index) => (
                <motion.div
                  key={admin.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <GlassCard variant="hover" glow="violet" className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-secondary/30 to-neon-purple/30 text-xl font-bold text-secondary">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{admin.name}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Shield className="h-3 w-3 text-secondary" />
                            <span className="text-xs font-medium text-secondary">Administrator</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              admin.employeeType === 'INTERNAL' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {admin.employeeType}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              admin.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {admin.status || 'ACTIVE'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ActionMenu
                        onEdit={() => handleEdit(admin)}
                        onDelete={() => handleDelete(admin)}
                      />
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {admin.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {admin.empId}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        {admin.employeeType}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {admin.location ?? 'Bangalore'}
                      </div>
                      {/* {admin.skill && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-4 w-4" />
                          {admin.skill}
                        </div>
                      )} */}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                      <span className="text-sm text-muted-foreground">Assigned Cohorts</span>
                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                        {admin.assignedCohorts || 0}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add User Modal */}
        <AddUserModal
  isOpen={showAddUser}
  onClose={() => {
    setShowAddUser(false);
    setEditingUser(null);
  }}
  onSubmit={editingUser ? handleUpdateUser : handleAddUser}
  userType={addUserType}
  isEdit={!!editingUser}
  defaultValues={editingUser}
/>


      </div>
    );
  };