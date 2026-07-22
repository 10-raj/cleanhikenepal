import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mountain, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { navigateToLink } from '../../utils/navigateToLink';

export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description?: string;
  button_text: string;
  button_link: string;
  button_visible?: boolean;
  open_new_tab?: boolean;
  sort_order: number;
  is_active: boolean;
  status?: 'published' | 'draft';
  mobile_image?: string;
  overlay_opacity?: number;
  text_alignment?: 'left' | 'center' | 'right';
  start_date?: string | null;
  end_date?: string | null;
  icon?: 'mountain' | 'camera';
}

const defaultSlides: BannerSlide[] = [
  {
    id: 'default-1',
    image: 'https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Join the Clean Hike Movement',
    subtitle: 'Every step matters. Together we preserve Nepal\'s breathtaking trails for generations to come.',
    button_text: 'Join Upcoming Clean Hike',
    button_link: '/contact#join-us-for-clean-hike',
    sort_order: 1,
    is_active: true,
    icon: 'mountain',
  },
  {
    id: 'default-2',
    image: 'https://images.pexels.com/photos/12715946/pexels-photo-12715946.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Our Moments',
    subtitle: 'Captured memories from our clean hikes and community events. Relive the trails, the smiles, and the impact.',
    button_text: 'View Gallery',
    button_link: '/gallery',
    sort_order: 2,
    is_active: true,
    icon: 'camera',
  },
];

export function BannerCarousel() {
  const [slides, setSlides] = useState<BannerSlide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from('hero_banners')
          .select('*')
          .eq('is_active', true)
          .eq('status', 'published')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const now = new Date();
          const visible = (data as BannerSlide[]).filter(s => {
            if (s.start_date && new Date(s.start_date) > now) return false;
            if (s.end_date && new Date(s.end_date) < now) return false;
            return true;
          });
          if (visible.length > 0) setSlides(visible);
        }
      } catch {
        // Use default slides
      }
    }
    fetchBanners();
  }, []);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setDirection(1);
        setCurrent(prev => (prev + 1) % slides.length);
      }
    }, 5000);
  }, [slides.length, isPaused]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoplay]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    startAutoplay();
  };

  const prev = () => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
    startAutoplay();
  };

  const next = () => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % slides.length);
    startAutoplay();
  };

  const handleCTAClick = (link: string) => navigateToLink(link, navigate);

  if (slides.length === 0) return null;

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
    }),
  };

  return (
    <>
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(600px, 90vh, 900px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover hidden md:block"
              loading="eager"
            />
            {slide.mobile_image ? (
              <img
                src={slide.mobile_image}
                alt={slide.title}
                className="w-full h-full object-cover md:hidden"
                loading="eager"
              />
            ) : (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover md:hidden"
                loading="eager"
              />
            )}
            {/* Overlay gradient */}
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: (slide.overlay_opacity ?? 50) / 100 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
          </div>

          {/* Content */}
          <div className={`absolute inset-0 flex items-center justify-center ${slide.text_alignment === 'left' ? 'justify-start md:pl-20' : slide.text_alignment === 'right' ? 'justify-end md:pr-20' : ''}`}>
            <div className={`max-w-5xl mx-auto px-6 ${slide.text_alignment === 'left' ? 'text-left' : slide.text_alignment === 'right' ? 'text-right' : 'text-center'}`}>
              {/* Badge */}
              {/*
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-sm font-medium mb-6"
              >
                
              {slide.icon === 'camera' ? <Camera className="w-4 h-4" /> : <Mountain className="w-4 h-4" />}
                CleanHike Nepal
                

              </motion.div> 
              */}

              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
              >
                {slide.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-gray-200 mb-4 max-w-2xl mx-auto leading-relaxed"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
              >
                {slide.subtitle}
              </motion.p>

              {/* Description */}
              {slide.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                >
                  {slide.description}
                </motion.p>
              )}
              {!slide.description && <div className="mb-10" />}

              {/* CTA Button */}
              {slide.button_visible !== false && slide.button_text && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => {
                      if (slide.open_new_tab && /^https?:\/\//i.test(slide.button_link)) {
                        window.open(slide.button_link, '_blank', 'noopener,noreferrer');
                      } else {
                        handleCTAClick(slide.button_link);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold text-lg shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    {slide.icon === 'camera' ? <Camera className="w-5 h-5" /> : <Mountain className="w-5 h-5" />}
                    {slide.button_text}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? 'w-8 h-3 bg-emerald-400'
                : 'w-3 h-3 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!isPaused && (
        <motion.div
          key={`${slide.id}-progress`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: 'linear' }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400/60 origin-left z-20"
        />
      )}
    </div>
    </>
  );
}
