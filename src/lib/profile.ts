import { supabase } from './supabase';

interface ProfileUpdate {
  language?: string;
  phone?: string;
}

export async function updateProfile(update: ProfileUpdate) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No user found');

  // Update auth metadata
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      language: update.language,
      phone: update.phone,
    },
  });

  if (metadataError) throw metadataError;

  // Update profile table
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      language: update.language,
      phone: update.phone,
      updated_at: new Date().toISOString(),
    });

  if (profileError) throw profileError;

  return { success: true };
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('profiles')
    .select('language, phone')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  return data;
}