import { PrimaryBrand, WhiteBackground } from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

/**
 * Main entry point for the app
 * 
 * Flow:
 * 1. ALWAYS show onboarding first (mandatory)
 * 2. After onboarding → Check authentication
 * 3. If authenticated → Check account type → Go to main app or account selection
 * 4. If not authenticated → Show login
 */
export default function IndexScreen() {
  const { user, loading } = useAuth();
  const { accountType } = useAccount();

  useEffect(() => {
    if (!loading) {
      // Always show onboarding first - it's mandatory
      router.push('/onboarding');
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PrimaryBrand} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
  },
});
