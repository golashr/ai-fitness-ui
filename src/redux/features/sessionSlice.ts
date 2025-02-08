import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Session } from '@supabase/supabase-js';

export interface SessionState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userDetails: {
    avatar_url?: string;
    email?: string;
    name?: string;
  } | null;
}

export const initialState: SessionState = {
  user: null,
  session: null,
  isLoading: false,
  userDetails: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      console.log('Setting session for user:', action.payload?.user?.email);
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
      if (action.payload?.user) {
        state.userDetails = {
          avatar_url: action.payload.user.user_metadata?.avatar_url,
          email: action.payload.user.email,
          name: action.payload.user.user_metadata?.full_name,
        };
      }
      state.isLoading = false;
    },
    clearSession: (state) => {
      console.log('Clearing session');
      state.session = null;
      state.user = null;
      state.userDetails = null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setSession, clearSession, setLoading } = sessionSlice.actions;
export default sessionSlice.reducer;
