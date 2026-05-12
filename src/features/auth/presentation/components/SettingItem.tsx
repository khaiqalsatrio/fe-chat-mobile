import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/core/hooks/use-theme-color';

interface SettingItemProps {
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  isLast?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  color, 
  isLast, 
  onPress,
  rightElement 
}) => {
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');
  const borderColor = useThemeColor({ light: '#f9fafb', dark: '#1f2937' }, 'background');

  return (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        isLast && styles.noBorder,
        { borderBottomColor: borderColor }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.settingSubtitle, { color: subTextColor }]}>{subtitle}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
});
