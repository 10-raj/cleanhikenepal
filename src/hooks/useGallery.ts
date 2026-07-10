import { useState, useEffect } from 'react';
import { getGalleryImages } from '../services/gallery';
import { GalleryImage } from '../types';

export function useGallery(filters?: { category?: string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const data = await getGalleryImages(filters);
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch gallery'));
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [filters?.category]);

  return { images, loading, error };
}
