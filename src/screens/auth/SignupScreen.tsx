// src/screens/auth/SignupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native-web';
import { useAppStore } from '../../state/store.ts';
import { authService } from '../../services/authService.ts';
import { theme } from '../../constants/theme.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/navigationTypes.ts';
import { useNavigation } from '@react-navigation/native';

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loginUser = useAppStore(state => state.loginUser); // Use loginUser to set the session
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const session = await authService.mockSignup(email, password);
      if (session) {
        await loginUser(session); // This will store the session and update isAuthenticated
        // Navigation to main app is handled by AppNavigator's conditional rendering
      } else {
        // This case should ideally not happen with mockSignup always succeeding
        Alert.alert('Signup Failed', 'Could not create an account.');
      }
    } catch (error) {
      Alert.alert('Signup Error', 'An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={theme.colors.darkGray}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={theme.colors.darkGray}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor={theme.colors.darkGray}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignup} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.switchScreenContainer}>
        <Text style={styles.switchScreenText}>Already have an account? </Text>
        <Text style={styles.switchScreenLink} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </View>
    </View>
  );
};

// Use similar styles as LoginScreen, or create shared styles
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
    marginBottom: theme.spacing.xl,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: theme.colors.lightGray,
    borderWidth: 1,
    borderRadius: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: theme.spacing.s,
  },
  switchScreenContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.l,
  },
  switchScreenText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  switchScreenLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
