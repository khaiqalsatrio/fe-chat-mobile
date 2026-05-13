import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Conversation } from '../../domain/entities/chat';
import { useThemeColor } from '@/core/hooks/use-theme-color';
import { getAvatarUrl } from '@/core/utils/image-utils';

interface ConversationItemProps {
  item: Conversation;
  isLast: boolean;
  onPress: (id: string) => void;
  themeColors: any;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  item,
  isLast,
  onPress,
  themeColors,
}) => {
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const timeColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'text');
  const borderColor = useThemeColor({ light: '#f3f4f6', dark: '#111827' }, 'background');
  const groupBg = useThemeColor({ light: '#eef2ff', dark: '#1e1b4b' }, 'background');

  return (
    <TouchableOpacity
      style={[
        styles.chatItem, 
        isLast && styles.noBorder,
        { borderBottomColor: borderColor }
      ]}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.chatAvatarWrapper}>
        {item.type === 'GROUP' ? (
          <View style={[styles.groupIcon, { backgroundColor: groupBg }]}>
            <Ionicons name="people" size={26} color="#6366f1" />
          </View>
        ) : (
          <Image 
            source={{ uri: getAvatarUrl(item.avatar, item.id) }} 
            style={styles.chatAvatar} 
          />
        )}
        <View style={[styles.onlineDotSmall, { borderColor: themeColors.background }]} />
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: textColor }]} numberOfLines={1}>
            {item.name || 'Chat'}
          </Text>
          <Text style={[styles.chatTime, { color: timeColor }]}>
            {item.last_message_time ? new Date(item.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </Text>
        </View>

        <View style={styles.chatFooter}>
          <Text style={[styles.chatMessage, { color: subTextColor }]} numberOfLines={1}>
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
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
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
});
