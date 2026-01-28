import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  BarChart3,
  MapPin,
  Mail,
  Phone,
  Plus,
  UserPlus,
  Upload,
  Download,
  Search,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useCohort } from '@/hooks/useCohortsBackend';
import { Cohort } from '@/integrations/backend/cohortApi';
import { useCohortStore } from '@/stores/cohortStore';
import { useTrainers, useCreateTrainer, useAssignTrainer, useUpdateTrainer, useDeleteTrainer, useUnassignTrainer, Trainer } from '@/hooks/useTrainers';
import { useMentors, useCreateMentor, useAssignMentor, useUpdateMentor, useDeleteMentor, useUnassignMentor, Mentor } from '@/hooks/useMentors';
import { useCandidates, useCreateCandidate, useUpdateCandidate, useDeleteCandidate, useBulkCreateCandidates, Candidate } from '@/hooks/useCandidates';
import { useDailyEfforts } from '@/hooks/useDailyEfforts';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { AddTrainerModal } from '@/components/modals/AddTrainerModal';
import { AddMentorModal } from '@/components/modals/AddMentorModal';
import { AssignStakeholderModal } from '@/components/modals/AssignStakeholderModal';
import { AddCandidateModal } from '@/components/modals/AddCandidateModal';
import { CSVUploadModal } from '@/components/modals/CSVUploadModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TabType = 'overview' | 'candidates' | 'stakeholders' | 'efforts' | 'reports';

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: GraduationCap },
  { id: 'candidates', label: 'Candidates', icon: Users },
  { id: 'stakeholders', label: 'Trainers & Mentors', icon: UserCheck },
  { id: 'efforts', label: 'Daily Efforts', icon: Calendar },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export const CohortDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: cohort, isLoading: loading, error } = useCohort(id ? parseInt(id) : 0);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loading cohort details...</p>
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Cohort not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/cohorts')}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cohorts
        </button>

        <GlassCard variant="feature" className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-neon-blue/20">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">{cohort.code}</span>
                <h1 className="text-2xl font-bold text-foreground">{cohort.code}</h1>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {cohort.trainingLocation}
                  </span>
                  <span>•</span>
                  <span>{cohort.skill}</span>
                  <span>•</span>
                  <span>{cohort.activeGencCount} candidates</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {(() => {
                    const now = new Date();
                    const start = new Date(cohort.startDate);
                    const end = new Date(cohort.endDate);
                    const totalDuration = end.getTime() - start.getTime();
                    const elapsed = now.getTime() - start.getTime();
                    const progress = totalDuration > 0 ? Math.max(0, Math.min(100, (elapsed / totalDuration) * 100)) : 0;
                    return Math.round(progress);
                  })()}%
                </p>
              </div>
              <div className="h-16 w-16">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={100}
                    initial={{ strokeDashoffset: 100 }}
                    animate={{
                      strokeDashoffset: 100 - (() => {
                        const now = new Date();
                        const start = new Date(cohort.startDate);
                        const end = new Date(cohort.endDate);
                        const totalDuration = end.getTime() - start.getTime();
                        const elapsed = now.getTime() - start.getTime();
                        return totalDuration > 0 ? Math.max(0, Math.min(100, (elapsed / totalDuration) * 100)) : 0;
                      })()
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && <OverviewTab cohortId={cohort.id.toString()} cohort={cohort} />}
        {activeTab === 'stakeholders' && <StakeholdersTab cohortId={cohort.id.toString()} cohort={cohort} />}
        {activeTab === 'candidates' && <CandidatesTab cohortId={cohort.id.toString()} cohort={cohort} />}
        {activeTab === 'efforts' && <EffortsTab cohortId={cohort.id.toString()} />}
        {activeTab === 'reports' && <ReportsTab cohortId={cohort.id.toString()} />}
      </motion.div>
    </div>
  );
};

const OverviewTab = ({ cohortId, cohort }: { cohortId: string; cohort: Cohort }) => {
  const { data: trainers = [] } = useTrainers(cohortId);
  const { data: mentors = [] } = useMentors(cohortId);
  const { data: candidates = [] } = useCandidates(cohortId);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <GlassCard className="p-6 lg:col-span-2">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Cohort Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Business Unit</p>
            <p className="font-medium text-foreground">{cohort.bu}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Skill/Technology</p>
            <p className="font-medium text-foreground">{cohort.skill}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-medium text-foreground">
              {new Date(cohort.startDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="font-medium text-foreground">
              {new Date(cohort.endDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <span className="badge-active mt-1 inline-block capitalize">
              {(() => {
                const now = new Date();
                const start = new Date(cohort.startDate);
                const end = new Date(cohort.endDate);
                if (now < start) return 'upcoming';
                if (now > end) return 'completed';
                return 'active';
              })()}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Coach</p>
            <p className="font-medium text-foreground">{cohort.coach?.name || 'Not assigned'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium text-foreground">{cohort.trainingLocation}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Candidates</span>
            <span className="font-semibold text-foreground">{cohort.activeGencCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Trainers</span>
            <span className="font-semibold text-foreground">{trainers.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Mentors</span>
            <span className="font-semibold text-foreground">{mentors.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-semibold text-primary">
              {(() => {
                const now = new Date();
                const start = new Date(cohort.startDate);
                const end = new Date(cohort.endDate);
                const totalDuration = end.getTime() - start.getTime();
                const elapsed = now.getTime() - start.getTime();
                const progress = totalDuration > 0 ? Math.max(0, Math.min(100, (elapsed / totalDuration) * 100)) : 0;
                return Math.round(progress);
              })()}%
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

interface StakeholdersTabProps {
  cohortId: string;
  cohort: Cohort;
}

const StakeholdersTab = ({ cohortId, cohort }: StakeholdersTabProps) => {
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [showAssignTrainer, setShowAssignTrainer] = useState(false);
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [showAssignMentor, setShowAssignMentor] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [trainerModalMode, setTrainerModalMode] = useState<'add' | 'edit'>('add');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [mentorModalMode, setMentorModalMode] = useState<'add' | 'edit'>('add');

  const { data: trainers = [], isLoading: loadingTrainers } = useTrainers(cohortId);
  const { data: mentors = [], isLoading: loadingMentors } = useMentors(cohortId);
  const createTrainer = useCreateTrainer();
  const assignTrainer = useAssignTrainer();
  const createMentor = useCreateMentor();
  const assignMentor = useAssignMentor();
  const updateTrainer = useUpdateTrainer();
  const updateMentor = useUpdateMentor();
  const unassignTrainer = useUnassignTrainer();
  const unassignMentor = useUnassignMentor();
  const deleteTrainer = useDeleteTrainer();
  const deleteMentor = useDeleteMentor();

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


  // Use DB data
  const displayTrainers = trainers;

  const displayMentors = mentors;

  const handleAddTrainer = (data: any) => {
    createTrainer.mutate({
      trainer: {
        ...data,
        emp_id: data.emp_id || `EMP${Date.now()}`,
      },
      cohortId: cohortId,
    }, {
      onSuccess: () => setShowAddTrainer(false),
    });
  };

  const handleAssignTrainer = (trainerId: number) => {
    assignTrainer.mutate({ trainerId, cohortId }, {
      onSuccess: () => setShowAssignTrainer(false),
    });
  };

  const handleAddMentor = (data: any) => {
    createMentor.mutate({
      mentor: {
        ...data,
        emp_id: data.emp_id || `EMP${Date.now()}`,
      },
      cohortId: cohortId,
    }, {
      onSuccess: () => setShowAddMentor(false),
    });
  };

  const handleAssignMentor = (mentorId: number) => {
    assignMentor.mutate({ mentorId, cohortId }, {
      onSuccess: () => setShowAssignMentor(false),
    });
  };

  return (
    <div className="space-y-8">
      {/* Trainers */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Trainers</h3>
          <div className="flex gap-2">
            <GradientButton
              variant="ghost"
              size="sm"
              icon={<UserPlus className="h-4 w-4" />}
              onClick={() => setShowAssignTrainer(true)}
            >
              Assign Existing
            </GradientButton>
            <GradientButton
              variant="outline"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowAddTrainer(true)}
            >
              Add New
            </GradientButton>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayTrainers.map((trainer) => (
            <GlassCard key={trainer.id} variant="hover" glow="cyan" className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/30 to-neon-blue/30 text-lg font-semibold text-primary">
                    {trainer.avatar_url ? (
                      <img src={trainer.avatar_url} alt={trainer.name} className="h-full w-full object-cover" />
                    ) : (
                      trainer.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{trainer.name}</h4>
                    <p className="text-sm capitalize text-muted-foreground">{trainer.type} Trainer</p>
                  </div>
                </div>
                <ActionMenu
                  onEdit={() => {
                    setSelectedTrainer(trainer);
                    setTrainerModalMode('edit');
                    setShowAddTrainer(true);
                  }}
                  onDelete={() => unassignTrainer.mutate({ trainerId: trainer.id, cohortId })}
                />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {trainer.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  {trainer.emp_id}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  {trainer.skill}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <span className={`badge-status ${trainer.is_internal ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                  {trainer.is_internal ? 'Internal' : 'External'}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Mentors */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Mentors</h3>
          <div className="flex gap-2">
            <GradientButton
              variant="ghost"
              size="sm"
              icon={<UserPlus className="h-4 w-4" />}
              onClick={() => setShowAssignMentor(true)}
            >
              Assign Existing
            </GradientButton>
            <GradientButton
              variant="outline"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowAddMentor(true)}
            >
              Add New
            </GradientButton>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayMentors.map((mentor) => (
            <GlassCard key={mentor.id} variant="hover" glow="violet" className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-secondary/30 to-neon-purple/30 text-lg font-semibold text-secondary">
                    {mentor.avatar_url ? (
                      <img src={mentor.avatar_url} alt={mentor.name} className="h-full w-full object-cover" />
                    ) : (
                      mentor.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{mentor.name}</h4>
                    <p className="text-sm capitalize text-muted-foreground">{mentor.type} Mentor</p>
                  </div>
                </div>
                <ActionMenu
                  onEdit={() => {
                    setSelectedMentor(mentor);
                    setMentorModalMode('edit');
                    setShowAddMentor(true);
                  }}
                  onDelete={() => unassignMentor.mutate({ mentorId: mentor.id, cohortId })}
                />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {mentor.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  {mentor.emp_id}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  {mentor.skill}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddTrainerModal
        isOpen={showAddTrainer}
        onClose={() => {
          setShowAddTrainer(false);
          setSelectedTrainer(null);
          setTrainerModalMode('add');
        }}
        onSubmit={trainerModalMode === 'add' ? handleAddTrainer : handleEditTrainer}
        cohortId={cohortId}
        isLoading={createTrainer.isPending || updateTrainer.isPending}
        mode={trainerModalMode}
        initialData={selectedTrainer}
      />
      <AssignStakeholderModal
        isOpen={showAssignTrainer}
        onClose={() => setShowAssignTrainer(false)}
        onAssign={handleAssignTrainer}
        type="trainer"
        isLoading={assignTrainer.isPending}
        excludeIds={displayTrainers.map(t => t.id)}
      />
      <AddMentorModal
        isOpen={showAddMentor}
        onClose={() => {
          setShowAddMentor(false);
          setSelectedMentor(null);
          setMentorModalMode('add');
        }}
        onSubmit={mentorModalMode === 'add' ? handleAddMentor : handleEditMentor}
        cohortId={cohortId}
        isLoading={createMentor.isPending || updateMentor.isPending}
        mode={mentorModalMode}
        initialData={selectedMentor}
      />
      <AssignStakeholderModal
        isOpen={showAssignMentor}
        onClose={() => setShowAssignMentor(false)}
        onAssign={handleAssignMentor}
        type="mentor"
        isLoading={assignMentor.isPending}
        excludeIds={displayMentors.map(m => m.id)}
      />
    </div>
  );
};

interface CandidatesTabProps {
  cohortId: string;
  cohort: Cohort;
}

const CandidatesTab = ({ cohortId, cohort }: CandidatesTabProps) => {
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showEditCandidate, setShowEditCandidate] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: candidates = [], isLoading } = useCandidates(cohortId);
  const createCandidate = useCreateCandidate();
  const updateCandidate = useUpdateCandidate();
  const deleteCandidate = useDeleteCandidate();
  const bulkCreate = useBulkCreateCandidates();

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.candidateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusConfig: Record<string, { label: string; class: string }> = {
    ACTIVE: { label: 'Active', class: 'badge-active' },
    INACTIVE: { label: 'Inactive', class: 'badge-inactive' },
    COMPLETED: { label: 'Completed', class: 'bg-info/20 text-info' },
  };

  const handleAddCandidate = (data: any) => {
    createCandidate.mutate({
      candidateId: data.candidate_id || `GC-${Date.now()}`,
      name: data.name,
      email: data.email || null,
      skill: data.skill || cohort.skill,
      location: data.location || cohort.trainingLocation,
      cohort: cohort,
      status: 'ACTIVE',
      joinDate: data.join_date || new Date().toISOString(),
    }, {
      onSuccess: () => setShowAddCandidate(false),
    });
  };

  const handleEditCandidate = (data: any) => {
    if (!selectedCandidate) return;

    updateCandidate.mutate({
      id: selectedCandidate.id,
      candidateId: data.candidate_id,
      name: data.name,
      email: data.email || null,
      skill: data.skill,
      location: data.location,
      status: data.status.toUpperCase() as any,
      joinDate: data.join_date,
    }, {
      onSuccess: () => {
        setShowEditCandidate(false);
        setSelectedCandidate(null);
      },
    });
  };

  const handleCSVUpload = (data: Record<string, string>[]) => {
    const timestamp = Date.now();
    const candidates = data.map((row, index) => ({
      candidateId: row.candidate_id || row.id || `GC-${timestamp}-${index}`,
      name: row.name,
      email: row.email || null,
      skill: row.skill || cohort.skill,
      location: row.location || cohort.trainingLocation,
      cohort: cohort,
      status: 'ACTIVE' as const,
      joinDate: row.join_date || new Date().toISOString(),
    }));
    bulkCreate.mutate(candidates, {
      onSuccess: () => setShowCSVUpload(false),
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['Candidate ID', 'Name', 'Email', 'Skill', 'Location', 'Status', 'Join Date'],
      ...candidates.map((c) => [
        c.candidateId,
        c.name,
        c.email || '',
        c.skill,
        c.location,
        c.status,
        c.joinDate,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-${cohort.code}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Candidates exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates..."
            className="input-premium w-full pl-12"
          />
        </div>
        <div className="flex gap-3">
          <GradientButton
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export
          </GradientButton>
          <GradientButton
            variant="outline"
            size="sm"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => setShowCSVUpload(true)}
          >
            Upload CSV
          </GradientButton>
          <GradientButton
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddCandidate(true)}
          >
            Add Candidate
          </GradientButton>
        </div>
      </div>

      {isLoading ? (
        <GlassCard className="p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading candidates...</p>
        </GlassCard>
      ) : filteredCandidates.length > 0 ? (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate ID</th>
                  <th>Name</th>
                  <th>Skill</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="group">
                    <td className="font-mono text-sm">{candidate.candidateId}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-neon-blue/20 text-sm font-semibold text-primary">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{candidate.skill}</td>
                    <td>{candidate.location}</td>
                    <td>
                      <span className={`badge-status ${statusConfig[candidate.status]?.class || 'bg-muted'}`}>
                        {statusConfig[candidate.status]?.label || candidate.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground">
                      {new Date(candidate.joinDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowEditCandidate(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteCandidate.mutate(candidate.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="p-6 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No candidates yet</h3>
            <p className="mt-2 text-muted-foreground">
              Upload a CSV file or add candidates manually
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <GradientButton
                variant="outline"
                size="sm"
                onClick={() => setShowCSVUpload(true)}
              >
                Upload CSV
              </GradientButton>
              <GradientButton
                variant="primary"
                size="sm"
                onClick={() => setShowAddCandidate(true)}
              >
                Add Manually
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Modals */}
      <AddCandidateModal
        isOpen={showAddCandidate}
        onClose={() => setShowAddCandidate(false)}
        onSubmit={handleAddCandidate}
        cohortId={cohortId}
        isLoading={createCandidate.isPending}
      />

      <AddCandidateModal
        isOpen={showEditCandidate}
        onClose={() => {
          setShowEditCandidate(false);
          setSelectedCandidate(null);
        }}
        onSubmit={handleEditCandidate}
        cohortId={cohortId}
        isLoading={updateCandidate.isPending}
        initialData={selectedCandidate ? {
          candidate_id: selectedCandidate.candidateId,
          name: selectedCandidate.name,
          email: selectedCandidate.email || '',
          skill: selectedCandidate.skill,
          location: selectedCandidate.location,
          status: selectedCandidate.status.toLowerCase() as any,
          join_date: selectedCandidate.joinDate ? new Date(selectedCandidate.joinDate).toISOString().split('T')[0] : '',
        } : undefined}
        mode="edit"
      />
      <CSVUploadModal
        isOpen={showCSVUpload}
        onClose={() => setShowCSVUpload(false)}
        onUpload={handleCSVUpload}
        title="Import Candidates"
        requiredColumns={['candidate_id', 'name', 'email']}
      />
    </div>
  );
};

interface EffortsTabProps {
  cohortId: string;
}

const EffortsTab = ({ cohortId }: EffortsTabProps) => {
  const navigate = useNavigate();
  const { data: efforts = [], isLoading } = useDailyEfforts(cohortId);

  const groupedByDate = efforts.reduce((acc, effort) => {
    const date = effort.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(effort);
    return acc;
  }, {} as Record<string, typeof efforts>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Daily Efforts Log</h3>
        <GradientButton
          variant="primary"
          onClick={() => navigate('/efforts')}
        >
          Log Daily Effort
        </GradientButton>
      </div>

      {isLoading ? (
        <GlassCard className="p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </GlassCard>
      ) : Object.keys(groupedByDate).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByDate)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, dayEfforts]) => (
              <GlassCard key={date} className="p-6">
                <h4 className="mb-4 font-semibold text-foreground">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h4>
                <div className="space-y-3">
                  {dayEfforts.map((effort) => (
                    <div
                      key={effort.id}
                      className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{effort.stakeholder_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {effort.stakeholder_type} • {effort.area_of_work}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{effort.effort_hours} hrs</p>
                        <p className="text-sm text-muted-foreground capitalize">{effort.mode_of_training}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
        </div>
      ) : (
        <GlassCard className="p-6">
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No efforts logged yet</h3>
            <p className="mt-2 text-muted-foreground">
              Start logging daily training efforts for this cohort
            </p>
            <GradientButton
              variant="primary"
              className="mt-6"
              onClick={() => navigate('/efforts')}
            >
              Log Daily Effort
            </GradientButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

interface ReportsTabProps {
  cohortId: string;
}

const ReportsTab = ({ cohortId }: ReportsTabProps) => {
  const { data: efforts = [] } = useDailyEfforts(cohortId);

  const totalHours = efforts.reduce((sum, e) => sum + Number(e.effort_hours), 0);
  const uniqueDays = new Set(efforts.map((e) => e.date)).size;

  const handleGenerateReport = () => {
    // Generate a simple report
    const reportContent = [
      ['Daily Effort Report'],
      [''],
      ['Summary'],
      [`Total Effort Hours: ${totalHours}`],
      [`Days Logged: ${uniqueDays}`],
      [''],
      ['Detailed Entries'],
      ['Date', 'Stakeholder', 'Type', 'Area of Work', 'Hours', 'Mode'],
      ...efforts.map((e) => [
        e.date,
        e.stakeholder_name,
        e.stakeholder_type,
        e.area_of_work,
        e.effort_hours.toString(),
        e.mode_of_training,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([reportContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `effort-report-${cohortId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report generated successfully');
  };

  return (
    <GlassCard className="p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border/30 bg-muted/20 p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{totalHours}</p>
          <p className="text-sm text-muted-foreground">Total Effort Hours</p>
        </div>
        <div className="rounded-lg border border-border/30 bg-muted/20 p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{uniqueDays}</p>
          <p className="text-sm text-muted-foreground">Days Logged</p>
        </div>
        <div className="rounded-lg border border-border/30 bg-muted/20 p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{efforts.length}</p>
          <p className="text-sm text-muted-foreground">Total Entries</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <GradientButton variant="primary" onClick={handleGenerateReport}>
          Generate Report
        </GradientButton>
      </div>
    </GlassCard>
  );
};