// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppStore, AppState } from '../state/store'; // Combined import
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Screen Imports
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import DiscoverActivitiesScreen from '../screens/main/DiscoverActivitiesScreen';
import ActivityDetailScreen from '../screens/main/ActivityDetailScreen';
import MyPlannedActivitiesScreen from '../screens/main/MyPlannedActivitiesScreen';
import CreateActivityScreen from '../screens/main/CreateActivityScreen';
import { theme } from '../constants/theme';
import {
  AuthStackParamList,
  MainTabsParamList,
  DiscoverStackParamList,
  MyPlannedStackParamList,
  CreateActivityStackParamList,
  ProfileStackParamList,
} from './navigationTypes'; // Removed .ts from paths
import { RouteProp } from '@react-navigation/native'; // For explicit route prop typing

// Placeholder for Profile Screen
const ProfileScreenPlaceholder = () => (
  <View style={styles.placeholderContainer}>
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
    </CreateActivityStackNav.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="Profile" component={ProfileScreenPlaceholder} />
    </ProfileStackNav.Navigator>
  );
}

function MainAppNavigator() {
  return (
    <MainTabs.Navigator
      screenOptions={({ route }: { route: RouteProp<MainTabsParamList, keyof MainTabsParamList> }) => ({ // Typed route
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.darkGray,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.lightGray,
        },
        tabBarIcon: ({ focused, color, size }) => { // Parameters are already typed by the context
          let iconName = '';

          if (route.name === 'DiscoverTab') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'MyPlannedTab') {
            iconName = focused ? 'calendar-check' : 'calendar-check-outline';
          } else if (route.name === 'CreateActivityTab') {
            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
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
  // checkAuthStatus is called in App.tsx, no need to call it again here unless specifically intended

  if (isLoadingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <MainAppNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AppNavigator;