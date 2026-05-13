import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/features/auth/domain/entities/user';
import { useThemeColor } from '@/core/hooks/use-theme-color';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { ActivityIndicator } from 'react-native';
import { getAvatarUrl } from '@/core/utils/image-utils';

interface ProfileInfoProps {
  user: User | null;
  onUpdatePhoto?: () => void;
  isUpdating?: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, onUpdatePhoto, isUpdating }) => {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const backgroundColor = useThemeColor({ light: '#f9fafb', dark: '#000000' }, 'background');
  const cardColor = useThemeColor({ light: '#fff', dark: '#0a0a0a' }, 'background');
  const shareBtnColor = useThemeColor({ light: '#e5e7eb', dark: '#1a1a1a' }, 'background');
  const shareIconColor = useThemeColor({ light: '#374151', dark: '#ececec' }, 'text');
  const primaryColor = '#6366f1';

  const avatarUrl = getAvatarUrl(user?.avatar_url || undefined, user?.id);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ImageBackground 
        source={{ uri: avatarUrl }} 
        style={styles.coverImage}
        blurRadius={Platform.OS === 'ios' ? 5 : 3}
      >
        <View style={[
          styles.overlay, 
          { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.55)' }
        ]}>
          <View style={styles.profileInfoSection}>
            <View style={styles.largeAvatarWrapper}>
              <View style={styles.avatarGradientBorder}>
                <Image 
                  source={{ uri: avatarUrl }} 
                  style={styles.largeAvatar} 
                />
                {isUpdating && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
              </View>
              {user?.status === 'ONLINE' && <View style={[styles.onlineStatusDot, { borderColor: cardColor }]} />}
              <TouchableOpacity 
                style={[styles.cameraButton, { backgroundColor: cardColor }]}
                onPress={onUpdatePhoto}
                disabled={isUpdating}
              >
                <Ionicons name="camera" size={18} color={primaryColor} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.userName, { color: textColor }]}>{user?.username || 'User'}</Text>
            <Text style={[styles.userSubtitle, { color: subTextColor }]}>
              {user?.email} • "Available"
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.shareButton, { backgroundColor: shareBtnColor }]}>
                <Ionicons name="share-social-outline" size={22} color={shareIconColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
  },
  overlay: {
    width: '100%',
    paddingVertical: 30,
  },
  profileInfoSection: {
    alignItems: 'center',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 62,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  userSubtitle: {
    fontSize: 15,
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
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
