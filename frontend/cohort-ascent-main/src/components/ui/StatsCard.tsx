import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: 'cyan' | 'violet' | 'blue' | 'success' | 'warning';
  delay?: number;
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'cyan',
  delay = 0,
}: StatsCardProps) => {
  const iconColorStyles = {
    cyan: 'text-primary bg-primary/10',
    violet: 'text-secondary bg-secondary/10',
    blue: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
  };

  const changeStyles = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard variant="hover" glow="cyan" className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change && (
              <p className={cn('text-sm', changeStyles[changeType])}>
                {change}
              </p>
            )}
          </div>
          <div className={cn('rounded-lg p-3', iconColorStyles[iconColor])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
