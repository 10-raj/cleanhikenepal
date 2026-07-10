import { motion } from 'framer-motion';
import { Target, Users, Heart, Calendar } from 'lucide-react';
import { Donation } from '../../types';
import { DisplayCard, CardImage, CardContent } from '../cards/DisplayCard';
import { Button } from '../ui/Button';

interface DonationCardProps {
  donation: Donation;
  index?: number;
}

export function DonationCard({ donation, index = 0 }: DonationCardProps) {
  const progress = Math.min((donation.currentAmount / donation.goalAmount) * 100, 100);
  const remaining = donation.goalAmount - donation.currentAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <DisplayCard className="h-full" glow="orange">
        <CardImage
          src={donation.image}
          alt={donation.title}
          className="h-48"
          overlay
        />
        <div className="absolute top-4 left-4 z-10">
          <span className={`
            px-3 py-1 text-xs font-semibold rounded-full
            ${donation.category === 'environmental' ? 'bg-emerald-500' : ''}
            ${donation.category === 'education' ? 'bg-sky-500' : ''}
            ${donation.category === 'community' ? 'bg-purple-500' : ''}
            ${donation.category === 'infrastructure' ? 'bg-orange-500' : ''}
            text-white capitalize
          `}>
            {donation.category}
          </span>
        </div>

        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {donation.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {donation.description}
            </p>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ${donation.currentAmount.toLocaleString()}
                </span>
                <span className="text-gray-500">
                  of ${donation.goalAmount.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{progress.toFixed(0)}% funded</span>
                <span>${remaining.toLocaleString()} to go</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{donation.donorsCount}</p>
                  <p className="text-xs text-gray-500">Donors</p>
                </div>
              </div>
              {donation.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{donation.endDate}</p>
                    <p className="text-xs text-gray-500">End Date</p>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full" size="md">
              <Heart className="w-4 h-4 mr-2" />
              Donate Now
            </Button>
          </div>
        </CardContent>
      </DisplayCard>
    </motion.div>
  );
}
