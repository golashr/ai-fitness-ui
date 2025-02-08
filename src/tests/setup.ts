import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock toast notifications
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
})); 