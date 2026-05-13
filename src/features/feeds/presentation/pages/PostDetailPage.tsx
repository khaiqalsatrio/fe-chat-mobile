import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/core/hooks/use-theme-color';
import { FeedItem } from '../components/FeedItem';
import { MOCK_POSTS } from '../constants/mock-posts';

const { height } = Dimensions.get('window');

export default function PostDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const headerBorder = useThemeColor({ light: '#f3f4f6', dark: '#1a1a1a' }, 'background');

  const initialIndex = parseInt(params.index as string) || 0;

  const renderItem = ({ item }: { item: any }) => {
    const postData = {
      id: item.id,
      user: {
        name: (params.username as string) || 'User',
        avatar: (params.avatar as string) || 'https://i.pravatar.cc/150',
        timeAgo: 'Just now',
      },
      image: item.uri,
      likes: '0',
      comments: '0',
      caption: 'Beautiful moment captured on camera.',
      hashtags: ['post', 'detail', 'aura'],
    };

    return <FeedItem {...postData} />;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: headerBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Post</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={MOCK_POSTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: height, // Approximate or exact length of one FeedItem
          offset: height * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        pagingEnabled={false} // Paging is often too aggressive for variable height, snapping is better
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
