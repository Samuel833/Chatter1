// Unit Tests for Login Page

// __tests__/LoginPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../src/app/login/page';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
  const mockRouterPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push: mockRouterPush,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByTestId("Email")).toBeInTheDocument();
    expect(screen.getByTestId("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it('displays error message on failed login', async () => {
    mockSignIn.mockResolvedValueOnce({
      error: 'Invalid credentials',
      status: 401,
      ok: false,
      url: '',
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByTestId("Email"), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId("Password"), { target: { value: 'password' } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it('redirects on successful login', async () => {
    mockSignIn.mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: '',
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByTestId("Email"), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId("Password"), { target: { value: 'password' } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard/profile');
    });
  });
});
