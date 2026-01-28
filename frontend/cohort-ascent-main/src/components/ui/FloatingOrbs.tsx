import { motion } from 'framer-motion';

interface FloatingOrbsProps {
  variant?: 'landing' | 'dashboard';
}

export const FloatingOrbs = ({ variant = 'landing' }: FloatingOrbsProps) => {
  const orbs = variant === 'landing' ? [
    { color: 'cyan', size: 400, x: '10%', y: '20%', delay: 0 },
    { color: 'violet', size: 300, x: '80%', y: '60%', delay: 2 },
    { color: 'blue', size: 250, x: '60%', y: '10%', delay: 1 },
    { color: 'cyan', size: 200, x: '30%', y: '80%', delay: 3 },
  ] : [
    { color: 'cyan', size: 200, x: '5%', y: '30%', delay: 0 },
    { color: 'violet', size: 150, x: '90%', y: '70%', delay: 2 },
    { color: 'blue', size: 180, x: '70%', y: '20%', delay: 1 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`floating-orb-${orb.color}`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
