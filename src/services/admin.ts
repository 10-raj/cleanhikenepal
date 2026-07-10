import { supabase } from './supabase';

// ============================================================
// Admin auth check
// ============================================================

export async function checkIsAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('checkIsAdmin error:', error);
    return false;
  }

  return profile?.role === 'admin';
}

// ============================================================
// Dashboard stats
// ============================================================

export async function getAdminStats() {
  const [messagesResult, donationsResult, bookingsResult, hikesResult, galleryResult, sponsorsResult, campaignsResult, teamResult] = await Promise.all([
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
    supabase.from('donations').select('amount', { count: 'exact' }),
    supabase.from('trek_bookings').select('id', { count: 'exact', head: true }),
    supabase.from('hikes').select('id', { count: 'exact', head: true }),
    supabase.from('gallery').select('id', { count: 'exact', head: true }),
    supabase.from('sponsors').select('id', { count: 'exact', head: true }),
    supabase.from('donation_campaigns').select('id', { count: 'exact', head: true }),
    supabase.from('team_members').select('id', { count: 'exact', head: true }),
  ]);

  const unreadMessages = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'unread');

  return {
    totalMessages: messagesResult.count || 0,
    unreadMessages: unreadMessages.count || 0,
    totalDonations: donationsResult.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0,
    totalBookings: bookingsResult.count || 0,
    totalHikes: hikesResult.count || 0,
    totalGallery: galleryResult.count || 0,
    totalSponsors: sponsorsResult.count || 0,
    totalCampaigns: campaignsResult.count || 0,
    totalTeam: teamResult.count || 0,
  };
}

// ============================================================
// Contact messages (read / update / reply)
// ============================================================

export async function getAllContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateMessageStatus(messageId: string, status: 'unread' | 'read' | 'replied' | 'archived') {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function replyToMessage(messageId: string, replyMessage: string) {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({
      status: 'replied',
      reply_message: replyMessage,
      replied_at: new Date().toISOString(),
    })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContactMessage(messageId: string) {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', messageId);
  if (error) throw error;
}

// ============================================================
// Donations (read / update / delete / verify)
// ============================================================

export async function getAllDonations() {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      donation_campaigns(title)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateDonationStatus(donationId: string, status: string) {
  const { data, error } = await supabase
    .from('donations')
    .update({ payment_status: status })
    .eq('id', donationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function verifyDonation(donationId: string, verificationStatus: 'pending' | 'verified' | 'rejected') {
  const { data, error } = await supabase
    .from('donations')
    .update({ verification_status: verificationStatus })
    .eq('id', donationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDonation(donationId: string) {
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', donationId);
  if (error) throw error;
}

// ============================================================
// Bookings (read / update)
// ============================================================

export async function getAllBookings() {
  const { data, error } = await supabase
    .from('trek_bookings')
    .select(`
      *,
      hikes(name, location)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  const { data, error } = await supabase
    .from('trek_bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// Hikes — full CMS CRUD
// ============================================================

export async function getAllHikesAdmin() {
  const { data, error } = await supabase
    .from('hikes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createHike(hike: Record<string, any>) {
  const { data, error } = await supabase
    .from('hikes')
    .insert([hike])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHike(hikeId: string, hike: Record<string, any>) {
  const { data, error } = await supabase
    .from('hikes')
    .update(hike)
    .eq('id', hikeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHike(hikeId: string) {
  const { error } = await supabase
    .from('hikes')
    .delete()
    .eq('id', hikeId);
  if (error) throw error;
}

// ============================================================
// Gallery — full CMS CRUD
// ============================================================

export async function getAllGalleryAdmin() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createGalleryImage(image: Record<string, any>) {
  const { data, error } = await supabase
    .from('gallery')
    .insert([image])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryImage(imageId: string, image: Record<string, any>) {
  const { data, error } = await supabase
    .from('gallery')
    .update(image)
    .eq('id', imageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGalleryImage(imageId: string) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', imageId);
  if (error) throw error;
}

// ============================================================
// Sponsors — full CMS CRUD
// ============================================================

export async function getAllSponsorsAdmin() {
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createSponsor(sponsor: Record<string, any>) {
  const { data, error } = await supabase
    .from('sponsors')
    .insert([sponsor])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSponsor(sponsorId: string, sponsor: Record<string, any>) {
  const { data, error } = await supabase
    .from('sponsors')
    .update(sponsor)
    .eq('id', sponsorId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSponsor(sponsorId: string) {
  const { error } = await supabase
    .from('sponsors')
    .delete()
    .eq('id', sponsorId);
  if (error) throw error;
}

// ============================================================
// Donation Campaigns / Events — full CMS CRUD
// ============================================================

export async function getAllCampaignsAdmin() {
  const { data, error } = await supabase
    .from('donation_campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCampaign(campaign: Record<string, any>) {
  const { data, error } = await supabase
    .from('donation_campaigns')
    .insert([campaign])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCampaign(campaignId: string, campaign: Record<string, any>) {
  const { data, error } = await supabase
    .from('donation_campaigns')
    .update(campaign)
    .eq('id', campaignId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCampaign(campaignId: string) {
  const { error } = await supabase
    .from('donation_campaigns')
    .delete()
    .eq('id', campaignId);
  if (error) throw error;
}

// ============================================================
// Website Settings / Statistics — CMS
// ============================================================

export async function getWebsiteSettings() {
  const { data, error } = await supabase
    .from('website_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

export async function updateWebsiteSettings(settings: Record<string, any>) {
  const { data: existing } = await supabase
    .from('website_settings')
    .select('id')
    .limit(1)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('website_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('website_settings')
    .insert([settings])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// Donation screenshot upload (storage)
// ============================================================

export async function uploadDonationScreenshot(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const fileName = `donation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from('donation-screenshots')
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage
    .from('donation-screenshots')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
