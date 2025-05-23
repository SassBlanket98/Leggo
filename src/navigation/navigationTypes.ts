// src/navigation/navigationTypes.ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StaticParamList } from '@react-navigation/native';

// In React Navigation v7, these types need to be defined manually
// Type for nested navigators in React Navigation v7
type NavigatorScreenParams<ParamList> = {
  screen?: keyof ParamList;
  params?: ParamList[keyof ParamList];
};

// Type for composite screen props in React Navigation v7
type CompositeScreenProps<ScreenProps, NavigatorProps> = ScreenProps & NavigatorProps;
// For React Navigation v7, we need to ensure we're importing the types correctly

// Auth Stack
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// --- Main App Stacks (one for each tab) ---

// Discover Tab Stack (includes DiscoverActivities and ActivityDetail)
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
  // Potentially other screens like CategoryPicker, LocationPicker if they were separate screens
};

// Profile Tab Stack
export type ProfileStackParamList = {
  Profile: undefined;
  // Settings: undefined;
  // EditProfile: undefined;
};

// Main Bottom Tabs Param List (combining the stacks for each tab)
export type MainTabsParamList = {
  DiscoverTab: NavigatorScreenParams<DiscoverStackParamList>;
  MyPlannedTab: NavigatorScreenParams<MyPlannedStackParamList>;
  CreateActivityTab: NavigatorScreenParams<CreateActivityStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// --- Screen Prop Types (examples, you'd create these for each screen that needs them) ---

// For screens in AuthStack
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

// For screens directly in MainTabs (if any were directly components, not stacks)
// export type MainTabScreenProps<T extends keyof MainTabsParamList> =
//   BottomTabScreenProps<MainTabsParamList, T>;

// For screens within the Discover Stack (nested in MainTabs)
export type DiscoverScreenProps<T extends keyof DiscoverStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<DiscoverStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList, 'DiscoverTab'>
>;

// For screens within the MyPlanned Stack
export type MyPlannedScreenProps<T extends keyof MyPlannedStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<MyPlannedStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList, 'MyPlannedTab'>
>;

// For screens within the CreateActivity Stack
export type CreateActivityTabProps<T extends keyof CreateActivityStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CreateActivityStackParamList, T>,
    BottomTabScreenProps<MainTabsParamList, 'CreateActivityTab'>
  >;

// For screens within the Profile Stack
export type ProfileTabProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList, 'ProfileTab'>
>;

// If ActivityDetailScreen can be accessed from multiple stacks and needs typed navigation/route from its origin
// This setup implies ActivityDetail uses its own stack's navigation prop,
// which is fine as long as it doesn't need to navigate to screens *outside* its current parent stack directly.
// If it does, more complex type composition might be needed or using navigation.getParent().
