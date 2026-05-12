import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';
import { MessageBubble } from '../components/MessageBubble';
import { useChatDetail } from '../hooks/useChatDetail';

const { width } = Dimensions.get('window');

export default function ChatDetailPage() {
  const router = useRouter();
  const { id: conversationId, name, avatar } = useLocalSearchParams<{ id: string, name?: string, avatar?: string }>();
  const insets = useSafeAreaInsets();

  const {
    conversation,
    messages,
    inputText,
    setInputText,
    isLoading,
    isSending,
    currentUserId,
    flatListRef,
    handleSend,
  } = useChatDetail(conversationId, { name, avatar });


  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }
  }, []);

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: '#f9fafb',
        paddingBottom: Platform.OS === 'android' ? Math.max(0, keyboardHeight - insets.bottom + 20) : 0
      }
    ]}>
      <View style={{ flex: 1 }}>
        <ChatHeader
          conversation={conversation}
          conversationId={conversationId}
          onBack={() => router.back()}
        />

        {/* Messages */}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <MessageBubble item={item} currentUserId={currentUserId} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, { paddingBottom: 20 }]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
      </View>

      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView 
          behavior="padding"
          keyboardVerticalOffset={90}
        >
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            isSending={isSending}
            handleSend={handleSend}
          />
        </KeyboardAvoidingView>
      ) : (
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          isSending={isSending}
          handleSend={handleSend}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
