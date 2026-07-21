import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { ScrollReveal } from '../common/ContainerScroll';
import { Button } from '../ui/Button';

interface FeaturedPhoto {
  image: string;
  title: string;
  description: string;
  link: string;
}

const defaultPhoto: FeaturedPhoto = {
  image: 'https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=1200',
  title: 'Featured Clean Hikes',
  description: 'Discover the breathtaking beauty of Nepal\'s trails.',
  link: '/gallery',
};

export function FeaturedPhotoSection() {
  const [photo, setPhoto] = useState<FeaturedPhoto>(defaultPhoto);

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const { data } = await supabase
          .from('website_settings')
          .select('featured_photo_image, featured_photo_title, featured_photo_description, featured_photo_link')
          .limit(1)
          .maybeSingle();
        if (data) {
          setPhoto({
            image: data.featured_photo_image || defaultPhoto.image,
            title: data.featured_photo_title || defaultPhoto.title,
            description: data.featured_photo_description || defaultPhoto.description,
            link: data.featured_photo_link || defaultPhoto.link,
          });
        }
      } catch { /* use defaults */ }
    }
    fetchPhoto();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-72 md:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Featured
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
                Upcoming &amp; Featured Hikes
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {photo.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {photo.description}
              </p>
              <Link to={photo.link || '/gallery'}>
                <Button className="group flex items-center">
                  Explore More
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
