import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mountain, Trees, Heart, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

const floatingStats = [
  { icon: Mountain, label: '5+ Hikes', value: 'Explore' },
  { icon: Trees, label: 'Eco-Certified', value: 'Green' },
  { icon: Heart, label: '50+ Donors', value: 'Support' },
  { icon: Compass, label: '24/7 Guide', value: 'Assist' },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-gray-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/40" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -20, 20],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-sm mt-20"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Preserving Nepal's Natural Beauty
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Discover Nepal's
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-sky-400 bg-clip-text text-transparent">
            Pristine Trails
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Experience sustainable eco-tourism that preserves the Himalayas for future generations.
          Every hike supports local communities and environmental conservation.
        </motion.p>

     {/* CTA Buttons */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7 }}
  className="flex flex-col items-center gap-8 mb-16"
>
  {/* Primary CTA */}
  <div className="flex justify-center">
    <Link to="/contact">
      <Button
        size="lg"
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 text-lg flex items-center justify-center group"
      >
        Join Us For Upcoming Clean Hikes
        <ArrowRight className="w-6 h-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </Link>
  </div>

  {/* Secondary CTAs */}
  <div className="flex flex-row flex-wrap justify-center gap-6">
    <Link to="/hikes">
      <Button
        variant="outline"
        size="lg"
        className="border-white/30 text-white hover:bg-white/10 hover:text-white flex items-center group"
      >
        Explore Hikes
        <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </Link>

    <Link to="/donate">
      <Button
        variant="outline"
        size="lg"
        className="border-white/30 text-white hover:bg-white/10 hover:text-white"
      >
        Support Our Mission
      </Button>
    </Link>
  </div>
</motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {floatingStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-500/30 transition-all"
            >
              <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">{stat.label}</p>
              <p className="text-sm text-gray-400">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
