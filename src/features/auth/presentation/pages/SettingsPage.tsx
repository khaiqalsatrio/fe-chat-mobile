import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/core/context/ThemeContext';
import { useThemeColor } from '@/core/hooks/use-theme-color';
import { useProfile } from '../hooks/useProfile';
import { SettingItem } from '../components/SettingItem';

export default function SettingsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleTheme } = useAppTheme();
  const { handleLogout, isLoading } = useProfile();

  const backgroundColor = useThemeColor({ light: '#f9fafb', dark: '#000000' }, 'background');
  const headerBg = useThemeColor({ light: '#fff', dark: '#0a0a0a' }, 'background');
  const headerBorder = useThemeColor({ light: '#f3f4f6', dark: '#1a1a1a' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({ light: '#fff', dark: '#0a0a0a' }, 'background');
  const logoutBorder = useThemeColor({ light: '#fee2e2', dark: '#450a0a' }, 'background');

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: headerBg, borderBottomColor: headerBorder }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={[styles.settingsCard, { backgroundColor: cardBg }]}>
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle="Enable dark theme"
              color="#8b5cf6"
              rightElement={
                <Switch
                  value={colorScheme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#d1d5db', true: '#6366f1' }}
                  thumbColor="#fff"
                />
              }
            />
          </View>

          <Text style={styles.sectionTitle}>Account & Security</Text>
          <View style={[styles.settingsCard, { backgroundColor: cardBg }]}>
            <SettingItem
              icon="person-outline"
              title="Account"
              subtitle="Security, Two-factor, Privacy"
              color="#6366f1"
            />
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Push, Email, Quiet mode"
              color="#6366f1"
            />
            <SettingItem
              icon="lock-closed-outline"
              title="Privacy"
              subtitle="Data, Visibility, Contacts"
              color="#10b981"
              isLast
            />
          </View>

          <Text style={styles.sectionTitle}>Other</Text>
          <View style={[styles.settingsCard, { backgroundColor: cardBg }]}>
            <SettingItem
              icon="help-circle-outline"
              title="Help"
              subtitle="Support center, FAQ"
              color="#6b7280"
              isLast
            />
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: cardBg, borderColor: logoutBorder }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <Text style={styles.appVersion}>APP VERSION 2.4.1 (STABLE)</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingsCard: {
    borderRadius: 24,
    paddingVertical: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  appVersion: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
