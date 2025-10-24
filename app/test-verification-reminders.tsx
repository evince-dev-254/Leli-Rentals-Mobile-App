import { useAccount } from '@/contexts/AccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { VerificationReminderService } from '@/services/VerificationReminderService';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Platform-specific storage
const getStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
    };
  } else {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage;
  }
};

export default function TestVerificationReminders() {
  const { accountType, verificationStatus } = useAccount();
  const { user } = useAuth();
  const [reminderData, setReminderData] = useState<any>(null);

  useEffect(() => {
    loadReminderData();
  }, []);

  const loadReminderData = async () => {
    try {
      const storage = getStorage();
      const reminderDate = await storage.getItem('verificationReminderDate');
      const reminderSent = await storage.getItem('verificationReminderSent');
      const accountCreated = await storage.getItem('ownerAccountCreated');
      
      setReminderData({
        reminderDate,
        reminderSent,
        accountCreated,
        isOwner: accountType === 'owner',
        verificationStatus
      });
    } catch (error) {
      console.error('Error loading reminder data:', error);
    }
  };

  const testScheduleReminder = async () => {
    try {
      await VerificationReminderService.scheduleVerificationReminder(
        user?.email || 'test@example.com',
        user?.displayName || 'Test User'
      );
      Alert.alert('Success', 'Verification reminder scheduled for 2 days from now');
      loadReminderData();
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule reminder');
      console.error('Error scheduling reminder:', error);
    }
  };

  const testSendReminder = async () => {
    try {
      await VerificationReminderService.sendVerificationReminder();
      Alert.alert('Success', 'Verification reminder sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reminder');
      console.error('Error sending reminder:', error);
    }
  };

  const testCheckReminders = async () => {
    try {
      await VerificationReminderService.checkVerificationReminders();
      Alert.alert('Success', 'Checked verification reminders');
      loadReminderData();
    } catch (error) {
      Alert.alert('Error', 'Failed to check reminders');
      console.error('Error checking reminders:', error);
    }
  };

  const clearReminderData = async () => {
    try {
      await VerificationReminderService.clearVerificationReminder();
      Alert.alert('Success', 'Reminder data cleared');
      loadReminderData();
    } catch (error) {
      Alert.alert('Error', 'Failed to clear reminder data');
      console.error('Error clearing reminder data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verification Reminder Test</Text>
        <Text style={styles.subtitle}>Test the 2-day verification reminder system</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Status:</Text>
        <Text style={styles.statusText}>Account Type: {accountType}</Text>
        <Text style={styles.statusText}>Verification: {verificationStatus}</Text>
        <Text style={styles.statusText}>User: {user?.email || 'Not logged in'}</Text>
      </View>

      {reminderData && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Reminder Data:</Text>
          <Text style={styles.dataText}>Reminder Date: {reminderData.reminderDate || 'Not set'}</Text>
          <Text style={styles.dataText}>Reminder Sent: {reminderData.reminderSent || 'Not set'}</Text>
          <Text style={styles.dataText}>Account Created: {reminderData.accountCreated || 'Not set'}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testScheduleReminder}>
          <Text style={styles.buttonText}>Schedule Reminder (2 days)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testSendReminder}>
          <Text style={styles.buttonText}>Send Reminder Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testCheckReminders}>
          <Text style={styles.buttonText}>Check Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearReminderData}>
          <Text style={styles.buttonText}>Clear Reminder Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How the System Works:</Text>
        <Text style={styles.infoText}>1. When switching to owner, a 2-day reminder is scheduled</Text>
        <Text style={styles.infoText}>2. Reminder emails and notifications are sent after 2 days</Text>
        <Text style={styles.infoText}>3. Users must complete ID verification to maintain owner status</Text>
        <Text style={styles.infoText}>4. System checks reminders every hour automatically</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  dataContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    backgroundColor: '#d97706',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
});
