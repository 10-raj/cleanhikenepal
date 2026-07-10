import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Hike } from '../types';

interface Props {
  hike: Hike;
  onClose: () => void;
}

export function HikeDetailsModal({ hike, onClose }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        {/* Image */}
        <img
          src={hike.image}
          className="w-full h-64 object-cover"
          alt={hike.name}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {hike.name}
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            {hike.location}, {hike.region}
          </p>

          {/* Info Row */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>⛰ {hike.maxElevation} m</span>
            <span>📏 {hike.distance}</span>
            <span>⏱ {hike.duration}</span>
            <span>🔥 {hike.difficulty}</span>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {hike.description}
          </p>

          {/* Highlights */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Highlights
            </h3>

            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {hike.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Extra info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
            Best seasons: {hike.bestSeason?.join(', ')}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}