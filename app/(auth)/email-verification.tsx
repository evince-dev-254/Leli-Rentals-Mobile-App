import BackButton from '@/components/BackButton';
import TechLoader from '@/components/TechLoader';
import { styles } from '@/constants/AuthStyles';
import { useAccount } from '@/contexts/AccountContext';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { accountType, loading: accountLoading } = useAccount();
  const { showAlert, AlertComponent } = useCustomAlert();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const onVerifyPress = async () => {
    if (!isLoaded || isVerifying) return;

    if (!code.trim()) {
      showAlert('Verification Code Required', 'Please enter the verification code sent to your email.', 'warning');
      return;
    }

    try {
      setIsVerifying(true);
      console.log('Attempting email verification with code:', code);

      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      console.log('Verification attempt result:', signUpAttempt);

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        console.log('Email verification successful, setting active session...');
        await setActive({ session: signUpAttempt.createdSessionId });
        
        // Wait a moment for account context to load
        setTimeout(() => {
          console.log('Checking account type after verification...');
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
        }, 1000);
        
        showAlert('Success!', 'Your email has been verified. Welcome to Leli Rentals!', 'success');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error('Verification incomplete:', JSON.stringify(signUpAttempt, null, 2));
        showAlert('Verification Incomplete', 'Please check your verification code and try again.', 'error');
      }
    } catch (err: any) {
      console.error('Email verification error:', JSON.stringify(err, null, 2));
      
      // Handle specific Clerk errors
      if (err?.clerkError) {
        const errorCode = err.errors?.[0]?.code;
        const errorMessage = err.errors?.[0]?.message;
        
        if (errorCode === 'form_code_incorrect') {
          showAlert('Invalid Code', 'The verification code you entered is incorrect. Please check and try again.', 'error');
        } else if (errorCode === 'form_code_expired') {
          showAlert('Code Expired', 'The verification code has expired. Please request a new one.', 'warning');
        } else if (errorCode === 'too_many_requests') {
          showAlert('Too Many Attempts', 'You have made too many verification attempts. Please wait a moment before trying again.', 'warning');
        } else if (errorCode === 'already_verified' || errorMessage?.includes('already verified')) {
          // Handle already verified error - check account type
          showAlert('Already Verified', 'Your email is already verified. Redirecting...', 'success', {
            onConfirm: () => {
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
            }
          });
        } else {
          showAlert('Verification Failed', errorMessage || 'Please try again.', 'error');
        }
      } else {
        showAlert('Verification Failed', 'An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefce8' }}>
      {/* Back Button */}
      <BackButton onPress={() => router.back()} />

      <View style={[styles.formContainer, { paddingBottom: Math.max(insets.bottom + 40, 60) }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>Enter the verification code sent to your email</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your verification code"
              value={code}
              onChangeText={(text) => setCode(text)}
              autoCapitalize="none"
              keyboardType="number-pad"
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, isVerifying && styles.loadingButton]} 
            onPress={onVerifyPress} 
            activeOpacity={0.8}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <View style={styles.loadingContainer}>
                <TechLoader size={20} color="#ffffff" variant="circular" showText={false} />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Verifying...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Verify Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textButton}
            onPress={async () => {
              if (!signUp) return;
              try {
                await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                showAlert('Code Resent', 'A new verification code has been sent to your email.', 'success');
              } catch (err) {
                console.error('Error resending code:', err);
                showAlert('Error', 'Failed to resend code. Please try again.', 'error');
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.textButtonText}>Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.textButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AlertComponent />
    </SafeAreaView>
  );
}
