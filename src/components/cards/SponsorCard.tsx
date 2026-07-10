import { motion } from 'framer-motion';
import { Sponsor } from '../../types';
import { ExternalLink } from 'lucide-react';

interface SponsorCardProps {
  sponsor: Sponsor;
}

const tierStyles = {
  platinum: 'border-purple-500/50 bg-purple-500/5',
  gold: 'border-yellow-500/50 bg-yellow-500/5',
  silver: 'border-gray-400/50 bg-gray-400/5',
  bronze: 'border-orange-500/50 bg-orange-500/5',
};

export function SponsorCard({ sponsor }: SponsorCardProps) {
  return (
    <motion.a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      className={`
        flex flex-col items-center justify-center
        p-6 rounded-2xl
        border-2
        ${tierStyles[sponsor.tier]}
        backdrop-blur-sm
        transition-all duration-300
        hover:shadow-lg
        group
        min-w-[200px]
      `}
    >
      <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 overflow-hidden shadow-lg">
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="w-16 h-16 object-cover rounded-full"
        />
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-white text-center group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {sponsor.name}
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
        {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)} Partner
      </p>
      <ExternalLink className="w-4 h-4 text-gray-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
}

export function SponsorLogo({ sponsor }: SponsorCardProps) {
  return (
    <motion.a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      className="flex-shrink-0 px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 overflow-hidden">
          <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover" />
        </div>
        <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          {sponsor.name}
        </span>
      </div>
    </motion.a>
  );
}
