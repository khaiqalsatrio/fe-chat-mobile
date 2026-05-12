import React from 'react';
import { useProfile } from '../hooks/useProfile';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProfileInfo } from '../components/ProfileInfo';
import { SettingItem } from '../components/SettingItem';

const { width } = Dimensions.get('window');

export default function ProfilePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    user,
    isLoading,
    isRefreshing,
    onRefresh,
    handleLogout,
  } = useProfile();


  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image 
              source={{ uri: user?.avatar_url || `https://i.pravatar.cc/150?u=${user?.id || 'me'}` }} 
              style={styles.myAvatarSmall} 
            />
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#374151" />
          </TouchableOpacity>
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
            <View style={styles.settingsCard}>
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
                isLast
              />
            </View>

            <View style={styles.settingsCard}>
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
              style={styles.logoutButton}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
    color: '#111827',
  },
  settingsSection: {
    paddingHorizontal: 20,
  },
  settingsCard: {
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fee2e2',
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
