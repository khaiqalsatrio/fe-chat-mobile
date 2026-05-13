import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { userRepository } from '@/features/auth/data/repositories/user-repository-impl';
import { User } from '@/features/auth/domain/entities/user';
import { chatRepository } from '@/features/chat/data/repositories/chat-repository-impl';

export interface ContactSection {
  title: string;
  data: User[];
}

export const useContacts = () => {
  const router = useRouter();
  const [sections, setSections] = useState<ContactSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchContacts = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return;

      const users = await userRepository.getAllUsers();
      
      // Group users by first letter
      const groups: { [key: string]: User[] } = {};
      users
        .sort((a, b) => a.username.localeCompare(b.username))
        .forEach(user => {
          const firstLetter = user.username.charAt(0).toUpperCase();
          if (!groups[firstLetter]) groups[firstLetter] = [];
          groups[firstLetter].push(user);
        });

      const formattedSections = Object.keys(groups)
        .sort()
        .map(letter => ({
          title: letter,
          data: groups[letter]
        }));

      setSections(formattedSections);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchContacts(false);
  }, [fetchContacts]);

  const handleStartChat = useCallback(async (user: User) => {
    try {
      const conversation = await chatRepository.createRoom(user.id);
      router.push({ 
        pathname: '/chat/[id]', 
        params: { id: conversation.id, name: user.username, avatar: user.avatar_url } 
      } as any);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  }, [router]);

  return {
    sections,
    isLoading,
    isRefreshing,
    onRefresh,
    handleStartChat,
    fetchContacts,
  };
};
