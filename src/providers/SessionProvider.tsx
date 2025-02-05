'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { supabase } from '@/lib/supabase';
import { setSession, clearSession } from '@/redux/features/sessionSlice';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  console.log('SessionProvider mounted');

  useEffect(() => {
    console.log('SessionProvider useEffect running');

    // Track the last known auth state
    let lastKnownAuthState = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session); // Debug

      // If transitioning from no auth to auth (sign in)
      if (!lastKnownAuthState && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        // Check if we're on the signin page (likely from verification)
        if (window.location.pathname === '/auth/signin') {
          return; // Don't update Redux
        }
      }

      // Update last known state
      lastKnownAuthState = !!session;

      // Handle normal auth state changes
      if (session) {
        dispatch(setSession(session));
      } else {
        dispatch(clearSession());
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
}
