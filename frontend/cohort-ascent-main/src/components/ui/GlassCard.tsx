import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'hover' | 'elevated' | 'feature';
  glow?: 'none' | 'cyan' | 'violet' | 'blue';
  children: React.ReactNode;
}

export const GlassCard = ({
  variant = 'default',
  glow = 'none',
  className,
  children,
  ...props
}: GlassCardProps) => {
  const baseStyles = 'relative rounded-xl border backdrop-blur-xl overflow-hidden';
  
  const variantStyles = {
    default: 'border-border/50 bg-card/60',
    hover: 'border-border/50 bg-card/60 transition-all duration-300 hover:border-primary/30 hover:bg-card/80',
    elevated: 'border-border/40 bg-card/70 shadow-elevated',
    feature: 'border-border/30 bg-gradient-to-br from-card/80 to-card/40',
  };

  const glowStyles = {
    none: '',
    cyan: 'hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3)]',
    violet: 'hover:shadow-[0_0_30px_hsl(var(--neon-violet)/0.3)]',
    blue: 'hover:shadow-[0_0_30px_hsl(var(--neon-blue)/0.3)]',
  };

  return (
    <motion.div
      className={cn(baseStyles, variantStyles[variant], glowStyles[glow], className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
