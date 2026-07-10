import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Clock, CheckCircle, AlertCircle, Heart, Handshake, Users, Mountain, Calendar, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { ScrollReveal } from '../common/ContainerScroll';
import { InteractiveMap } from '../common/InteractiveMap';
import { submitContactForm } from '../../services/contact';
import { supabase } from '../../services/supabase';

const purposes = [
  { id: 'general', label: 'General Inquiry', icon: Mail, description: 'Questions about hikes, donations, or anything else' },
  { id: 'volunteer', label: 'Join as Volunteer', icon: Heart, description: 'Lend a hand on trails, cleanups, or events' },
  { id: 'partner', label: 'Join as Partner', icon: Handshake, description: 'Collaborate as a business or organization' },
  { id: 'donation', label: 'Donation Question', icon: Users, description: 'How donations are used or how to contribute' },
  { id: 'join_hike', label: 'Join Us For Clean Hike', icon: Mountain, description: 'Participate in our next community clean hike' },
] as const;

const volunteerInterests = [
  'Trail Cleanup',
  'Community Outreach',
  'Event Support',
  'Photography / Media',
  'Guiding / Logistics',
  'Other',
] as const;

const partnerTypes = [
  'Corporate Sponsor',
  'NGO / Non-Profit',
  'Government Body',
  'Local Business',
  'Travel Agency',
  'Other',
] as const;

const howHeardOptions = [
  'Instagram',
  'Facebook',
  'YouTube',
  'Google Search',
  'Friend Recommendation',
  'College/Organization',
  'Other',
] as const;

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    content: 'Dakshinkali, Kathmandu, Nepal',
    link: '#',
  },
  {
    icon: Mail,
    title: 'Email Us',
    content: 'hello@cleanhike.com',
    link: 'mailto:hello@cleanhike.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    content: '+977 1-423-4567',
    link: 'tel:+97714234567',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    content: 'Mon-Sat, 9AM - 6PM',
    link: '#',
  },
];

export function ContactSection() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('general');
  const [interest, setInterest] = useState<string>('');
  const [partnerType, setPartnerType] = useState<string>('');
  const [numMembers, setNumMembers] = useState<string>('');
  const [howHeard, setHowHeard] = useState<string>('');
  const [hikeJoinDate, setHikeJoinDate] = useState<string>('');
  const [nextHike, setNextHike] = useState({
    name: 'Community Clean Hike',
    location: 'Champadevi Trail, Dakshinkali',
    date: 'Every Saturday Morning',
    description: 'Join us for our weekly community clean hike. We meet at the trailhead, hike together, and clean up along the way. All are welcome!',
  });

  useEffect(() => {
    async function fetchNextHike() {
      try {
        const { data } = await supabase
          .from('website_settings')
          .select('next_hike_name, next_hike_location, next_hike_date, next_hike_description')
          .limit(1)
          .single();
        if (data) {
          setNextHike({
            name: data.next_hike_name || 'Community Clean Hike',
            location: data.next_hike_location || 'Champadevi Trail, Dakshinkali',
            date: data.next_hike_date || 'Every Saturday Morning',
            description: data.next_hike_description || 'Join us for our weekly community clean hike!',
          });
        }
      } catch {
        // Use defaults if settings not available
      }
    }
    fetchNextHike();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
  try {
    setSubmitStatus('idle');

    await submitContactForm({
      ...data,
      purpose: selectedPurpose,
      interest: selectedPurpose === 'volunteer' ? interest : undefined,
      partnerType: selectedPurpose === 'partner' ? partnerType : undefined,
      nextHikeLocation: selectedPurpose === 'join_hike' ? nextHike.location : undefined,
      numberOfMembers: selectedPurpose === 'join_hike' ? (numMembers ? parseInt(numMembers) : undefined) : undefined,
      howHeard: howHeard || undefined,
      hikeJoinDate: selectedPurpose === 'join_hike' ? (hikeJoinDate || undefined) : undefined,
    });

    setSubmitStatus('success');

    reset();
    setInterest('');
    setPartnerType('');
    setNumMembers('');
    setHowHeard('');
    setHikeJoinDate('');
  } catch (error) {
    console.error(error);

    setSubmitStatus('error');
  }
};

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              <Mail className="w-4 h-4" />
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Let's Start Your
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                Nepal Adventure
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions about our hikes, donations, or partnership opportunities? We'd love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        {/* Join Us For Clean Hike Banner */}
        <ScrollReveal>
          <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Mountain className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Join Us For Clean Hike</h3>
                <p className="text-white/90 mb-4">{nextHike.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{nextHike.date}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{nextHike.location}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPurpose('join_hike');
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-white text-emerald-600 font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-2 flex-shrink-0"
              >
                <Mountain className="w-5 h-5" />
                Register Now
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <ScrollReveal className="lg:col-span-2">
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{info.title}</p>
                    <p className="text-gray-900 dark:text-white font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {info.content}
                    </p>
                  </div>
                </motion.a>
              ))}

              {/* Interactive Map */}
              <InteractiveMap />
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal className="lg:col-span-3">
            <motion.form
              id="contact-form"
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg"
            >
              {/* Purpose Selection (MCQ-style) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How can we help you?
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {purposes.map((purpose) => {
                    const isSelected = selectedPurpose === purpose.id;
                    return (
                      <button
                        key={purpose.id}
                        type="button"
                        onClick={() => setSelectedPurpose(purpose.id)}
                        className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500/40 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                          <purpose.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                            {purpose.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{purpose.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional: Join Hike fields */}
              <AnimatePresence>
                {selectedPurpose === 'join_hike' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    {/* Next Hike Location (read-only, admin-editable) */}
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Next Hike Location</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{nextHike.name} — {nextHike.location}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{nextHike.date}</p>
                    </div>

                    {/* Number of Members */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Number of Members <span className="text-gray-400 font-normal">(including you)</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={numMembers}
                          onChange={(e) => setNumMembers(e.target.value)}
                          placeholder="1"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Preferred Join Date */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Preferred Hike Date <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="date"
                        value={hikeJoinDate}
                        onChange={(e) => setHikeJoinDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Conditional: Volunteer interests (MCQ) */}
              <AnimatePresence>
                {selectedPurpose === 'volunteer' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Which area interests you? <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {volunteerInterests.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setInterest(interest === item ? '' : item)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            interest === item
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Conditional: Partner type (MCQ) */}
              <AnimatePresence>
                {selectedPurpose === 'partner' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      What type of partner? <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {partnerTypes.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPartnerType(partnerType === item ? '' : item)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            partnerType === item
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  {...register('name')}
                  id="name"
                  label="Your Name"
                  placeholder="John Doe"
                  error={errors.name?.message}
                />
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Input
                  {...register('phone')}
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="+977 98XXXXXXXX"
                  error={errors.phone?.message}
                />
                <Input
                  {...register('subject')}
                  id="subject"
                  label="Subject"
                  placeholder="Inquiry about Everest Base Camp trek"
                  error={errors.subject?.message}
                />
              </div>

              {/* How did you hear about us? (dropdown, always visible) */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  How did you hear about us? <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <select
                  value={howHeard}
                  onChange={(e) => setHowHeard(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  <option value="">Select an option...</option>
                  {howHeardOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <Textarea
                  {...register('message')}
                  id="message"
                  label="Message"
                  rows={5}
                  placeholder="Tell us about your inquiry..."
                  error={errors.message?.message}
                />
              </div>
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-medium text-emerald-800 dark:text-emerald-200">Message sent successfully!</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">We'll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Failed to send message</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Please try again or email us directly.</p>
                  </div>
                </motion.div>
              )}

              <div className="mt-8">
                <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </div>
            </motion.form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
