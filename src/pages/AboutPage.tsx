import { motion } from 'framer-motion';
import { Target, Eye, Leaf, Users, Award, Globe } from 'lucide-react';
import { ScrollReveal } from '../components/common/ContainerScroll';

const team = [
  {
    name: 'Avib Adhikari',
    role: 'Founder & CEO',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Lifetime mountaineer with 30+ years of Himalayan experience',
  },
  {
    name: 'Umang Raj Gurung',
    role: 'Environmental Director',
    image: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Environmental scientist specializing in sustainable tourism',
  },
  {
    name: 'Raj Acharya',
    role: 'Community Liaison',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Connects trekkers with authentic local experiences',
  },
  {
    name: 'Alice KC ',
    role: 'Head Guide',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Led 500+ successful expeditions across Nepal',
  },
  {
    name: 'Pratik Shrestha',
    role: 'Head Guide',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Led 500+ successful expeditions across Nepal',
  },
  {
    name: 'Praful Gole',
    role: 'Head Guide',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Led 500+ successful expeditions across Nepal',
  },
];

const milestones = [
  { year: '2025 October', event: 'CleanHike Nepal founded' },
  { year: '2026 Febrauray 28', event: 'First trail cleanup program launched' },
  { year: '2026 March 1', event: 'Partnership with German Exam Nepal' },
  { year: '2026 March 20', event: 'Partnership with Nepal Tour and Trek' },
  { year: '2026 June 20', event: '5+ clean hike projects completed' },
  //{ year: '2024', event: 'Expanded to 12 trekking regions' },//
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1321889/pexels-photo-1321889.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Nepal mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-green-900/70 to-gray-900/80" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-sm mb-6 mt-20"
          >
            <Leaf className="w-4 h-4" />
            Since 2025
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Pioneering sustainable eco-tourism in Nepal's Himalayan trails
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
              <Target className="w-12 h-12 mb-6" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-emerald-100 leading-relaxed">
                To provide transformative trekking experiences while actively preserving Nepal's natural
                environment and supporting the communities that make these journeys possible.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
              <Eye className="w-12 h-12 mb-6" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-sky-100 leading-relaxed">
                A future where adventure tourism and environmental stewardship work hand-in-hand,
                creating a model for sustainable development across the Himalayan region.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Core Values */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our values guide every decision we make, from trail selection to community partnerships
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Leaf, title: 'Sustainability', desc: 'Leave No Trace principles in everything we do' },
            { icon: Users, title: 'Community', desc: 'Empowering local economies and cultures' },
            { icon: Award, title: 'Excellence', desc: 'Uncompromising quality and safety standards' },
            { icon: Globe, title: 'Global Impact', desc: 'Inspiring sustainable tourism worldwide' },
          ].map((value) => (
            <ScrollReveal key={value.title}>
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <value.icon className="w-10 h-10 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Timeline */}
        <ScrollReveal>
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Our Journey
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-emerald-500/30" />
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center gap-8 mb-12 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg ${
                        index % 2 === 0 ? 'ml-auto' : 'mr-auto'
                      }`}
                    >
                      <span className="text-emerald-500 font-bold">{milestone.year}</span>
                      <p className="text-gray-900 dark:text-white mt-1">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-emerald-500 z-10 flex-shrink-0" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Team */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Passionate locals dedicated to sharing Nepal's beauty with the world
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <ScrollReveal key={member.name}>
              <motion.div
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <div className="relative mb-4 inline-block">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-emerald-500"
                  />
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
