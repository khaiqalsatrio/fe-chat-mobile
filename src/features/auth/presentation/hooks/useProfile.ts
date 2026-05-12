import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authRepository } from '@/features/auth/data/repositories/auth-repository-impl';
import { User } from '@/features/auth/domain/entities/user';

export const useProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfile = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const userData = await authRepository.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
            await authRepository.logout();
            router.replace('/login');
          }
        },
      ]
    );
  }, [router]);

  return {
    user,
    isLoading,
    isRefreshing,
    onRefresh,
    handleLogout,
    fetchProfile,
  };
};
