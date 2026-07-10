import { supabase } from './supabase';

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

  if (error) throw error;

  // Client-side search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    return data?.filter(hike =>
      hike.name.toLowerCase().includes(searchLower) ||
      hike.location.toLowerCase().includes(searchLower) ||
      hike.region.toLowerCase().includes(searchLower)
    );
  }

  return data;
}

export async function getHikeBySlug(slug: string) {
  const { data, error } = await supabase
    .from('hikes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getHikeById(id: string) {
  const { data, error } = await supabase
    .from('hikes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getFeaturedHikes() {
  const { data, error } = await supabase
    .from('hikes')
    .select('*')
    .eq('featured', true);

  if (error) throw error;
  return data;
}
