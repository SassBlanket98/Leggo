// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSession } from '../types/authTypes.ts';

const USER_SESSION_KEY = '@LeggoApp:userSession';

const AsyncStorageAny = AsyncStorage as any;

export const authService = {
  storeUserSession: async (session: UserSession): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(session);
      await AsyncStorageAny.setItem(USER_SESSION_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save user session to AsyncStorage', e);
      throw e; // Re-throw to handle it in the caller
    }
  },

  getUserSession: async (): Promise<UserSession | null> => {
    try {
      const jsonValue = await AsyncStorageAny.getItem(USER_SESSION_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to fetch user session from AsyncStorage', e);
      return null;
    }
  },

  removeUserSession: async (): Promise<void> => {
    try {
      await AsyncStorageAny.removeItem(USER_SESSION_KEY);
    } catch (e) {
      console.error('Failed to remove user session from AsyncStorage', e);
      throw e;
    }
  },

  // Mock login function
  mockLogin: async (email: string, password: string): Promise<UserSession | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@leggo.com' && password === 'password123') {
      const session: UserSession = {
        token: `mock-jwt-token-${Date.now()}`,
        userId: 'mockUser123',
        email: email,
      };
      return session;
    }
    return null;
  },

  // Mock signup function
  mockSignup: async (email: string, password: string): Promise<UserSession | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // For MVP, signup is always successful and returns a new mock session
    const session: UserSession = {
      token: `mock-jwt-token-signup-${Date.now()}`,
      userId: `mockUser-${Math.random().toString(36).substring(7)}`,
      email: email,
    };
    return session;
  },
};
