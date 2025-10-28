import { useAccount } from '@/contexts/AccountContext';
import { authErrorHandler } from '@/utils/authErrorHandler';
import { useAuth, useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

// Complete the auth session for OAuth flows
WebBrowser.maybeCompleteAuthSession();

interface OAuthButtonProps {
  strategy: 'oauth_google' | 'oauth_apple' | 'oauth_facebook';
  children: React.ReactNode;
  style?: any;
  isSignUp?: boolean; // Add prop to distinguish between sign-in and sign-up
}

export default function OAuthButton({ strategy, children, style, isSignUp = false }: OAuthButtonProps) {
  const { startOAuthFlow } = useOAuth({ strategy });
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  // Safely get account context - it might not be available in auth screens
  let accountType = null;
  try {
    const accountContext = useAccount();
    accountType = accountContext?.accountType;
  } catch (error) {
    // AccountProvider not available - this is expected in auth screens
    console.log('AccountProvider not available in this context');
  }
  
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOAuth = React.useCallback(async () => {
    if (isLoading) {
      console.log('OAuth already in progress, please wait...');
      return; // Prevent multiple simultaneous OAuth attempts
    }
    
    // Wait for authentication to be loaded
    if (!isLoaded) {
      console.log('Authentication not loaded yet, please wait...');
      return;
    }
    
    // Check if user is already signed in - prevent OAuth flow entirely
    if (isSignedIn) {
      console.log('User already signed in, redirecting to main app...');
      router.push('/');
      return;
    }
    
    // Additional check: if we have account type but not signed in, there might be a session issue
    if (accountType && !isSignedIn) {
      console.log('Account type exists but not signed in - possible session issue, redirecting to main app');
      router.push('/');
      return;
    }
    
    // Double check - if somehow we get here while signed in, don't start OAuth
    if (isSignedIn) {
      console.log('Double check: User is signed in, aborting OAuth flow');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log(`Starting ${strategy} OAuth flow...`);
      console.log('isSignUp:', isSignUp);
      console.log('accountType:', accountType);
      
      const result = await startOAuthFlow();
      console.log('OAuth result:', result);
      
      // Handle the OAuth result
      if (result.createdSessionId) {
        console.log('Session created, determining redirect...');
        console.log('OAuth result details:', {
          signUp: result.signUp,
          signIn: result.signIn,
          createdSessionId: result.createdSessionId
        });
        
        // Add a small delay to allow authentication state to update
        setTimeout(async () => {
          try {
            // Check if this is a new user (signup) or existing user (login)
            if (result.signUp) {
              console.log('New user signup via Google OAuth');
              // New user - always go to account type selection
              // They need to choose if they want to be a renter or owner
              router.replace('/account-type');
            } else if (result.signIn) {
              console.log('Existing user login via Google OAuth, checking account type...');
              // Existing Google user - check stored account type
              setTimeout(async () => {
                try {
                  const storedAccountType = await AsyncStorage.getItem('accountType');
                  console.log('OAuth - Stored account type:', storedAccountType);
                  
                  if (storedAccountType === 'renter') {
                    console.log('OAuth - Redirecting to renter home');
                    router.replace('/(renter)');
                  } else if (storedAccountType === 'owner') {
                    console.log('OAuth - Redirecting to owner dashboard');
                    router.replace('/(owner)');
                  } else {
                    console.log('OAuth - No stored account type, redirecting to account type selection');
                    router.replace('/account-type');
                  }
                } catch (error) {
                  console.error('OAuth - Error checking stored account type:', error);
                  router.replace('/account-type');
                }
              }, 1000);
            } else {
              // Fallback - check stored account type
              console.log('OAuth successful, checking account type...');
              setTimeout(async () => {
                try {
                  const storedAccountType = await AsyncStorage.getItem('accountType');
                  console.log('OAuth Fallback - Stored account type:', storedAccountType);
                  
                  if (storedAccountType === 'renter') {
                    console.log('OAuth Fallback - Redirecting to renter home');
                    router.replace('/(renter)');
                  } else if (storedAccountType === 'owner') {
                    console.log('OAuth Fallback - Redirecting to owner dashboard');
                    router.replace('/(owner)');
                  } else {
                    console.log('OAuth Fallback - No stored account type, redirecting to account type selection');
                    router.replace('/account-type');
                  }
                } catch (error) {
                  console.error('OAuth Fallback - Error checking stored account type:', error);
                  router.replace('/account-type');
                }
              }, 1000);
            }
          } catch (error) {
            console.error('Error in OAuth redirect logic:', error);
            // Fallback to account type selection
            router.replace('/account-type');
          }
        }, 500); // Wait for auth state to update
      } else {
        // Handle next steps like 2FA or profile completion
        console.log('OAuth flow initiated, but no session created yet. Handle next steps (e.g., 2FA)');
        if (result.signIn) {
          console.log('Sign-in process needs completion');
        } else if (result.signUp) {
          console.log('Sign-up process needs completion');
        }
      }
    } catch (err: any) {
      console.error(`${strategy} OAuth error:`, JSON.stringify(err, null, 2));
      console.error('Full error object:', err);
      
      // Use error handler for robust error handling
      try {
        authErrorHandler.handleAuthError(err, {
          isSignedIn,
          user: null,
          accountType: accountType || null,
          isLoaded
        });
      } catch (errorHandlerError) {
        console.error('Error handler failed:', errorHandlerError);
        // Fallback error handling
        alert(`${strategy} authentication failed. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [startOAuthFlow, router, strategy, isSignUp, accountType, isLoading, isSignedIn, isLoaded]);

  const getButtonStyle = () => {
    switch (strategy) {
      case 'oauth_google':
        return {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dadce0',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        };
      case 'oauth_apple':
        return {
          backgroundColor: '#000000',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      case 'oauth_facebook':
        return {
          backgroundColor: '#1877f2',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      default:
        return {
          backgroundColor: '#d97706',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
    }
  };

  const getTextStyle = () => {
    switch (strategy) {
      case 'oauth_google':
        return {
          color: '#3c4043',
          fontSize: 16,
          fontWeight: '500' as const,
          marginLeft: 8,
        };
      case 'oauth_apple':
        return {
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '500' as const,
          marginLeft: 8,
        };
      case 'oauth_facebook':
        return {
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '500' as const,
          marginLeft: 8,
        };
      default:
        return {
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '500' as const,
          marginLeft: 8,
        };
    }
  };

  const getIcon = () => {
    switch (strategy) {
      case 'oauth_google':
        return (
          <Image
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        );
      case 'oauth_apple':
        return <Text style={{ color: '#ffffff', fontSize: 16 }}>🍎</Text>;
      case 'oauth_facebook':
        return <Text style={{ color: '#ffffff', fontSize: 16 }}>📘</Text>;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(), 
        style, 
        (isLoading || isSignedIn || !isLoaded) && { opacity: 0.6 }
      ]}
      onPress={handleOAuth}
      activeOpacity={0.8}
      disabled={isLoading || isSignedIn || !isLoaded}
    >
      {getIcon()}
      <Text style={getTextStyle()}>
        {isLoading ? 'Signing in...' : 
         !isLoaded ? 'Loading...' :
         isSignedIn ? 'Already signed in' : 
         children}
      </Text>
    </TouchableOpacity>
  );
}
