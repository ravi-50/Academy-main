import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  Search,
  Plus,
  UserPlus,
  Mail,
  Phone,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { AddTrainerModal } from '@/components/modals/AddTrainerModal';
import { AddMentorModal } from '@/components/modals/AddMentorModal';
import { useTrainers, useCreateTrainer, useUpdateTrainer, useDeleteTrainer, useReactivateTrainer, Trainer } from '@/hooks/useTrainers';
import { useMentors, useCreateMentor, useUpdateMentor, useDeleteMentor, useReactivateMentor, Mentor } from '@/hooks/useMentors';
import { useCohorts } from '@/hooks/useCohorts';
import { toast } from 'sonner';
import { useEffect } from 'react';

type TabType = 'trainers' | 'mentors';

export const Stakeholders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('trainers');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [trainerModalMode, setTrainerModalMode] = useState<'add' | 'edit'>('add');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [mentorModalMode, setMentorModalMode] = useState<'add' | 'edit'>('add');

  const { data: cohorts = [] } = useCohorts();

  const { data: trainers = [], isLoading: loadingTrainers } = useTrainers(
    selectedCohort !== 'all' ? selectedCohort : undefined
  );
  const { data: mentors = [], isLoading: loadingMentors } = useMentors(
    selectedCohort !== 'all' ? selectedCohort : undefined
  );

  const createTrainer = useCreateTrainer();
  const updateTrainer = useUpdateTrainer();
  const createMentor = useCreateMentor();
  const updateMentor = useUpdateMentor();
  const deleteTrainer = useDeleteTrainer();
  const deleteMentor = useDeleteMentor();
  const reactivateTrainer = useReactivateTrainer();
  const reactivateMentor = useReactivateMentor();

  const filteredTrainers = trainers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMentors = mentors.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTrainer = (data: any) => {
    createTrainer.mutate({
      trainer: {
        ...data,
        status: 'active',
      },
      cohortId: selectedCohort !== 'all' ? selectedCohort : undefined,
    }, {
      onSuccess: () => setShowAddTrainer(false),
    });
  };

  const handleAddMentor = (data: any) => {
    createMentor.mutate({
      mentor: {
        ...data,
        status: 'active',
      },
      cohortId: selectedCohort !== 'all' ? selectedCohort : undefined,
    }, {
      onSuccess: () => setShowAddMentor(false),
    });
  };

  const handleEditTrainer = (data: any) => {
    if (!selectedTrainer) return;
    updateTrainer.mutate({ id: selectedTrainer.id, ...data }, {
      onSuccess: () => {
        setShowAddTrainer(false);
        setSelectedTrainer(null);
        setTrainerModalMode('add');
        toast.success('Trainer updated successfully');
      },
    });
  };

  const handleEditMentor = (data: any) => {
    if (!selectedMentor) return;
    updateMentor.mutate({ id: selectedMentor.id, ...data }, {
      onSuccess: () => {
        setShowAddMentor(false);
        setSelectedMentor(null);
        setMentorModalMode('add');
        toast.success('Mentor updated successfully');
      },
    });
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
          <h1 className="text-3xl font-bold text-foreground">Stakeholders</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage trainers, mentors, and buddy mentors
          </p>
        </div>
        <div className="flex gap-3">
          <GradientButton
            variant="outline"
            icon={<UserCheck className="h-4 w-4" />}
            onClick={() => setShowAddMentor(true)}
          >
            Add Mentor
          </GradientButton>
          <GradientButton
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddTrainer(true)}
          >
            Add Trainer
          </GradientButton>
        </div>
      </motion.div>

      {/* Tabs and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('trainers')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'trainers'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <GraduationCap className="h-4 w-4" />
            Trainers ({filteredTrainers.length})
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'mentors'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <UserCheck className="h-4 w-4" />
            Mentors ({filteredMentors.length})
          </button>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="input-premium appearance-none pr-10"
            >
              <option value="all">All Cohorts</option>
              {cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.code} - {cohort.skill}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
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
            placeholder="Search by name, email, or skill..."
            className="input-premium w-full pl-12"
          />
        </div>
      </motion.div>

      {/* Content */}
      {activeTab === 'trainers' ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredTrainers.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard
                  variant="hover"
                  glow="cyan"
                  className={`p-6 transition-all duration-300 ${trainer.status === 'INACTIVE' ? 'opacity-40 grayscale-[0.5] hover:opacity-70' : ''}`}
                  onClick={() => {
                    if (trainer.status === 'INACTIVE') {
                      if (window.confirm(`Do you want to reactivate ${trainer.name}?`)) {
                        reactivateTrainer.mutate(trainer.id);
                      }
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/30 to-neon-blue/30 text-xl font-bold text-primary">
                        {trainer.avatar_url ? (
                          <img src={trainer.avatar_url} alt={trainer.name} className="h-full w-full object-cover" />
                        ) : (
                          trainer.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{trainer.name}</h3>
                        <span className="text-sm capitalize text-muted-foreground">
                          {trainer.type} Trainer
                        </span>
                      </div>
                    </div>
                    <ActionMenu
                      showEdit={trainer.status === 'ACTIVE'}
                      onEdit={() => {
                        setSelectedTrainer(trainer);
                        setTrainerModalMode('edit');
                        setShowAddTrainer(true);
                      }}
                      onDelete={() => deleteTrainer.mutate(trainer.id)}
                    />
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {trainer.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      {trainer.skill}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                    <span className={`badge-status ${trainer.is_internal ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                      {trainer.is_internal ? 'Internal' : 'External'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(trainer as any).cohort_name || 'Assigned'}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredTrainers.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No trainers found</h3>
              <p className="mt-2 text-muted-foreground">Add trainers to your cohorts</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard
                  variant="hover"
                  glow="violet"
                  className={`p-6 transition-all duration-300 ${mentor.status === 'INACTIVE' ? 'opacity-40 grayscale-[0.5] hover:opacity-70' : ''}`}
                  onClick={() => {
                    if (mentor.status === 'INACTIVE') {
                      if (window.confirm(`Do you want to reactivate ${mentor.name}?`)) {
                        reactivateMentor.mutate(mentor.id);
                      }
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-secondary/30 to-neon-purple/30 text-xl font-bold text-secondary">
                        {mentor.avatar_url ? (
                          <img src={mentor.avatar_url} alt={mentor.name} className="h-full w-full object-cover" />
                        ) : (
                          mentor.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                        <span className="text-sm capitalize text-muted-foreground">
                          Mentor
                        </span>
                      </div>
                    </div>
                    <ActionMenu
                      showEdit={mentor.status === 'ACTIVE'}
                      onEdit={() => {
                        setSelectedMentor(mentor);
                        setMentorModalMode('edit');
                        setShowAddMentor(true);
                      }}
                      onDelete={() => deleteMentor.mutate(mentor.id)}
                    />
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {mentor.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      {mentor.skill}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                    <span className={`badge-status ${mentor.is_internal ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                      {mentor.is_internal ? 'Internal' : 'External'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(mentor as any).cohort_name || 'Assigned'}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredMentors.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No mentors found</h3>
              <p className="mt-2 text-muted-foreground">Add mentors to your cohorts</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddTrainerModal
        isOpen={showAddTrainer}
        onClose={() => {
          setShowAddTrainer(false);
          setSelectedTrainer(null);
          setTrainerModalMode('add');
        }}
        onSubmit={trainerModalMode === 'add' ? handleAddTrainer : handleEditTrainer}
        cohortId={selectedCohort !== 'all' ? selectedCohort : ''}
        isLoading={createTrainer.isPending || updateTrainer.isPending}
        mode={trainerModalMode}
        initialData={selectedTrainer}
      />
      <AddMentorModal
        isOpen={showAddMentor}
        onClose={() => {
          setShowAddMentor(false);
          setSelectedMentor(null);
          setMentorModalMode('add');
        }}
        onSubmit={mentorModalMode === 'add' ? handleAddMentor : handleEditMentor}
        cohortId={selectedCohort !== 'all' ? selectedCohort : ''}
        isLoading={createMentor.isPending || updateMentor.isPending}
        mode={mentorModalMode}
        initialData={selectedMentor}
      />
    </div>
  );
};