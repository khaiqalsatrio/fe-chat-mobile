import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { StatusCircle } from './StatusCircle';

interface StatusListProps {
  themeColors: any;
}

const DUMMY_STATUS = [
  { id: '1', name: 'Alex', image: 'https://i.pravatar.cc/150?u=alex', hasUpdate: true },
  { id: '2', name: 'Sarah', image: 'https://i.pravatar.cc/150?u=sarah', hasUpdate: false },
  { id: '3', name: 'Jordan', image: 'https://i.pravatar.cc/150?u=jordan', hasUpdate: true },
  { id: '4', name: 'Taylor', image: 'https://i.pravatar.cc/150?u=taylor', hasUpdate: false },
  { id: '5', name: 'Casey', image: 'https://i.pravatar.cc/150?u=casey', hasUpdate: true },
];

export const StatusList: React.FC<StatusListProps> = ({ themeColors }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StatusCircle 
          name="My Status" 
          image="https://i.pravatar.cc/150?u=me" 
          isMe 
          themeColors={themeColors} 
        />
        
        {DUMMY_STATUS.map((status) => (
          <StatusCircle 
            key={status.id}
            name={status.name}
            image={status.image}
            hasUpdate={status.hasUpdate}
            themeColors={themeColors}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
});
