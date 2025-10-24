import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    InputBackground,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    WhiteBackground
} from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { getCalmErrorMessage } from '@/utils/errorMessages';
import { navigateToLogin } from '@/utils/navigation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ForgotPasswordScreen = () => {
  const { resetPassword } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      showErrorAlert('Email Required', 'Please enter your email address to reset your password.');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      const calmMessage = getCalmErrorMessage(error);
      showSuccessAlert('Reset Password', calmMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail('');
  };

  if (isSubmitted) {
    return (
      <View style={styles.container}>
          <BackButton onPress={navigateToLogin} />

        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color={Success} />
          </View>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successDescription}>
            We've sent a password reset link to {email}
          </Text>
          <Text style={styles.successSubtext}>
            Didn't receive the email? Check your spam folder or try again.
          </Text>
          
          <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
            <Text style={styles.tryAgainButtonText}>Try Different Email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backToLoginButton} onPress={() => router.replace('/login')}>
            <Text style={styles.backToLoginButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {/* Animated Back Button */}
          <BackButton onPress={navigateToLogin} />

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={40} color={PrimaryBrand} />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your email address and we'll send you a reset link.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={SecondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={SecondaryText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.submitButtonText}>Sending...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Remember your password?</Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips:</Text>
            <Text style={styles.tipText}>• Check your spam folder</Text>
            <Text style={styles.tipText}>• Make sure you're using the correct email</Text>
            <Text style={styles.tipText}>• Contact support if you need help</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: InputBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
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
  submitButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: PrimaryBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: SecondaryText,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  helpText: {
    color: SecondaryText,
    fontSize: 14,
    marginRight: 5,
  },
  loginLink: {
    color: PrimaryBrand,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipsContainer: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: SecondaryText,
    marginBottom: 4,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  successSubtext: {
    fontSize: 14,
    color: SecondaryText,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  tryAgainButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tryAgainButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginButton: {
    borderWidth: 1,
    borderColor: Border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backToLoginButtonText: {
    color: PrimaryBrand,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
