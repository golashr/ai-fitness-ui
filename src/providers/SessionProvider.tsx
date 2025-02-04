"use client";

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { supabase } from '@/lib/supabase';
import { setSession, clearSession } from '@/redux/features/sessionSlice';
import { useRouter } from 'next/navigation';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  console.log("SessionProvider mounted");

  useEffect(() => {
    console.log("SessionProvider useEffect running");

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", session?.user?.email);
      
      if (session) {
        console.log("Dispatching session to Redux");
        dispatch(setSession(session));
      } else {
        console.log("No session found, clearing");
        dispatch(clearSession());
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      switch (event) {
        case 'SIGNED_IN':
          console.log("User signed in, setting session");
          dispatch(setSession(session));
          // Don't redirect here - let the signin page handle it
          break;
        
        case 'SIGNED_OUT':
          console.log("User signed out, clearing session");
          dispatch(clearSession());
          router.push('/auth/signin');
          break;
        
        case 'USER_UPDATED':
          console.log("User updated, updating session");
          dispatch(setSession(session));
          break;
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [dispatch, router]);

  return children;
} 