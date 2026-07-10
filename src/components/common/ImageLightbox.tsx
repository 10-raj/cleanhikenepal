import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import { GalleryImage } from '../../types';

interface LightboxProps {
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-5xl max-h-[85vh] relative"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
          <p className="text-white font-medium">{currentImage.alt}</p>
          {currentImage.location && (
            <p className="text-gray-400 text-sm mt-1">{currentImage.location}</p>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <button
          onClick={e => { e.stopPropagation(); handlePrev(); }}
          className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          onClick={e => { e.stopPropagation(); handleNext(); }}
          className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
}

interface GalleryImageCardProps {
  image: GalleryImage;
  index: number;
  onClick: (index: number) => void;
}

export function GalleryImageCard({ image, index, onClick }: GalleryImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-square"
      onClick={() => onClick(index)}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-medium text-sm truncate">{image.alt}</p>
        {image.location && (
          <p className="text-gray-300 text-xs">{image.location}</p>
        )}
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
