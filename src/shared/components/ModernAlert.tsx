import React from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface ModernAlertProps {
  visible: boolean;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ModernAlert: React.FC<ModernAlertProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getIcon = () => {
    switch (type) {
      case 'success': return { name: 'checkmark-circle', color: '#10b981' };
      case 'danger': return { name: 'trash-bin', color: '#ef4444' };
      case 'warning': return { name: 'warning', color: '#f59e0b' };
      default: return { name: 'information-circle', color: '#3b82f6' };
    }
  };

  const icon = getIcon();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[
          styles.alertCard, 
          { 
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            borderWidth: 1,
          }
        ]}>
          <BlurView 
            intensity={isDark ? 40 : 60} 
            tint={isDark ? 'dark' : 'light'} 
            style={StyleSheet.absoluteFill} 
          />
          
          <View style={styles.contentContainer}>
            <View style={[styles.iconWrapper, { backgroundColor: icon.color + '20' }]}>
              <Ionicons name={icon.name as any} size={40} color={icon.color} />
            </View>
            
            <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#111827' }]}>{title}</Text>
            <Text style={[styles.message, { color: isDark ? '#e5e7eb' : '#4b5563' }]}>{message}</Text>

            <View style={styles.buttonGroup}>
              {onConfirm ? (
                <>
                  <TouchableOpacity 
                    style={[styles.cancelButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} 
                    onPress={onClose}
                  >
                    <Text style={[styles.cancelText, { color: isDark ? '#d1d5db' : '#6b7280' }]}>{cancelText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: icon.color }]} 
                    onPress={onConfirm}
                  >
                    <Text style={styles.confirmText}>{confirmText}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={[styles.confirmButton, { backgroundColor: icon.color, width: '100%' }]} 
                  onPress={onClose}
                >
                  <Text style={styles.confirmText}>Got it</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Overlay lebih ringan agar blur terlihat
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertCard: {
    borderRadius: 30,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden', // Penting untuk BlurView
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  contentContainer: {
    padding: 28,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22, // Sedikit lebih besar
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    height: 54, // Sedikit lebih tinggi
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
