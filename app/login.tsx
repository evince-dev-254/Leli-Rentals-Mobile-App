
import AuthForm from '@/components/AuthForm';
import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    InputBackground,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    WhiteBackground
} from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { getCalmErrorMessage } from '@/utils/errorMessages';
import { navigateToOnboarding } from '@/utils/navigation';
// icons used inside AuthForm
import { showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Simplified login UI to match signup styling

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // password visibility handled within AuthForm
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email || !password) {
      showErrorAlert('Almost there!', 'Please fill in all fields to continue.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      const calmMessage = getCalmErrorMessage(error);
      showSuccessAlert('Sign In', calmMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    // Navigate to signup page
    router.push('/signup');
  };

  // Google Sign-In temporarily disabled for testing
  // const handleGoogleSignIn = async () => {
  //   try {
  //     setLoading(true);
  //     const result = await signInWithGoogle();
      
  //     if (result.success) {
  //       router.replace('/(tabs)');
  //     } else {
  //       Alert.alert('Google Sign-In', result.error || 'Google Sign-In is not available in development environment');
  //     }
  //   } catch (error: any) {
  //     Alert.alert('Google Sign-In Error', error.message || 'An error occurred during Google sign-in');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.formWrapper} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: Math.max(insets.bottom, 4) }]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <BackButton onPress={navigateToOnboarding} />

          {/* Logo above hero image */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/default-monochrome-black.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Hero image */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=800&fit=crop' }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Page title */}
          <View style={styles.headerSimple}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue your rental journey</Text>
          </View>

          {/* Login Form extracted into reusable component */}
          <View style={styles.form}> 
            <AuthForm
              type="SIGN_IN"
              defaultValues={{ email: '', password: '' }}
              onSubmit={async ({ email, password }) => {
                setEmail(email);
                setPassword(password);
                await handleLogin();
              }}
              onForgotPassword={() => router.push('/forgot-password')}
              // onGoogle={handleGoogleSignIn} // Temporarily disabled for testing
              submitting={loading}
            />

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Don&apos;t have an account? </Text>
              <Text style={styles.signUpButtonTextBold}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 4,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  heroImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  headerSimple: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PrimaryText,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: SecondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
  },
  form: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: InputBackground,
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: PrimaryText,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: PrimaryBrand,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  loginButtonText: {
    color: WhiteBackground,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: SecondaryText,
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtons: {
    marginBottom: 18,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: InputBackground,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Border,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  signUpButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    color: SecondaryText,
  },
  signUpButtonTextBold: {
    fontSize: 16,
    color: PrimaryBrand,
    fontWeight: 'bold',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
});

export default LoginScreen;
