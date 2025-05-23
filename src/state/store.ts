// src/state/store.ts
import { create, StateCreator } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService.js';
import { UserSession } from '../types/authTypes.js';
import { Activity, ActivityCategory } from '../types/activityTypes.js'; // Added ActivityCategory
import { MOCK_ACTIVITIES } from '../constants/mockActivities.js'; // For initial data

export interface AuthSlice {
  isAuthenticated: boolean;
  userToken: string | null;
  currentUser: UserSession | null;
  isLoadingAuth: boolean;
  loginUser: (session: UserSession) => Promise<void>;
  logoutUser: () => Promise<void>;
  setAuthLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
}

export interface ActivitySlice {
  allActivities: Activity[];
  interestedActivityIds: string[];
  loadInitialActivities: () => void;
  addActivity: (newActivity: Activity) => void;
  apiAddActivity: (activityData: Omit<Activity, 'id' | 'creatorId'>) => Promise<Activity>;
  removeActivityFromAll: (activityId: string) => void;
  addInterestedActivity: (activityId: string) => void;
  removeInterestedActivity: (activityId: string) => void;
}

// Combine slices into the full AppState
export interface AppState extends AuthSlice, ActivitySlice {}

export const useAppStore = create<AppState>((set, get) => ({
  // Activity State
  allActivities: [], // Initialize with empty or mock data
  interestedActivityIds: [],

  loadInitialActivities: () => {
    set({ allActivities: MOCK_ACTIVITIES });
  },

  addActivity: newActivity =>
    set((state: AppState) => ({
      allActivities: [newActivity, ...state.allActivities],
    })),

  apiAddActivity: async (activityData: Omit<Activity, 'id' | 'creatorId'>): Promise<Activity> => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    // Simulate API call
    const newActivity: Activity = {
      ...activityData,
      id: `mockActivity-${Date.now()}`, // Generate a mock ID
      creatorId: currentUser.userId,
    };
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    get().addActivity(newActivity); // Add to local store
    return newActivity;
  },

  removeActivityFromAll: (activityId: string) =>
    set((state: AppState) => ({
      allActivities: state.allActivities.filter((activity: Activity) => activity.id !== activityId),
    })),

  addInterestedActivity: (activityId: string) =>
    set((state: AppState) => {
      if (!state.interestedActivityIds.includes(activityId)) {
        return { interestedActivityIds: [...state.interestedActivityIds, activityId] };
      }
      return state; // No change if already interested
    }),

  removeInterestedActivity: (activityId: string) =>
    set((state: AppState) => ({
      interestedActivityIds: state.interestedActivityIds.filter((id: string) => id !== activityId),
    })),

  // Auth State
  isAuthenticated: false,
  userToken: null,
  currentUser: null,
  isLoadingAuth: true,

  loginUser: async (session: UserSession) => {
    await authService.storeUserSession(session);
    set({
      isAuthenticated: true,
      userToken: session.token,
      currentUser: session,
      isLoadingAuth: false,
    });
  },
  logoutUser: async () => {
    await authService.removeUserSession();
    set({
      isAuthenticated: false,
      userToken: null,
      currentUser: null,
      isLoadingAuth: false,
      // Optionally clear interested activities on logout if they are user-specific
      // interestedActivityIds: [],
    });
  },
  setAuthLoading: (loading: boolean) => set({ isLoadingAuth: loading }),
  checkAuthStatus: async () => {
    set({ isLoadingAuth: true });
    try {
      const session = await authService.getUserSession();
      if (session && session.token) {
        set({
          isAuthenticated: true,
          userToken: session.token,
          currentUser: session,
          isLoadingAuth: false,
        });
      } else {
        set({ isAuthenticated: false, userToken: null, currentUser: null, isLoadingAuth: false });
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      set({ isAuthenticated: false, userToken: null, currentUser: null, isLoadingAuth: false });
    }
  },
}));

// Initialize mock activities when the store is created (for development)
// In a real app, you might fetch these from an API in App.tsx or a similar entry point.
useAppStore.getState().loadInitialActivities();
