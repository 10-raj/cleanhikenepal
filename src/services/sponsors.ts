import { supabase } from './supabase';
import { sponsorsData } from '../data/sponsors';
import { Sponsor } from '../types';

function mapSponsor(row: any): Sponsor {
  return {
    id: row.id,
    name: row.name,
    logo: row.logo,
    website: row.website || '',
    tier: row.tier,
    description: row.description || '',
  };
}

export async function getSponsors(filters?: {
  tier?: string;
}): Promise<Sponsor[]> {
  let query = supabase
    .from('sponsors')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (filters?.tier) {
    query = query.eq('tier', filters.tier);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    let fallback = sponsorsData;
    if (filters?.tier) fallback = fallback.filter(s => s.tier === filters.tier);
    return fallback;
  }

  return data.map(mapSponsor);
}

export async function getSponsorsByTier() {
  const sponsors = await getSponsors();

  return {
    platinum: sponsors?.filter(s => s.tier === 'platinum') || [],
    gold: sponsors?.filter(s => s.tier === 'gold') || [],
    silver: sponsors?.filter(s => s.tier === 'silver') || [],
    bronze: sponsors?.filter(s => s.tier === 'bronze') || [],
  };
}
