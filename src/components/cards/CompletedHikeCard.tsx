import { motion } from 'framer-motion';
import { MapPin, Clock, Route, Calendar, CheckCircle } from 'lucide-react';
import { CompletedHike } from '../../data/completedHikes';
import { DisplayCard, CardImage, CardContent } from './DisplayCard';
import { DifficultyBadge } from '../ui/Badge';

interface CompletedHikeCardProps {
  hike: CompletedHike;
  index?: number;
}

export function CompletedHikeCard({ hike, index = 0 }: CompletedHikeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <DisplayCard className="group h-full" glow="emerald">
        <CardImage
          src={hike.image}
          alt={hike.name}
          className="h-56"
          overlay
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        </div>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {hike.name}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  {hike.location}
                </div>
              </div>
              <DifficultyBadge difficulty={hike.difficulty} />
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {hike.description}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{hike.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-sky-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{hike.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(hike.completedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completed on</p>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {formatDate(hike.completedDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </DisplayCard>
    </motion.div>
  );
}
