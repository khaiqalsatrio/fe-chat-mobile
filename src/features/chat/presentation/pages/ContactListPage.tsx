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

  const renderContactItem = (contact: any, isLast: boolean) => (
    <View key={contact.id} style={[styles.contactItem, isLast && styles.noBorder]}>
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

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
      >
        {/* Filter Section with Borders */}
        <View style={styles.filterSection}>
          <TouchableOpacity style={styles.filterItem}>
            <MaterialCommunityIcons name="filter-variant" size={24} color="#6366f1" />
            <Text style={styles.filterText}>Filter by Department or Group</Text>
            <Ionicons name="chevron-down" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Sections */}
        {CONTACT_SECTIONS.map((section) => (
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
});
