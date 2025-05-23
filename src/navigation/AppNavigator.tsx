// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../state/store.ts'; // Adjusted path
import { AppState } from '../state/store.ts'; // Import AppState, adjusted path
import { View, Text, ActivityIndicator } from 'react-native-web'; // Import View and Text

// Screen Imports
import OnboardingScreen from '../screens/auth/OnboardingScreen.tsx';
import LoginScreen from '../screens/auth/LoginScreen.tsx';
import SignupScreen from '../screens/auth/SignupScreen.tsx';
import DiscoverActivitiesScreen from '../screens/main/DiscoverActivitiesScreen.tsx';
import ActivityDetailScreen from '../screens/main/ActivityDetailScreen.tsx';
import MyPlannedActivitiesScreen from '../screens/main/MyPlannedActivitiesScreen.tsx';
import CreateActivityScreen from '../screens/main/CreateActivityScreen.tsx';
import { theme } from '../constants/theme.ts';
import {
  AuthStackParamList,
  MainTabsParamList,
  DiscoverStackParamList,
  MyPlannedStackParamList,
  CreateActivityStackParamList,
  ProfileStackParamList,
} from './navigationTypes.ts';

// Placeholder for Profile Screen
const ProfileScreenPlaceholder = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

const DiscoverStackNav = createNativeStackNavigator<DiscoverStackParamList>();
const MyPlannedStackNav = createNativeStackNavigator<MyPlannedStackParamList>();
const CreateActivityStackNav = createNativeStackNavigator<CreateActivityStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();

function DiscoverNavigator() {
  return (
    <DiscoverStackNav.Navigator screenOptions={{ headerShown: false }}>
      <DiscoverStackNav.Screen name="DiscoverActivities" component={DiscoverActivitiesScreen} />
      <DiscoverStackNav.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ headerShown: true, title: 'Activity Details' }}
      />
    </DiscoverStackNav.Navigator>
  );
}

function MyPlannedNavigator() {
  return (
    <MyPlannedStackNav.Navigator screenOptions={{ headerShown: false }}>
      <MyPlannedStackNav.Screen
        name="MyPlannedActivitiesList"
        component={MyPlannedActivitiesScreen}
      />
      <MyPlannedStackNav.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ headerShown: true, title: 'Activity Details' }}
      />
    </MyPlannedStackNav.Navigator>
  );
}

function CreateActivityNavigator() {
  return (
    <CreateActivityStackNav.Navigator screenOptions={{ headerShown: false }}>
      <CreateActivityStackNav.Screen name="CreateActivity" component={CreateActivityScreen} />
      {/* Add other screens specific to activity creation flow if any */}
    </CreateActivityStackNav.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="Profile" component={ProfileScreenPlaceholder} />
      {/* Add other screens like EditProfile, Settings etc. */}
    </ProfileStackNav.Navigator>
  );
}

function MainAppNavigator() {
  return (
    <MainTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header for individual tabs, manage in stacks
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.darkGray,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.lightGray,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'DiscoverTab') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'MyPlannedTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'CreateActivityTab') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <MainTabs.Screen
        name="DiscoverTab"
        component={DiscoverNavigator}
        options={{ tabBarLabel: 'Discover' }}
      />
      <MainTabs.Screen
        name="MyPlannedTab"
        component={MyPlannedNavigator}
        options={{ tabBarLabel: 'Planned' }}
      />
      <MainTabs.Screen
        name="CreateActivityTab"
        component={CreateActivityNavigator}
        options={{ tabBarLabel: 'Suggest' }}
      />
      <MainTabs.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
    </MainTabs.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

const AppNavigator: React.FC = () => {
  const isAuthenticated = useAppStore((state: AppState) => state.isAuthenticated);
  const isLoadingAuth = useAppStore((state: AppState) => state.isLoadingAuth);
  const checkAuthStatus = useAppStore((state: AppState) => state.checkAuthStatus);

  React.useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoadingAuth) {
    // You can return a loading spinner here if you have a global one
    // For now, returning null or a simple loading text
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <MainAppNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
