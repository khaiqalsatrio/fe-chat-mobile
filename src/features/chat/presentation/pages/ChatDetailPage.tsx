import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const MOCK_MESSAGES = [
  {
    id: '1',
    text: 'Hey! Did you have a chance to look at the project proposal I sent over last night?',
    time: '10:24 AM',
    sender: 'other',
    type: 'text',
  },
  {
    id: '2',
    text: 'Just finished reading it. The marketing strategy section is really solid. I like the direction we\'re taking with the visual identity.',
    time: '10:26 AM',
    sender: 'me',
    type: 'text',
    status: 'read',
  },
  {
    id: '3',
    text: 'Should we schedule a brief call to finalize the budget allocations?',
    time: '10:26 AM',
    sender: 'me',
    type: 'text',
    status: 'read',
  },
  {
    id: '4',
    text: 'That sounds perfect. Here are the latest engagement stats to help with the budget breakdown.',
    time: '10:28 AM',
    sender: 'other',
    type: 'image',
    image: require('@/shared/assets/images/chat_chart.png'),
  },
];

export default function ChatDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const [message, setMessage] = useState('');

  const renderMessage = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => {
    const isMe = item.sender === 'me';
    
    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          {item.type === 'image' && (
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.messageImage} contentFit="cover" />
            </View>
          )}
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
        </View>
        <View style={[styles.messageFooter, isMe ? styles.myFooter : styles.otherFooter]}>
          <Text style={styles.timeText}>{item.time}</Text>
          {isMe && <Ionicons name="checkmark-done" size={16} color="#6366f1" style={{ marginLeft: 4 }} />}
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
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=alex' }} style={styles.avatar} />
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userStatus}>Online</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="video" size={22} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="phone" size={20} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="search" size={22} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 20 }]}
        ListHeaderComponent={() => (
          <View style={styles.dateDivider}>
            <Text style={styles.dateText}>TODAY</Text>
          </View>
        )}
      />

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
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Feather name="smile" size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
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
