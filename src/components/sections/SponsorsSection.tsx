import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sponsorsData } from '../../data/sponsors';
import { useSponsors } from '../../hooks/useSponsors';
import { SponsorLogo } from '../cards/SponsorCard';
import { ScrollReveal } from '../common/ContainerScroll';

export function SponsorsSection() {
  const { sponsors } = useSponsors();
  const activeSponsors = sponsors.length > 0 ? sponsors : sponsorsData;
  const duplicatedSponsors = [...activeSponsors, ...activeSponsors];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-sm font-medium mb-4">
              Our Partners
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Backed by
              <br />
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                Trusted Organizations
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our corporate partners share our vision for sustainable tourism and environmental protection.
            </p>
          </div>
        </ScrollReveal>

        {/* Infinite Scroll Logo Carousel */}
        <div className="relative overflow-hidden mb-12">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent z-10" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="flex gap-6"
          >
            {duplicatedSponsors.map((sponsor, index) => (
              <SponsorLogo key={`${sponsor.id}-${index}`} sponsor={sponsor} />
            ))}
          </motion.div>
        </div>

        {/* Partner CTA */}
        <ScrollReveal>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Interested in partnering with CleanHike Nepal?
            </p>
            <Link
              to="/contact?partner=true"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
            >
              Become a Partner
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
