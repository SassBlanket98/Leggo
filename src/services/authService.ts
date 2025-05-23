// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSession } from '../types/authTypes';

const USER_SESSION_KEY = '@LeggoApp:userSession';

export const authService = {
  storeUserSession: async (session: UserSession): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(session);
      await AsyncStorage.setItem(USER_SESSION_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save user session to AsyncStorage', e);
      throw e;
    }
  },

  getUserSession: async (): Promise<UserSession | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_SESSION_KEY);
      return jsonValue != null ? (JSON.parse(jsonValue) as UserSession) : null;
    } catch (e) {
      console.error('Failed to fetch user session from AsyncStorage', e);
      return null;
    }
  },

  removeUserSession: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_SESSION_KEY);
    } catch (e) {
      console.error('Failed to remove user session from AsyncStorage', e);
      throw e;
    }
  },

  mockLogin: async (email: string, password: string): Promise<UserSession | null> => {
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

  mockSignup: async (email: string, password: string): Promise<UserSession | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const session: UserSession = {
      token: `mock-jwt-token-signup-${Date.now()}`,
      userId: `mockUser-${Math.random().toString(36).substring(7)}`,
      email: email,
    };
    return session;
  },
};