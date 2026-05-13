import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import apiClient from '@/core/services/api-client';
import { socketService } from '@/core/services/socket-service';
import { useAuth } from '@/features/auth/presentation/context/AuthContext';
import { Alert } from 'react-native';

interface StatusContextType {
  myStatuses: any[];
  allStatuses: Record<string, any[]>;
  isUploading: boolean;
  uploadStatus: () => Promise<boolean>;
  deleteStatus: (id: string) => Promise<boolean>;
  fetchMyStatuses: () => Promise<void>;
  fetchAllStatuses: () => Promise<void>;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [myStatuses, setMyStatuses] = useState<any[]>([]);
  const [allStatuses, setAllStatuses] = useState<Record<string, any[]>>({});

  const fetchMyStatuses = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return;

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
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return;

      const response = await apiClient.get('/status');
      if (response.data && response.data.data) {
        setAllStatuses(response.data.data);
      }
    } catch (error) {
      console.error('Fetch All Status Error:', error);
    }
  }, []);

  // Listen to Auth changes to clear status state
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setMyStatuses([]);
      setAllStatuses({});
      return;
    }

    fetchMyStatuses();
    fetchAllStatuses();

    const unsubscribe = socketService.subscribe((message) => {
      if (
        message.type === 'status_created' || 
        message.type === 'status_deleted' || 
        message.type === 'new_status'
      ) {
        fetchMyStatuses();
        fetchAllStatuses();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, fetchMyStatuses, fetchAllStatuses]);

  const uploadStatus = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return false;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const file = result.assets[0];
        
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.fileName || 'status.jpg',
          type: file.mimeType || 'image/jpeg',
        } as any);
        formData.append('caption', 'Sent from My Mobile');

        const response = await apiClient.post('/status', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 201 || response.status === 200) {
          fetchMyStatuses();
          fetchAllStatuses();
          return true;
        }
      }
    } catch (error: any) {
      console.error('Upload Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload status');
    } finally {
      setIsUploading(false);
    }
    return false;
  };

  const deleteStatus = async (id: string) => {
    try {
      console.log('Attempting to delete status with ID:', id);
      const response = await apiClient.delete(`/status/${id}`);
      if (response.status === 200) {
        fetchMyStatuses();
        fetchAllStatuses(); // Tambahkan refresh all juga
        return true;
      }
    } catch (error: any) {
      console.error('Delete Status Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete status');
    }
    return false;
  };

  return (
    <StatusContext.Provider value={{
      myStatuses,
      allStatuses,
      isUploading,
      uploadStatus,
      deleteStatus,
      fetchMyStatuses,
      fetchAllStatuses
    }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatusContext = () => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatusContext must be used within a StatusProvider');
  }
  return context;
};
