import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { authRepository } from '@/features/auth/data/repositories/auth-repository-impl';
import { User } from '@/features/auth/domain/entities/user';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const router = useRouter();
  const { user, setUser, logout: contextLogout, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

  const fetchProfile = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    // Initial fetch if user is null
    if (!user) {
      fetchProfile();
    }
  }, [fetchProfile, user]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProfile(false);
  }, [fetchProfile]);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await contextLogout();
            router.replace('/login');
          }
        },
      ]
    );
  }, [router, contextLogout]);

  const updatePhoto = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUpdatingPhoto(true);
        const selectedImage = result.assets[0];
        
        const updatedUser = await authRepository.updateProfilePhoto({
          uri: selectedImage.uri,
          name: selectedImage.fileName || 'profile.jpg',
          type: selectedImage.mimeType || 'image/jpeg',
        });
        
        setUser(updatedUser); // This updates global state
        Alert.alert('Success', 'Profile photo updated successfully');
      }
    } catch (error: any) {
      console.error('Update photo error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile photo');
    } finally {
      setIsUpdatingPhoto(false);
    }
  }, [setUser]);

  return {
    user,
    isLoading,
    isRefreshing,
    isUpdatingPhoto,
    onRefresh,
    handleLogout,
    fetchProfile,
    updatePhoto,
  };
};
