import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Leaf, Users, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { ScrollReveal } from '../common/ContainerScroll';

const values = [
  {
    icon: Leaf,
    title: 'Sustainability First',
    description: 'We practice and promote Leave No Trace principles, ensuring trails remain pristine for future generations.',
  },
  {
    icon: Users,
    title: 'Community Impact',
    description: '100% of donations go directly to local communities, supporting education, healthcare, and infrastructure.',
  },
  {
    icon: Target,
    title: 'Transparent Operations',
    description: 'Track every donation and see real-time progress on environmental projects you support.',
  },
  {
    icon: Eye,
    title: 'Authentic Experiences',
    description: 'Connect with local guides, experience genuine culture, and create meaningful memories in the Himalayas.',
  },
];

export function AboutSection() {
const ref = useRef<HTMLElement>(null);

  return (
    <section ref={ref} className="relative py-24 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              <Leaf className="w-4 h-4" />
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Preserving Paradise,
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                One Hike at a Time
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              CleanHike Nepal combines adventure tourism with environmental stewardship, creating sustainable
              experiences that benefit both travelers and the communities they visit.
            </p>
          </div>
        </ScrollReveal>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value) => (
            <ScrollReveal key={value.title}>
              <motion.div
                whileHover={{ y: -8 }}
                className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Image & Stats */}
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700">
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                alt="Nepal landscape"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="grid md:grid-cols-3 gap-8 text-white text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-5xl md:text-6xl font-bold mb-2">50+</p>
                  <p className="text-emerald-200">Happy Hikkers</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-5xl md:text-6xl font-bold mb-2">$0</p>
                  <p className="text-emerald-200">Raised for Conservation</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-5xl md:text-6xl font-bold mb-2">5+</p>
                  <p className="text-emerald-200">Hike Projects</p>
                </motion.div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <div className="flex justify-center mt-12">
  <Link to="/about">
    <Button 
      variant="outline" 
      size="lg" 
      className="btn-group flex items-center"
    >
      Learn More About Us
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
