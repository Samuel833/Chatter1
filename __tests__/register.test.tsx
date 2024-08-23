// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import RegisterPage from '../src/app/register/page';
// import { signIn } from 'next-auth/react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// jest.mock('axios');
// jest.mock('next-auth/react');
// jest.mock('next/navigation', () => ({
//   useRouter: jest.fn(),
// }));

// describe('RegisterPage', () => {
//   const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
//   const mockAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;
//   const mockRouterPush = jest.fn();
  
//   beforeEach(() => {
//     jest.clearAllMocks();
//     (useRouter as jest.Mock).mockReturnValue({
//       push: mockRouterPush,
//     });
//   });

//   it('renders the form elements correctly', () => {
//     render(<RegisterPage />);
    
//     expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
//     expect(screen.getByPlaceholderText("somemail@gmail.com")).toBeInTheDocument();
//     expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
//     expect(screen.getByTestId("Sign Up")).toBeInTheDocument();
//   });

 

//   it('submits form and handles success response', async () => {
//     mockAxiosPost.mockResolvedValueOnce({ data: {} });
//     mockSignIn.mockResolvedValueOnce({ 
//       error: null,
//       status: 200,
//       ok: true,
//       url: '',
//     });
    
//     render(<RegisterPage />);
    
//     fireEvent.change(screen.getByPlaceholderText("John Doe"), { target: { value: 'testuser' } });
//     fireEvent.change(screen.getByPlaceholderText("somemail@gmail.com"), { target: { value: 'test@example.com' } });
//     fireEvent.change(screen.getByPlaceholderText("password"), { target: { value: 'password123' } });
//     fireEvent.change(screen.getByPlaceholderText("confirm password"), { target: { value: 'password123' } });
//     fireEvent.click(screen.getByTestId("Sign Up"));
    
//     await waitFor(() => {
//       expect(mockAxiosPost).toHaveBeenCalledWith("/api/auth/register", {
//         username: 'testuser',
//         email: 'test@example.com',
//         password: 'password123',
//       });
//     });
    
//     await waitFor(() => {
//       expect(mockSignIn).toHaveBeenCalledWith('credentials', {
//         redirect: false,
//         email: 'test@example.com',
//         password: 'password123',
//       });
//     });
    
//     await waitFor(() => {
//       expect(mockRouterPush).toHaveBeenCalledWith('/');
//     });
//   });

// });

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from '../src/app/register/page';
import { signIn, useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('RegisterPage', () => {
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
  const mockAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;
  const mockRouterPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    // Mock useSession to return an unauthenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
  });

  it('renders the form elements correctly', () => {
    render(<RegisterPage />);
    
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("somemail@gmail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("confirm password")).toBeInTheDocument();
    expect(screen.getByTestId("Sign Up")).toBeInTheDocument();
  });

  it('submits form and handles success response', async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: {} });
    mockSignIn.mockResolvedValueOnce({ 
      error: null,
      status: 200,
      ok: true,
      url: '',
    });
    
    render(<RegisterPage />);
    
    fireEvent.change(screen.getByPlaceholderText("John Doe"), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText("somemail@gmail.com"), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText("password"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText("confirm password"), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId("Sign Up"));
    
    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith("/api/auth/register", {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });
  });

});
