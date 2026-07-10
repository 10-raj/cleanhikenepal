import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { donationsData } from '../../data/donations';
import { useDonationCampaigns } from '../../hooks/useDonations';
import { DonationCard } from '../cards/DonationCard';
import { Button } from '../ui/Button';
import { ScrollReveal } from '../common/ContainerScroll';

export function DonationSection() {
  const { campaigns } = useDonationCampaigns();
  const topDonations = campaigns.length > 0 ? campaigns.slice(0, 3) : donationsData.slice(0, 3);

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Make an Impact
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Support Our
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Environmental Mission
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your contribution directly funds trail conservation, community development,
              and environmental education across Nepal's trekking regions.
            </p>
          </div>
        </ScrollReveal>

        {/* Donation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {topDonations.map((donation, index) => (
            <DonationCard key={donation.id} donation={donation} index={index} />
          ))}
        </div>

        {/* Stats Bar */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 to-green-700 p-8 mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold">$180K</p>
                <p className="text-emerald-200 text-sm mt-1">Total Raised</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold">1,200+</p>
                <p className="text-emerald-200 text-sm mt-1">Active Donors</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold">45</p>
                <p className="text-emerald-200 text-sm mt-1">Projects Funded</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold">12</p>
                <p className="text-emerald-200 text-sm mt-1">Regions Impacted</p>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <div className="text-center">
            <Link to="/donate">
              <Button className="group" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                View All Campaigns
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
