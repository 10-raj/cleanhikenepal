import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building, BadgeCheck, Star, ArrowRight } from 'lucide-react';
import { sponsorsData } from '../data/sponsors';
import { useSponsorsByTier } from '../hooks/useSponsors';
import { SponsorCard } from '../components/cards/SponsorCard';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/common/ContainerScroll';

export function SponsorsPage() {
  const { sponsorsByTier, loading } = useSponsorsByTier();

  const hasData = Object.values(sponsorsByTier).some(arr => arr.length > 0);
  const platinum = hasData ? sponsorsByTier.platinum : sponsorsData.filter(s => s.tier === 'platinum');
  const gold = hasData ? sponsorsByTier.gold : sponsorsData.filter(s => s.tier === 'gold');
  const silver = hasData ? sponsorsByTier.silver : sponsorsData.filter(s => s.tier === 'silver');
  const bronze = hasData ? sponsorsByTier.bronze : sponsorsData.filter(s => s.tier === 'bronze');

  const tiers = [
    {
      name: 'Platinum',
      description: 'Premium visibility and exclusive partnership opportunities',
      color: 'from-purple-500 to-purple-700',
      sponsors: platinum,
      benefits: ['Logo hero placement', 'Exclusive event access', 'Direct community engagement'],
    },
    {
      name: 'Gold',
      description: 'Featured placement across our platform',
      color: 'from-yellow-500 to-yellow-700',
      sponsors: gold,
      benefits: ['Featured logo display', 'Campaign co-branding', 'Social media features'],
    },
    {
      name: 'Silver',
      description: 'Visibility on key pages and campaigns',
      color: 'from-gray-400 to-gray-600',
      sponsors: silver,
      benefits: ['Logo on sponsors page', 'Newsletter mentions', 'Impact reports'],
    },
    {
      name: 'Bronze',
      description: 'Community partner recognition',
      color: 'from-orange-600 to-orange-800',
      sponsors: bronze,
      benefits: ['Logo display', 'Thank you posts', 'Certificate of partnership'],
    },
  ];

  const totalSponsors = platinum.length + gold.length + silver.length + bronze.length;
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative h-64 flex items-center justify-center mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Partnership"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-blue-900/70 to-gray-900/80" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-sm mb-6"
          >
            <Building className="w-4 h-4" />
            {totalSponsors} Partners
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our Partners
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg"
          >
            Organizations committed to sustainable tourism in Nepal
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier Sections */}
        {tiers.map((tier) => (
          <ScrollReveal key={tier.name}>
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${tier.color} text-white`}>
                  {tier.name === 'Platinum' && <Star className="w-6 h-6" />}
                  {tier.name === 'Gold' && <BadgeCheck className="w-6 h-6" />}
                  {tier.name === 'Silver' && <BadgeCheck className="w-6 h-6" />}
                  {tier.name === 'Bronze' && <BadgeCheck className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tier.name} Partners</h2>
                  <p className="text-gray-600 dark:text-gray-400">{tier.description}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tier.sponsors.map((sponsor) => (
                  <SponsorCard key={sponsor.id} sponsor={sponsor} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}

        {/* Become a Partner */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 p-8 md:p-12 text-center"
          >
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="20" cy="20" r="40" fill="white" />
                <circle cx="80" cy="80" r="30" fill="white" />
              </svg>
            </div>
            <div className="relative z-10">
              <Building className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Become a Partner
              </h2>
              <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
                Join our network of organizations committed to sustainable tourism.
                Gain visibility while supporting Nepal's environment and communities.
              </p>
              <Link to="/contact?partner=true">
                <Button variant="secondary" size="lg" className="group">
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
