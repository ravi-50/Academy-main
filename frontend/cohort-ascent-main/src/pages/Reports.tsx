import { motion } from 'framer-motion';
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Filter,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { StatsCard } from '@/components/ui/StatsCard';

export const Reports = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            View insights and export training reports
          </p>
        </div>
        <div className="flex gap-3">
          <GradientButton variant="outline" icon={<Filter className="h-4 w-4" />}>
            Filters
          </GradientButton>
          <GradientButton variant="primary" icon={<Download className="h-4 w-4" />}>
            Export Report
          </GradientButton>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Effort Hours"
          value="1,248"
          change="+156 this week"
          changeType="positive"
          icon={Clock}
          iconColor="cyan"
          delay={0.1}
        />
        <StatsCard
          title="Active Trainers"
          value="24"
          change="+3 assigned"
          changeType="positive"
          icon={Users}
          iconColor="violet"
          delay={0.2}
        />
        <StatsCard
          title="Completion Rate"
          value="87%"
          change="+5% vs last week"
          changeType="positive"
          icon={TrendingUp}
          iconColor="success"
          delay={0.3}
        />
        <StatsCard
          title="Reports Generated"
          value="12"
          change="This month"
          changeType="neutral"
          icon={FileText}
          iconColor="blue"
          delay={0.4}
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Effort Distribution</h3>
            <div className="flex h-64 items-center justify-center rounded-lg border border-border/30 bg-muted/20">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Chart visualization</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Trainer Utilization</h3>
            <div className="flex h-64 items-center justify-center rounded-lg border border-border/30 bg-muted/20">
              <div className="text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Chart visualization</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Recent Reports</h3>
          <div className="space-y-4">
            {[
              { name: 'Weekly Effort Report - Week 3', date: 'Jan 19, 2024', type: 'Excel' },
              { name: 'Monthly Summary - December', date: 'Jan 05, 2024', type: 'PDF' },
              { name: 'Cohort Alpha Progress Report', date: 'Jan 03, 2024', type: 'PDF' },
              { name: 'Trainer Utilization Q4', date: 'Dec 31, 2023', type: 'Excel' },
            ].map((report, index) => (
              <motion.div
                key={report.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 p-4 transition-all hover:border-primary/30 hover:bg-muted/40"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <p className="text-sm text-muted-foreground">Generated {report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-status bg-muted text-muted-foreground">{report.type}</span>
                  <GradientButton variant="ghost" size="sm" icon={<Download className="h-4 w-4" />}>
                    Download
                  </GradientButton>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Weekly Submission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <GlassCard variant="feature" className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/20">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Weekly Final Submission</h3>
                <p className="text-muted-foreground">
                  Submit your weekly effort summary by Friday EOD
                </p>
              </div>
            </div>
            <GradientButton variant="primary">
              Submit Weekly Report
            </GradientButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
