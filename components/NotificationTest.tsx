import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NotificationService } from '@/services/NotificationService';

export const NotificationTest: React.FC = () => {
  const testWelcomeNotification = async () => {
    try {
      await NotificationService.sendWelcomeNotification('Test User');
      Alert.alert('Success', 'Welcome notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
      console.error('Notification error:', error);
    }
  };

  const testReminderNotification = async () => {
    try {
      await NotificationService.sendReminderNotification('Test User');
      Alert.alert('Success', 'Reminder notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
      console.error('Notification error:', error);
    }
  };

  const testBookingNotification = async () => {
    try {
      await NotificationService.sendBookingNotification('Test Item');
      Alert.alert('Success', 'Booking notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
      console.error('Notification error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Notifications</Text>
      <Text style={styles.subtitle}>Tap buttons to test different notification types</Text>
      
      <TouchableOpacity style={styles.button} onPress={testWelcomeNotification}>
        <Text style={styles.buttonText}>Test Welcome Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testReminderNotification}>
        <Text style={styles.buttonText}>Test Reminder Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testBookingNotification}>
        <Text style={styles.buttonText}>Test Booking Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NotificationTest;
