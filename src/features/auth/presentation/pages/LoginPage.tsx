import React from 'react';
import { useLogin } from '../hooks/useLogin';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthHeader } from '../components/AuthHeader';
import { LoginForm } from '../components/LoginForm';
import { SocialAuthButtons } from '../components/SocialAuthButtons';

const { width } = Dimensions.get('window');

export default function LoginPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isLoading,
    error,
    setError,
    handleLogin,
    toggleShowPassword,
    clearError,
  } = useLogin();

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb', paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <AuthHeader 
            title="Welcome back" 
            subtitle="Sign in to continue your conversations" 
          />

          {/* Illustration */}
          <View style={styles.illustrationWrapper}>
            <Image
              source={require('@/shared/assets/images/login_illustration.png')}
              style={styles.illustration}
              contentFit="cover"
            />
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            isLoading={isLoading}
            handleLogin={handleLogin}
            error={error}
            clearError={clearError}
          />

          <SocialAuthButtons />

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  illustrationWrapper: {
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
    height: 160,
    width: '100%',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#4b5563',
    fontSize: 15,
  },
  registerLink: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});
