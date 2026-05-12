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
  Text,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';
import { MessageBubble } from '../components/MessageBubble';
import { useChatDetail } from '../hooks/useChatDetail';
import { useThemeColor } from '@/core/hooks/use-theme-color';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

// Import wallpapers
const lightWallpaper = require('@/app/assets/walpaper.jpg');
const darkWallpaper = require('@/app/assets/darkmode.png');

export default function ChatDetailPage() {
  const router = useRouter();
  const { id: conversationId, name, avatar } = useLocalSearchParams<{ id: string, name?: string, avatar?: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  
  const backgroundColor = useThemeColor({ light: '#f9fafb', dark: '#000000' }, 'background');
  const dividerBg = useThemeColor({ light: '#e5e7eb', dark: '#1f2937' }, 'background');
  const dividerText = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'text');

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

  const currentWallpaper = colorScheme === 'dark' ? darkWallpaper : lightWallpaper;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor,
        paddingBottom: Platform.OS === 'android' ? Math.max(0, keyboardHeight - insets.bottom + 20) : 0
      }
    ]}>
      <ImageBackground 
        source={currentWallpaper} 
        style={styles.wallpaper}
        resizeMode="cover"
      >
        {/* Dark overlay for better readability */}
        <View style={[
          styles.overlay, 
          { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.1)' }
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
                ListHeaderComponent={
                  <View style={styles.dateDivider}>
                    <Text style={[styles.dateText, { backgroundColor: dividerBg, color: dividerText }]}>TODAY</Text>
                  </View>
                }
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wallpaper: {
    flex: 1,
  },
  overlay: {
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
