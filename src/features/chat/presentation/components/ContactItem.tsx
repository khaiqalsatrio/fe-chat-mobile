import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/features/auth/domain/entities/user';

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
  return (
    <View style={[styles.contactItem, isLast && styles.noBorder]}>
      <View style={styles.contactInfo}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: contact.avatar_url || `https://i.pravatar.cc/150?u=${contact.id}` }} 
            style={styles.avatar} 
          />
          {contact.status === 'ONLINE' && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: themeColors.text }]}>{contact.username}</Text>
          <Text style={styles.role}>{contact.email}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.messageButton}
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
    borderBottomColor: '#f3f4f6',
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
    borderColor: '#fff',
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
    color: '#6b7280',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
