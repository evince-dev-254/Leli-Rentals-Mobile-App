import { clearAllAppData, clearAuthData, clearOnboardingData } from '@/utils/clearAppData';
import { useClerk } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DebugClearDataScreen() {
  const { signOut } = useClerk();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all app data and sign you out. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearing(true);
              
              // Clear all app data
              await clearAllAppData();
              
              // Sign out from Clerk
              await signOut();
              
              // Navigate to onboarding
              router.replace('/onboarding');
              
              Alert.alert('Success', 'All data cleared successfully!');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            } finally {
              setIsClearing(false);
            }
          }
        }
      ]
    );
  };

  const handleClearAuthData = async () => {
    Alert.alert(
      'Clear Auth Data',
      'This will clear authentication data but keep you signed in. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Auth Data',
          onPress: async () => {
            try {
              setIsClearing(true);
              await clearAuthData();
              Alert.alert('Success', 'Authentication data cleared!');
              router.replace('/account-type');
            } catch (error) {
              console.error('Error clearing auth data:', error);
              Alert.alert('Error', 'Failed to clear auth data.');
            } finally {
              setIsClearing(false);
            }
          }
        }
      ]
    );
  };

  const handleClearOnboardingData = async () => {
    Alert.alert(
      'Clear Onboarding Data',
      'This will reset onboarding status. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Onboarding',
          onPress: async () => {
            try {
              setIsClearing(true);
              await clearOnboardingData();
              Alert.alert('Success', 'Onboarding data cleared!');
              router.replace('/onboarding');
            } catch (error) {
              console.error('Error clearing onboarding data:', error);
              Alert.alert('Error', 'Failed to clear onboarding data.');
            } finally {
              setIsClearing(false);
            }
          }
        }
      ]
    );
  };

  const handleSignOutOnly = async () => {
    Alert.alert(
      'Sign Out',
      'This will sign you out but keep app data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              setIsClearing(true);
              await signOut();
              router.replace('/(auth)/login');
              Alert.alert('Success', 'Signed out successfully!');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out.');
            } finally {
              setIsClearing(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🧹 Clear App Data</Text>
        <Text style={styles.subtitle}>
          Use these options to clear different types of app data and start fresh.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearAllData}
            disabled={isClearing}
          >
            <Text style={styles.buttonText}>
              {isClearing ? 'Clearing...' : '🗑️ Clear All Data'}
            </Text>
            <Text style={styles.buttonSubtext}>
              Clears everything and signs you out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={handleClearAuthData}
            disabled={isClearing}
          >
            <Text style={styles.buttonText}>
              {isClearing ? 'Clearing...' : '🔐 Clear Auth Data'}
            </Text>
            <Text style={styles.buttonSubtext}>
              Clears account type and preferences
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.infoButton]}
            onPress={handleClearOnboardingData}
            disabled={isClearing}
          >
            <Text style={styles.buttonText}>
              {isClearing ? 'Clearing...' : '📱 Clear Onboarding'}
            </Text>
            <Text style={styles.buttonSubtext}>
              Resets onboarding status
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSignOutOnly}
            disabled={isClearing}
          >
            <Text style={styles.buttonText}>
              {isClearing ? 'Signing Out...' : '🚪 Sign Out Only'}
            </Text>
            <Text style={styles.buttonSubtext}>
              Signs out but keeps app data
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>ℹ️ What Each Option Does:</Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Clear All Data:</Text> Removes everything and starts completely fresh
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Clear Auth Data:</Text> Removes account type and user preferences
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Clear Onboarding:</Text> Shows onboarding screens again
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Sign Out Only:</Text> Just signs out, keeps app data
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 30,
  },
  button: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  warningButton: {
    backgroundColor: '#f59e0b',
  },
  infoButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
  },
  backButton: {
    backgroundColor: '#e5e7eb',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
