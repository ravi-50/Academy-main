import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BarChart3,
  Calendar,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';

const features = [
  {
    icon: GraduationCap,
    title: 'Cohort Management',
    description: 'Organize and track GenC batches with comprehensive oversight of training programs.',
    color: 'cyan',
  },
  {
    icon: Users,
    title: 'Stakeholder Tracking',
    description: 'Manage trainers, mentors, and buddy mentors with detailed role assignments.',
    color: 'violet',
  },
  {
    icon: Calendar,
    title: 'Daily Effort Logging',
    description: 'Track daily training hours and activities with streamlined data entry.',
    color: 'blue',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Generate insights with automated weekly reports and performance metrics.',
    color: 'cyan',
  },
];

const stats = [
  { value: '500+', label: 'Active Cohorts' },
  { value: '12K+', label: 'Candidates Trained' },
  { value: '98%', label: 'Program Completion' },
  { value: '4.9', label: 'Satisfaction Score' },
];

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <FloatingOrbs variant="landing" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-neon-blue shadow-lg shadow-primary/20">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Cohort Effort</h1>
            <p className="text-xs text-muted-foreground">Management Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <GradientButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Sign In
          </GradientButton>
          <GradientButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/login')}
            icon={<ArrowRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Get Started
          </GradientButton>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 lg:pt-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
          >
            <Zap className="h-4 w-4" />
            Enterprise-Grade Training Operations
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Streamline Your{' '}
            <span className="gradient-text">Corporate Training</span>{' '}
            Operations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl"
          >
            The all-in-one platform for managing cohort training programs, tracking stakeholder efforts, 
            and generating actionable insights for Fortune 500 companies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <GradientButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              Start Managing Cohorts
            </GradientButton>
            <GradientButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
            >
              View Demo
            </GradientButton>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <GlassCard
              key={stat.label}
              variant="feature"
              className="p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <p className="text-3xl font-bold gradient-text lg:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </GlassCard>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
            Everything You Need to{' '}
            <span className="gradient-text-secondary">Excel</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Powerful features designed for enterprise-scale training management
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard
                variant="hover"
                glow={feature.color as 'cyan' | 'violet' | 'blue'}
                className="group p-8"
              >
                <div className={`mb-4 inline-flex rounded-lg p-3 ${
                  feature.color === 'cyan' ? 'bg-primary/10' :
                  feature.color === 'violet' ? 'bg-secondary/10' : 'bg-accent/10'
                }`}>
                  <feature.icon className={`h-6 w-6 ${
                    feature.color === 'cyan' ? 'text-primary' :
                    feature.color === 'violet' ? 'text-secondary' : 'text-accent'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
            <div className="relative px-8 py-16 text-center lg:px-16">
              <Shield className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-6 text-3xl font-bold text-foreground lg:text-4xl">
                Ready to Transform Your Training Operations?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join leading enterprises in managing cohort training programs with precision and efficiency.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <GradientButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/login')}
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                >
                  Get Started Today
                </GradientButton>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Enterprise Security
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  24/7 Support
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Custom Integrations
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-neon-blue">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">Cohort Effort Management</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Cohort Platform. Enterprise Training Solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
