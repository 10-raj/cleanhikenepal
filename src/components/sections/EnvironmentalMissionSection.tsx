import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, TreePine, Bird, Leaf, Droplets, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { ScrollReveal } from '../common/ContainerScroll';

const environmentalFeatures = [
  {
    icon: TreePine,
    title: 'Protect Natural Trails',
    description: 'Maintain and restore hiking paths while preserving native vegetation and preventing erosion.',
  },
  {
    icon: Bird,
    title: 'Preserve Wildlife Habitats',
    description: 'Protect natural ecosystems and ensure native species thrive in their natural environment.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Trekking Practices',
    description: 'Promote Leave No Trace principles and responsible tourism throughout all our expeditions.',
  },
  {
    icon: Droplets,
    title: 'Reduce Environmental Impact',
    description: 'Minimize waste, conserve water sources, and implement eco-friendly trekking solutions.',
  },
];

export function EnvironmentalMissionSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Our Purpose
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Support Our
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                Environmental Mission
              </span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Mission Statement */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 p-8 md:p-12 mb-16"
          >
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="10" cy="10" r="30" fill="white" />
                <circle cx="90" cy="90" r="40" fill="white" />
              </svg>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <TreePine className="w-12 h-12 text-emerald-200 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Conserving Nature for Future Generations
              </h3>
              <p className="text-emerald-100 text-lg leading-relaxed">
                We believe every hike should leave nature better than we found it. Our mission is to promote
                responsible trekking, preserve natural ecosystems, protect wildlife habitats, reduce environmental
                impact, and inspire future generations to enjoy and conserve nature responsibly.
              </p>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {environmentalFeatures.map((feature) => (
            <ScrollReveal key={feature.title}>
              <motion.div
                whileHover={{ y: -8 }}
                className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal>
  <div className="flex flex-col items-center mt-12">
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      Join us in protecting Nepal's natural beauty
    </p>
    <Link to="/donate">
      <Button className="btn-group flex items-center justify-center" size="lg">
        <Heart className="w-5 h-5 mr-2" />
        Support Our Mission
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
