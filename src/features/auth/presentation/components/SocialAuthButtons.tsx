import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/core/hooks/use-theme-color';

export const SocialAuthButtons = () => {
  const dividerColor = useThemeColor({ light: '#e5e7eb', dark: '#374151' }, 'tabIconDefault');
  const buttonBgColor = useThemeColor({ light: '#fff', dark: '#1f2937' }, 'background');
  const buttonBorderColor = useThemeColor({ light: '#f3f4f6', dark: '#374151' }, 'tabIconDefault');
  const buttonTextColor = useThemeColor({ light: '#374151', dark: '#f9fafb' }, 'text');
  const appleIconColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

  return (
    <View style={styles.socialContainer}>
      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <Text style={styles.dividerText}>OR SIGN IN WITH</Text>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity 
          style={[styles.socialButton, { backgroundColor: buttonBgColor, borderColor: buttonBorderColor }]}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={{ uri: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png' }} 
              style={styles.googleIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.socialButtonText, { color: buttonTextColor }]}>Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.socialButton, { backgroundColor: buttonBgColor, borderColor: buttonBorderColor }]}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <FontAwesome name="apple" size={24} color={appleIconColor} />
          </View>
          <Text style={[styles.socialButtonText, { color: buttonTextColor }]}>Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  socialContainer: {
    gap: 4,
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  socialButtonText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '700',
  },
});
