import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MapPin, Phone, Send, Clock, CheckCircle, AlertCircle,
  Heart, Handshake, Users, Mountain, Calendar, User, Timer, Navigation,
  Loader2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { ScrollReveal } from '../common/ContainerScroll';
import { InteractiveMap } from '../common/InteractiveMap';
import { supabase } from '../../services/supabase';
import { submitContactForm } from '../../services/contact';

const purposes = [
  { id: 'general', label: 'General Inquiry', icon: Mail, description: 'Questions about hikes, donations, or anything else' },
  { id: 'volunteer', label: 'Join as Volunteer', icon: Heart, description: 'Lend a hand on trails, cleanups, or events' },
  { id: 'partner', label: 'Join as Partner', icon: Handshake, description: 'Collaborate as a business or organization' },
  { id: 'donation', label: 'Donation Question', icon: Users, description: 'How donations are used or how to contribute' },
  { id: 'join_hike', label: 'Join Us For Clean Hike', icon: Mountain, description: 'Participate in our next community clean hike' },
] as const;

const volunteerInterests = [
  'Trail Cleanup', 'Community Outreach', 'Event Support', 'Photography / Media', 'Guiding / Logistics', 'Other',
] as const;

const partnerTypes = [
  'Corporate Sponsor', 'NGO / Non-Profit', 'Government Body', 'Local Business', 'Travel Agency', 'Other',
] as const;

const howHeardOptions = [
  'Instagram', 'Facebook', 'YouTube', 'Google Search', 'Friend Recommendation', 'College/Organization', 'Other',
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
  { icon: MapPin, title: 'Visit Us', content: 'Dakshinkali, Kathmandu, Nepal', link: null },
  { icon: Mail, title: 'Email Us', content: 'info@cleanhikenepal.com', link: 'mailto:info@cleanhikenepal.com', isEmail: true },
  { icon: Phone, title: 'Call Us', content: '+977 98767262762', link: 'tel:+9779876726276' },
  { icon: Clock, title: 'Working Hours', content: 'Mon-Sat, 9AM - 6PM', link: null },
];

/** Desktop browsers open mailto: via the OS default mail client (often Outlook),
 * ignoring that the business actually uses Gmail. Mobile already resolves
 * mailto: to the Gmail app correctly via OS-level intent handling, so this
 * only needs to special-case desktop: open Gmail's web compose instead. */
function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function handleEmailClick(e: React.MouseEvent, email: string) {
  if (isMobileDevice()) return; // let the native mailto: -> Gmail app handoff happen
  e.preventDefault();
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank', 'noopener,noreferrer');
}

const defaultNextHike = {
  name: 'Community Clean Hike',
  location: 'Jamcho Gumba Trail, Kathmandu',
  date: '25th July, Saturday',
  description: 'Join us for our weekly community clean hike. We meet at the trailhead, hike together, and clean up along the way. All are welcome!',
  time: '7:00 AM',
  meeting_point: 'Jamacho Hike Point',
  difficulty: 'Easy',
  participants: '50 Volunteers',
  registration_link: '',
  image: '',
};

export function ContactSection() {
  const location = useLocation();
  const formRef = useRef<HTMLDivElement>(null);
  const upcomingHikeRef = useRef<HTMLDivElement>(null);
  const joinPartnerRef = useRef<HTMLDivElement>(null);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('general');
  const [interest, setInterest] = useState<string>('');
  const [partnerType, setPartnerType] = useState<string>('');
  const [numMembers, setNumMembers] = useState<string>('');
  const [howHeard, setHowHeard] = useState<string>('');
  const [nextHike, setNextHike] = useState(defaultNextHike);

  // Auto-scroll and auto-select purpose based on URL hash
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const scrollToSection = (id: string, purpose?: string) => {
      if (purpose) setSelectedPurpose(purpose);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    };

    if (hash === '#join-us-for-clean-hike') {
      scrollToSection('join-us-for-clean-hike', 'join_hike');
    } else if (hash === '#join-as-partner') {
      scrollToSection('join-as-partner', 'partner');
    } else if (hash === '#join-as-volunteer') {
      scrollToSection('join-as-volunteer', 'volunteer');
    } else if (hash === '#upcoming-hike') {
      scrollToSection('upcoming-hike');
    }
  }, [location.hash]);

  useEffect(() => {
    async function fetchNextHike() {
      try {
        const { data } = await supabase
          .from('website_settings')
          .select('next_hike_name, next_hike_location, next_hike_date, next_hike_description, next_hike_time, next_hike_meeting_point, next_hike_difficulty, next_hike_registration_link, next_hike_image, next_hike_participants')
          .limit(1)
          .maybeSingle();
        if (data) {
          setNextHike({
            name: data.next_hike_name || defaultNextHike.name,
            location: data.next_hike_location || defaultNextHike.location,
            date: data.next_hike_date || defaultNextHike.date,
            description: data.next_hike_description || defaultNextHike.description,
            time: data.next_hike_time || defaultNextHike.time,
            meeting_point: data.next_hike_meeting_point || defaultNextHike.meeting_point,
            difficulty: data.next_hike_difficulty || defaultNextHike.difficulty,
            participants: (data as any).next_hike_participants || defaultNextHike.participants,
            registration_link: data.next_hike_registration_link || '',
            image: data.next_hike_image || '',
          });
        }
      } catch { /* use defaults */ }
    }
    fetchNextHike();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('loading');
    try {
      await submitContactForm({
        ...data,
        purpose: selectedPurpose,
        interest: interest || undefined,
        partnerType: partnerType || undefined,
        numberOfMembers: numMembers ? parseInt(numMembers) : undefined,
        howHeard: howHeard || undefined,
      });
      setSubmitStatus('success');
      reset();
      setInterest('');
      setPartnerType('');
      setNumMembers('');
      setHowHeard('');
    } catch {
      setSubmitStatus('error');
    }
  };

  const difficultyColor: Record<string, string> = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Moderate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Challenging: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <section className="pt-20 pb-12 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              <Mail className="w-4 h-4" />
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5">
              Contact{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                CleanHike Nepal
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you want to join a hike, partner with us, or just say hello — we'd love to hear from you!
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Info Cards */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {contactInfo.map((info) => {
              const cardClass = "p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-500/50 transition-all text-center group";
              const cardContent = (
                <>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500 transition-colors">
                    <info.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">{info.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{info.content}</p>
                </>
              );

              if (!info.link) {
                // Visit Us / Working Hours: hover animation only, not clickable
                return (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    className={`${cardClass} cursor-default select-none`}
                  >
                    {cardContent}
                  </motion.div>
                );
              }

              return (
                <motion.a
                  key={info.title}
                  href={info.link}
                  onClick={info.isEmail ? (e) => handleEmailClick(e, 'info@cleanhikenepal.com') : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className={cardClass}
                >
                  {cardContent}
                </motion.a>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ─── Upcoming Clean Hike Info Card ─── */}
        <div id="upcoming-hike" ref={upcomingHikeRef} className="mb-10 scroll-mt-24">
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden border border-emerald-200 dark:border-emerald-800 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/10"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center gap-3">
                <Mountain className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">Next Community Clean Hike</h3>
                  <p className="text-emerald-100 text-sm">{nextHike.name}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Location</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{nextHike.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{nextHike.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow flex items-center justify-center flex-shrink-0">
                      <Timer className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{nextHike.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow flex items-center justify-center flex-shrink-0">
                      <Navigation className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Meeting Point</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{nextHike.meeting_point}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Expected Participants</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{nextHike.participants}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow flex items-center justify-center flex-shrink-0">
                      <Mountain className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Difficulty</p>
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5 ${difficultyColor[nextHike.difficulty] || difficultyColor['Easy']}`}>
                        {nextHike.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {nextHike.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-emerald-200/60 dark:border-emerald-800/60 pt-4">
                    {nextHike.description}
                  </p>
                )}
              </div>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* ─── Contact Form ─── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:items-start">
          {/* Purpose Selector + Form */}
          <ScrollReveal>
            <div id="join-us-for-clean-hike" ref={formRef} className="scroll-mt-24">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send us a Message</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Choose your inquiry type and fill in the form below.</p>

              {/* Purpose Selector */}
              <div className="grid grid-cols-1 gap-3 mb-8">
                {purposes.map((purpose) => {
                  const isSelected = selectedPurpose === purpose.id;
                  const Icon = purpose.icon;
                  const anchorId = purpose.id === 'partner'
                    ? 'join-as-partner'
                    : purpose.id === 'volunteer'
                      ? 'join-as-volunteer'
                      : undefined;
                  return (
                    <div key={purpose.id} id={anchorId} className="scroll-mt-24">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedPurpose(purpose.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>
                            {purpose.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{purpose.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto flex-shrink-0" />
                        )}
                      </motion.button>
                    </div>
                  );
                })}
              </div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    {...register('name')}
                    id="name"
                    label="Full Name *"
                    placeholder="Your name"
                    error={errors.name?.message}
                  />
                  <Input
                    {...register('email')}
                    id="email"
                    label="Email *"
                    type="email"
                    placeholder="your@email.com"
                    error={errors.email?.message}
                  />
                </div>

                <Input
                  {...register('phone')}
                  id="phone"
                  label="Phone (Optional)"
                  placeholder="+977 9XXXXXXXX"
                  error={errors.phone?.message}
                />

                {/* Next Clean Hike — read-only, auto-populated from the Admin Panel.
                    Only shown for the Join Us for Clean Hike purpose, between
                    Phone and "How many people will be joining". */}
                {selectedPurpose === 'join_hike' && (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Next Clean Hike</p>
                      <span className="text-[10px] uppercase tracking-wide text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Auto-filled</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">Date:</span> {nextHike.date}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      <span className="font-medium text-gray-900 dark:text-white">Location:</span> {nextHike.location}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      This is set automatically from the Admin Panel and can't be edited here.
                    </p>
                  </div>
                )}

                {/* Volunteer interest */}
                {selectedPurpose === 'volunteer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Area of Interest</label>
                    <div className="grid grid-cols-2 gap-2">
                      {volunteerInterests.map(opt => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setInterest(opt)}
                          className={`px-3 py-2 rounded-xl text-sm border transition-all ${
                            interest === opt
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Partner type */}
                {selectedPurpose === 'partner' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {partnerTypes.map(opt => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setPartnerType(opt)}
                          className={`px-3 py-2 rounded-xl text-sm border transition-all ${
                            partnerType === opt
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Number of members for group hike */}
                {selectedPurpose === 'join_hike' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      How many people will be joining?
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={numMembers}
                      onChange={e => setNumMembers(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                )}

                <Input
                  {...register('subject')}
                  id="subject"
                  label="Subject *"
                  placeholder="How can we help you?"
                  error={errors.subject?.message}
                />

                {/* How did you hear */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    value={howHeard}
                    onChange={e => setHowHeard(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select option...</option>
                    {howHeardOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <Textarea
                  {...register('message')}
                  id="message"
                  label="Message *"
                  rows={5}
                  placeholder="Tell us about your inquiry..."
                  error={errors.message?.message}
                />

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
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
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-200">Failed to send message</p>
                        <p className="text-sm text-red-600 dark:text-red-400">Please try again or email us directly at acharyaraj2005@gmail.com</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {submitStatus === 'loading' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Send Message</>
                  )}
                </button>
              </motion.form>
            </div>
          </ScrollReveal>

          {/* Map & Location */}
          <ScrollReveal>
            <div className="space-y-6 lg:sticky lg:top-24">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Find Us</h3>
                <p className="text-gray-500 dark:text-gray-400">We're based in Kathmandu, Nepal — come visit us!</p>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 h-[320px] sm:h-[380px] lg:h-[420px]">
                <InteractiveMap />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
