import { useState, useEffect, useCallback, useRef } from 'react';
import { FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { chatRepository } from '../../data/repositories/chat-repository-impl';
import { socketService } from '@/core/services/socket-service';
import { Message, Conversation } from '../../domain/entities/chat';

export const useChatDetail = (
  conversationId: string | undefined,
  initialData?: { name?: string; avatar?: string }
) => {
  const [conversation, setConversation] = useState<Conversation | null>(
    initialData ? {
      id: conversationId || '',
      conversation_id: conversationId || '',
      name: initialData.name || 'Chat',
      avatar: initialData.avatar || '',
      last_message: '',
      last_message_time: '',
      time: '',
      unread_count: 0,
      type: 'PRIVATE'
    } : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initChat = async () => {
      try {
        // Get current user info
        const userDataStr = await SecureStore.getItemAsync('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setCurrentUserId(userData.id);
        }

        // Fetch conversation details and history
        if (conversationId) {
          try {
            const [details, history] = await Promise.all([
              chatRepository.getConversation(conversationId),
              chatRepository.getMessages(conversationId)
            ]);
            if (details) {
              setConversation(prev => {
                if ((!details.name || details.name === 'Chat') && prev?.name && prev.name !== 'Chat') {
                  return { ...details, name: prev.name, avatar: prev.avatar || details.avatar };
                }
                return details;
              });
            }
            // Sort messages oldest to newest for the normal list view
            const sortedHistory = [...history].sort((a, b) => {
              const dateA = new Date(a.created_at || 0).getTime();
              const dateB = new Date(b.created_at || 0).getTime();
              return dateA - dateB;
            });
            setMessages(sortedHistory);
          } catch (fetchError: any) {
            throw fetchError;
          }
        }

        // Connect and subscribe to socket
        await socketService.connect();
        unsubscribe = socketService.subscribe((payload) => {
          // Support both wrapped {event: '...', data: {...}} and direct {...} formats
          const message = payload.event === 'new_message' ? payload.data : payload;
          const rid = message.room_id || message.conversation_id;

          if (rid === conversationId) {
            setMessages((prev) => {
              if (prev.find(m => m.id === message.id)) return prev;
              return [...prev, message];
            });
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setIsLoading(false);
      }
    };

    initChat();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [conversationId]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isSending || !conversationId) return;

    const content = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const newMessage = await chatRepository.sendMessage(conversationId, content);
      setMessages((prev) => {
        if (prev.find(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      // Optional: Restore input text if send fails
      setInputText(content);
    } finally {
      setIsSending(false);
    }
  }, [inputText, isSending, conversationId]);

  return {
    conversation,
    messages,
    inputText,
    setInputText,
    isLoading,
    isSending,
    currentUserId,
    flatListRef,
    handleSend,
  };
};
