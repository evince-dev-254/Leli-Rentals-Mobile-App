import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    Error,
    InputBackground,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    WhiteBackground
} from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
// import { GoogleAuthService } from '@/services/GoogleAuthService'; // Temporarily disabled
import { showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { getCalmErrorMessage } from '@/utils/errorMessages';
import { navigateToOnboarding } from '@/utils/navigation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignupScreen = () => {
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) {
      setEmailValid(validateEmail(text));
    } else {
      setEmailValid(null);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  // Google Sign-In temporarily disabled for testing
  // const handleGoogleSignUp = async () => {
  //   try {
  //     setIsLoading(true);
  //     const result = await GoogleAuthService.signInWithGoogle();
      
  //     if (result.success) {
  //       // User profile is automatically created by GoogleAuthService
  //       router.replace('/(tabs)');
  //     } else {
  //       Alert.alert('Google Sign-Up Failed', result.error || 'An error occurred during Google sign-up');
  //     }
  //   } catch (error: any) {
  //     Alert.alert('Google Sign-Up Error', error.message || 'An error occurred during Google sign-up');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSignup = async () => {
    // Trim whitespace and check for empty strings
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    
    if (!trimmedFullName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      showErrorAlert('Almost there!', 'Please fill in all fields to create your account.');
      return;
    }
    if (password !== confirmPassword) {
      showErrorAlert('Password Mismatch', 'Your passwords don\'t match. Please make sure they\'re the same.');
      return;
    }
    if (!emailValid) {
      showErrorAlert('Email Check', 'Please enter a valid email address to continue.');
      return;
    }
    if (passwordStrength < 3) {
      showErrorAlert('Password Strength', 'For your security, please choose a stronger password with at least 8 characters.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create Firebase user account
      await signUp(trimmedEmail, trimmedPassword, trimmedFullName);
      
      // Save user data to AsyncStorage (in a real app, this would be sent to a server)
      const userData = {
        fullName: trimmedFullName,
        email: trimmedEmail,
        password: trimmedPassword, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
        isVerified: false
      };
      
      // Store user data (simulating account creation)
      console.log('Account created successfully:', userData);
      
      // Navigate directly to account type selection
      router.replace('/account-type');
    } catch (error: any) {
      console.error('Signup error:', error);
      const calmMessage = getCalmErrorMessage(error);
      showSuccessAlert('Create Account', calmMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {/* Animated Back Button */}
        <BackButton onPress={navigateToOnboarding} />

        <View style={styles.header}>
          {/* Brand logo */}
          <Image 
            source={require('../assets/images/default-monochrome-black.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Leli Rentals today!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={SecondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={SecondaryText}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={SecondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={SecondaryText}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailValid !== null && (
              <Ionicons 
                name={emailValid ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={emailValid ? Success : Error} 
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={SecondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={SecondaryText}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={SecondaryText} />
            </TouchableOpacity>
          </View>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <View style={styles.passwordStrength}>
              <Text style={styles.strengthLabel}>Password Strength:</Text>
              <View style={styles.strengthBars}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthBar,
                      { backgroundColor: level <= passwordStrength ? Success : Border }
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={SecondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={SecondaryText}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.passwordToggle}>
              <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={SecondaryText} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In temporarily disabled for testing */}
          {/* <TouchableOpacity 
            style={[styles.googleButton, isLoading && styles.googleButtonDisabled]} 
            onPress={handleGoogleSignUp}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={20} color={PrimaryBrand} />
            <Text style={styles.googleButtonText}>
              {isLoading ? 'Signing Up...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity> */}

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PrimaryBrand,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: PrimaryBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: SecondaryText,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: InputBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: PrimaryText,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 5,
  },
  passwordStrength: {
    marginBottom: 15,
  },
  strengthLabel: {
    fontSize: 12,
    color: SecondaryText,
    marginBottom: 5,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
  signupButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  signupButtonDisabled: {
    backgroundColor: SecondaryText,
    shadowOpacity: 0.1,
  },
  signupButtonText: {
    color: WhiteBackground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
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
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Border,
    marginBottom: 14,
  },
  googleButtonText: {
    color: PrimaryBrand,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: SecondaryText,
    fontSize: 14,
  },
  loginLink: {
    color: PrimaryBrand,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
