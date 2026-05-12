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
import { useContacts } from '../hooks/useContacts';
import { ContactItem } from '../components/ContactItem';
import { User } from '@/features/auth/domain/entities/user';

const { width } = Dimensions.get('window');


export default function ContactListPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeColors = { text: '#111827' }; // Defaulting for now

  const {
    sections,
    isLoading,
    isRefreshing,
    onRefresh,
    handleStartChat,
  } = useContacts();


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
                  {section.data.map((contact, index) => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      isLast={index === section.data.length - 1}
                      themeColors={themeColors}
                      onPress={handleStartChat}
                    />
                  ))}
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
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});
