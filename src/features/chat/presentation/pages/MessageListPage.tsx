import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConversationItem } from '../components/ConversationItem';
import { useConversations } from '../hooks/useConversations';

const { width } = Dimensions.get('window');

export default function MessageListPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const {
    conversations,
    isLoading,
    isRefreshing,
    myUserData,
    onRefresh,
  } = useConversations();


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
            <View style={styles.onlineDotLarge} />
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
                <ConversationItem
                  key={chat.id}
                  item={chat}
                  isLast={index === conversations.length - 1}
                  themeColors={themeColors}
                  onPress={(id) => router.push({ 
        pathname: '/chat/[id]', 
        params: { id, name: chat.name, avatar: chat.avatar } 
      } as any)}
                />
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
