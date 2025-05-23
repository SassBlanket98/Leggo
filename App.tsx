// Leggo/App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; // Removed .tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore, AppState } from './src/state/store'; // Combined import, removed .ts
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/constants/theme'; // Removed .ts

const App = () => {
  const checkAuthStatus = useAppStore((state: AppState) => state.checkAuthStatus);
  // isLoadingAuth is handled within AppNavigator now

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

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