import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Leaf, Users, Globe } from 'lucide-react';
import { paymentMethods } from '../config/paymentMethods';
import { PaymentMethodCard, BankTransferCard } from '../components/donate/PaymentMethodCard';
import { DonationModal, BankTransferModal } from '../components/donate/DonationModals';
import { ScrollReveal } from '../components/common/ContainerScroll';
import { PaymentMethod } from '../config/paymentMethods';

export function DonatePage() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);

  const stats = [
    { icon: Users, value: '10+', label: 'Donors' },
    { icon: Heart, value: '$20', label: 'Raised' },
    { icon: Leaf, value: '5+', label: 'Projects' },
    { icon: Globe, value: '1', label: 'Regions' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative h-64 md:h-80 flex items-center justify-center mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Nature conservation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-green-900/70 to-gray-900/80" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-sm mb-6"
          >
            <Heart className="w-4 h-4" />
            Make an Impact
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Support Our Mission
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Your donation directly supports environmental conservation and sustainable trekking in Nepal
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 -mt-0">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg text-center"
              >
                <stat.icon className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* About Donation */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Payment Method
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We support multiple payment options for your convenience. All donations go directly to environmental
              conservation, trail maintenance, and community development projects.
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Security Badge */}
        <ScrollReveal>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm">
              <Shield className="w-4 h-4" />
              Secure donations powered by trusted payment gateways
            </div>
          </div>
        </ScrollReveal>

        {/* Payment Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onClick={() => setSelectedMethod(method)}
            />
          ))}
          <BankTransferCard onClick={() => setShowBankModal(true)} />
        </div>

        {/* Impact Section */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Where Your Donation Goes
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 mx-auto mb-3 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900 dark:text-white">Trail Conservation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Maintaining and restoring Nepal's trekking routes
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-sky-500 mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900 dark:text-white">Community Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Education and healthcare for mountain communities
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500 mx-auto mb-3 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900 dark:text-white">Environmental Programs</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Wildlife protection and ecosystem preservation
                </p>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* Modals */}
      <DonationModal
        paymentMethod={selectedMethod}
        isOpen={!!selectedMethod}
        onClose={() => setSelectedMethod(null)}
        onDonated={() => setSelectedMethod(null)}
      />
      <BankTransferModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onDonated={() => setShowBankModal(false)}
      />
    </div>
  );
}
