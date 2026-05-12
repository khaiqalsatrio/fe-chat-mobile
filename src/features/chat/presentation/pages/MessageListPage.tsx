import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { chatRepository } from '../../data/repositories/chat-repository-impl';
import { socketService } from '@/core/services/socket-service';
import { Conversation } from '../../domain/entities/chat';

const { width } = Dimensions.get('window');

export default function MessageListPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [myUserData, setMyUserData] = useState<any>(null);

  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await chatRepository.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const userDataStr = await SecureStore.getItemAsync('user_data');
      if (userDataStr) setMyUserData(JSON.parse(userDataStr));
      
      await fetchConversations();
      
      // Connect to socket and listen for new messages to update the list
      await socketService.connect();
      const unsubscribe = socketService.subscribe((event) => {
        if (event.event === 'new_message') {
          // If we get a new message, refresh the list or update local state
          // For simplicity, let's refresh the list to get updated unread counts/last message
          fetchConversations(false);
        }
      });
      
      return unsubscribe;
    };

    const unsubscribePromise = init();
    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchConversations(false);
  };

  const renderChatItem = ({ item, isLast }: { item: Conversation, isLast: boolean }) => (
    <TouchableOpacity 
      style={[styles.chatItem, isLast && styles.noBorder]} 
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } } as any)}
    >
      <View style={styles.chatAvatarWrapper}>
        <View style={[styles.groupIcon, { backgroundColor: '#eef2ff' }]}>
          <Ionicons name="people" size={26} color="#6366f1" />
        </View>
        <View style={styles.onlineDotSmall} />
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: themeColors.text }]} numberOfLines={1}>
            {item.name || 'Chat Group'}
          </Text>
          <Text style={[styles.chatTime, { color: '#9ca3af' }]}>
            {item.last_message_time ? new Date(item.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text style={[styles.chatMessage, { color: '#6b7280' }]} numberOfLines={1}>
            {item.last_message || 'No messages yet'}
          </Text>
          {(item.unread_count ?? 0) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#fff', paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.myAvatarWrapper}>
            <Image 
              source={{ uri: myUserData?.avatar_url || 'https://i.pravatar.cc/150?u=me' }} 
              style={styles.myAvatar} 
            />
            <View style={styles.onlineDotSmall} />
          </View>
          <Text style={[styles.headerTitle, { color: '#111827' }]}>Messages</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={26} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {/* Chats List */}
          <View style={styles.chatsSection}>
            {conversations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No conversations yet.</Text>
              </View>
            ) : (
              conversations.map((chat, index) => (
                <React.Fragment key={chat.id}>
                  {renderChatItem({ item: chat, isLast: index === conversations.length - 1 })}
                </React.Fragment>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* FAB */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: Platform.OS === 'ios' ? 100 : 90 }]} 
        activeOpacity={0.8}
      >
        <Feather name="edit-3" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myAvatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  myAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 8,
  },
  activeContactsSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activeListContent: {
    paddingHorizontal: 20,
  },
  activeContactItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  activeAvatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  activeAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  onlineDotLarge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeContactName: {
    fontSize: 13,
    fontWeight: '500',
  },
  chatsSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  chatAvatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  chatAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  groupIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDotSmall: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#6366f1',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
