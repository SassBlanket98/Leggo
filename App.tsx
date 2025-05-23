// Leggo/App.tsx (or your main entry file)
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator.ts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore } from './src/state/store.ts';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/constants/theme.ts';
import { AppState } from './src/state/store.ts'; // Import AppState

const App = () => {
  const checkAuthStatus = useAppStore((state: AppState) => state.checkAuthStatus);
  const isLoadingAuth = useAppStore((state: AppState) => state.isLoadingAuth);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Optional: Could show a global loading spinner here while isLoadingAuth is true,
  // but AppNavigator will handle its own loading/splash screen.

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={theme.colors.background} />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
