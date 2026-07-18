import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase/client';
import type { PlayerProfile, ProfileRow } from './types';

export async function getCurrentUser() {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!sessionData.session) {
    return null;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  return userData.user;
}

export async function ensureAnonymousUser() {
  const existingUser = await getCurrentUser();

  if (existingUser) {
    return existingUser;
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Supabase did not return an anonymous user.');
  }

  return data.user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw error;
  }

  return data ? mapProfile(data) : null;
}

export async function saveProfile(user: User, username: string) {
  const normalizedUsername = normalizeUsername(username);

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        username: normalizedUsername,
      },
      { onConflict: 'id' }
    )
    .select('id, username, avatar_url, created_at, updated_at')
    .single<ProfileRow>();

  if (error) {
    throw error;
  }

  return mapProfile(data);
}

export async function signOutPlayer() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export function normalizeUsername(username: string) {
  return username.trim().replace(/\s+/g, '-').toLowerCase();
}

function mapProfile(row: ProfileRow): PlayerProfile {
  return {
    id: row.id,
    username: row.username,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
