import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

interface StatusCircleProps {
  id?: string;
  name: string;
  image: string;
  isMe?: boolean;
  hasUpdate?: boolean;
  onPress?: () => void;
  themeColors: any;
}

export const StatusCircle: React.FC<StatusCircleProps> = ({
  id,
  name,
  image,
  isMe = false,
  hasUpdate = false,
  onPress,
  themeColors,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (isMe && !hasUpdate) {
      onPress?.();
    } else if (hasUpdate || isMe) {
      router.push({
        pathname: `/status/${id || 'me'}`,
        params: { name, avatar: image, image }
      } as any);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.imageContainer, 
        hasUpdate && styles.updateBorder,
        { borderColor: hasUpdate ? '#6366f1' : 'transparent' }
      ]}>
        <Image source={{ uri: image }} style={styles.avatar} />
        
        {isMe && (
          <View style={styles.addButton}>
            <Ionicons name="add" size={12} color="#fff" />
          </View>
        )}
      </View>
      <Text 
        style={[styles.name, { color: themeColors.text }]} 
        numberOfLines={1}
      >
        {isMe ? 'My Status' : name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  imageContainer: {
    padding: 3,
    borderRadius: 34,
    borderWidth: 2,
    marginBottom: 6,
    position: 'relative',
  },
  updateBorder: {
    borderStyle: 'solid',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
  },
  addButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#6366f1',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
