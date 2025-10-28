import { Background, Border, PrimaryBrand, PrimaryText, SecondaryText, WhiteBackground } from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { NotificationService } from '@/services/NotificationService';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GoogleNameCollectionScreen = () => {
  const { user } = useUser();
  const { accountType } = useAccount();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Pre-fill name if available from Google
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleContinue = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      NotificationService.showError('Please enter your full name');
      return;
    }

    try {
      setIsLoading(true);

      // Update user profile with name
      if (user) {
        await user.update({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
      }

      NotificationService.showSuccess('Profile updated successfully!');

      // Navigate to account type selection if no account type
      setTimeout(() => {
        if (!accountType) {
          router.replace('/account-type');
        } else if (accountType === 'renter') {
          router.replace('/(renter)');
        } else {
          router.replace('/(owner)');
        }
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      NotificationService.showError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip name collection and go directly to account type or home
    if (!accountType) {
      router.replace('/account-type');
    } else if (accountType === 'renter') {
      router.replace('/(renter)');
    } else {
      router.replace('/(owner)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            We need a bit more information to personalize your experience
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor={SecondaryText}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              placeholderTextColor={SecondaryText}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleContinue}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Saving...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSkip}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
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
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: WhiteBackground,
    borderWidth: 1,
    borderColor: Border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: PrimaryText,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: PrimaryBrand,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: WhiteBackground,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
  },
});

export default GoogleNameCollectionScreen;
