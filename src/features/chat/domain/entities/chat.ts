export interface Message {
  id: string;
  conversation_id: string;
  room_id?: string;
  content: string;
  sender_id: string;
  status?: 'sent' | 'delivered' | 'read';
  created_at?: string;
}

export interface Conversation {
  id: string;
  name?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  participants?: any[];
}

export interface SocketEvent {
  event: 'new_message';
  data: Message;
}
