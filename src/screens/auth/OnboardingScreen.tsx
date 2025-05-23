// src/screens/auth/OnboardingScreen.tsx
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button as PaperButton } from 'react-native-paper'; // Aliased for clarity
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/navigationTypes';
import { theme } from '../../constants/theme';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Leggo!</Text>
      <Text style={styles.subtitle}>Discover and plan your next adventure.</Text>
      <View style={styles.buttonContainer}>
        <PaperButton
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.buttonSpacing}
          labelStyle={styles.buttonLabel}
          theme={{ colors: { primary: theme.colors.primary } }} // Ensure PaperButton uses your theme color
        >
          Login
        </PaperButton>
        <PaperButton
          mode="contained"
          onPress={() => navigation.navigate('Signup')}
          style={styles.buttonSpacing}
          labelStyle={styles.buttonLabel}
          theme={{ colors: { primary: theme.colors.secondary } }} // Ensure PaperButton uses your theme color
        >
          Sign Up
        </PaperButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    width: '80%',
  },
  buttonSpacing: {
    marginVertical: theme.spacing.s,
  },
  buttonLabel: {
    color: theme.colors.white, // Assuming you want white text on colored buttons
    fontWeight: 'bold',
  }
});

export default OnboardingScreen;