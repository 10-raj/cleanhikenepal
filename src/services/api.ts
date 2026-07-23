import { supabase } from './supabase';
import { hikesData } from '../data/hikes';
import { Hike } from '../types';

function mapHikeRow(row: any): Hike {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    region: row.region,
    difficulty: row.difficulty,
    duration: row.duration,
    distance: row.distance,
    maxElevation: row.max_elevation,
    bestSeason: row.best_season || [],
    description: row.description,
    highlights: row.highlights || [],
    image: row.image,
    gallery: row.gallery || [],
    featured: row.featured,
    price: Number(row.price),
    groupSize: row.group_size,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    slug: row.slug,
    hikeDate: row.hike_date || null,
    video: row.video || '',
    routeUrl: row.route_url || '',
    mapUrl: row.map_url || '',
    availableSeats: row.available_seats ?? null,
    status: row.status || 'published',
  };
}

export async function getHikes(filters?: {
  difficulty?: string;
  featured?: boolean;
  search?: string;
}) {
  let query = supabase
    .from('hikes')
    .select('*')
    .order('featured', { ascending: false });

  if (filters?.difficulty && filters.difficulty !== 'All') {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    // Fall back to static data if Supabase is empty or unreachable
    let fallback = [...hikesData];
    if (filters?.difficulty && filters.difficulty !== 'All') {
      fallback = fallback.filter(h => h.difficulty === filters.difficulty);
    }
    if (filters?.featured !== undefined) {
      fallback = fallback.filter(h => h.featured === filters.featured);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      fallback = fallback.filter(h =>
        h.name.toLowerCase().includes(searchLower) ||
        h.location.toLowerCase().includes(searchLower) ||
        h.region.toLowerCase().includes(searchLower)
      );
    }
    return fallback;
  }

  const mapped = data.map(mapHikeRow);

  // Client-side search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    return mapped.filter(hike =>
      hike.name.toLowerCase().includes(searchLower) ||
      hike.location.toLowerCase().includes(searchLower) ||
      hike.region.toLowerCase().includes(searchLower)
    );
  }

  return mapped;
}

export async function getHikeBySlug(slug: string) {
  const { data, error } = await supabase
    .from('hikes')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    return hikesData.find(h => h.id === slug) || null;
  }
  return mapHikeRow(data);
}

export async function getHikeById(id: string) {
  const { data, error } = await supabase
    .from('hikes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return hikesData.find(h => h.id === id) || null;
  }
  return mapHikeRow(data);
}

export async function getFeaturedHikes() {
  const { data, error } = await supabase
    .from('hikes')
    .select('*')
    .eq('featured', true);

  if (error || !data || data.length === 0) {
    return hikesData.filter(h => h.featured);
  }
  return data.map(mapHikeRow);
}
