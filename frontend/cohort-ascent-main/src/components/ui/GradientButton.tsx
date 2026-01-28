import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const GradientButton = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  className,
  ...props
}: GradientButtonProps) => {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary to-neon-blue text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.4)]',
    secondary: 'bg-gradient-to-r from-secondary to-neon-purple text-secondary-foreground hover:shadow-[0_0_30px_hsl(var(--neon-violet)/0.4)]',
    ghost: 'bg-transparent text-foreground hover:bg-muted/50',
    outline: 'border border-border/50 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary',
  };

  return (
    <motion.button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && <span className="relative z-10">{icon}</span>}
    </motion.button>
  );
};
