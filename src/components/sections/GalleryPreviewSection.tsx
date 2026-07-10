import { Link } from 'react-router-dom';
import { ArrowRight, Image } from 'lucide-react';
import { galleryData } from '../../data/gallery';
import { GalleryImageCard } from '../common/ImageLightbox';
import { Button } from '../ui/Button';
import { ScrollReveal } from '../common/ContainerScroll';
import { useState } from 'react';
import { ImageLightbox } from '../common/ImageLightbox';

export function GalleryPreviewSection() {
  const previewImages = galleryData.slice(0, 6);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                <Image className="w-4 h-4" />
                Photo Gallery
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Moments from
                <br />
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  the Trail
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl">
                Glimpses of Nepal's breathtaking landscapes and vibrant culture captured by our community.
              </p>
            </div>
            <Link to="/gallery">
             <Button variant="outline" className="group flex items-center">
  View Full Gallery
  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
</Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewImages.map((image, index) => (
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
            images={previewImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    </section>
  );
}
