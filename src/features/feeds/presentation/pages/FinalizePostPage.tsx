import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function FinalizePostPage() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [caption, setCaption] = useState('');
  const [shareFacebook, setShareFacebook] = useState(false);
  const [shareTwitter, setShareTwitter] = useState(false);

  const handleShare = () => {
    console.log('Sharing post...', { caption, imageUri });
    router.replace('/(tabs)');
  };

  const cardBg = isDark ? '#121212' : '#fff';
  const separatorColor = isDark ? '#262626' : '#f0f0f0';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f9fa' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      {/* Improved Header */}
      <View style={[
        styles.header,
        {
          paddingTop: insets.top,
          backgroundColor: isDark ? '#000' : '#fff',
          borderBottomColor: separatorColor
        }
      ]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={28} color={themeColors.text} />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Postingan Baru</Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Text style={styles.shareTextBtn}>Posting</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Caption Section */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.captionRow}>
            <Image
              source={imageUri}
              style={styles.previewImage}
              contentFit="cover"
            />
            <TextInput
              style={[styles.captionInput, { color: themeColors.text }]}
              placeholder="Tulis keterangan..."
              placeholderTextColor="#888"
              multiline
              value={caption}
              onChangeText={setCaption}
              blurOnSubmit={true}
            />
          </View>
        </View>

        {/* List Options Section */}
        <View style={[styles.card, { backgroundColor: cardBg, marginTop: 16 }]}>
          <OptionItem
            icon="person-add-outline"
            title="Tandai Orang"
            themeColors={themeColors}
            separatorColor={separatorColor}
          />
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          <OptionItem
            icon="location-outline"
            title="Tambah Lokasi"
            themeColors={themeColors}
            separatorColor={separatorColor}
          />
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          <OptionItem
            icon="musical-notes-outline"
            title="Tambah Musik"
            themeColors={themeColors}
            separatorColor={separatorColor}
          />
        </View>

        {/* Share Toggles Section */}
        <View style={[styles.card, { backgroundColor: cardBg, marginTop: 16 }]}>
          <View style={styles.shareRow}>
            <View style={styles.shareLabelGroup}>
              <View style={[styles.socialCircle, { backgroundColor: '#1877F2' }]}>
                <Ionicons name="logo-facebook" size={18} color="#fff" />
              </View>
              <Text style={[styles.shareLabel, { color: themeColors.text }]}>Bagikan ke Facebook</Text>
            </View>
            <Switch
              value={shareFacebook}
              onValueChange={setShareFacebook}
              trackColor={{ false: '#3a3a3c', true: '#6366f1' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : shareFacebook ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          <View style={styles.shareRow}>
            <View style={styles.shareLabelGroup}>
              <View style={[styles.socialCircle, { backgroundColor: isDark ? '#333' : '#000' }]}>
                <Ionicons name="logo-twitter" size={16} color="#fff" />
              </View>
              <Text style={[styles.shareLabel, { color: themeColors.text }]}>Bagikan ke Twitter</Text>
            </View>
            <Switch
              value={shareTwitter}
              onValueChange={setShareTwitter}
              trackColor={{ false: '#3a3a3c', true: '#6366f1' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : shareTwitter ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <Text style={styles.footerInfo}>
          Postingan Anda akan dibagikan kepada pengikut Anda dan juga dapat muncul di hasil pencarian.
        </Text>
      </ScrollView>
    </View>
  );
}

function OptionItem({ icon, title, themeColors }: any) {
  return (
    <TouchableOpacity style={styles.optionBtn} activeOpacity={0.6}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={22} color={themeColors.text} />
        <Text style={[styles.optionLabel, { color: themeColors.text }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#888" />
    </TouchableOpacity>
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
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    zIndex: 10,
  },
  headerButton: {
    padding: 8,
    minWidth: 70,
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  shareTextBtn: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
    textAlign: 'right',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  captionRow: {
    flexDirection: 'row',
    padding: 16,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  captionInput: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 4,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    marginLeft: 54, // Align with text, not icon
    marginRight: 0,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  shareLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  footerInfo: {
    marginTop: 24,
    color: '#8e8e93',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 18,
  }
});
