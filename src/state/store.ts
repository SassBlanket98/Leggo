// src/state/store.ts
//... (import create, UserSession from authTypes)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService'; // Will be created next

//... (other parts of AppState interface and store)

export interface AuthSlice {
  isAuthenticated: boolean;
  userToken: string | null;
  currentUser: UserSession | null; // Store minimal user info
  isLoadingAuth: boolean;
  loginUser: (session: UserSession) => Promise<void>;
  logoutUser: () => Promise<void>;
  setAuthLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
}

// Add AuthSlice to AppState type
// type AppState = ActivitySlice & AuthSlice &...;

export const useAppStore = create<AppState>((set, get) => ({
  //... (previous ActivityState implementation)

  // Auth State
  isAuthenticated: false,
  userToken: null,
  currentUser: null,
  isLoadingAuth: true, // Start true to allow async check

  loginUser: async session => {
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
    set({ isAuthenticated: false, userToken: null, currentUser: null, isLoadingAuth: false });
  },
  setAuthLoading: loading => set({ isLoadingAuth: loading }),
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
  apiAddActivity: async (activityData: Omit<Activity, 'id' | 'creatorId'>): Promise<Activity> => {
    // Simulate API delay for adding activity
    await new Promise(resolve => setTimeout(resolve, 700));
    const newActivity: Activity = {
      ...activityData,
      id: `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`, // More unique mock ID
      creatorId: get().currentUser?.userId || 'mockUserSystem', // Use logged-in user or fallback
    };
    set(state => ({
      allActivities: [newActivity, ...state.allActivities], // Add to the beginning for immediate visibility
    }));
    return newActivity;
  },
  //... (rest of the store)
}));
