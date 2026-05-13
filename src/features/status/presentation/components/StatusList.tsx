import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { StatusCircle } from './StatusCircle';
import { useContacts } from '@/features/chat/presentation/hooks/useContacts';
import { useStatus } from '../hooks/useStatus';
import { ModernAlert } from '@/shared/components/ModernAlert';

interface StatusListProps {
  themeColors: any;
}

export const StatusList: React.FC<StatusListProps> = ({ themeColors }) => {
  const { uploadStatus, isUploading, myStatuses, allStatuses } = useStatus();
  const { sections } = useContacts();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUploadStatus = async () => {
    const success = await uploadStatus();
    if (success) {
      setShowSuccess(true);
    }
  };

  // Ambil semua user dari semua section kontak untuk pencocokan nama
  const allUsers = sections.flatMap(section => section.data);

  const BASE_IMAGE_URL = 'http://10.0.2.2:8080'; // Sesuaikan dengan API_URL Anda
  
  // My Status Data
  const myLatestStatus = myStatuses.length > 0 ? myStatuses[0] : null;
  const myAvatar = myLatestStatus 
    ? `${BASE_IMAGE_URL}${myLatestStatus.media_url}` 
    : 'https://i.pravatar.cc/150?u=me';

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
              image={`${BASE_IMAGE_URL}${latestStatus.media_url}`}
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
