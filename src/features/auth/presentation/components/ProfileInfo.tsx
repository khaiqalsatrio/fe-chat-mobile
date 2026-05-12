import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/features/auth/domain/entities/user';

interface ProfileInfoProps {
  user: User | null;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <View style={styles.profileInfoSection}>
      <View style={styles.largeAvatarWrapper}>
        <View style={styles.avatarGradientBorder}>
          <Image 
            source={{ uri: user?.avatar_url || `https://i.pravatar.cc/150?u=${user?.id || 'me'}` }} 
            style={styles.largeAvatar} 
          />
        </View>
        {user?.status === 'ONLINE' && <View style={styles.onlineStatusDot} />}
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera" size={18} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>{user?.username || 'User'}</Text>
      <Text style={styles.userSubtitle}>
        {user?.email} • "Available"
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
  );
};

const styles = StyleSheet.create({
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
});
