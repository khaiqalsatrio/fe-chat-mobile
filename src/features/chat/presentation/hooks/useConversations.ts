import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { chatRepository } from '../../data/repositories/chat-repository-impl';
import { Conversation } from '../../domain/entities/chat';
import { socketService } from '@/core/services/socket-service';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [myUserData, setMyUserData] = useState<any>(null);

  const fetchConversations = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return;

      const data = await chatRepository.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        const userDataStr = await SecureStore.getItemAsync('user_data');
        if (userDataStr) setMyUserData(JSON.parse(userDataStr));

        await fetchConversations();

        // Connect to socket and listen for new messages to update the list
        await socketService.connect();
        unsubscribe = socketService.subscribe((payload) => {
          // If it's a message or a message-like event, refresh the list
          const isMessage = payload.event === 'new_message' || payload.room_id || payload.conversation_id;
          if (isMessage) {
            fetchConversations(false);
          }
        });
      } catch (error) {
        console.error('Error initializing conversations:', error);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchConversations]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchConversations(false);
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    isRefreshing,
    myUserData,
    onRefresh,
    fetchConversations,
  };
};
