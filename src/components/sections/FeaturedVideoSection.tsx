import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { ScrollReveal } from '../common/ContainerScroll';

interface FeaturedVideo {
  url: string;
  title: string;
  description: string;
}

const defaultVideo: FeaturedVideo = {
  url: 'https://cdn.pixabay.com/video/2024/01/15/197834-907453376_large.mp4',
  title: 'Experience the Journey',
  description: 'Watch our latest adventure on the trails of Nepal.',
};

export function FeaturedVideoSection() {
  const [video, setVideo] = useState<FeaturedVideo>(defaultVideo);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const { data } = await supabase
          .from('website_settings')
          .select('featured_video_url, featured_video_title, featured_video_description')
          .limit(1)
          .maybeSingle();
        if (data) {
          setVideo({
            url: data.featured_video_url || defaultVideo.url,
            title: data.featured_video_title || defaultVideo.title,
            description: data.featured_video_description || defaultVideo.description,
          });
        }
      } catch { /* use defaults */ }
    }
    fetchVideo();
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-medium mb-4">
              <Video className="w-4 h-4" />
              Watch Now
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {video.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {video.description}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <video
              src={video.url}
              controls
              playsInline
              className="w-full aspect-video object-cover"
              poster="https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=1200"
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
