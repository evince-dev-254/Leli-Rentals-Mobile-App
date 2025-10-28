import OAuthButton from '@/components/OAuthButton';
import ToastNotification from '@/components/ToastNotification';
import { styles } from '@/constants/AuthStyles';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { useToast } from '@/hooks/useToast';
import { authErrorHandler } from '@/utils/authErrorHandler';
import { useAuth, useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { toast, showError, showWarning, showSuccess, hideToast } = useToast();
  const insets = useSafeAreaInsets();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already signed in
  useEffect(() => {
    if (authLoaded && isSignedIn) {
      console.log('User already signed in, redirecting to main app');
      router.replace('/');
    }
  }, [authLoaded, isSignedIn]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Enhanced validation
    if (!firstName.trim()) {
      showAlert('First Name Required', 'Please enter your first name.', 'warning');
      return;
    }

    if (!lastName.trim()) {
      showAlert('Last Name Required', 'Please enter your last name.', 'warning');
      return;
    }

    if (!emailAddress.trim()) {
      showAlert('Email Required', 'Please enter your email address.', 'warning');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      showAlert('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }

    if (!password.trim()) {
      showAlert('Password Required', 'Please enter your password.', 'warning');
      return;
    }

    // Password strength validation
    if (password.length < 8) {
      showAlert('Weak Password', 'Password must be at least 8 characters long.', 'warning');
      return;
    }

    try {
      // Start sign-up process using email, password, and names
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      // Redirect to dedicated email verification screen
      router.push('/(auth)/email-verification');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      
      // Handle specific Clerk errors with user-friendly messages
      if (err?.clerkError) {
        const errorCode = err.errors?.[0]?.code;
        const errorMessage = err.errors?.[0]?.message;
        
        switch (errorCode) {
          case 'form_identifier_exists':
            showError(
              'This email address is already registered. Please try signing in instead or use a different email address.',
              {
                label: 'Go to Login',
                onPress: () => router.push('/(auth)/login')
              }
            );
            break;
          case 'form_password_pwned':
            showAlert(
              'Password Not Secure', 
              'This password has been found in data breaches. Please choose a stronger, unique password.',
              'error'
            );
            break;
          case 'form_password_validation_failed':
            showAlert(
              'Password Requirements', 
              'Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.',
              'warning'
            );
            break;
          case 'form_identifier_invalid':
            showAlert(
              'Invalid Email', 
              'Please enter a valid email address.',
              'warning'
            );
            break;
          case 'too_many_requests':
            showAlert(
              'Too Many Attempts', 
              'You have made too many signup attempts. Please wait a few minutes before trying again.',
              'warning'
            );
            break;
          default:
            showAlert(
              'Sign Up Failed', 
              errorMessage || 'An unexpected error occurred. Please try again.',
              'error'
            );
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
        showAlert('Sign Up Failed', 'An unexpected error occurred. Please try again.', 'error');
      }
    }
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefce8' }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.formContainer, { paddingBottom: Math.max(insets.bottom + 80, 100) }]}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start using Leli Rentals</Text>
          </View>

          {/* OAuthButton component to handle OAuth sign-up */}
          <View style={styles.oauthContainer}>
            <OAuthButton strategy="oauth_google" isSignUp={true}>Sign up with Google</OAuthButton>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={emailAddress}
              onChangeText={(text) => setEmailAddress(text)}
              autoCapitalize="none"
              keyboardType="email-address"
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

          <TouchableOpacity style={styles.button} onPress={onSignUpPress} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Link to sign-in screen */}
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.textButtonText}>Already have an account? Sign in.</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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