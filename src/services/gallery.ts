import { supabase } from './supabase';
import { galleryData } from '../data/gallery';
import { GalleryImage } from '../types';

export async function getGalleryImages(filters?: {
  category?: string;
}): Promise<GalleryImage[]> {
  let query = supabase
    .from('gallery')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category.toLowerCase());
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    let fallback = galleryData;
    if (filters?.category && filters.category !== 'All') {
      fallback = fallback.filter(img => img.category === filters.category.toLowerCase());
    }
    return fallback;
  }

  return data?.map(img => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    category: img.category,
    location: img.location,
  })) || [];
}
