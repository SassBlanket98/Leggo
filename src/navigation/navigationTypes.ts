// src/navigation/navigationTypes.ts
import type {
  CompositeScreenProps as RNCompositeScreenProps,
  NavigatorScreenParams as RNNavigatorScreenParams,
} from '@react-navigation/native'; // Ensure this import is correct and recognized
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Auth Stack
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// --- Main App Stacks (one for each tab) ---

// Discover Tab Stack
export type DiscoverStackParamList = {
  DiscoverActivities: undefined;
  ActivityDetail: { activityId: string };
};

// My Planned Activities Tab Stack
export type MyPlannedStackParamList = {
  MyPlannedActivitiesList: undefined;
  ActivityDetail: { activityId: string };
};

// Create Activity Tab Stack
export type CreateActivityStackParamList = {
  CreateActivity: undefined;
};

// Profile Tab Stack
export type ProfileStackParamList = {
  Profile: undefined;
};

// Main Bottom Tabs Param List
export type MainTabsParamList = {
  DiscoverTab: RNNavigatorScreenParams<DiscoverStackParamList>;
  MyPlannedTab: RNNavigatorScreenParams<MyPlannedStackParamList>;
  CreateActivityTab: RNNavigatorScreenParams<CreateActivityStackParamList>;
  ProfileTab: RNNavigatorScreenParams<ProfileStackParamList>;
};

// Screen Prop Types

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type DiscoverScreenProps<T extends keyof DiscoverStackParamList> = RNCompositeScreenProps<
  NativeStackScreenProps<DiscoverStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList, 'DiscoverTab'>
>;

export type MyPlannedScreenProps<T extends keyof MyPlannedStackParamList> = RNCompositeScreenProps<
  NativeStackScreenProps<MyPlannedStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList, 'MyPlannedTab'>
>;

export type CreateActivityTabProps<T extends keyof CreateActivityStackParamList> =
  RNCompositeScreenProps<
    NativeStackScreenProps<CreateActivityStackParamList, T>,
    BottomTabScreenProps<MainTabsParamList, 'CreateActivityTab'>
  >;

export type ProfileTabProps<T extends keyof ProfileStackParamList> = RNCompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList, 'ProfileTab'>
>;
