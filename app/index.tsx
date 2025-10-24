import { PrimaryBrand, WhiteBackground } from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

/**
 * Main entry point for the app
 * 
 * Flow:
 * 1. Always check if user has seen onboarding first
 * 2. If not seen onboarding → Show onboarding
 * 3. If seen onboarding → Check authentication
 * 4. If authenticated → Check account type → Go to main app or account selection
 * 5. If not authenticated → Show login
 */
export default function IndexScreen() {
  const { user, loading } = useAuth();
  const { accountType } = useAccount();
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  useEffect(() => {
    if (!loading && isFirstTime !== null) {
      // Always check onboarding first, regardless of authentication status
      if (isFirstTime) {
        // Show onboarding first
        router.push('/onboarding');
      } else {
        // User has seen onboarding, now check authentication
        if (user) {
          // User is authenticated, check if they have selected an account type
          if (accountType) {
            // User has selected account type, go to main app
            router.push('/(tabs)');
          } else {
            // User needs to select account type
            router.push('/account-type');
          }
        } else {
          // User is not authenticated, show login
          router.push('/login');
        }
      }
    }
  }, [user, loading, isFirstTime, accountType]);

  const checkFirstTimeUser = async () => {
    try {
      // Always check if user has seen onboarding
      let hasSeenOnboarding: string | null = null;
      
      try {
        // Try to get from localStorage (works on both web and mobile)
        hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      } catch (error) {
        // If localStorage is not available, assume first time
        hasSeenOnboarding = null;
      }
      
      // For development/testing: uncomment the line below to always show onboarding
      // hasSeenOnboarding = null;
      
      // If no onboarding flag found, show onboarding
      setIsFirstTime(!hasSeenOnboarding);
    } catch (error) {
      console.error('Error checking first time user:', error);
      // Default to showing onboarding if there's any error
      setIsFirstTime(true);
    }
  };

  if (loading || isFirstTime === null) {
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
