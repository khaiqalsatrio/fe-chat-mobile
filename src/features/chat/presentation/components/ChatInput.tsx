import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/core/hooks/use-theme-color';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isSending: boolean;
  handleSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  isSending,
  handleSend,
}) => {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#0a0a0a' }, 'background');
  const inputBg = useThemeColor({ light: '#f3f4f6', dark: '#1a1a1a' }, 'background');
  const borderColor = useThemeColor({ light: '#f3f4f6', dark: '#1a1a1a' }, 'background');
  const iconColor = useThemeColor({ light: '#4b5563', dark: '#9ca3af' }, 'text');
  
  return (
    <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10, backgroundColor, borderTopColor: borderColor }]}>
      <TouchableOpacity style={styles.plusButton}>
        <Ionicons name="add-circle-outline" size={28} color={iconColor} />
      </TouchableOpacity>
      
      <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          value={inputText}
          onChangeText={setInputText}
          multiline
          editable={!isSending}
        />
        <TouchableOpacity style={styles.emojiButton}>
          <Feather name="smile" size={22} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.sendButton, (!inputText.trim() || isSending) && { opacity: 0.5 }]} 
        onPress={handleSend}
        disabled={!inputText.trim() || isSending}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="send" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  plusButton: {
    marginBottom: 10,
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
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
