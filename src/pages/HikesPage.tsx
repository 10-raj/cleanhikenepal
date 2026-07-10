import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, SortAsc } from 'lucide-react';
import { hikesData } from '../data/hikes';
import { HikeCard } from '../components/cards/HikeCard';
import { ScrollReveal } from '../components/common/ContainerScroll';

const difficulties = ['All', 'Easy', 'Moderate', 'Challenging', 'Hard'];

export function HikesPage() {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredHikes = useMemo(() => {
    let hikes = [...hikesData];

    // Filter by search
    if (search) {
      hikes = hikes.filter(hike =>
        hike.name.toLowerCase().includes(search.toLowerCase()) ||
        hike.location.toLowerCase().includes(search.toLowerCase()) ||
        hike.region.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      hikes = hikes.filter(hike => hike.difficulty === selectedDifficulty);
    }

    // Sort by duration (assuming format like "14 days")
    hikes.sort((a, b) => {
      const aDays = parseInt(a.duration);
      const bDays = parseInt(b.duration);
      return sortOrder === 'asc' ? aDays - bDays : bDays - aDays;
    });

    return hikes;
  }, [search, selectedDifficulty, sortOrder]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Himalayan mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-green-900/70 to-gray-900/80" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
        Explore Nepal's Trails
        </motion.h1>
        <p className="text-gray-200" >
        with {""} 
        </p>
        <a
        href="https://nepaltourandtrek.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline hover:text-gray-300 transition"
        >
        Nepal Tour and Trek
        </a>

<motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="text-gray-300 text-lg max-w-2xl mx-auto"
>
  Discover curated hiking experiences from day trips to epic multi-day adventures
</motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hikes by name or location..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff === 'All' ? 'All Difficulties' : diff}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500/50 transition-all"
            >
              <SortAsc className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              Duration
            </button>
          </div>
        </ScrollReveal>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredHikes.length}</span> hikes
          </p>
        </div>

        {/* Hikes Grid */}
        {filteredHikes.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hikes found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredHikes.map((hike, index) => (
              <HikeCard key={hike.id} hike={hike} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}