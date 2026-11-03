import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '@/src/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primaryDark,
      tabBarInactiveTintColor: colors.textSubtle,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 66, paddingBottom: 8, paddingTop: 7 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="home-outline" size={size} /> }} />
      <Tabs.Screen name="patients" options={{ title: 'Pacientes', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="people-outline" size={size} /> }} />
      <Tabs.Screen name="evaluations" options={{ title: 'Clasificaciones', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="pulse-outline" size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="person-circle-outline" size={size} /> }} />
    </Tabs>
  );
}
