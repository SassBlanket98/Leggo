// src/screens/auth/OnboardingScreen.tsx
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/navigationTypes.ts'; // Assuming AuthStackParamList is defined
import { theme } from '../../constants/theme.ts';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Leggo!</Text>
      <Text style={styles.subtitle}>Discover and plan your next adventure.</Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          color={theme.colors.primary}
        >
          Login
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Signup')}
          color={theme.colors.secondary}
        >
          Sign Up
        </Button>
        <Button color={theme.colors.secondary} children={undefined} />
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
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: theme.spacing.s,
  },
});

export default OnboardingScreen;
