import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { useAuth } from '@/features/auth/presentation/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusList } from '../../../status/presentation/components/StatusList';
import { ConversationItem } from '../components/ConversationItem';
import { useConversations } from '../hooks/useConversations';

const { width } = Dimensions.get('window');

export default function MessageListPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user } = useAuth();

  const {
    conversations,
    isLoading,
    isRefreshing,
    onRefresh,
    fetchConversations,
  } = useConversations();

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchConversations(false);
    }, [fetchConversations])
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);

  const filteredConversations = React.useMemo(() => {
    // First sort by time descending and filter by search query
    const filtered = [...conversations]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Then deduplicate private chats by other participant ID
    const seen = new Set<string>();
    return filtered.filter(chat => {
      if (chat.type === 'PRIVATE' && chat.participants && user?.id) {
        const otherParticipant = chat.participants.find((p: any) => {
          const pId = typeof p === 'string' ? p : p.id;
          return pId && String(pId) !== String(user.id);
        });

        const otherId = otherParticipant ? (typeof otherParticipant === 'string' ? otherParticipant : otherParticipant.id) : null;

        if (otherId) {
          const key = `private_${otherId}`;
          if (seen.has(key)) return false;
          seen.add(key);
        }
      }
      return true;
    });
  }, [conversations, searchQuery, user?.id]);

  const conversationUserIds = React.useMemo(() => {
    const ids = new Set<string>();
    conversations.forEach(chat => {
      // 1. Cek explicit other_user_id (baru ditambahkan di repo)
      const directId = (chat as any).other_user_id;
      if (directId) {
        ids.add(String(directId));
      }

      // 2. Fallback: Cari dari daftar participants
      if (chat.participants && Array.isArray(chat.participants)) {
        chat.participants.forEach((p: any) => {
          const pId = typeof p === 'string' ? p : (p.id || p.ID || p.user_id || p.UserId || p.userId);
          if (pId && String(pId) !== String(user?.id)) {
            ids.add(String(pId));
          }
        });
      }
    });
    return Array.from(ids);
  }, [conversations, user?.id]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : themeColors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: colorScheme === 'dark' ? '#0a0a0a' : 'transparent',
        borderBottomColor: colorScheme === 'dark' ? '#1a1a1a' : '#f3f4f6'
      }]}>
        {isSearchVisible ? (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6366f1" style={styles.searchIconInside} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder="Search conversations..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={toggleSearch}>
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.headerLeft}>
              <Text style={[styles.headerTitle, { color: themeColors.text }]}>Messager</Text>
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
              <Ionicons name="search" size={24} color="#6366f1" />
            </TouchableOpacity>
          </>
        )}
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
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colorScheme === 'dark' ? '#fff' : '#000'}
            />
          }
        >
          {/* Status Section */}
          <StatusList themeColors={themeColors} filterUserIds={conversationUserIds} />

          {/* Chats List */}
          <View style={styles.chatsSection}>
            {filteredConversations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery ? `No results for "${searchQuery}"` : "No conversations yet."}
                </Text>
              </View>
            ) : (
              filteredConversations.map((chat, index) => (
                <ConversationItem
                  key={chat.id}
                  item={chat}
                  isLast={index === filteredConversations.length - 1}
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
        style={[
          styles.fab,
          {
            bottom: Platform.OS === 'ios' ? 75 : 65,
            backgroundColor: colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.15)',
            shadowColor: colorScheme === 'dark' ? '#000' : '#6366f1',
          }
        ]}
        activeOpacity={0.8}
      >
        <Image
          source={require('@/app/assets/meta3.png')}
          style={{ width: 50, height: 50 }}
          contentFit="contain"
        />
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
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIconInside: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    padding: 0, // Remove default padding on Android
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
