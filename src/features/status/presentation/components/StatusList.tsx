import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusCircle } from './StatusCircle';
import { useContacts } from '@/features/chat/presentation/hooks/useContacts';
import { useStatus } from '../hooks/useStatus';
import { ModernAlert } from '@/shared/components/ModernAlert';
import { getAvatarUrl } from '@/core/utils/image-utils';
import { useAuth } from '@/features/auth/presentation/context/AuthContext';

interface StatusListProps {
  themeColors: any;
  filterUserIds?: string[];
}

export const StatusList: React.FC<StatusListProps> = ({ themeColors, filterUserIds }) => {
  const { uploadStatus, isUploading, myStatuses, allStatuses, fetchAllStatuses } = useStatus();
  const { sections } = useContacts();
  const { user: myUserData } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchAllStatuses();
  }, [fetchAllStatuses]);

  // Refresh statuses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAllStatuses();
    }, [fetchAllStatuses])
  );

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
  const friendsStatusEntries = Object.entries(allStatuses).filter(([userId]) => {
    if (filterUserIds) {
      return filterUserIds.some(id => String(id) === String(userId));
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        data={[
          { isMe: true },
          ...friendsStatusEntries.map(([userId, statuses]) => ({ userId, statuses }))
        ]}
        keyExtractor={(item: any, index) => item.isMe ? 'me' : item.userId}
        renderItem={({ item }: { item: any }) => {
          if (item.isMe) {
            return (
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
            );
          }

          const { userId, statuses } = item;
          const latestStatus = statuses[0];
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
        }}
      />

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
    flexDirection: 'row',
    alignItems: 'center',
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
