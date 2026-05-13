import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '@/shared/components/haptic-tab';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const TabIcon = ({ name, color, focused }: { name: any, color: string, focused: boolean }) => (
    <View style={[
      styles.iconContainer,
      focused && {
        backgroundColor: colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
        transform: [{ scale: 1.15 }],
      }
    ]}>
      <Ionicons name={name} size={focused ? 24 : 22} color={color} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        animation: 'fade',
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#4b5563' : '#9ca3af',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 65 + (insets.bottom > 0 ? insets.bottom : 12),
          paddingBottom: (insets.bottom > 0 ? insets.bottom : 12) + 5,
          paddingTop: 12,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.05,
          shadowRadius: 12,
          backgroundColor: themeColors.background,
          borderTopColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              name={focused ? "chatbubble-ellipses-sharp" : "chatbubble-ellipses-outline"} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="feeds"
        options={{
          title: 'Feeds',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              name={focused ? "newspaper-sharp" : "newspaper-outline"} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              name={focused ? "people-sharp" : "people-outline"} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              name={focused ? "person-sharp" : "person-outline"} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
