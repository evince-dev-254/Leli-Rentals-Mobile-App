import { PrimaryBrand } from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useAuth, useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Global flag to prevent multiple navigation attempts
let globalNavigationLock = false;

/**
 * Main entry point for the app
 * 
 * Flow:
 * 1. Check if onboarding is completed
 * 2. If not completed → Show onboarding
 * 3. If completed → Check authentication
 * 4. If authenticated → Check account type → Go to main app or account selection
 * 5. If not authenticated → Show login
 */
export default function IndexScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { accountType, loading: accountLoading } = useAccount();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [hasNavigated, setHasNavigated] = useState(false);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if onboarding has been completed using AsyncStorage
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('onboarding_completed');
        console.log('Onboarding status from AsyncStorage:', onboardingStatus);
        
        if (onboardingStatus === 'true') {
          console.log('Onboarding already completed, proceeding to auth flow');
          setOnboardingCompleted(true);
        } else {
          console.log('Onboarding not completed, showing onboarding');
          setOnboardingCompleted(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to showing onboarding if there's an error
        setOnboardingCompleted(false);
      }
    };
    
    checkOnboardingStatus();
  }, []);

  // Debug function to reset onboarding (can be called from console)
  useEffect(() => {
    // Add global function for debugging
    (global as any).resetOnboarding = async () => {
      console.log('Resetting onboarding status...');
      await AsyncStorage.removeItem('onboarding_completed');
      setOnboardingCompleted(false);
      setHasNavigated(false);
      globalNavigationLock = false;
    };
    
    // Add global function to force navigation
    (global as any).forceNavigation = () => {
      console.log('Forcing navigation to login...');
      setHasNavigated(true);
      router.replace('/(auth)/login');
    };
  }, []);

  // Separate fallback timeout to prevent infinite loading
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (onboardingCompleted === null) {
        console.log('Fallback: Setting onboarding to false due to timeout');
        setOnboardingCompleted(false);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(fallbackTimeout);
  }, [onboardingCompleted]);

  // Navigation timeout to prevent hanging
  useEffect(() => {
    const navigationTimeout = setTimeout(() => {
      if (onboardingCompleted === true && !hasNavigated) {
        console.log('Navigation timeout: Forcing navigation to login');
        setHasNavigated(true);
        router.replace('/(auth)/login');
      }
    }, 1000); // 1 second timeout for navigation
    
    return () => clearTimeout(navigationTimeout);
  }, [onboardingCompleted, hasNavigated]);

  // Reset navigation state on app open/refresh
  useEffect(() => {
    setHasNavigated(false);
  }, []);

  // Start loading animation
  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, [spinValue]);

  useEffect(() => {
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Only proceed if we have all the required data
    if (!isLoaded || !userLoaded || onboardingCompleted === null) {
      console.log('App index - Waiting for data:', { isLoaded, userLoaded, onboardingCompleted });
      return;
    }

    if (onboardingCompleted === false && !hasNavigated) {
      // Always show onboarding first
      console.log('Redirecting to onboarding');
      setHasNavigated(true);
      router.replace('/onboarding');
      return;
    }

    if (onboardingCompleted === true && !hasNavigated) {
      console.log('App index - Auth state:', { isSignedIn, user: !!user, accountType, onboardingCompleted, accountLoading });
      
      // Set navigation flag immediately
      setHasNavigated(true);
      
      // Navigate immediately without delay
      try {
        if (isSignedIn && user && accountType) {
          // User is authenticated and has account type - go directly to specific page
          console.log('App index - User authenticated with account type, redirecting to specific page');
          if (accountType === 'renter') {
            router.replace('/(renter)');
          } else if (accountType === 'owner') {
            router.replace('/(owner)');
          } else {
            router.replace('/account-type'); // Fallback to account type selection
          }
        } else if (isSignedIn && user && !accountType) {
          // User is authenticated but needs to select account type
          console.log('App index - User authenticated but no account type, redirecting to account type selection');
          router.replace('/account-type');
        } else {
          // User not authenticated - go to login
          console.log('App index - User not authenticated, redirecting to login');
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to login if navigation fails
        router.replace('/(auth)/login');
      }
    }

    // Cleanup function
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [isLoaded, userLoaded, onboardingCompleted, isSignedIn, user, accountType, hasNavigated]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!isLoaded || !userLoaded || onboardingCompleted === null) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.simpleLoader}>
          <Animated.View style={[styles.loaderCircle, { borderColor: PrimaryBrand, transform: [{ rotate }] }]} />
          <View style={styles.loaderText}>
            <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
            <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
            <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
          </View>
        </View>
      </View>
    );
  }

  // Fallback: If we reach here and haven't navigated, show a simple message
  if (onboardingCompleted === true && !hasNavigated) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.simpleLoader}>
          <Animated.View style={[styles.loaderCircle, { borderColor: PrimaryBrand, transform: [{ rotate }] }]} />
          <View style={styles.loaderText}>
            <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
            <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
            <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
          </View>
        </View>
      </View>
    );
  }

  // Final fallback - show loading if we reach here
  console.log('App index - Final fallback reached. State:', { 
    isLoaded, 
    userLoaded, 
    onboardingCompleted, 
    isSignedIn, 
    user: !!user, 
    accountType, 
    hasNavigated 
  });
  
  const handleForceNavigation = () => {
    console.log('Force navigation button pressed');
    setHasNavigated(true);
    router.replace('/(auth)/login');
  };
  
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.simpleLoader}>
        <Animated.View style={[styles.loaderCircle, { borderColor: PrimaryBrand, transform: [{ rotate }] }]} />
        <View style={styles.loaderText}>
          <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
          <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
          <View style={[styles.loadingDot, { backgroundColor: PrimaryBrand }]} />
        </View>
      </View>
      
      {/* Debug button - remove in production */}
      <TouchableOpacity style={styles.debugButton} onPress={handleForceNavigation}>
        <Text style={styles.debugButtonText}>Continue to App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefce8',
  },
  simpleLoader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderTopColor: 'transparent',
    marginBottom: 20,
  },
  loaderText: {
    flexDirection: 'row',
    gap: 4,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  debugButton: {
    marginTop: 30,
    backgroundColor: PrimaryBrand,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
