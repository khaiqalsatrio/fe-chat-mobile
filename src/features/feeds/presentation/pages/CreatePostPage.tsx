import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

const COLUMN_COUNT = 4;

export default function CreatePostPage() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaLibrary.Asset | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const ITEM_SIZE = width / COLUMN_COUNT;

  useEffect(() => {
    (async () => {
      try {
        console.log('Requesting MediaLibrary permissions...');
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status === 'granted') {
          const getAssets = await MediaLibrary.getAssetsAsync({
            sortBy: ['creationTime'],
            mediaType: ['photo'],
            first: 100,
          });
          
          if (getAssets.assets.length > 0) {
            setAssets(getAssets.assets);
            setSelectedAsset(getAssets.assets[0]);
          } else {
            // Use mock data if gallery is empty
            setAssets(MOCK_ASSETS);
            setSelectedAsset(MOCK_ASSETS[0]);
          }
        } else {
          // Fallback to mock data if permission denied (for UI testing)
          setAssets(MOCK_ASSETS);
          setSelectedAsset(MOCK_ASSETS[0]);
        }
      } catch (error) {
        console.warn('MediaLibrary error, falling back to mock data:', error);
        setAssets(MOCK_ASSETS);
        setSelectedAsset(MOCK_ASSETS[0]);
        setHasPermission(true); // Bypass permission screen for testing
      }
    })();
  }, []);

  const MOCK_ASSETS = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400' },
    { id: '4', uri: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400' },
    { id: '5', uri: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
    { id: '6', uri: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400' },
    { id: '7', uri: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400' },
    { id: '8', uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?w=400' },
  ] as any[];

  const handleNext = () => {
    if (selectedAsset) {
      router.push({
        pathname: '/post/finalize',
        params: { imageUri: selectedAsset.uri }
      });
    }
  };

  const renderAsset = ({ item }: { item: MediaLibrary.Asset }) => {
    const isSelected = selectedAsset?.id === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.assetContainer, { width: ITEM_SIZE, height: ITEM_SIZE }]} 
        onPress={() => setSelectedAsset(item)}
        activeOpacity={0.8}
      >
        <Image 
          source={item.uri} 
          style={[
            styles.assetImage,
            isSelected && styles.selectedAssetBorder
          ]} 
          contentFit="cover"
        />
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <View style={styles.checkmarkCircle}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff', paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#1a1a1a' : '#f0f0f0' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="close" size={28} color={themeColors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>New Post</Text>
        
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>

      {hasPermission === false ? (
        <View style={styles.permissionContainer}>
          <Text style={{ color: themeColors.text, textAlign: 'center', padding: 20 }}>
            Tolong izinkan akses galeri di pengaturan perangkat Anda untuk melihat foto.
          </Text>
          <TouchableOpacity 
            onPress={() => MediaLibrary.requestPermissionsAsync()}
            style={[styles.retryButton, { backgroundColor: '#6366f1' }]}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Izinkan Akses</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Preview Section */}
          <View style={[styles.previewContainer, { width: width, height: width }]}>
            {selectedAsset ? (
              <Image 
                source={selectedAsset.uri} 
                style={styles.previewImage} 
                contentFit="cover"
              />
            ) : (
              <View style={[styles.previewPlaceholder, { backgroundColor: isDark ? '#111' : '#f9f9f9' }]} />
            )}
            
            <View style={styles.previewOverlays}>
              <TouchableOpacity style={styles.overlayButton}>
                <Ionicons name="resize-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.overlayButton}>
                <Ionicons name="sparkles-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Media Selector Bar */}
          <View style={[styles.selectorBar, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <TouchableOpacity style={styles.recentsButton}>
              <Text style={[styles.recentsText, { color: themeColors.text }]}>RECENTS</Text>
              <Ionicons name="chevron-down" size={16} color={themeColors.text} />
            </TouchableOpacity>

            <View style={styles.selectorActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="copy-outline" size={20} color={themeColors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="camera-outline" size={20} color={themeColors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Gallery Grid */}
          <FlatList
            data={assets}
            renderItem={renderAsset}
            keyExtractor={(item) => item.id}
            numColumns={COLUMN_COUNT}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContent}
            removeClippedSubviews={true}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerIcon: {
    width: 60,
    alignItems: 'flex-start',
  },
  nextButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  nextText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
  },
  previewContainer: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
  },
  previewOverlays: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentsText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
    letterSpacing: 0.5,
  },
  selectorActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContent: {
    paddingBottom: 20,
  },
  assetContainer: {
    padding: 1,
  },
  assetImage: {
    width: '100%',
    height: '100%',
  },
  selectedAssetBorder: {
    borderWidth: 2,
    borderColor: '#6366f1',
    opacity: 0.7,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  checkmarkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  }
});


