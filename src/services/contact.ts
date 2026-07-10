import { supabase } from './supabase';
import { contactService, EmailData } from './email.service';

export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  purpose?: string;
  interest?: string;
  partnerType?: string;
  nextHikeLocation?: string;
  numberOfMembers?: number;
  howHeard?: string;
  hikeJoinDate?: string;
}) {
  const { error: dbError } = await supabase
    .from('contact_messages')
    .insert([{
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      phone: formData.phone || null,
      purpose: formData.purpose || null,
      interest: formData.interest || null,
      partner_type: formData.partnerType || null,
      next_hike_location: formData.nextHikeLocation || null,
      number_of_members: formData.numberOfMembers || null,
      how_heard: formData.howHeard || null,
      hike_join_date: formData.hikeJoinDate || null,
    }]);

  if (dbError) {
    console.error('Database Error:', dbError);
  }

  const emailResult = await contactService.sendMessage(
    formData as EmailData
  );

  if (!emailResult.success) {
    throw new Error(
      emailResult.error || 'Failed to send message'
    );
  }

  return {
    success: true,
  };
}

export async function getContactMessages(filters?: {
  status?: string;
}) {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
