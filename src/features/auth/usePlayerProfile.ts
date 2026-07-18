import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ensureAnonymousUser,
  getCurrentUser,
  getProfile,
  normalizeUsername,
  saveProfile,
  signOutPlayer,
} from './authService';
import type { PlayerProfile } from './types';

type AuthStatus = 'loading' | 'anonymous' | 'ready' | 'error';

export function usePlayerProfile() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          if (!ignore) {
            setErrorMessage(null);
            setStatus('anonymous');
          }
          return;
        }

        const currentProfile = await getProfile(user.id);

        if (!ignore) {
          setErrorMessage(null);
          setProfile(currentProfile);
          setStatus(currentProfile ? 'ready' : 'anonymous');
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getAuthErrorMessage(error));
          setStatus('error');
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const registerPlayer = useCallback(async (username: string) => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      const user = await ensureAnonymousUser();
      const savedProfile = await saveProfile(user, username);

      setProfile(savedProfile);
      setStatus('ready');

      return savedProfile;
    } catch (error) {
      const message = getAuthErrorMessage(error);

      setErrorMessage(message);
      setStatus('error');
      throw new Error(message, { cause: error });
    }
  }, []);

  const signOut = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      await signOutPlayer();
      setProfile(null);
      setStatus('anonymous');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setStatus('error');
    }
  }, []);

  const normalizedUsername = useMemo(() => {
    return profile ? normalizeUsername(profile.username) : '';
  }, [profile]);

  return {
    errorMessage,
    isLoading: status === 'loading',
    isReady: status === 'ready',
    normalizedUsername,
    profile,
    registerPlayer,
    signOut,
    status,
  };
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('anonymous')) {
      return 'Anonymous auth must be enabled in Supabase Auth settings.';
    }

    if (error.message.toLowerCase().includes('duplicate')) {
      return 'That username is already taken.';
    }

    return error.message;
  }

  return 'Unexpected auth error.';
}
