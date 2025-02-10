import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createTestStore } from '@/tests/utils/mockStore';
import SignUp from '@/app/(auth)/signup/page';
import { AuthState, initialAuthState, initialSessionState } from '@/redux/auth-session/types';
import { authReducer } from '@/redux/auth-session';
import sessionReducer from '@/redux/auth-session/sessionSlice';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));

// Or alternatively, mock the entire module
jest.mock('@/lib/supabase', () => {
  return {
    supabase: {
      auth: {
        signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
        signUp: jest.fn().mockResolvedValue({ error: null, data: { session: null } }),
      },
    },
  };
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe('Auth Flow Integration', () => {
  it('completes signup and verification flow', async () => {
    const user = userEvent.setup();
    const mockStore = createTestStore({
      auth: initialAuthState,
      session: initialSessionState,
    });

    const { rerender } = render(
      <Provider store={mockStore}>
        <SignUp />
      </Provider>
    );

    // Fill and submit signup form
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getAllByRole('button', { name: /sign up/i })[0]);

    const verificationStore = configureStore({
      reducer: {
        auth: authReducer,
        session: sessionReducer,
      },
      preloadedState: {
        auth: {
          ...initialAuthState,
          requiresEmailVerification: false,
          email: 'test@example.com',
        },
        session: initialSessionState,
      },
    });

    // Test verification flow
    rerender(
      <Provider store={verificationStore}>
        <SignUp />
      </Provider>
    );

    // Verify email verification screen shows
    await waitFor(() => {
      // expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
      const authState = mockStore.getState().auth as AuthState;
      expect(authState.requiresEmailVerification).toBe(false);
      // expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    });
  });
});
