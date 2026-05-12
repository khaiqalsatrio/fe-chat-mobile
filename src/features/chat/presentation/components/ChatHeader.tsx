import { useThemeColor } from '@/core/hooks/use-theme-color';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatHeaderProps {
  conversation: any;
  conversationId: string | undefined;
  onBack: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, conversationId, onBack }) => {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#806b6bff', dark: '#9ca3af' }, 'text');
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#0a0a0a' }, 'background');
  const borderColor = useThemeColor({ light: '#f3f4f6', dark: '#1a1a1a' }, 'background');

  return (
    <View style={[styles.header, { paddingTop: insets.top, backgroundColor, borderBottomColor: borderColor }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={textColor} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: conversation?.avatar || `https://i.pravatar.cc/150?u=${conversationId || 'default'}` }}
              style={styles.avatar}
            />
            <View style={[styles.onlineDot, { borderColor: backgroundColor }]} />
          </View>
          <View>
            <Text style={[styles.userName, { color: textColor }]}>{conversation?.name || 'Loading...'}</Text>
            <Text style={[styles.userStatus, { color: subTextColor }]}>Active</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="video" size={22} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="phone" size={20} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
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
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
});
