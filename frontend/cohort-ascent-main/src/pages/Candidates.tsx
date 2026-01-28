import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Upload,
  Plus,
  Download,
  Edit2,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { useCandidates, useCreateCandidate, useUpdateCandidate, useDeleteCandidate, useBulkCreateCandidates } from '@/hooks/useCandidates';
import { useCohorts } from '@/hooks/useCohorts';
import { AddCandidateModal } from '@/components/modals/AddCandidateModal';
import { CSVUploadModal } from '@/components/modals/CSVUploadModal';
import { toast } from 'sonner';

const statusConfig = {
  active: { label: 'Active', class: 'badge-active' },
  inactive: { label: 'Inactive', class: 'badge-inactive' },
  completed: { label: 'Completed', class: 'bg-info/20 text-info' },
};

export const Candidates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: candidates = [], isLoading } = useCandidates();
  const { data: cohorts = [] } = useCohorts();
  const createCandidate = useCreateCandidate();
  const updateCandidate = useUpdateCandidate();
  const deleteCandidate = useDeleteCandidate();
  const bulkCreate = useBulkCreateCandidates();

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidate_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCohort = cohortFilter === 'all' || c.cohort_id === cohortFilter;
    return matchesSearch && matchesStatus && matchesCohort;
  });

  const handleAddCandidate = (data: any) => {
    if (editingCandidate) {
      updateCandidate.mutate({
        id: editingCandidate.id,
        ...data,
      }, {
        onSuccess: () => {
          setShowAddCandidate(false);
          setEditingCandidate(null);
        },
      });
    } else {
      createCandidate.mutate({
        ...data,
        cohort_id: cohortFilter !== 'all' ? cohortFilter : cohorts[0]?.id,
        email: data.email || null,
      }, {
        onSuccess: () => setShowAddCandidate(false),
      });
    }
  };

  const handleCSVUpload = (data: Record<string, string>[]) => {
    const candidatesToCreate = data.map((row) => ({
      candidate_id: row.candidate_id || row.id || `GC-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: row.name,
      email: row.email || null,
      skill: row.skill || 'General',
      location: row.location || 'Unknown',
      cohort_id: cohortFilter !== 'all' ? cohortFilter : cohorts[0]?.id,
      status: 'active',
      join_date: row.join_date || new Date().toISOString().split('T')[0],
    }));
    bulkCreate.mutate(candidatesToCreate, {
      onSuccess: () => setShowCSVUpload(false),
    });
  };

  const handleExport = () => {
    if (filteredCandidates.length === 0) {
      toast.error('No candidates to export');
      return;
    }

    const csvContent = [
      ['Candidate ID', 'Name', 'Email', 'Skill', 'Location', 'Status', 'Join Date'],
      ...filteredCandidates.map((c) => [
        c.candidate_id,
        c.name,
        c.email || '',
        c.skill,
        c.location,
        c.status,
        c.join_date,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Candidates exported successfully');
  };

  const handleEdit = (candidate: any) => {
    setEditingCandidate({
      ...candidate,
      status: candidate.status as 'active' | 'inactive' | 'completed',
    });
    setShowAddCandidate(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      deleteCandidate.mutate(id);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setShowCSVUpload(true);
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
          <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
          <p className="mt-2 text-muted-foreground">
            Manage GenC candidates across your cohorts
          </p>
        </div>
        <div className="flex gap-3">
          <GradientButton 
            variant="outline" 
            icon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export
          </GradientButton>
          <GradientButton 
            variant="primary" 
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditingCandidate(null);
              setShowAddCandidate(true);
            }}
          >
            Add Candidate
          </GradientButton>
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard
          variant={isDragOver ? 'elevated' : 'default'}
          className={`border-2 border-dashed p-8 text-center transition-all ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-border/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
        >
          <Upload className={`mx-auto h-10 w-10 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            Drag & Drop to Upload
          </h3>
          <p className="mt-2 text-muted-foreground">
            Upload CSV or Excel file with candidate data
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setShowCSVUpload(true);
              }
            }}
          />
          <GradientButton 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </GradientButton>
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or email..."
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
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="relative">
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="input-premium appearance-none pr-10"
            >
              <option value="all">All Cohorts</option>
              {cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Candidates Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {isLoading ? (
          <GlassCard className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Loading candidates...</p>
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden">
            {filteredCandidates.length > 0 ? (
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
                    {filteredCandidates.map((candidate, index) => (
                      <motion.tr
                        key={candidate.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.03 }}
                        className="group"
                      >
                        <td className="font-mono text-sm">{candidate.candidate_id}</td>
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
                          <span className={`badge-status ${statusConfig[candidate.status as keyof typeof statusConfig]?.class || 'bg-muted'}`}>
                            {statusConfig[candidate.status as keyof typeof statusConfig]?.label || candidate.status}
                          </span>
                        </td>
                        <td className="text-muted-foreground">
                          {new Date(candidate.join_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button 
                              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                              onClick={() => handleEdit(candidate)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDelete(candidate.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No candidates found</h3>
                <p className="mt-2 text-muted-foreground">
                  {candidates.length === 0
                    ? 'Upload a CSV or add candidates manually to get started'
                    : 'Try adjusting your search or filter criteria'}
                </p>
                {candidates.length === 0 && (
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
                )}
              </div>
            )}
          </GlassCard>
        )}
      </motion.div>

      {/* Modals */}
      <AddCandidateModal
        isOpen={showAddCandidate}
        onClose={() => {
          setShowAddCandidate(false);
          setEditingCandidate(null);
        }}
        onSubmit={handleAddCandidate}
        cohortId={cohortFilter !== 'all' ? cohortFilter : cohorts[0]?.id || ''}
        isLoading={createCandidate.isPending || updateCandidate.isPending}
        initialData={editingCandidate}
        mode={editingCandidate ? 'edit' : 'add'}
      />
      <CSVUploadModal
        isOpen={showCSVUpload}
        onClose={() => setShowCSVUpload(false)}
        onUpload={handleCSVUpload}
        title="Import Candidates"
        requiredColumns={['name', 'skill', 'location']}
      />
    </div>
  );
};