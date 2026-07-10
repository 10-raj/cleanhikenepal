import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  Star,
  ArrowLeft,
  Mountain,
} from 'lucide-react';
import { hikesData } from '../data/hikes';
import { Button } from '../components/ui/Button';
import { DifficultyBadge } from '../components/ui/Badge';
import { ScrollReveal } from '../components/common/ContainerScroll';

export function HikeDetailPage() {
  const { id } = useParams();

  const hike = hikesData.find((h) => h.id === id);

  if (!hike) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Hike not found
          </h2>
          <Link to="/hikes">
            <Button variant="outline">Back to Hikes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={hike.image}
          alt={hike.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        {/* Back Button */}
        <Link
          to="/hikes"
          className="absolute top-24 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hikes
        </Link>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              {hike.featured && (
                <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
                  Featured
                </span>
              )}

              <DifficultyBadge difficulty={hike.difficulty} />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {hike.name}
            </h1>

            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5" />
              {hike.location}, {hike.region}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: Clock,
                    label: 'Duration',
                    value: hike.duration,
                  },
                  {
                    icon: TrendingUp,
                    label: 'Max Elevation',
                    value: `${hike.maxElevation}m`,
                  },
                  {
                    icon: Users,
                    label: 'Group Size',
                    value: hike.groupSize,
                  },
                  {
                    icon: Star,
                    label: 'Rating',
                    value: `${hike.rating} (${hike.reviewCount})`,
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  >
                    <stat.icon className="w-5 h-5 text-emerald-500 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal>
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About This Trek
                </h2>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {hike.description}
                </p>
              </div>
            </ScrollReveal>

            {/* Highlights */}
            <ScrollReveal>
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Highlights
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {hike.highlights.map((highlight, index) => (
                    <motion.div
                      key={highlight}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>

                      <span className="text-gray-700 dark:text-gray-300">
                        {highlight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Best Season */}
            <ScrollReveal>
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Best Seasons
                </h2>

                <div className="flex flex-wrap gap-3">
                  {hike.bestSeason.map((season) => (
                    <span
                      key={season}
                      className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium"
                    >
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {season}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg">
                <div className="text-center mb-6">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    Starting from
                  </p>

                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${hike.price}
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    per person
                  </p>
                </div>

                <a
                  href="https://nepaltourandtrek.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full mb-4" size="lg">
                    Book This Trek
                  </Button>
                </a>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    What's Included
                  </h3>

                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Experienced local guide
                    </li>

                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      All necessary permits
                    </li>

                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Accommodation during trek
                    </li>

                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Three meals per day
                    </li>

                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Emergency first aid kit
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}