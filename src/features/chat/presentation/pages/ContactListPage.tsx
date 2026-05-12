import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const CONTACT_SECTIONS = [
  {
    title: 'A',
    data: [
      { id: '1', name: 'Alice Henderson', role: 'Product Designer', online: true, image: 'https://i.pravatar.cc/150?u=alice' },
      { id: '2', name: 'Andrew Miller', role: 'Lead Developer', online: false, image: 'https://i.pravatar.cc/150?u=andrew' },
    ],
  },
  {
    title: 'B',
    data: [
      { id: '3', name: 'Beatrice Thorne', role: 'Marketing Director', online: true, image: 'https://i.pravatar.cc/150?u=beatrice' },
    ],
  },
  {
    title: 'C',
    data: [
      { id: '4', name: 'Calvin Brooks', role: 'Senior Recruiter', online: false, image: 'https://i.pravatar.cc/150?u=calvin' },
      { id: '5', name: 'Catherine Vance', role: 'Operations Manager', online: false, image: 'https://i.pravatar.cc/150?u=catherine' },
    ],
  },
];

export default function ContactListPage() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const renderContactItem = (contact: any) => (
    <View key={contact.id} style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: contact.image }} style={styles.avatar} />
          {contact.online && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: themeColors.text }]}>{contact.name}</Text>
          <Text style={styles.role}>{contact.role}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.messageButton}>
        <Ionicons name="chatbubble-outline" size={20} color="#4f46e5" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
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

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
      >
        {/* Filter Bar */}
        <View style={styles.filterBar}>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#6b7280" />
          <Text style={styles.filterText}>Filter by Department or Group</Text>
        </View>

        {/* Sections */}
        {CONTACT_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map(renderContactItem)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  filterText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 12,
    marginLeft: 4,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 24,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
