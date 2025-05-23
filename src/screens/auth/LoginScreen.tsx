// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native-web';
import { useAppStore } from '../../state/store.ts';
import { authService } from '../../services/authService.ts';
import { theme } from '../../constants/theme.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/navigationTypes.ts';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native/Libraries/Alert/Alert';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loginUser = useAppStore(state => state.loginUser);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const session = await authService.mockLogin(email, password);
      if (session) {
        await loginUser(session);
        // Navigation to the main app will be handled by the AppNavigator's conditional rendering
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Leggo</Text>
      <TextInput
        style={styles.input}
        placeholder="Email (e.g., user@leggo.com)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={theme.colors.darkGray}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (e.g., password123)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={theme.colors.darkGray}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.switchScreenContainer}>
        <Text style={styles.switchScreenText}>Don't have an account? </Text>
        <Text style={styles.switchScreenLink} onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </Text>
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

export default LoginScreen;
