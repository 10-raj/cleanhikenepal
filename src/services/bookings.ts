import { supabase } from './supabase';

export async function createBooking(booking: {
  hike_id: string;
  booking_date: string;
  number_of_participants: number;
  total_price: number;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  special_requests?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('trek_bookings')
    .insert([{
      ...booking,
      user_id: user?.id || null,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserBookings() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('trek_bookings')
    .select(`
      *,
      hikes(name, location, region, image)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function cancelBooking(bookingId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('trek_bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
