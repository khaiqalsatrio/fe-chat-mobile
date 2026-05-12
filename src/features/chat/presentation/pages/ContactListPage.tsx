import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { userRepository } from '@/features/auth/data/repositories/user-repository-impl';
import { User } from '@/features/auth/domain/entities/user';

const { width } = Dimensions.get('window');

interface ContactSection {
  title: string;
  data: User[];
}

export default function ContactListPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const [sections, setSections] = useState<ContactSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchContacts = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const users = await userRepository.getAllUsers();
      
      // Group users by first letter
      const groups: { [key: string]: User[] } = {};
      users
        .sort((a, b) => a.username.localeCompare(b.username))
        .forEach(user => {
          const firstLetter = user.username.charAt(0).toUpperCase();
          if (!groups[firstLetter]) groups[firstLetter] = [];
          groups[firstLetter].push(user);
        });

      const formattedSections = Object.keys(groups)
        .sort()
        .map(letter => ({
          title: letter,
          data: groups[letter]
        }));

      setSections(formattedSections);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchContacts(false);
  };

  const renderContactItem = (contact: User, isLast: boolean) => (
    <View key={contact.id} style={[styles.contactItem, isLast && styles.noBorder]}>
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
        onPress={() => {
          // Placeholder: Navigate to chat with this user
          // router.push({ pathname: '/chat/[id]', params: { id: contact.id } } as any);
        }}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#6366f1" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=me' }} style={styles.myAvatar} />
            <Text style={[styles.headerTitle, { color: '#111827' }]}>Contacts</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionIcon}>
              <Ionicons name="person-add-outline" size={24} color="#6366f1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIcon}>
              <Ionicons name="search" size={24} color="#6366f1" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {/* Filter Section */}
          <View style={styles.filterSection}>
            <TouchableOpacity style={styles.filterItem}>
              <MaterialCommunityIcons name="filter-variant" size={24} color="#6366f1" />
              <Text style={styles.filterText}>Filter by Status or Department</Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Sections */}
          {sections.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No contacts found.</Text>
            </View>
          ) : (
            sections.map((section) => (
              <View key={section.title} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <View style={styles.sectionContent}>
                  {section.data.map((contact, index) => 
                    renderContactItem(contact, index === section.data.length - 1)
                  )}
                </View>
              </View>
            ))
          )}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
  myAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginLeft: 20,
    padding: 4,
  },
  scrollContent: {
    paddingTop: 0,
  },
  filterSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '500',
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
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
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});
