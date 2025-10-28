import BackButton from '@/components/BackButton';
import OAuthButton from '@/components/OAuthButton';
import TechLoader from '@/components/TechLoader';
import ToastNotification from '@/components/ToastNotification';
import { styles } from '@/constants/AuthStyles';
import { useAccount } from '@/contexts/AccountContext';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { useToast } from '@/hooks/useToast';
import { authErrorHandler } from '@/utils/authErrorHandler';
import { useAuth, useSignIn, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { accountType, loading: accountLoading } = useAccount();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { toast, showError, showWarning, showSuccess, hideToast } = useToast();
  const insets = useSafeAreaInsets();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already signed in and verified
  useEffect(() => {
    if (authLoaded && userLoaded && isSignedIn && user && !accountLoading) {
      console.log('User already signed in and verified, checking email verification...');
      
      // Check if email is verified
      if (user.emailAddresses && user.emailAddresses.length > 0) {
        const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
        if (primaryEmail && primaryEmail.verification?.status === 'verified') {
          console.log('Email verified, checking account type...');
          
          // Check if user has an account type
          if (accountType) {
            console.log(`User has account type: ${accountType}, redirecting directly to their account`);
            if (accountType === 'renter') {
              router.replace('/(renter)');
            } else if (accountType === 'owner') {
              router.replace('/(owner)');
            }
          } else {
            console.log('User has no account type, redirecting to account type selection');
            router.replace('/account-type');
          }
        } else {
          console.log('Email not verified, staying on login');
          showAlert('Email Verification Required', 'Please verify your email address before proceeding.', 'warning');
        }
      }
    }
  }, [authLoaded, userLoaded, isSignedIn, user, accountType, accountLoading]);

  const onSignInPress = async () => {
    if (!isLoaded || !setActive || isLoading) return;

    // Validate required fields
    if (!emailAddress.trim() || !password.trim()) {
      showWarning('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      
      // signIn.create() method from Clerk SDK to handle sign-in logic
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        
        console.log('Sign in successful, checking account type...');
        
        // Wait a moment for account context to load
        setTimeout(() => {
          // Force a re-check of account type from storage
          const checkAccountType = async () => {
            try {
              const storedAccountType = await AsyncStorage.getItem('accountType');
              console.log('Stored account type:', storedAccountType);
              
              if (storedAccountType === 'renter') {
                console.log('Redirecting to renter home');
                router.replace('/(renter)');
              } else if (storedAccountType === 'owner') {
                console.log('Redirecting to owner dashboard');
                router.replace('/(owner)');
              } else {
                console.log('No stored account type, redirecting to account type selection');
                router.replace('/account-type');
              }
            } catch (error) {
              console.error('Error checking stored account type:', error);
              router.replace('/account-type');
            }
          };
          
          checkAccountType();
        }, 1000);
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        showAlert('Sign In Incomplete', 'Please complete all required steps to sign in.', 'warning');
      }
    } catch (err: any) {
      console.error('Login error details:', JSON.stringify(err, null, 2));
      console.error('Error code:', err?.errors?.[0]?.code);
      console.error('Error message:', err?.errors?.[0]?.message);
      
      // Handle specific Clerk errors with user-friendly messages
      if (err?.clerkError) {
        const errorCode = err.errors?.[0]?.code;
        const errorMessage = err.errors?.[0]?.message;
        
        switch (errorCode) {
          case 'form_identifier_not_found':
            showAlert(
              'Account Not Found', 
              'No account found with this email address. Please check your email or sign up for a new account.',
              'warning',
              {
                onConfirm: () => {
                  // Optionally redirect to signup
                  router.push('/(auth)/signup');
                }
              }
            );
            break;
          case 'form_password_incorrect':
            showError('The password you entered is incorrect. Please try again or reset your password.');
            break;
          case 'form_identifier_invalid':
            showWarning('Please enter a valid email address.');
            break;
          case 'too_many_requests':
            showWarning('You have made too many login attempts. Please wait a few minutes before trying again.');
            break;
          case 'session_exists':
            showAlert(
              'Already Signed In', 
              'You are already signed in. Redirecting to your account...',
              'success',
              {
                onConfirm: () => {
                  router.replace('/');
                }
              }
            );
            break;
          case 'strategy_for_user_invalid':
            showAlert(
              'Account Verification Issue', 
              'Your account was created with a different verification method. Please try signing up with a new email address or contact support for assistance.',
              'error',
              {
                confirmText: 'Sign Up Again',
                onConfirm: () => {
                  router.push('/(auth)/signup');
                }
              }
            );
            break;
          case 'verification_failed':
            showAlert(
              'Verification Failed', 
              'Email verification failed. Please try again or contact support if the issue persists.',
              'error'
            );
            break;
          case 'user_not_found':
            showAlert(
              'Account Not Found', 
              'No account found with this email address. Please check your email or sign up for a new account.',
              'warning',
              {
                confirmText: 'Sign Up',
                onConfirm: () => {
                  router.push('/(auth)/signup');
                }
              }
            );
            break;
          case 'invalid_credentials':
            showError('Invalid email or password. Please check your credentials and try again.');
            break;
          default:
            showError(errorMessage || 'An unexpected error occurred. Please try again.');
        }
      } else {
      // Use error handler for robust error handling
      try {
        authErrorHandler.handleAuthError(err, {
          isSignedIn: false,
          user: null,
          accountType: null,
          isLoaded: true
        });
      } catch (errorHandlerError) {
        console.error('Error handler failed:', errorHandlerError);
        // Fallback error handling
          showAlert('Sign In Failed', 'An unexpected error occurred. Please try again.', 'error');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefce8' }}>
      {/* Back Button */}
      <BackButton onPress={() => router.push('/onboarding')} />

      <View style={[styles.formContainer, { paddingBottom: Math.max(insets.bottom + 40, 60) }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>Enter your credentials to access your account</Text>
        </View>

        {/* OAuthButton component to handle OAuth sign-in */}
        <View style={styles.oauthContainer}>
          <OAuthButton strategy="oauth_google" isSignUp={false}>Sign in with Google</OAuthButton>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={emailAddress}
              onChangeText={(text) => setEmailAddress(text)}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.loadingButton]} 
            onPress={onSignInPress} 
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <TechLoader size={20} color="#ffffff" variant="circular" showText={false} />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Signing In...</Text>
              </View>
            ) : (
            <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => router.push('/(auth)/forgot-password')}
            activeOpacity={0.8}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Link to sign-up screen */}
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.8}
          >
            <Text style={styles.textButtonText}>Don&apos;t have an account? Sign up.</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AlertComponent />
      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        action={toast.action}
      />
    </SafeAreaView>
  );
}