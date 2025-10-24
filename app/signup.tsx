import BackButton from '@/components/BackButton';
import { useAuth } from '@/contexts/AuthContext';
import { getCalmErrorMessage } from '@/utils/errorMessages';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
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
      showErrorAlert('Password Mismatch', 'Your passwords don&apos;t match. Please make sure they&apos;re the same.');
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
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <BackButton onPress={() => router.push('/onboarding')} />

        {/* Header */}
        <View className="items-center px-6 py-8">
          <Image 
            source={require('../assets/images/default-monochrome-black.png')}
            className="w-20 h-20 mb-6"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-text-primary text-center mb-2">Create Account</Text>
          <Text className="text-base text-text-secondary text-center">Join Leli Rentals today!</Text>
        </View>

        {/* Form */}
        <View className="px-6 pb-8">
          {/* Full Name Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-text-primary mb-2">Full Name</Text>
            <TextInput
              className="bg-muted-background border border-border rounded-xl px-4 py-4 text-base text-text-primary"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-text-primary mb-2">Email</Text>
            <TextInput
              className={`bg-muted-background border rounded-xl px-4 py-4 text-base ${
                emailValid === false ? 'border-error' : emailValid === true ? 'border-success' : 'border-border'
              }`}
              placeholder="Enter your email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailValid === false && (
              <Text className="text-error text-sm mt-1">Please enter a valid email address</Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-text-primary mb-2">Password</Text>
            <View className="flex-row items-center bg-muted-background border border-border rounded-xl px-4">
              <TextInput
                className="flex-1 py-4 text-base text-text-primary"
                placeholder="Create a password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                <Text className="text-primary-brand font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View className="mt-2">
                <View className="flex-row space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <View
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        level <= passwordStrength
                          ? passwordStrength <= 2
                            ? 'bg-error'
                            : passwordStrength <= 3
                            ? 'bg-warning'
                            : 'bg-success'
                          : 'bg-border'
                      }`}
                    />
                  ))}
                </View>
                <Text className="text-xs text-text-secondary mt-1">
                  {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'} password
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-text-primary mb-2">Confirm Password</Text>
            <View className="flex-row items-center bg-muted-background border border-border rounded-xl px-4">
              <TextInput
                className="flex-1 py-4 text-base text-text-primary"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-2">
                <Text className="text-primary-brand font-medium">
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {password !== confirmPassword && confirmPassword.length > 0 && (
              <Text className="text-error text-sm mt-1">Passwords don't match</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl ${
              isLoading ? 'bg-muted-background' : 'bg-primary-brand'
            }`}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text className={`text-center font-semibold text-base ${
              isLoading ? 'text-text-secondary' : 'text-white'
            }`}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="mt-6">
            <TouchableOpacity 
              className="flex-row justify-center items-center py-4"
              onPress={() => router.push('/login')}
            >
              <Text className="text-text-secondary">Already have an account? </Text>
              <Text className="text-primary-brand font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;