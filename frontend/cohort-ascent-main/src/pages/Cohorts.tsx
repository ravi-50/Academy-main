import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Plus,
  MapPin,
  Users,
  Calendar,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import { useCohortStore, Cohort } from '@/stores/cohortStore';
import { useAuthStore } from '@/stores/authStore';
import { useCohorts, useCreateCohort, useDeleteCohort } from '@/hooks/useCohortsBackend';
import { useActiveCoaches } from '@/hooks/useCoachesBackend';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { AddCohortModal } from '@/components/modals/AddCohortModal';
import { toast } from 'sonner';

const statusConfig = {
  active: { label: 'Active', class: 'badge-active' },
  completed: { label: 'Completed', class: 'bg-muted text-muted-foreground' },
  upcoming: { label: 'Upcoming', class: 'badge-pending' },
};

export const Cohorts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showAddCohort, setShowAddCohort] = useState(false);
  const { cohorts: mockCohorts } = useCohortStore();
  const { data: dbCohorts = [] } = useCohorts();
  const createCohort = useCreateCohort();
  const deleteCohort = useDeleteCohort();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  // Use DB cohorts if available, otherwise mock
  const cohorts = dbCohorts.length > 0
    ? dbCohorts.map((c: any) => ({
        id: c.id.toString(),
        code: c.code,
        name: c.code, // Using code as name since backend doesn't have name field
        bu: c.bu,
        skill: c.skill,
        location: c.trainingLocation,
        startDate: c.startDate,
        endDate: c.endDate,
        status: 'active' as 'active' | 'upcoming' | 'completed', // Default to active
        candidateCount: c.activeGencCount,
        progress: c.progress || 0, // Backend doesn't have progress field
        coachId: c.coach?.id?.toString() || '',
        coachName: c.coach?.name || 'Unassigned',
        trainers: [],
        mentors: [],
      }))
    : mockCohorts;

  const locations = [...new Set(cohorts.map((c) => c.location))];

  const { 
  data: activeCoaches = [], 
  isLoading: loadingCoaches,
  isError: coachError 
} = useActiveCoaches();
if (coachError) {
  toast.error('Failed to load active coaches');
}


  const filteredCohorts = cohorts.filter((cohort) => {
    const matchesSearch =
      cohort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cohort.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cohort.skill.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cohort.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || cohort.location === locationFilter;
    const matchesRole = isAdmin || cohort.coachId === user?.id?.toString();
    return matchesSearch && matchesStatus && matchesLocation && matchesRole;
  });

  const handleCreateCohort = (data: any) => {
    console.log('Submitting cohort:', data);
    createCohort.mutate({
      code: data.code,
      bu: data.bu,
      skill: data.skill,
      activeGencCount: 0,
      trainingLocation: data.location,
      startDate: data.start_date,
      endDate: data.end_date || null,
      coachId: data.coachId ? Number(data.coachId) : null,
      primaryTrainerId: null, // or another dropdown later
    }, {
      onSuccess: () => {
        setShowAddCohort(false);
        toast.success('Cohort created successfully');
      },
    });
  };

  const handleEditCohort = (cohort: any) => {
    toast.info(`Edit cohort: ${cohort.name}`);
  };

  const handleDeleteCohort = (cohort: any) => {
    if (confirm(`Are you sure you want to delete ${cohort.name}?`)) {
      if (dbCohorts.length > 0) {
        deleteCohort.mutate(cohort.id);
      } else {
        toast.info('Cannot delete mock data');
      }
    }
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
          <h1 className="text-3xl font-bold text-foreground">Cohorts</h1>
          <p className="mt-2 text-muted-foreground">
            {isAdmin
              ? 'Manage all training cohorts across locations'
              : 'Your assigned cohort programs'}
          </p>
        </div>
        {/* Only show New Cohort button for admins */}
        {isAdmin && (
          <GradientButton
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
            onClick={() => setShowAddCohort(true)}
          >
            New Cohort
          </GradientButton>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cohorts by name, code, or skill..."
            className="input-premium w-full pl-12"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-premium appearance-none pr-10"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="relative">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input-premium appearance-none pr-10"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Cohorts Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredCohorts.map((cohort, index) => (
            <CohortCard
              key={cohort.id}
              cohort={cohort}
              index={index}
              onClick={() => navigate(`/cohorts/${cohort.id}`)}
              onEdit={() => handleEditCohort(cohort)}
              onDelete={() => handleDeleteCohort(cohort)}
              isAdmin={isAdmin}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredCohorts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No cohorts found</h3>
          <p className="mt-2 text-muted-foreground">
            {isAdmin ? 'Create a new cohort to get started' : 'No cohorts assigned to you yet'}
          </p>
          {isAdmin && (
            <GradientButton
              variant="primary"
              className="mt-4"
              onClick={() => setShowAddCohort(true)}
            >
              Create First Cohort
            </GradientButton>
          )}
        </motion.div>
      )}

      {/* Add Cohort Modal */}
      <AddCohortModal
        isOpen={showAddCohort}
        onClose={() => setShowAddCohort(false)}
        onSubmit={handleCreateCohort}
        coaches={activeCoaches
          .filter((c: any) => c.role === 'COACH')
          .map((c: any) => ({
          id: c.id.toString(),
          name: c.name,
          email: c.email,}))}

        isLoading={createCohort.isPending || loadingCoaches}
      />
    </div>
  );
};

interface CohortCardProps {
  cohort: any;
  index: number;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}

const CohortCard = ({ cohort, index, onClick, onEdit, onDelete, isAdmin }: CohortCardProps) => {
  const status = statusConfig[cohort.status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <GlassCard
        variant="hover"
        glow="cyan"
        className="group cursor-pointer p-6"
        onClick={onClick}
        whileHover={{ y: -4 }}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-neon-blue/20 transition-all group-hover:from-primary/30 group-hover:to-neon-blue/30">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground">{cohort.code}</span>
              <h3 className="font-semibold text-foreground">{cohort.name}</h3>
            </div>
          </div>
          <div className="opacity-0 transition-all group-hover:opacity-100">
            <ActionMenu
              onEdit={isAdmin ? onEdit : undefined}
              onDelete={isAdmin ? onDelete : undefined}
              onView={onClick}
              showEdit={isAdmin}
              showDelete={isAdmin}
              showView={true}
            />
          </div>
        </div>

        {/* Info */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">{cohort.skill}</span>
            <span>•</span>
            <span>{cohort.bu}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {cohort.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {cohort.candidateCount}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Started {new Date(cohort.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Progress & Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`badge-status ${status.class}`}>{status.label}</span>
            <span className="text-sm font-medium text-foreground">{cohort.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cohort.progress}%` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-neon-blue"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-xs font-semibold text-secondary">
              {cohort.coachName?.charAt(0) || 'U'}
            </div>
            <span className="text-sm text-muted-foreground">{cohort.coachName || 'Unassigned'}</span>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:text-primary group-hover:opacity-100" />
        </div>
      </GlassCard>
    </motion.div>
  );
};