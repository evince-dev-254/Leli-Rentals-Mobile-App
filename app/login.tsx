import AuthForm from '@/components/AuthForm';
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
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    // Trim whitespace and check for empty strings
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      showErrorAlert('Almost there!', 'Please fill in all fields to continue.');
      return;
    }

    try {
      setLoading(true);
      await signIn(trimmedEmail, trimmedPassword);
      router.replace('/(tabs)');
    } catch (error: any) {
      const calmMessage = getCalmErrorMessage(error);
      showSuccessAlert('Sign In', calmMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView 
        className="flex-1 justify-end"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          className="flex-grow justify-start"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <BackButton onPress={() => router.push('/onboarding')} />

          {/* Logo above hero image */}
          <View className="items-center mt-8 mb-6">
            <Image
              source={require('../assets/images/default-monochrome-black.png')}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>

          {/* Hero image */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=800&fit=crop' }}
            className="w-full h-48 rounded-2xl mx-6 mb-8"
            resizeMode="cover"
          />

          {/* Page title */}
          <View className="px-6 mb-8">
            <Text className="text-3xl font-bold text-text-primary text-center mb-2">Welcome Back!</Text>
            <Text className="text-base text-text-secondary text-center">Sign in to continue your rental journey</Text>
          </View>

          {/* Login Form extracted into reusable component */}
          <View className="px-6 mb-6"> 
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

            <TouchableOpacity className="flex-row justify-center items-center py-4" onPress={handleSignUp}>
              <Text className="text-text-secondary">Don&apos;t have an account? </Text>
              <Text className="text-primary-brand font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;