import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/core/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background, paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Top Illustration Area */}
          <View style={styles.illustrationContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={require('@/shared/assets/images/onboarding.png')}
                style={styles.illustration}
                contentFit="cover"
              />
              
              {/* Encrypted Badge */}
              <View style={styles.encryptedBadge}>
                <Ionicons name="lock-closed" size={14} color="#6366f1" />
                <Text style={styles.encryptedText}>Encrypted</Text>
              </View>

              {/* Side Chat Icon */}
              <View style={styles.sideChatIcon}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
              </View>
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: themeColors.text }]}>Connect Instantly</Text>
            <Text style={[styles.subtitle, { color: themeColors.icon }]}>
              Experience the future of communication with seamless real-time messaging and military-grade security.
            </Text>
          </View>

          {/* Features Row */}
          <View style={styles.featuresRow}>
            <View style={[styles.featureCard, { backgroundColor: colorScheme === 'dark' ? '#212121' : '#f3f4f6' }]}>
              <View style={styles.featureIconContainer}>
                <MaterialCommunityIcons name="speedometer" size={24} color="#6366f1" />
              </View>
              <Text style={[styles.featureTitle, { color: themeColors.text }]}>Zero Latency</Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: colorScheme === 'dark' ? '#212121' : '#f3f4f6' }]}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="shield-outline" size={24} color="#6366f1" />
              </View>
              <Text style={[styles.featureTitle, { color: themeColors.text }]}>Private Vault</Text>
            </View>
          </View>

          {/* Footer Area */}
          <View style={styles.footer}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => router.push('/register')}
            >
              <LinearGradient
                colors={['#4f46e5', '#3730a3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: width * 0.8,
    height: width * 0.8,
  },
  illustration: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  encryptedBadge: {
    position: 'absolute',
    top: 20,
    left: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ rotate: '-10deg' }],
  },
  encryptedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  sideChatIcon: {
    position: 'absolute',
    bottom: 40,
    right: -20,
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
  },
  featureCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  featureIconContainer: {
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: width - 48,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  termsLink: {
    color: '#4f46e5',
    fontWeight: '500',
  },
});
