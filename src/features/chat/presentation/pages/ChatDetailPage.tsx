import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { chatRepository } from '../../data/repositories/chat-repository-impl';
import { socketService } from '@/core/services/socket-service';
import { Message } from '../../domain/entities/chat';

const { width } = Dimensions.get('window');

export default function ChatDetailPage() {
  const router = useRouter();
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        // Get current user info
        const userDataStr = await SecureStore.getItemAsync('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setCurrentUserId(userData.id);
        }

        // Fetch history
        if (conversationId) {
          const history = await chatRepository.getMessages(conversationId);
          setMessages(history);
        }

        // Connect and subscribe to socket
        await socketService.connect();
        const unsubscribe = socketService.subscribe((event) => {
          if (event.event === 'new_message' && event.data.conversation_id === conversationId) {
            setMessages((prev) => {
              // Avoid duplicates if we are the sender (since we might have added it locally)
              if (prev.find(m => m.id === event.data.id)) return prev;
              return [...prev, event.data];
            });
            // Auto scroll to bottom
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
          }
        });

        setIsLoading(false);
        return unsubscribe;
      } catch (error) {
        console.error('Error initializing chat:', error);
        setIsLoading(false);
      }
    };

    const unsubscribePromise = initChat();
    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [conversationId]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending || !conversationId) return;

    const content = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const newMessage = await chatRepository.sendMessage(conversationId, content);
      setMessages((prev) => [...prev, newMessage]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optional: Add the message back to input or show error
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender_id === currentUserId;
    
    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
            {item.content}
          </Text>
        </View>
        <View style={[styles.messageFooter, isMe ? styles.myFooter : styles.otherFooter]}>
          <Text style={styles.timeText}>
            {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </Text>
          {isMe && (
            <Ionicons 
              name={item.status === 'read' ? "checkmark-done" : "checkmark"} 
              size={16} 
              color={item.status === 'read' ? "#6366f1" : "#9ca3af"} 
              style={{ marginLeft: 4 }} 
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#1f2937" />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=' + (conversationId || 'default') }} style={styles.avatar} />
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.userName}>Chat Group</Text>
              <Text style={styles.userStatus}>Active</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="video" size={22} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="phone" size={20} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: 20 }]}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity style={styles.plusButton}>
            <Ionicons name="add-circle-outline" size={28} color="#4b5563" />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={!isSending}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Feather name="smile" size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.sendButton, (!inputText.trim() || isSending) && { opacity: 0.5 }]} 
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  userStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dateText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9ca3af',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  myBubble: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#1f2937',
  },
  imageContainer: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageImage: {
    width: width * 0.7,
    height: 180,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  myFooter: {
    justifyContent: 'flex-end',
  },
  otherFooter: {
    justifyContent: 'flex-start',
  },
  timeText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  plusButton: {
    marginBottom: 10,
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    color: '#1f2937',
    paddingTop: 8,
    paddingBottom: 8,
  },
  emojiButton: {
    marginLeft: 8,
    marginBottom: 6,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginBottom: 4,
  },
});
