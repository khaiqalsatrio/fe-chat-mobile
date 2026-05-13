import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useThemeColor } from '@/core/hooks/use-theme-color';

interface RegisterFormProps {
  fullName: string;
  setFullName: (text: string) => void;
  email: string;
  setEmail: (text: string) => void;
  password: string;
  setPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  agree: boolean;
  toggleAgree: () => void;
  isLoading: boolean;
  handleRegister: () => void;
  error: string | null;
  clearError: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  toggleShowPassword,
  agree,
  toggleAgree,
  isLoading,
  handleRegister,
  error,
  clearError,
}) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 500;

  const cardBgColor = useThemeColor({ light: '#fff', dark: '#121212' }, 'background');
  const titleColor = useThemeColor({ light: '#111827', dark: '#f9fafb' }, 'text');
  const subtitleColor = useThemeColor({ light: '#4b5563', dark: '#9ca3af' }, 'text');
  const labelColor = useThemeColor({ light: '#374151', dark: '#d1d5db' }, 'text');
  const inputBgColor = useThemeColor({ light: '#f3f4f6', dark: '#1f2937' }, 'background');
  const inputTextColor = useThemeColor({ light: '#111827', dark: '#f9fafb' }, 'text');
  const iconColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'icon');
  const placeholderColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'text');
  const agreementTextColor = useThemeColor({ light: '#4b5563', dark: '#9ca3af' }, 'text');

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: cardBgColor,
        alignSelf: isTablet ? 'center' : 'stretch',
        width: isTablet ? 450 : 'auto',
        marginHorizontal: isTablet ? 0 : 20,
      }
    ]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.title, { color: titleColor }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: subtitleColor }]}>Join our professional community today.</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: labelColor }]}>Username</Text>
            <View style={[styles.inputWrapper, { backgroundColor: inputBgColor }]}>
              <Feather name="user" size={20} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="khaiqal"
                placeholderTextColor={placeholderColor}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (error) clearError();
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: labelColor }]}>Email</Text>
            <View style={[styles.inputWrapper, { backgroundColor: inputBgColor }]}>
              <Feather name="mail" size={20} color={iconColor} style={styles.inputIcon} />
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

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: labelColor }]}>Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: inputBgColor }]}>
              <Feather name="lock" size={20} color={iconColor} style={styles.inputIcon} />
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
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color={iconColor} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: labelColor }]}>Confirm Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: inputBgColor }]}>
              <Ionicons name="refresh-outline" size={20} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="••••••••"
                placeholderTextColor={placeholderColor}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) clearError();
                }}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.agreementRow} 
            onPress={toggleAgree}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agree && styles.checkboxActive]}>
              {agree && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={[styles.agreementText, { color: agreementTextColor }]}>
              By creating an account, you agree to our <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy</Text>.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && { opacity: 0.7 }]} 
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden', // Untuk memastikan borderRadius bekerja dengan ScrollView
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  cardHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  agreementText: {
    flex: 1,
    fontSize: 11,
    color: '#4b5563',
  },
  link: {
    color: '#4f46e5',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#3730a3',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32, // Sedikit lebih besar agar ada jarak yang pas
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
