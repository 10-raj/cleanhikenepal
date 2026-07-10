import { supabase } from './supabase';
import { donationsData } from '../data/donations';
import { Donation } from '../types';

function mapCampaign(row: any): Donation {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    goalAmount: Number(row.goal_amount),
    currentAmount: Number(row.current_amount),
    category: row.category,
    image: row.image,
    donorsCount: row.donors_count,
    endDate: row.end_date || undefined,
  };
}

export async function getDonationCampaigns(filters?: {
  category?: string;
  status?: string;
}): Promise<Donation[]> {
  let query = supabase
    .from('donation_campaigns')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    let fallback = donationsData;
    if (filters?.category && filters.category !== 'All') {
      fallback = fallback.filter(d => d.category === filters.category);
    }
    return fallback;
  }

  return data.map(mapCampaign);
}

export async function getDonationCampaignBySlug(slug: string) {
  const { data, error } = await supabase
    .from('donation_campaigns')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createDonation(donation: {
  campaign_id?: string;
  amount: number;
  payment_method: string;
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  is_anonymous?: boolean;
  message?: string;
  transaction_id?: string;
  remarks?: string;
  screenshot_url?: string;
}) {
  const { data, error } = await supabase
    .from('donations')
    .insert([{
      ...donation,
      payment_status: 'pending',
      verification_status: 'pending',
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserDonations(userId: string) {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      donation_campaigns(title)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
