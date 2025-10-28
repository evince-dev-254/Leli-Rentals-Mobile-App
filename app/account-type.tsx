import BackButton from '@/components/BackButton';
import LoadingScreen from '@/components/LoadingScreen';
import { SignOutButton } from '@/components/SignOutButton';
import TechLoader from '@/components/TechLoader';
import ToastNotification from '@/components/ToastNotification';
import { useAccount } from '@/contexts/AccountContext';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { useToast } from '@/hooks/useToast';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AccountTypeScreen = () => {
  const { accountType, switchToOwner, switchToRenter } = useAccount();
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { toast, showError, showWarning, showSuccess, hideToast } = useToast();
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const hasNavigatedRef = useRef(false);

  // Confirm user is authenticated before allowing account type selection
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not authenticated, redirecting to login');
      router.replace('/(auth)/login');
    }
  }, [isLoaded, isSignedIn]);

  // Pre-select existing account type but allow user to change it
  useEffect(() => {
    if (isLoaded && isSignedIn && accountType && !selectedType) {
      console.log(`User is already a ${accountType}, pre-selecting account type`);
      setSelectedType(accountType);
    }
  }, [isLoaded, isSignedIn, accountType, selectedType]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <LoadingScreen 
        text="Loading..."
        variant="spinner"
        color="#d97706"
        size={60}
      />
    );
  }

  // Note: Automatic redirects removed - let user manually choose

  const handleContinue = async () => {
    if (hasNavigatedRef.current || isProcessing) {
      console.log('Navigation already in progress, ignoring duplicate call');
      return;
    }

    try {
      console.log('Setting account type:', selectedType);
      setIsProcessing(true);
      hasNavigatedRef.current = true;
      
      if (selectedType === 'renter') {
        // Save account type and navigate to home for renters
        await switchToRenter();
        console.log('Switched to renter, redirecting to renter home...');
        // Navigate directly to renter home
        router.replace('/(renter)');
        
        // Show success notification for renters
        setTimeout(() => {
          const message = accountType === 'renter' 
            ? 'Account type updated! You can continue using renter features.'
            : 'Renter account selected! You can now browse and rent items.';
          
          showSuccess(message, {
            label: 'Got it',
            onPress: () => {
              // Just dismiss the notification
            }
          });
        }, 500);
      } else if (selectedType === 'owner') {
        // Save account type and navigate to owner setup/dashboard
        await switchToOwner();
        console.log('Switched to owner, redirecting to owner dashboard...');
        
        // Navigate directly to owner dashboard
        router.replace('/(owner)');
        
        // Show success notification after navigation
                setTimeout(() => {
                  const message = accountType === 'owner' 
                    ? 'Account type updated! You can continue using owner features.'
                    : 'Owner account selected! You can now access owner features. Remember to verify your identity in your profile.';
                  
                  showSuccess(message, {
                    label: 'Got it',
                    onPress: () => {
                      // Just dismiss the notification
                    }
                  });
                }, 500);
      }
    } catch (error) {
      console.error('Error setting account type:', error);
      showError('Failed to set account type. Please try again.');
      hasNavigatedRef.current = false; // Reset on error
      setIsProcessing(false); // Reset processing state
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefce8' }}>
      <ScrollView style={styles.container}>
      {/* Animated Back Button */}
      <BackButton onPress={() => router.push('/(auth)/login')} />

      <View style={styles.content}>
                <Text style={styles.title}>
                  {accountType ? 'Change Your Account Type' : 'Choose Your Account Type'}
                </Text>
                <Text style={styles.subtitle}>
                  {accountType 
                    ? `You're currently a ${accountType}. You can change your account type below.`
                    : 'Select how you\'d like to use Leli Rentals'
                  }
                </Text>

        {/* Renter Option */}
        <TouchableOpacity 
          style={[
            styles.optionCard,
            selectedType === 'renter' && styles.selectedCard
          ]}
          onPress={() => setSelectedType('renter')}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop' }}
              style={styles.optionImage}
              resizeMode="cover"
            />
            <View style={styles.iconOverlay}>
              <Text style={styles.iconText}>🔍</Text>
            </View>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>I&apos;m a Renter</Text>
            <Text style={styles.optionDescription}>
              Find and rent items for your projects, events, or daily needs
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Browse thousands of items</Text>
              <Text style={styles.featureItem}>• Easy booking process</Text>
              <Text style={styles.featureItem}>• Secure payments</Text>
            </View>
          </View>
          {selectedType === 'renter' && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color="#d97706" />
            </View>
          )}
        </TouchableOpacity>

        {/* Owner Option */}
        <TouchableOpacity 
          style={[
            styles.optionCard,
            selectedType === 'owner' && styles.selectedCard
          ]}
          onPress={() => setSelectedType('owner')}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' }}
              style={styles.optionImage}
              resizeMode="cover"
            />
            <View style={styles.iconOverlay}>
              <Text style={styles.iconText}>💰</Text>
            </View>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>I&apos;m an Owner</Text>
            <Text style={styles.optionDescription}>
              List your items and earn money by renting them out
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• List unlimited items</Text>
              <Text style={styles.featureItem}>• Set your own prices</Text>
              <Text style={styles.featureItem}>• Track earnings</Text>
            </View>
          </View>
          {selectedType === 'owner' && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color="#d97706" />
            </View>
          )}
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedType || isProcessing) && styles.disabledButton,
            { marginBottom: Math.max(insets.bottom + 20, 40) }
          ]}
          onPress={handleContinue}
          disabled={!selectedType || isProcessing}
        >
          {isProcessing ? (
            <View style={styles.loadingContainer}>
              <TechLoader size={16} color="#ffffff" variant="circular" showText={false} />
              <Text style={[styles.continueButtonText, { marginLeft: 8 }]}>
                Setting up...
              </Text>
            </View>
                  ) : (
                    <Text style={[
                      styles.continueButtonText,
                      (!selectedType || isProcessing) && styles.disabledButtonText
                    ]}>
                      {accountType && selectedType === accountType ? 'Continue' : 'Update Account Type'}
                    </Text>
                  )}
        </TouchableOpacity>

        {/* Sign Out Button */}
        <View style={{ marginBottom: Math.max(insets.bottom + 40, 60) }}>
          <SignOutButton />
        </View>
      </View>
    </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefce8',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#d97706',
    shadowColor: '#d97706',
    shadowOpacity: 0.2,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(217, 119, 6, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  optionContent: {
    padding: 20,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  continueButton: {
    backgroundColor: '#d97706',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
});

export default AccountTypeScreen;
