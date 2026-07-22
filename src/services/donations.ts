import { supabase } from './supabase';

export async function createDonation(donation: {
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
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
