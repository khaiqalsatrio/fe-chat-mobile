import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function ProfilePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const SettingItem = ({ icon, title, subtitle, color, isLast }: any) => (
    <TouchableOpacity style={[styles.settingItem, isLast && styles.noBorder]}>
      <View style={[styles.iconWrapper, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=me' }} style={styles.myAvatarSmall} />
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Info */}
        <View style={styles.profileInfoSection}>
          <View style={styles.largeAvatarWrapper}>
            <View style={styles.avatarGradientBorder}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?u=alexandria' }} 
                style={styles.largeAvatar} 
              />
            </View>
            <View style={styles.onlineStatusDot} />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color="#6366f1" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Alexandria Carter</Text>
          <Text style={styles.userSubtitle}>
            Product Designer • "Living in the flow 🌊"
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-social-outline" size={22} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

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
            onPress={() => router.replace('/login')}
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
  profileInfoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f9fafb',
  },
  largeAvatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGradientBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#6366f1',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeAvatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
  },
  onlineStatusDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  userSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  editButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    width: 50,
    height: 50,
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6b7280',
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
