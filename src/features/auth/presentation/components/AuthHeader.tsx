import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/core/hooks/use-theme-color';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const titleColor = useThemeColor({ light: '#111827', dark: '#f9fafb' }, 'text');
  const subtitleColor = useThemeColor({ light: '#4b5563', dark: '#9ca3af' }, 'text');

  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoBox}>
        <Ionicons name="chatbubble-ellipses" size={32} color="#fff" />
      </View>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logoBox: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
});
