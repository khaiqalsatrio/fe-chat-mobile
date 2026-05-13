import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/features/auth/domain/entities/user';
import { useThemeColor } from '@/core/hooks/use-theme-color';
import { getAvatarUrl } from '@/core/utils/image-utils';

interface ContactItemProps {
  contact: User;
  isLast: boolean;
  themeColors: any;
  onPress: (user: User) => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  isLast,
  themeColors,
  onPress,
}) => {
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const borderColor = useThemeColor({ light: '#f3f4f6', dark: '#111827' }, 'background');
  const msgBtnBg = useThemeColor({ light: '#f5f3ff', dark: '#1e1b4b' }, 'background');

  return (
    <View style={[styles.contactItem, isLast && styles.noBorder, { borderBottomColor: borderColor }]}>
      <View style={styles.contactInfo}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: getAvatarUrl(contact.avatar_url, contact.id) }} 
            style={styles.avatar} 
          />
          {contact.status === 'ONLINE' && <View style={[styles.onlineDot, { borderColor: themeColors.background }]} />}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: textColor }]}>{contact.username}</Text>
          <Text style={[styles.role, { color: subTextColor }]}>{contact.email}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.messageButton, { backgroundColor: msgBtnBg }]}
        onPress={() => onPress(contact)}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#6366f1" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  role: {
    fontSize: 13,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
