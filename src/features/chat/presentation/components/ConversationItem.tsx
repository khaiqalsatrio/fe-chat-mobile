import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Conversation } from '../../domain/entities/chat';

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
  return (
    <TouchableOpacity
      style={[styles.chatItem, isLast && styles.noBorder]}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.chatAvatarWrapper}>
        {item.type === 'GROUP' ? (
          <View style={[styles.groupIcon, { backgroundColor: '#eef2ff' }]}>
            <Ionicons name="people" size={26} color="#6366f1" />
          </View>
        ) : (
          <Image 
            source={{ uri: item.avatar || `https://i.pravatar.cc/150?u=${item.id}` }} 
            style={styles.chatAvatar} 
          />
        )}
        <View style={styles.onlineDotSmall} />
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: themeColors.text }]} numberOfLines={1}>
            {item.name || 'Chat'}
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
};

const styles = StyleSheet.create({
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
});
