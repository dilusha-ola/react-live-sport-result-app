import { AuthResponse, LoginCredentials, SignUpData } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://dummyjson.com';
const LOCAL_USERS_KEY = '@scorepulse_local_users';

export const authService = {
  /**
   * Login with username and password
   * First checks local users (from signup), then tries DummyJSON
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Login request:', { username: credentials.username });
      
      // First, check if user exists in local storage (signed up locally)
      const localUsersJson = await AsyncStorage.getItem(LOCAL_USERS_KEY);
      console.log('Local users storage:', localUsersJson ? 'Found' : 'Empty');
      
      if (localUsersJson) {
        const localUsers = JSON.parse(localUsersJson);
        console.log('Total local users:', localUsers.length);
        console.log('Local usernames:', localUsers.map((u: any) => u.username));
        
        const localUser = localUsers.find(
          (u: any) => u.username === credentials.username && u.password === credentials.password
        );
        
        if (localUser) {
          console.log('✓ Local user found:', { username: localUser.username });
          // Return local user as AuthResponse (remove password from response)
          const { password, ...userWithoutPassword } = localUser;
          return {
            ...userWithoutPassword,
            token: 'local-token-' + localUser.id,
          };
        } else {
          console.log('✗ Local user not found, trying DummyJSON API...');
        }
      }
      
      // If not found locally, try DummyJSON API
      console.log('Attempting DummyJSON login...');
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Login error response:', error);
        throw new Error(error.message || 'Invalid username or password');
      }

      const data = await response.json();
      console.log('✓ DummyJSON login success:', { username: data.username, id: data.id });
      return data;
    } catch (error) {
      console.error('Login exception:', error);
      throw error instanceof Error ? error : new Error('Network error');
    }
  },

  /**
   * Sign up new user
   * Stores user locally for login
   */
  signUp: async (userData: SignUpData): Promise<AuthResponse> => {
    try {
      console.log('=== SIGNUP ATTEMPT ===');
      console.log('Sign up request:', { email: userData.email });
      
      // Create username from email
      const username = userData.email.split('@')[0];
      console.log('Generated username:', username);
      
      // Check if user already exists locally
      const localUsersJson = await AsyncStorage.getItem(LOCAL_USERS_KEY);
      const localUsers = localUsersJson ? JSON.parse(localUsersJson) : [];
      console.log('Existing local users:', localUsers.length);
      
      const existingUser = localUsers.find(
        (u: any) => u.username === username || u.email === userData.email
      );
      
      if (existingUser) {
        console.error('User already exists:', username);
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: username,
        password: userData.password, // Store for local login check
        token: 'local-token-' + Date.now(),
      };
      
      console.log('Creating new user:', { username: newUser.username, id: newUser.id });
      
      // Save to local storage
      localUsers.push(newUser);
      await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));
      
      // Verify it was saved
      const verifyJson = await AsyncStorage.getItem(LOCAL_USERS_KEY);
      console.log('✓ User saved. Total users now:', verifyJson ? JSON.parse(verifyJson).length : 0);
      
      // Return without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Sign up exception:', error);
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
