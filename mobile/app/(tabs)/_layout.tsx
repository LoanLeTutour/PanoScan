import { Tabs } from 'expo-router';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import useScale from '@/constants/scales';




export default function TabLayout() {
  const {verticalScale} = useScale()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarStyle: {height: verticalScale(90), alignItems: 'center', justifyContent: 'center'},
        tabBarLabelStyle: {marginBottom: verticalScale(10)},
        tabBarActiveBackgroundColor: Colors.white,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="photo"
        options={{
          title: 'Photo',
          tabBarLabel: 'Photo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='camera-sharp' color={color} size={size}/>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
          tabBarLabel: 'Historique',
          tabBarIcon: ({color, size}) => 
            <Ionicons name="images" color={color} size={size}/>,
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          title: 'Catalogue',
          tabBarLabel: 'Catalogue',
          tabBarIcon: ({color, size}) => 
            <Ionicons name="book" color={color} size={size}/>,
        }}
      />
    </Tabs>
  );
}
