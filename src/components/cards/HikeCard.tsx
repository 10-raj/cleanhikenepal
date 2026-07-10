import { motion } from 'framer-motion';
import { MapPin, Clock, TrendingUp, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hike } from '../../types';
import { DisplayCard, CardImage, CardContent } from '../cards/DisplayCard';
import { DifficultyBadge } from '../ui/Badge';

interface HikeCardProps {
  hike: Hike;
  index?: number;
}

export function HikeCard({ hike, index = 0 }: HikeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/hikes/${hike.id}`}>
        <DisplayCard className="group h-full" glow="emerald">
          <CardImage
            src={hike.image}
            alt={hike.name}
            className="h-56"
            overlay
          />
          <div className="absolute top-4 left-4 z-10">
            {hike.featured && (
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                Featured
              </span>
            )}
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
                    {hike.location}, {hike.region}
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
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{hike.maxElevation}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{hike.groupSize}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">{hike.rating}</span>
                  <span className="text-gray-500 text-sm">({hike.reviewCount})</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${hike.price}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </DisplayCard>
      </Link>
    </motion.div>
  );
}