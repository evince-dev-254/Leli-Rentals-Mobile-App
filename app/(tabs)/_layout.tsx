import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AuthGuard from '@/components/AuthGuard';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useAccount } from '@/contexts/AccountContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { accountType } = useAccount();
  const insets = useSafeAreaInsets();

  const tabBarOptions = {
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarStyle: {
      paddingBottom: Math.max(insets.bottom, 8),
      height: 60 + Math.max(insets.bottom, 8),
    },
  };

  return (
    <AuthGuard>
      {/* Different navigation for renters vs owners */}
      {accountType === 'owner' ? (
        <Tabs screenOptions={tabBarOptions}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color }) => <Ionicons name="analytics" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="browse"
            options={{
              title: 'Browse',
              tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
            }}
          />
        </Tabs>
      ) : (
        <Tabs screenOptions={tabBarOptions}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="browse"
            options={{
              title: 'Browse',
              tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
            }}
          />
        </Tabs>
      )}
    </AuthGuard>
  );
}
