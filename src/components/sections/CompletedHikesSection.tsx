import { useState, useMemo } from 'react';

import { Link } from 'react-router-dom';
import { ArrowRight, Filter, CheckCircle } from 'lucide-react';
import { completedHikes } from '../../data/completedHikes';
import { CompletedHikeCard } from '../cards/CompletedHikeCard';

import { Button } from '../ui/Button';
import { ScrollReveal } from '../common/ContainerScroll';

const difficulties = ['All', 'Easy', 'Moderate', 'Challenging', 'Hard'];

export function CompletedHikesSection() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filteredHikes = useMemo(() => {
    if (selectedDifficulty === 'All') return completedHikes;
    return completedHikes.filter(hike => hike.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              Completed Adventures
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Completed Hikes
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                Till Now
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our successfully completed trekking adventures across Nepal's magnificent trails.
            </p>
          </div>
        </ScrollReveal>

        {/* Difficulty Filter Pills */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Filter by difficulty:</span>
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedDifficulty === difficulty
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }
                `}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredHikes.length}</span> completed hikes
          </p>
        </div>

        {/* Hikes Grid */}
        {filteredHikes.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Will be doing soon...</h3>
            <p className="text-gray-500 dark:text-gray-400">Try a different difficulty filter</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHikes.map((hike, index) => (
              <CompletedHikeCard key={hike.id} hike={hike} index={index} />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <ScrollReveal>
  <div className="flex flex-col items-center mt-12">
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Ready to join our next adventure?
    </p>
    <Link to="/contact">
      <Button 
        variant="outline" 
        className="btn-group flex items-center justify-center"
      >
        Contact Us for Upcoming Clean Hike Programs
        <ArrowRight 
          className="w-5 h-5 ml-2 btn-group-hover:translate-x-1 transition-transform" 
        />
      </Button>
    </Link>
  </div>
</ScrollReveal>

      </div>
    </section>
  );
}
