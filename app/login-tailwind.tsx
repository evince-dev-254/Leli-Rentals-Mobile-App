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

// Tailwind CSS version of LoginScreen
const LoginScreenTailwind = () => {
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
    <KeyboardAvoidingView 
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-end">
        <ScrollView 
          className="flex-grow justify-start"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-16 pb-8">
            <BackButton />
            <View className="items-center mt-8">
              <Image 
                source={require('@/assets/images/splash-icon.png')} 
                className="w-20 h-20 mb-6"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-text-primary text-center mb-2">
                Welcome Back
              </Text>
              <Text className="text-base text-text-secondary text-center">
                Sign in to continue to Leli Rentals
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="px-6 pb-8">
            <AuthForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={handleLogin}
              loading={loading}
              submitText="Sign In"
            />

            {/* Sign Up Link */}
            <View className="mt-6">
              <Text className="text-center text-text-secondary mb-4">
                Don't have an account?
              </Text>
              <TouchableOpacity 
                onPress={handleSignUp}
                className="py-4 px-6 rounded-xl border-2 border-border items-center"
              >
                <Text className="text-primary-brand font-semibold text-base">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Additional Options */}
            <View className="mt-8">
              <TouchableOpacity 
                onPress={() => router.push('/forgot-password')}
                className="py-3"
              >
                <Text className="text-center text-primary-brand font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreenTailwind;
