// Leggo/App.tsx (or your main entry file)
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore } from './src/state/store';
import { StatusBar } from 'react-native';
import { theme } from './src/constants/theme';

const App = () => {
  const checkAuthStatus = useAppStore(state => state.checkAuthStatus);
  const isLoadingAuth = useAppStore(state => state.isLoadingAuth);

  useEffect(() => {
    checkAuthStatus();
  });

  // Optional: Could show a global loading spinner here while isLoadingAuth is true,
  // but AppNavigator will handle its own loading/splash screen.

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
