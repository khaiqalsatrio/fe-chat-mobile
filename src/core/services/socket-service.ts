import * as SecureStore from 'expo-secure-store';

type MessageCallback = (data: any) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private listeners: Set<MessageCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect() {
    const token = await SecureStore.getItemAsync('auth_token');
    if (!token) {
      console.warn('No token found, cannot connect to socket');
      return;
    }

    // 10.0.2.2 is localhost for Android emulator
    const wsUrl = `ws://10.0.2.2:8080/api/ws?token=${token}`;
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('Connected to chat server');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach((callback) => callback(data));
      } catch (e) {
        console.error('Error parsing socket message:', e);
      }
    };

    this.socket.onclose = (e) => {
      console.log('Socket closed:', e.code, e.reason);
      this.attemptReconnect();
    };

    this.socket.onerror = (e) => {
      console.error('Socket error:', e);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), 3000);
    }
  }

  subscribe(callback: MessageCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
