import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter } from 'lucide-react';
import { featuredHikes } from '../../data/hikes';
import { HikeCard } from '../cards/HikeCard';
import { Button } from '../ui/Button';
import { ScrollReveal } from '../common/ContainerScroll';

export function FeaturedHikesSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
                <Filter className="w-4 h-4" />
                Featured Treks
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Popular Hiking
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                  Adventures
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl">
                Explore our most beloved trails, handpicked for their stunning views and cultural significance.
              </p>
            </div>
            <Link to="/hikes">
              <Button variant="outline" className="group">
                View All Hikes
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Featured Hikes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredHikes.slice(0, 3).map((hike, index) => (
            <HikeCard key={hike.id} hike={hike} index={index} />
          ))}
        </div>

        {/* Difficulty Filter Pills */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-16">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Browse by difficulty:</span>
            {['Easy', 'Moderate', 'Challenging', 'Hard'].map((difficulty) => (
              <Link
                key={difficulty}
                to={`/hikes?difficulty=${difficulty.toLowerCase()}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
              >
                {difficulty}
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
