import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import SignUp from '@/app/(auth)/signup/page';
import { createTestStore } from '@/tests/utils/mockStore';
import { supabase } from '@/lib/supabase';
import { initialState } from '@/redux/features/auth/slice';
import { AuthState } from '@/redux/features/auth/types';
import { initialState as sessionInitialState, SessionState } from '@/redux/features/sessionSlice';

// Mock dependencies
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

describe('SignUp Component', () => {
  const mockStore = createTestStore({
    auth: initialState as AuthState,
    session: sessionInitialState as SessionState,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders signup form', () => {
    render(
      <Provider store={mockStore}>
        <SignUp />
      </Provider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('handles email/password signup', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={mockStore}>
        <SignUp />
      </Provider>
    );

    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getAllByRole('button', { name: /sign up/i })[0]);

    await waitFor(() => {
      const actions = mockStore.getState().auth as AuthState;
      expect(actions.isLoading).toBe(false);
    });
  });

  it('handles Google signup', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={mockStore}>
        <SignUp />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /sign up with google/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.any(Object),
      });
    });
  });
});
