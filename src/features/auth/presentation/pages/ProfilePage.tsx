import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';

import { useAppTheme } from '@/core/context/ThemeContext';
import { useThemeColor } from '@/core/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileInfo } from '../components/ProfileInfo';

import { MOCK_POSTS } from '@/features/feeds/presentation/constants/mock-posts';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;

export default function ProfilePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const [activeTab, setActiveTab] = useState('grid');

  const {
    user,
    isLoading,
    isRefreshing,
    isUpdatingPhoto,
    onRefresh,
    updatePhoto,
  } = useProfile();

  const handlePostPress = (post: any, index: number) => {
    router.push({
      pathname: `/post/${post.id}` as any,
      params: {
        index: index.toString(),
        username: user?.username || 'User',
        avatar: user?.avatar_url || '',
      }
    });
  };

  const backgroundColor = useThemeColor({ light: '#f9fafb', dark: '#000000' }, 'background');
  const headerBg = useThemeColor({ light: '#fff', dark: '#0a0a0a' }, 'background');
  const headerBorder = useThemeColor({ light: '#f3f4f6', dark: '#1a1a1a' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const tabBorderActive = '#6366f1';
  const tabIconInactive = useThemeColor({ light: '#9ca3af', dark: '#4b5563' }, 'text');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: headerBg, borderBottomColor: headerBorder }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <ProfileInfo 
            user={user} 
            onUpdatePhoto={updatePhoto} 
            isUpdating={isUpdatingPhoto} 
          />

          <View style={[styles.tabBar, { borderBottomColor: headerBorder }]}>
            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'grid' && { borderBottomColor: tabBorderActive, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab('grid')}
            >
              <Ionicons 
                name="grid-outline" 
                size={22} 
                color={activeTab === 'grid' ? tabBorderActive : tabIconInactive} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'video' && { borderBottomColor: tabBorderActive, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab('video')}
            >
              <Ionicons 
                name="play-circle-outline" 
                size={24} 
                color={activeTab === 'video' ? tabBorderActive : tabIconInactive} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'tag' && { borderBottomColor: tabBorderActive, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab('tag')}
            >
              <Ionicons 
                name="person-add-outline" 
                size={22} 
                color={activeTab === 'tag' ? tabBorderActive : tabIconInactive} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.gridContainer}>
            {MOCK_POSTS.map((post, index: number) => (
              <TouchableOpacity 
                key={index} 
                style={styles.gridItem}
                onPress={() => handlePostPress(post, index)}
              >
                <Image source={post.uri} style={styles.gridImage} contentFit="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  tabBar: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 1,
    marginTop: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH,
    padding: 1,
  },
  gridImage: {
    flex: 1,
    backgroundColor: '#333',
  },
});
