import React from 'react';
import { useProfile } from '../hooks/useProfile';

import { useAppTheme } from '@/core/context/ThemeContext';
import { useThemeColor } from '@/core/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileInfo } from '../components/ProfileInfo';
import { SettingItem } from '../components/SettingItem';

const { width } = Dimensions.get('window');

export default function ProfilePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleTheme } = useAppTheme();

  const {
    user,
    isLoading,
    isRefreshing,
    onRefresh,
    handleLogout,
  } = useProfile();

  const backgroundColor = useThemeColor({ light: '#f9fafb', dark: '#000000' }, 'background');
  const headerBg = useThemeColor({ light: '#fff', dark: '#0a0a0a' }, 'background');
  const headerBorder = useThemeColor({ light: '#f3f4f6', dark: '#1a1a1a' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = useThemeColor({ light: '#fff', dark: '#0a0a0a' }, 'background');
  const logoutBorder = useThemeColor({ light: '#fee2e2', dark: '#450a0a' }, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: headerBg, borderBottomColor: headerBorder }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <ProfileInfo user={user} />

          {/* Settings Groups */}
          <View style={styles.settingsSection}>
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
              <SettingItem
                icon="person-outline"
                title="Account"
                subtitle="Security, Two-factor, Privacy"
                color="#6366f1"
                isLast
              />
            </View>

            <View style={[styles.settingsCard, { backgroundColor: cardBg }]}>
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
              />
              <SettingItem
                icon="help-circle-outline"
                title="Help"
                subtitle="Support center, FAQ"
                color="#6b7280"
                isLast
              />
            </View>
          </View>

          {/* Logout Button */}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsSection: {
    paddingHorizontal: 20,
  },
  settingsCard: {
    borderRadius: 24,
    paddingVertical: 8,
    marginBottom: 20,
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
