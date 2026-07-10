import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Filter } from 'lucide-react';
import { useGallery } from '../hooks/useGallery';
import { GalleryImageCard, ImageLightbox } from '../components/common/ImageLightbox';
import { ScrollReveal } from '../components/common/ContainerScroll';

const categories = ['All', 'Hikes', 'Nature', 'Community', 'Events'];

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { images: filteredImages } = useGallery({ category: selectedCategory });

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative h-64 flex items-center justify-center mb-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Nepal landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/70 to-gray-900/80" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-pink-300 text-sm mb-6"
          >
            <ImageIcon className="w-4 h-4" />
            {filteredImages.length} Photos
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Photo Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg"
          >
            Capturing Nepal's breathtaking beauty through the lens
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <ScrollReveal>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <GalleryImageCard
              key={image.id}
              image={image}
              index={index}
              onClick={handleImageClick}
            />
          ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <ImageLightbox
            images={filteredImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
