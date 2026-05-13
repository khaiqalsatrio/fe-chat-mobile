import apiClient from '@/core/services/api-client';
import { Conversation, Message } from '../../domain/entities/chat';
import * as SecureStore from 'expo-secure-store';

export class ChatRepository {
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await apiClient.get('/chat/conversations');
      const userData = await SecureStore.getItemAsync('user_data');
      const currentUser = userData ? JSON.parse(userData) : null;
      const currentUserId = currentUser?.id;

      return (response.data.data || []).map((room: any) => {
        let name = room.name || 'Chat';
        let avatar = room.avatar_url || '';

        // If it's a private chat, use the other participant's info
        const isPrivate = room.type?.toUpperCase() === 'PRIVATE';
        let otherParticipant: any = null;

        if (isPrivate && Array.isArray(room.participants)) {
          otherParticipant = room.participants.find((p: any) => {
            const pId = typeof p === 'string' ? p : (p.id || p.ID || p.user_id);
            // Check both string and potentially numeric IDs
            return pId && String(pId) !== String(currentUserId);
          });

          if (otherParticipant) {
            if (typeof otherParticipant === 'object') {
              name = otherParticipant.username || otherParticipant.name || name;
              avatar = otherParticipant.avatar_url || otherParticipant.avatar || avatar;
            }
          }
        }

        // If it's still "Chat" but we have participants, maybe the first one is NOT us
        if (name === 'Chat' && Array.isArray(room.participants) && room.participants.length > 0) {
           const fallbackParticipant = room.participants.find((p: any) => {
             const pId = typeof p === 'string' ? p : (p.id || p.ID || p.user_id);
             return String(pId) !== String(currentUserId);
           });
           if (fallbackParticipant && typeof fallbackParticipant === 'object') {
             name = fallbackParticipant.username || fallbackParticipant.name || name;
           }
        }

        // Extract last message content, supporting both string and object formats
        let lastMessage = '';
        const lm = room.last_message || room.latest_message || room.LastMessage || room.LatestMessage;
        if (lm) {
          if (typeof lm === 'string') {
            lastMessage = lm;
          } else if (typeof lm === 'object') {
            lastMessage = lm.content || lm.Content || lm.text || lm.Text || lm.body || lm.Body || '';
          }
        }

        // Check if there's a messages array instead
        if (!lastMessage && Array.isArray(room.messages) && room.messages.length > 0) {
          const last = room.messages[room.messages.length - 1];
          lastMessage = typeof last === 'string' ? last : (last.content || last.Content || '');
        }

        // Final fallback to room.content
        if (!lastMessage && room.content) lastMessage = room.content;
        if (!lastMessage && room.Content) lastMessage = room.Content;

        const otherParticipantId = otherParticipant ? (typeof otherParticipant === 'string' ? otherParticipant : (otherParticipant.id || otherParticipant.ID || otherParticipant.user_id)) : null;

        return {
          id: room.id,
          conversation_id: room.id,
          name: name,
          last_message: lastMessage,
          last_message_time: room.updated_at || new Date().toISOString(),
          time: room.updated_at || new Date().toISOString(),
          unread_count: 0,
          avatar: avatar,
          type: room.type || 'PRIVATE',
          participants: room.participants,
          other_user_id: otherParticipantId ? String(otherParticipantId) : undefined,
        };
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      // If the backend doesn't have a specific endpoint for room detail, 
      // we might need to get it from the conversations list or just return a placeholder
      // For now, let's try to fetch it but return null if it fails with 404
      const response = await apiClient.get(`/chat/conversations/${id}`);
      const room = response.data?.data || response.data;
      
      if (!room) return null;

      const userData = await SecureStore.getItemAsync('user_data');
      const currentUser = userData ? JSON.parse(userData) : null;
      const currentUserId = currentUser?.id;

      let name = room.name || 'Chat';
      let avatar = room.avatar_url || '';

      const isPrivate = room.type?.toUpperCase() === 'PRIVATE';
      let otherParticipant: any = null;

      if (isPrivate && Array.isArray(room.participants)) {
        otherParticipant = room.participants.find((p: any) => {
          const pId = typeof p === 'string' ? p : (p.id || p.ID || p.user_id);
          return pId && String(pId) !== String(currentUserId);
        });

        if (otherParticipant && typeof otherParticipant === 'object') {
          name = otherParticipant.username || otherParticipant.name || name;
          avatar = otherParticipant.avatar_url || otherParticipant.avatar || avatar;
        }
      }

      // Fallback
      if (name === 'Chat' && Array.isArray(room.participants) && room.participants.length > 0) {
        const fallbackParticipant = room.participants.find((p: any) => {
          const pId = typeof p === 'string' ? p : (p.id || p.ID || p.user_id);
          return String(pId) !== String(currentUserId);
        });
        if (fallbackParticipant && typeof fallbackParticipant === 'object') {
          name = fallbackParticipant.username || fallbackParticipant.name || name;
        }
      }

      // Extract last message content
      let lastMessage = '';
      const lm = room.last_message || room.latest_message || room.LastMessage || room.LatestMessage;
      if (lm) {
        if (typeof lm === 'string') {
          lastMessage = lm;
        } else if (typeof lm === 'object') {
          lastMessage = lm.content || lm.Content || lm.text || lm.Text || lm.body || lm.Body || '';
        }
      }

      // Check if there's a messages array instead
      if (!lastMessage && Array.isArray(room.messages) && room.messages.length > 0) {
        const last = room.messages[room.messages.length - 1];
        lastMessage = typeof last === 'string' ? last : (last.content || last.Content || '');
      }

      // Final fallback to room.content
      if (!lastMessage && room.content) lastMessage = room.content;
      if (!lastMessage && room.Content) lastMessage = room.Content;

      const otherParticipantId = otherParticipant ? (typeof otherParticipant === 'string' ? otherParticipant : (otherParticipant.id || otherParticipant.ID || otherParticipant.user_id)) : null;

      return {
        id: room.id,
        conversation_id: room.id,
        name: name,
        last_message: lastMessage,
        last_message_time: room.updated_at || new Date().toISOString(),
        time: room.updated_at || new Date().toISOString(),
        unread_count: 0,
        avatar: avatar,
        type: room.type || 'PRIVATE',
        participants: room.participants,
        other_user_id: otherParticipantId ? String(otherParticipantId) : undefined,
      };
    } catch (error: any) {
      console.warn(`[ChatRepository] getConversation failed for ${id}, likely 404. Using fallback.`);
      return null;
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
      return (response.data.data || []).map((msg: any) => ({
        ...msg,
        conversation_id: msg.room_id,
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    try {
      const response = await apiClient.post('/chat/messages', {
        conversation_id: conversationId,
        content,
        type: 'TEXT',
      });
      const msg = response.data.data;
      return {
        ...msg,
        conversation_id: msg.room_id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  async createRoom(participantId: string): Promise<Conversation> {
    try {
      const response = await apiClient.post('/chat/conversations', {
        type: 'PRIVATE',
        participants: [participantId],
      });
      const room = response.data.data;
      
      // Map to Conversation format
      return {
        id: room.id,
        conversation_id: room.id,
        name: room.name || 'Chat',
        last_message: '',
        last_message_time: new Date().toISOString(),
        time: new Date().toISOString(),
        unread_count: 0,
        avatar: '',
        type: 'PRIVATE',
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create chat room');
    }
  }
}

export const chatRepository = new ChatRepository();
