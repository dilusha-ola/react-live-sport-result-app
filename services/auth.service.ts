import { AuthResponse, LoginCredentials, SignUpData } from '@/types/auth';

const API_URL = 'https://dummyjson.com';

export const authService = {
  /**
   * Login with username and password
   * DummyJSON provides test users - use any username from their docs
   * Example: username: 'emilys', password: 'emilyspass'
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  },

  /**
   * Sign up new user
   * Note: DummyJSON doesn't actually create users, but simulates the response
   */
  signUp: async (userData: SignUpData): Promise<AuthResponse> => {
    try {
      // DummyJSON doesn't have a real signup endpoint, so we'll use the add user endpoint
      // and then automatically log them in with dummy credentials
      const response = await fetch(`${API_URL}/users/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          username: userData.email.split('@')[0], // Create username from email
          password: userData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sign up failed');
      }

      const data = await response.json();
      
      // Simulate token for new user (DummyJSON doesn't provide one for new users)
      return {
        ...data,
        token: 'dummy-token-' + Date.now(),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      return await response.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  },
};
