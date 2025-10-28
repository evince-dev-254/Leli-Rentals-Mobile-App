import { ClerkProvider } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { clerkConfig } from '@/config/clerk';
import { AccountProvider } from '@/contexts/AccountContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider 
        publishableKey={clerkConfig.publishableKey}
      >
        <ThemeProvider>
          <AccountProvider>
          <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(renter)" />
          <Stack.Screen name="(owner)" />
          <Stack.Screen name="(shared)" />
          <Stack.Screen name="account-type" />
          <Stack.Screen name="google-name-collection" />
          <Stack.Screen name="admin/analytics" />
          <Stack.Screen name="debug-clear-data" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
          </AccountProvider>
        </ThemeProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
