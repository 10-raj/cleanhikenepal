import { supabase } from './supabase';

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // Profile might not exist yet, create it
    if (error.code === 'PGRST116') {
      return createProfile({
        name: user.user_metadata?.name || user.email?.split('@')[0],
      });
    }
    throw error;
  }

  return data;
}

export async function createProfile(profile: { name?: string; avatar?: string }) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{
      id: user.id,
      ...profile,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(updates: {
  name?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  bio?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
