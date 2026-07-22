import { motion } from 'framer-motion';
import { Target, Eye, Leaf, Users, Award, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ScrollReveal } from '../components/common/ContainerScroll';
import { supabase } from '../services/supabase';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social_links?: Record<string, string>;
}

interface AboutContentItem {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  designation: string | null;
}

const fallbackTeam: TeamMember[] = [
  { name: 'Avib Adhikari', role: 'Founder & CEO', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Lifetime mountaineer with 30+ years of Himalayan experience' },
  { name: 'Umang Raj Gurung', role: 'Environmental Director', image: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Environmental scientist specializing in sustainable tourism' },
  { name: 'Raj Acharya', role: 'Community Liaison', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Connects trekkers with authentic local experiences' },
  { name: 'Alice KC', role: 'Head Guide', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Led 500+ successful expeditions across Nepal' },
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
  const [team, setTeam] = useState<TeamMember[]>(fallbackTeam);
  const [mission, setMission] = useState<string>('To provide transformative trekking experiences while actively preserving Nepal\'s natural environment and supporting the communities that make these journeys possible.');
  const [vision, setVision] = useState<string>('A future where adventure tourism and environmental stewardship work hand-in-hand, creating a model for sustainable development across the Himalayan region.');
  const [historyText, setHistoryText] = useState<string | null>(null);
  const [founders, setFounders] = useState<AboutContentItem[]>([]);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data } = await supabase
          .from('team_members')
          .select('name, role, image, bio, social_links')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (data && data.length > 0) setTeam(data);
      } catch { /* use fallback */ }
    }
    async function fetchAboutContent() {
      try {
        const { data } = await supabase
          .from('about_content')
          .select('id, section, title, subtitle, description, image, designation')
          .eq('is_active', true)
          .eq('status', 'published')
          .order('display_order', { ascending: true });
        if (data) {
          const missionItem = data.find(d => d.section === 'mission');
          if (missionItem?.description) setMission(missionItem.description);
          const visionItem = data.find(d => d.section === 'vision');
          if (visionItem?.description) setVision(visionItem.description);
          const historyItem = data.find(d => d.section === 'history');
          if (historyItem?.description) setHistoryText(historyItem.description);
          const founderItems = data.filter(d => d.section === 'founders');
          if (founderItems.length > 0) setFounders(founderItems);
        }
      } catch { /* use fallback */ }
    }
    fetchTeam();
    fetchAboutContent();
  }, []);
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
                {mission}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
              <Eye className="w-12 h-12 mb-6" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-sky-100 leading-relaxed">
                {vision}
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

        {/* History */}
        {historyText && (
          <ScrollReveal>
            <div className="mb-20 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Our History</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{historyText}</p>
            </div>
          </ScrollReveal>
        )}

        {/* Founders */}
        {founders.length > 0 && (
          <ScrollReveal>
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Founders</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {founders.map((f) => (
                  <div key={f.id} className="text-center">
                    {f.image && (
                      <div className="relative mb-4 inline-block">
                        <img src={f.image} alt={f.title || ''} className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-emerald-500" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{f.title}</h3>
                    {f.designation && <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2">{f.designation}</p>}
                    {f.description && <p className="text-gray-600 dark:text-gray-400 text-sm">{f.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

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
                {member.social_links && Object.keys(member.social_links).length > 0 && (
                  <div className="flex justify-center gap-3 mt-3">
                    {member.social_links.twitter && <a href={member.social_links.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>}
                    {member.social_links.linkedin && <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a>}
                    {member.social_links.instagram && <a href={member.social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg></a>}
                    {member.social_links.facebook && <a href={member.social_links.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg></a>}
                  </div>
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
