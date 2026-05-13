import { useThemeColor } from '@/core/hooks/use-theme-color';
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  isLoading: boolean;
  handleLogin: () => void;
  error: string | null;
  clearError: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  isLoading,
  handleLogin,
  error,
  clearError,
}) => {
  const labelColor = useThemeColor({ light: '#374151', dark: '#d1d5db' }, 'text');
  const inputBgColor = useThemeColor({ light: '#f3f4f6', dark: '#1f2937' }, 'background');
  const inputTextColor = useThemeColor({ light: '#111827', dark: '#f9fafb' }, 'text');
  const iconColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'icon');
  const placeholderColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'text');

  return (
    <View style={styles.form}>
      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: labelColor }]}>Email address</Text>
        <View style={[styles.inputWrapper, { backgroundColor: inputBgColor }]}>
          <Feather name="mail" size={18} color={iconColor} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: inputTextColor }]}
            placeholder="name@company.com"
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) clearError();
            }}
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: labelColor }]}>Password</Text>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.inputWrapper, { backgroundColor: inputBgColor }]}>
          <Feather name="lock" size={18} color={iconColor} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: inputTextColor }]}
            placeholder="••••••••"
            placeholderTextColor={placeholderColor}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) clearError();
            }}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={18} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
        activeOpacity={0.8}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Signing in...' : 'Login'}
        </Text>
        {!isLoading && <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  forgotText: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  loginButton: {
    backgroundColor: '#6366f1',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
