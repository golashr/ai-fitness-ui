'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { supabase } from '@/lib/supabase';
import { setSession, clearSession, setLoading } from '@/redux/auth-session/sessionSlice';
import { getProfile } from '@/lib/profile';

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let lastKnownAuthState = false;

    // Set initial loading state
    dispatch(setLoading(true));

    // Initial session check
    const initializeSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          dispatch(setSession(session));
          lastKnownAuthState = true;
        } else {
          dispatch(clearSession());
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        dispatch(clearSession());
      } finally {
        dispatch(setLoading(false));
      }
    };

    // Run initial session check
    initializeSession();

    // Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);

      if (['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'].includes(event)) {
        dispatch(setLoading(true));
      }

      // Handle email verification flow
      if (!lastKnownAuthState && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        if (window.location.pathname === '/signin') {
          dispatch(setLoading(false));
          return;
        }
      }

      lastKnownAuthState = !!session;

      if (session) {
        try {
          const profile = await getProfile();
          dispatch(
            setSession({
              ...session,
              user: {
                ...session.user,
                user_metadata: {
                  ...session.user.user_metadata,
                  language: profile.language,
                  phone: profile.phone,
                },
              },
            })
          );
        } catch (error) {
          console.error('Error fetching profile:', error);
          dispatch(setSession(session));
        }
      } else {
        dispatch(clearSession());
      }
      dispatch(setLoading(false));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
}
