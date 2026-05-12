import apiClient from '@/core/services/api-client';
import { Conversation, Message } from '../../domain/entities/chat';

export class ChatRepository {
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await apiClient.get('/rooms');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await apiClient.get(`/rooms/${conversationId}/messages`);
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
      const response = await apiClient.post(`/rooms/${conversationId}/messages`, {
        room_id: conversationId,
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
}

export const chatRepository = new ChatRepository();
