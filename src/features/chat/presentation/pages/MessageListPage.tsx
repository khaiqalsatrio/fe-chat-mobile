import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const ACTIVE_CONTACTS = [
  { id: '1', name: 'Alex', image: 'https://i.pravatar.cc/150?u=alex', online: true },
  { id: '2', name: 'Sarah', image: 'https://i.pravatar.cc/150?u=sarah', online: false },
  { id: '3', name: 'Jordan', image: 'https://i.pravatar.cc/150?u=jordan', online: true },
  { id: '4', name: 'Taylor', image: 'https://i.pravatar.cc/150?u=taylor', online: false },
];

const CHATS = [
  {
    id: '1',
    name: 'Jordan Miller',
    message: 'Can we review the Q4 designs today?',
    time: '10:42 AM',
    unread: 2,
    image: 'https://i.pravatar.cc/150?u=jordan',
    online: true,
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    message: 'The final report has been uploaded to th...',
    time: 'Yesterday',
    unread: 0,
    image: 'https://i.pravatar.cc/150?u=sarah',
    online: false,
  },
  {
    id: '3',
    name: 'Alex Rivera',
    message: 'Sounds good, let\'s catch up later.',
    time: 'Monday',
    unread: 0,
    image: 'https://i.pravatar.cc/150?u=alex',
    online: true,
  },
  {
    id: '4',
    name: 'Design Team Sync',
    message: 'Mark: I\'ve updated the brand toke...',
    time: 'Monday',
    unread: 12,
    isGroup: true,
    image: null,
  },
  {
    id: '5',
    name: 'Taylor Swift',
    message: 'See you at the concert tonight!',
    time: 'Oct 12',
    unread: 0,
    image: 'https://i.pravatar.cc/150?u=taylor',
    online: false,
  },
];

export default function MessageListPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const renderActiveContact = ({ item }: { item: typeof ACTIVE_CONTACTS[0] }) => (
    <TouchableOpacity 
      style={styles.activeContactItem} 
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } } as any)}
    >
      <View style={styles.activeAvatarWrapper}>
        <Image source={{ uri: item.image }} style={styles.activeAvatar} />
        {item.online && <View style={styles.onlineDotLarge} />}
      </View>
      <Text style={[styles.activeContactName, { color: themeColors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item, isLast }: { item: typeof CHATS[0], isLast: boolean }) => (
    <TouchableOpacity 
      style={[styles.chatItem, isLast && styles.noBorder]} 
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } } as any)}
    >
      <View style={styles.chatAvatarWrapper}>
        {item.isGroup ? (
          <View style={[styles.groupIcon, { backgroundColor: '#eef2ff' }]}>
            <Ionicons name="people" size={26} color="#6366f1" />
          </View>
        ) : (
          <Image source={{ uri: item.image! }} style={styles.chatAvatar} />
        )}
        {item.online && <View style={styles.onlineDotSmall} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: themeColors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.chatTime, { color: '#9ca3af' }]}>{item.time}</Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text style={[styles.chatMessage, { color: '#6b7280' }]} numberOfLines={1}>
            {item.message}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
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
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=me' }} style={styles.myAvatar} />
            <View style={styles.onlineDotSmall} />
          </View>
          <Text style={[styles.headerTitle, { color: '#111827' }]}>Messages</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={26} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Active Contacts */}
        <View style={styles.activeContactsSection}>
          <FlatList
            data={ACTIVE_CONTACTS}
            renderItem={renderActiveContact}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeListContent}
          />
        </View>

        {/* Chats List */}
        <View style={styles.chatsSection}>
          {CHATS.map((chat, index) => (
            <React.Fragment key={chat.id}>
              {renderChatItem({ item: chat, isLast: index === CHATS.length - 1 })}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

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
});
