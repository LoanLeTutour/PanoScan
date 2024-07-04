import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="photo"
        options={{
          title: 'Photo',
          tabBarLabel: 'Photo',
          tabBarStyle: {backgroundColor: Colors.white },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='camera-sharp' color={color} size={size}/>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
          tabBarStyle: {backgroundColor: Colors.white },
          tabBarLabel: 'Historique',
          tabBarIcon: ({color, size}) => 
            <Ionicons name="images" color={color} size={size}/>,
        }}
      />
    </Tabs>
  );
}
