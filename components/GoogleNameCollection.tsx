import TechLoader from '@/components/TechLoader';
import { styles } from '@/constants/AuthStyles';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface GoogleNameCollectionProps {
  onComplete: () => void;
}

export default function GoogleNameCollection({ onComplete }: GoogleNameCollectionProps) {
  const { user } = useUser();
  const { showAlert, AlertComponent } = useCustomAlert();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showAlert('Required Fields', 'Please enter your first and last name.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      
      // Update user profile with names
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      console.log('Google OAuth user profile updated with names');
      onComplete();
    } catch (error) {
      console.error('Error updating user profile:', error);
      showAlert('Error', 'Failed to update profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefce8' }}>
      <View style={[styles.formContainer, { paddingBottom: Math.max(insets.bottom + 40, 60) }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Please provide your first and last name to continue</Text>
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
              autoFocus
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

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.loadingButton]} 
            onPress={handleComplete} 
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <TechLoader size={20} color="#ffffff" variant="circular" showText={false} />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Updating Profile...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
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
