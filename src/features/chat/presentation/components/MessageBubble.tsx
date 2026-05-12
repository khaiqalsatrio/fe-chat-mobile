import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Message } from '../../domain/entities/chat';
import { useThemeColor } from '@/core/hooks/use-theme-color';

interface MessageBubbleProps {
  item: Message;
  currentUserId: string | null;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ item, currentUserId }) => {
  const isMe = item.sender_id === currentUserId;
  const otherBubbleBg = useThemeColor({ light: '#fff', dark: '#1f2937' }, 'background');
  const otherTextColor = useThemeColor({}, 'text');
  const otherBorderColor = useThemeColor({ light: '#f3f4f6', dark: '#111827' }, 'background');
  const subTextColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'text');

  return (
    <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
      <View style={[
        styles.bubble, 
        isMe ? styles.myBubble : [styles.otherBubble, { backgroundColor: otherBubbleBg, borderColor: otherBorderColor }]
      ]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : { color: otherTextColor }]}>
          {item.content}
        </Text>
      </View>
      <View style={[styles.messageFooter, isMe ? styles.myFooter : styles.otherFooter]}>
        <Text style={[styles.timeText, { color: subTextColor }]}>
          {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </Text>
        {isMe && (
          <Ionicons
            name={item.status === 'read' ? "checkmark-done" : "checkmark"}
            size={16}
            color={item.status === 'read' ? "#6366f1" : subTextColor}
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
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
  },
});
