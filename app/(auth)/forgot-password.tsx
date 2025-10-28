import BackButton from '@/components/BackButton';
import ToastNotification from '@/components/ToastNotification';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { useToast } from '@/hooks/useToast';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';


const ForgotPasswordScreen = () => {
  const { isLoaded, signIn } = useSignIn();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { toast, showError, showWarning, showSuccess, hideToast } = useToast();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Check if passwords match for visual feedback
  const passwordsMatch = newPassword.trim() === confirmPassword.trim() && newPassword.trim().length > 0 && confirmPassword.trim().length > 0;
  
  // Show notification when passwords match/don't match (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (confirmPassword.trim().length > 0 && newPassword.trim().length > 0) {
        if (passwordsMatch) {
          showSuccess('Passwords match!');
        } else {
          showWarning('Passwords do not match.');
        }
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [newPassword, confirmPassword, passwordsMatch]);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  // Note: Removed authentication check - users should be able to reset password without being signed in

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  // Handle initial password reset request
  const handlePasswordResetRequest = async () => {
    if (!isLoaded) return;

    // Trim whitespace and check for empty strings
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      showError('Please enter your email address to reset your password.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Initiate password reset
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: trimmedEmail,
      });

      setEmailSent(true);
      showSuccess('Check your email for the password reset code.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Handle specific Clerk errors
      if (error?.clerkError) {
        const errorCode = error.errors?.[0]?.code;
        const errorMessage = error.errors?.[0]?.message;
        
        switch (errorCode) {
          case 'form_identifier_not_found':
            showError(
              'No account found with this email address. Please check your email or sign up for a new account.',
              {
                label: 'Sign Up',
                onPress: () => router.push('/(auth)/signup')
              }
            );
            break;
          case 'form_identifier_invalid':
            showError('Please enter a valid email address.');
            break;
          case 'too_many_requests':
            showWarning('You have made too many reset attempts. Please wait a few minutes before trying again.');
            break;
          default:
            showError(errorMessage || 'Failed to send reset code. Please try again.');
        }
      } else {
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/(auth)/login');
  };

  // Handle password reset with code
  const handlePasswordReset = async () => {
    if (!isLoaded || !signIn) return;

    // Validate inputs
    if (!resetCode.trim()) {
      showError('Please enter the reset code from your email.');
      return;
    }

    if (!newPassword.trim()) {
      showError('Please enter your new password.');
      return;
    }

    if (!confirmPassword.trim()) {
      showError('Please confirm your new password.');
      return;
    }

    // Trim whitespace and compare passwords
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    
    // Debug logging to help identify the issue
    console.log('Password comparison debug:');
    console.log('Original new password:', JSON.stringify(newPassword));
    console.log('Original confirm password:', JSON.stringify(confirmPassword));
    console.log('Trimmed new password:', JSON.stringify(trimmedNewPassword));
    console.log('Trimmed confirm password:', JSON.stringify(trimmedConfirmPassword));
    console.log('Passwords match:', trimmedNewPassword === trimmedConfirmPassword);
    
    if (trimmedNewPassword !== trimmedConfirmPassword) {
      showError('The passwords you entered do not match. Please try again.');
      return;
    }

    if (trimmedNewPassword.length < 8) {
      showError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting password reset with code:', resetCode);
      
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: trimmedNewPassword,
      });

      console.log('Password reset result:', result);

      if (result.status === 'complete') {
        console.log('Password reset successful');
        showSuccess('Your password has been reset successfully! You can now sign in with your new password.');
        router.push('/(auth)/login');
      } else {
        console.log('Password reset incomplete:', result);
        showError('The password reset could not be completed. Please check your reset code and try again.');
      }
    } catch (err: any) {
      console.error('Password reset error:', JSON.stringify(err, null, 2));
      
      // Handle specific Clerk errors
      if (err?.clerkError) {
        const errorCode = err.errors?.[0]?.code;
        const errorMessage = err.errors?.[0]?.message;
        
        if (errorCode === 'form_code_incorrect') {
          showError('The reset code you entered is incorrect. Please check your email and try again.');
        } else if (errorCode === 'form_code_expired') {
          showWarning('The reset code has expired. Please request a new one.');
          setShowResetForm(false); // Go back to request new code
        } else if (errorCode === 'form_password_pwned') {
          showError('This password has been found in data breaches. Please choose a different password.');
        } else if (errorCode === 'form_password_too_short') {
          showError('Password must be at least 8 characters long.');
        } else if (errorCode === 'too_many_requests') {
          showWarning('You have made too many reset attempts. Please wait a moment before trying again.');
        } else {
          showError(errorMessage || 'Password reset failed. Please try again.');
        }
      } else {
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend reset code
  const handleResendCode = async () => {
    if (!isLoaded || !signIn) return;

    setIsLoading(true);

    try {
      console.log('Resending reset code to:', email);
      
      await signIn.prepareFirstFactor({
        strategy: 'reset_password_email_code',
        emailAddressId: email,
      });
      
      console.log('Reset code resent successfully');
      showSuccess('A new reset code has been sent to your email. Please check your inbox.');
    } catch (err: any) {
      console.error('Resend code error:', JSON.stringify(err, null, 2));
      
      // Handle specific Clerk errors
      if (err?.clerkError) {
        const errorCode = err.errors?.[0]?.code;
        const errorMessage = err.errors?.[0]?.message;
        
        if (errorCode === 'form_identifier_not_found') {
          showError('No account found with this email address. Please check your email or sign up for a new account.');
        } else if (errorCode === 'form_identifier_invalid') {
          showError('Please enter a valid email address.');
        } else if (errorCode === 'too_many_requests') {
          showWarning('Please wait a moment before requesting another reset code.');
        } else {
          showError(errorMessage || 'Failed to resend reset code. Please try again.');
        }
      } else {
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent && !showResetForm) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fefce8' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 40, 60) }}
            showsVerticalScrollIndicator={false}
          >
            <BackButton onPress={() => router.push('/(auth)/login')} />

            {/* Success Header */}
            <View style={{ alignItems: 'center', paddingTop: 80, paddingBottom: 40 }}>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#10b981',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                  <Text style={{ fontSize: 32, color: '#ffffff', fontWeight: 'bold' }}>✓</Text>
                </View>
              </View>
              <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#111827' }}>Check Your Email</Text>
              <Text style={{ fontSize: 18, textAlign: 'center', color: '#6b7280', paddingHorizontal: 20, lineHeight: 24 }}>
                We've sent a reset code to {email}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{ paddingHorizontal: 20 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 18,
                  paddingHorizontal: 32,
                  borderRadius: 20,
                  marginBottom: 16,
                  backgroundColor: '#d97706',
                  shadowColor: '#d97706',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 10,
                  borderWidth: 2,
                  borderColor: '#b45309',
                }}
                onPress={() => setShowResetForm(true)}
              >
                <Text style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 18, letterSpacing: 0.5 }}>
                  Enter Reset Code
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 18,
                  paddingHorizontal: 32,
                  borderRadius: 20,
                  backgroundColor: '#f3f4f6',
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                }}
                onPress={handleResendCode}
                disabled={isLoading}
              >
                <Text style={{ color: '#111827', fontWeight: '600', textAlign: 'center', fontSize: 18, letterSpacing: 0.5 }}>
                  {isLoading ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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

  if (showResetForm) {
  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fefce8' }}>
    <KeyboardAvoidingView 
          style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 40, 60) }}
            showsVerticalScrollIndicator={false}
          >
            <BackButton onPress={() => router.push('/(auth)/login')} />

            {/* Reset Form Header */}
            <Animated.View 
              style={{
                alignItems: 'center',
                paddingTop: 80,
                paddingBottom: 40,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              }}
            >
              <Image
                source={require('@/assets/images/default-monochrome-black.png')}
                style={{ width: 140, height: 140, marginBottom: 24 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#111827' }}>
                Reset Password
              </Text>
              <Text style={{ fontSize: 18, textAlign: 'center', color: '#6b7280', paddingHorizontal: 20, lineHeight: 24 }}>
                Enter the reset code and your new password
              </Text>
            </Animated.View>

            {/* Reset Code Input */}
            <Animated.View 
              style={{
                paddingHorizontal: 20,
                marginBottom: 24,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
                Reset Code
              </Text>
              <TextInput
                style={{
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  fontSize: 16,
                  backgroundColor: '#ffffff',
                  color: '#111827',
                }}
                value={resetCode}
                onChangeText={setResetCode}
                placeholder="Enter reset code from email"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </Animated.View>

            {/* New Password Input */}
            <Animated.View 
              style={{
                paddingHorizontal: 20,
                marginBottom: 24,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
                New Password
              </Text>
              <View style={{
                position: 'relative',
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  borderRadius: 16,
                backgroundColor: '#ffffff',
              }}>
                <TextInput
                  style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                    paddingRight: 50,
                  fontSize: 16,
                  color: '#111827',
                }}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
                  secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 15,
                    top: '50%',
                    transform: [{ translateY: -12 }],
                    padding: 4,
                  }}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showNewPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Confirm Password Input */}
            <Animated.View 
              style={{
                paddingHorizontal: 20,
                marginBottom: 32,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
                Confirm Password
              </Text>
              <View style={{
                position: 'relative',
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  borderRadius: 16,
                backgroundColor: '#ffffff',
              }}>
                <TextInput
                  style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                    paddingRight: 50,
                  fontSize: 16,
                  color: '#111827',
                }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 15,
                    top: '50%',
                    transform: [{ translateY: -12 }],
                    padding: 4,
                  }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Match Indicator */}
              {confirmPassword.trim().length > 0 && (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                  paddingHorizontal: 4,
                }}>
                  <Ionicons 
                    name={passwordsMatch ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={passwordsMatch ? "#10b981" : "#ef4444"} 
                  />
                  <Text style={{
                    marginLeft: 6,
                    fontSize: 14,
                    color: passwordsMatch ? "#10b981" : "#ef4444",
                    fontWeight: '500',
                  }}>
                    {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                  </Text>
                </View>
              )}
            </Animated.View>

            {/* Reset Password Button */}
            <Animated.View 
              style={{
                paddingHorizontal: 20,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
        <TouchableOpacity 
                style={{
                  paddingVertical: 18,
                  paddingHorizontal: 32,
                  borderRadius: 20,
                  marginBottom: 24,
                  backgroundColor: isLoading ? '#9ca3af' : '#d97706',
                  shadowColor: '#d97706',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 10,
                  borderWidth: 2,
                  borderColor: isLoading ? '#9ca3af' : '#b45309',
                }}
                onPress={handlePasswordReset}
                disabled={isLoading}
              >
                <Text style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: isLoading ? '#6b7280' : '#ffffff',
                  letterSpacing: 0.5,
                }}>
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Text>
        </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefce8' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            <BackButton onPress={() => router.push('/(auth)/login')} />

        {/* Header */}
            <Animated.View 
              style={{
                alignItems: 'center',
                paddingTop: 80,
                paddingBottom: 40,
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }}
            >
              <View style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: '#ffffff',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
                shadowColor: '#d97706',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 10,
              }}>
            <Image 
              source={require('../../assets/images/default-monochrome-black.png')}
                  style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </View>
              <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#111827' }}>Forgot Password?</Text>
              <Text style={{ fontSize: 18, textAlign: 'center', color: '#6b7280', paddingHorizontal: 20, lineHeight: 24, fontWeight: '500' }}>
                No worries! Enter your email address and we'll send you a reset code.
          </Text>
            </Animated.View>

        {/* Form */}
            <Animated.View 
              style={{ 
                paddingHorizontal: 20,
                paddingBottom: Math.max(insets.bottom + 40, 60),
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}
            >
          {/* Email Input */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 }}>Email Address</Text>
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderWidth: 2,
                  borderColor: '#f59e0b',
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}>
            <TextInput
                    style={{ fontSize: 16, color: '#111827' }}
              placeholder="Enter your email address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
                </View>
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
                style={{
                  paddingVertical: 18,
                  paddingHorizontal: 32,
                  borderRadius: 20,
                  marginBottom: 24,
                  backgroundColor: isLoading ? '#9ca3af' : '#d97706',
                  shadowColor: '#d97706',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 10,
                  borderWidth: 2,
                  borderColor: isLoading ? '#9ca3af' : '#b45309',
                }}
                onPress={handlePasswordResetRequest}
            disabled={isLoading}
          >
                <Text style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: isLoading ? '#6b7280' : '#ffffff',
                  letterSpacing: 0.5,
                }}>
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
              <View style={{ alignItems: 'center' }}>
            <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}
              onPress={handleBackToLogin}
            >
                  <Text style={{ color: '#6b7280', fontSize: 16 }}>Remember your password? </Text>
                  <Text style={{ color: '#d97706', fontWeight: '600', fontSize: 16 }}>Sign In</Text>
            </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
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
};

export default ForgotPasswordScreen;