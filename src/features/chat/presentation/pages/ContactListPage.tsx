import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContactItem } from '../components/ContactItem';
import { useContacts } from '../hooks/useContacts';

const { width } = Dimensions.get('window');


export default function ContactListPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const {
    sections,
    isLoading,
    isRefreshing,
    onRefresh,
    handleStartChat,
  } = useContacts();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);

  const filteredSections = sections.map(section => ({
    ...section,
    data: section.data.filter(contact =>
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.data.length > 0);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  const borderColor = colorScheme === 'dark' ? '#1a1a1a' : '#f3f4f6';
  const sectionHeaderBg = colorScheme === 'dark' ? '#0a0a0a' : '#f9fafb';
  const headerBg = colorScheme === 'dark' ? '#0a0a0a' : 'transparent';

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: borderColor, backgroundColor: headerBg }]}>
        <View style={styles.headerContent}>
          {isSearchVisible ? (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6366f1" style={styles.searchIconInside} />
              <TextInput
                style={[styles.searchInput, { color: themeColors.text }]}
                placeholder="Search contacts..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity onPress={toggleSearch}>
                <Ionicons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.headerLeft}>
                <Text style={[styles.headerTitle, { color: themeColors.text }]}>Contacts</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionIcon}>
                  <Ionicons name="person-add-outline" size={24} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon} onPress={toggleSearch}>
                  <Ionicons name="search" size={24} color="#6366f1" />
                </TouchableOpacity>
              </View>
            </>
          )}
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
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colorScheme === 'dark' ? '#fff' : '#000'}
            />
          }
        >
          {/* Filter Section */}
          <View style={[styles.filterSection, { borderBottomColor: borderColor, backgroundColor: themeColors.background }]}>
            <TouchableOpacity style={styles.filterItem}>
              <MaterialCommunityIcons name="filter-variant" size={24} color="#6366f1" />
              <Text style={[styles.filterText, { color: colorScheme === 'dark' ? '#9ca3af' : '#4b5563' }]}>Filter by Status or Department</Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Sections */}
          {filteredSections.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? `No results for "${searchQuery}"` : "No contacts found."}
              </Text>
            </View>
          ) : (
            filteredSections.map((section) => (
              <View key={section.title} style={styles.section}>
                <View style={[styles.sectionHeader, { backgroundColor: sectionHeaderBg, borderColor: borderColor }]}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <View style={[styles.sectionContent, { backgroundColor: themeColors.background }]}>
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
    marginLeft: 12,
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIconInside: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    padding: 0,
  },
  scrollContent: {
    paddingTop: 0,
  },
  filterSection: {
    borderBottomWidth: 1,
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
    fontWeight: '500',
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    textTransform: 'uppercase',
  },
  sectionContent: {
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
