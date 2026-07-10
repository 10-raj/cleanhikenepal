import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DisplayCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glow?: 'emerald' | 'orange' | 'blue' | 'none';
}

const glowStyles = {
  emerald: 'hover:shadow-emerald-500/30',
  orange: 'hover:shadow-orange-500/30',
  blue: 'hover:shadow-sky-500/30',
  none: '',
};

export function DisplayCard({
  children,
  className = '',
  onClick,
  hoverable = true,
  glow = 'emerald',
}: DisplayCardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -8, scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        bg-white/80 dark:bg-gray-800/80
        backdrop-blur-xl
        rounded-2xl
        border border-white/20 dark:border-gray-700/50
        shadow-lg hover:shadow-2xl
        ${glowStyles[glow]}
        transition-shadow duration-500
        overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

export function CardImage({ src, alt, className = '', overlay = false }: CardImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      )}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
