import { useState, useEffect, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import apiClient from '@/core/services/api-client';
import { Alert } from 'react-native';

export const useStatus = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [myStatuses, setMyStatuses] = useState<any[]>([]);
  const [allStatuses, setAllStatuses] = useState<Record<string, any[]>>({});

  const fetchMyStatuses = useCallback(async () => {
    try {
      const response = await apiClient.get('/status/me');
      if (response.data && response.data.data) {
        setMyStatuses(response.data.data);
      }
    } catch (error) {
      console.error('Fetch My Status Error:', error);
    }
  }, []);

  const fetchAllStatuses = useCallback(async () => {
    try {
      const response = await apiClient.get('/status');
      if (response.data && response.data.data) {
        setAllStatuses(response.data.data);
      }
    } catch (error) {
      console.error('Fetch All Status Error:', error);
    }
  }, []);

  useEffect(() => {
    fetchMyStatuses();
    fetchAllStatuses();
  }, [fetchMyStatuses, fetchAllStatuses]);

  const uploadStatus = async () => {
    try {
      // ... (logika upload tetap sama)
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const asset = result.assets[0];
        const formData = new FormData();
        const filename = asset.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;

        // @ts-ignore
        formData.append('file', {
          uri: asset.uri,
          name: filename,
          type: asset.mimeType || type,
        });
        formData.append('caption', 'Sent from My Mobile');

        const token = await SecureStore.getItemAsync('auth_token');
        const response = await apiClient.post('/status', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 201 || response.status === 200) {
          Alert.alert('Success', 'Your status has been updated!');
          fetchMyStatuses();
          fetchAllStatuses(); // Refresh status semua teman juga
        }
      }
    } catch (error: any) {
      console.error('Upload Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload status');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadStatus,
    isUploading,
    myStatuses,
    allStatuses,
    fetchMyStatuses,
    fetchAllStatuses,
  };
};
