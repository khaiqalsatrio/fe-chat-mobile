import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { StatusCircle } from './StatusCircle';
import { useContacts } from '@/features/chat/presentation/hooks/useContacts';
import { useStatus } from '../hooks/useStatus';
import { ModernAlert } from '@/shared/components/ModernAlert';
import { getAvatarUrl } from '@/core/utils/image-utils';
import { useAuth } from '@/features/auth/presentation/context/AuthContext';

interface StatusListProps {
  themeColors: any;
}

export const StatusList: React.FC<StatusListProps> = ({ themeColors }) => {
  const { uploadStatus, isUploading, myStatuses, allStatuses, fetchAllStatuses } = useStatus();
  const { sections } = useContacts();
  const { user: myUserData } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchAllStatuses();
  }, [fetchAllStatuses]);

  const handleUploadStatus = async () => {
    const success = await uploadStatus();
    if (success) {
      setShowSuccess(true);
    }
  };

  // Ambil semua user dari semua section kontak untuk pencocokan nama
  const allUsers = sections.flatMap(section => section.data);

  // My Status Data
  const myLatestStatus = myStatuses.length > 0 ? myStatuses[0] : null;
  const myAvatar = getAvatarUrl(myUserData?.avatar_url, 'me');
  // Resolve my latest status media URL
  const myStatusMedia = myLatestStatus ? getAvatarUrl(myLatestStatus.media_url, 'status_me') : myAvatar;

  // Friends Status Data
  const friendsStatusEntries = Object.entries(allStatuses);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* My Status */}
        <View style={{ position: 'relative' }}>
          <StatusCircle 
            id={myLatestStatus?.id}
            name="My Status" 
            image={myAvatar} 
            statusMedia={myStatusMedia}
            isMe 
            hasUpdate={myStatuses.length > 0}
            themeColors={themeColors} 
            onPress={handleUploadStatus}
          />
          {isUploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#6366f1" />
            </View>
          )}
        </View>
        
        {/* Friends Statuses */}
        {friendsStatusEntries.map(([userId, statuses]) => {
          const latestStatus = statuses[0];
          // Cari nama asli teman berdasarkan ID
          const friend = allUsers.find(u => u.id === userId);
          const displayName = friend ? friend.username : `User ${userId.slice(0, 4)}`;

          return (
            <StatusCircle 
              key={userId}
              id={userId}
              name={displayName}
              image={getAvatarUrl(friend?.avatar_url, userId)}
              statusMedia={getAvatarUrl(latestStatus.media_url, latestStatus.id)}
              hasUpdate={true}
              themeColors={themeColors}
            />
          );
        })}
      </ScrollView>

      <ModernAlert 
        visible={showSuccess}
        title="Posted!"
        message="Your status has been updated successfully."
        type="success"
        onClose={() => setShowSuccess(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 16,
    bottom: 24,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
