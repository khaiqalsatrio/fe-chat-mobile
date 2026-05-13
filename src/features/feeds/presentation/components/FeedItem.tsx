import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

interface FeedItemProps {
  user: {
    name: string;
    avatar: string;
    timeAgo: string;
  };
  image: string;
  likes: string;
  comments: string;
  caption: string;
  hashtags: string[];
}

export const FeedItem: React.FC<FeedItemProps> = ({ user, image, likes, comments, caption, hashtags }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <View style={[styles.container, { borderBottomColor: colorScheme === 'dark' ? '#1a1a1a' : '#f3f4f6' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
          <View style={styles.userText}>
            <Text style={[styles.username, { color: themeColors.text }]}>{user.name}</Text>
            <Text style={[styles.timeAgo, { color: '#9ca3af' }]}>{user.timeAgo}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Main Image */}
      <Image 
        source={{ uri: image }} 
        style={styles.mainImage} 
        contentFit="cover"
      />

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)} style={styles.actionButton}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? "#ef4444" : themeColors.text} 
            />
            <Text style={[styles.actionCount, { color: themeColors.text }]}>{likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color={themeColors.text} />
            <Text style={[styles.actionCount, { color: themeColors.text }]}>{comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={22} color={themeColors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={[styles.captionText, { color: themeColors.text }]}>
          <Text style={styles.captionUsername}>{user.name} </Text>
          {caption}
        </Text>
        <View style={styles.hashtagContainer}>
          {hashtags.map((tag, index) => (
            <Text key={index} style={styles.hashtag}>#{tag} </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    padding: 2,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#6366f1',
    marginRight: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userText: {
    justifyContent: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeAgo: {
    fontSize: 12,
    marginTop: 1,
  },
  mainImage: {
    width: width,
    height: width,
    backgroundColor: '#f3f4f6',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionCount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: 'bold',
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  hashtag: {
    color: '#6366f1',
    fontSize: 14,
  },
});
