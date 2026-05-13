import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { FeedItem } from '@/features/feeds/presentation/components/FeedItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DUMMY_FEEDS = [
  {
    id: '1',
    user: {
      name: 'Sarah Jenkins',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      timeAgo: '2 hours ago',
    },
    image: 'https://picsum.photos/id/10/800/800',
    likes: '1.2k',
    comments: '48',
    caption: 'Exploring the beauty of nature today. The peace here is unmatched.',
    hashtags: ['aura', 'nature', 'serenity'],
  },
  {
    id: '2',
    user: {
      name: 'Marcus Chen',
      avatar: 'https://i.pravatar.cc/150?u=marcus',
      timeAgo: '5 hours ago',
    },
    image: 'https://picsum.photos/id/1/800/800',
    likes: '858',
    comments: '12',
    caption: 'Deep work session on the new Aura AI design system. Minimalist vibes only.',
    hashtags: ['productivity', 'UIUX', 'AuraAI'],
  },
  {
    id: '3',
    user: {
      name: 'Lula Martinez',
      avatar: 'https://i.pravatar.cc/150?u=lula',
      timeAgo: '1 day ago',
    },
    image: 'https://picsum.photos/id/102/800/800',
    likes: '2.5k',
    comments: '156',
    caption: 'City lights and late night walks. There is something magical about the urban glow.',
    hashtags: ['citylife', 'nightvibes', 'photography'],
  }
];

export default function FeedsPage() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : themeColors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#1a1a1a' : '#f3f4f6' }]}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Feeds</Text>
      </View>

      <FlatList
        data={DUMMY_FEEDS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedItem {...item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
