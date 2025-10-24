import {
    Background,
    Border,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    WhiteBackground
} from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { EmailService } from '@/services/EmailService';
import { NotificationService } from '@/services/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TestNotificationsScreen = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleWelcomeNotification = async () => {
    setIsLoading(true);
    try {
      await NotificationService.sendWelcomeNotification(user?.displayName || 'Test User');
      Alert.alert('Success', 'Welcome notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReminderNotification = async () => {
    setIsLoading(true);
    try {
      await NotificationService.sendReminderNotification(user?.displayName || 'Test User');
      Alert.alert('Success', 'Reminder notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingNotification = async () => {
    setIsLoading(true);
    try {
      await NotificationService.sendBookingNotification('Professional Camera Kit');
      Alert.alert('Success', 'Booking notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentalNotification = async () => {
    setIsLoading(true);
    try {
      await NotificationService.sendRentalNotification('Professional Camera Kit', 'John Doe');
      Alert.alert('Success', 'Rental notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeEmail = async () => {
    setIsLoading(true);
    try {
      const success = await EmailService.sendWelcomeEmail(
        user?.email || 'test@example.com',
        user?.displayName || 'Test User'
      );
      if (success) {
        Alert.alert('Success', 'Welcome email sent!');
      } else {
        Alert.alert('Error', 'Failed to send email');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReminderEmail = async () => {
    setIsLoading(true);
    try {
      const success = await EmailService.sendReminderEmail(
        user?.email || 'test@example.com',
        user?.displayName || 'Test User'
      );
      if (success) {
        Alert.alert('Success', 'Reminder email sent!');
      } else {
        Alert.alert('Error', 'Failed to send email');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingEmail = async () => {
    setIsLoading(true);
    try {
      const success = await EmailService.sendBookingConfirmationEmail(
        user?.email || 'test@example.com',
        user?.displayName || 'Test User',
        'Professional Camera Kit',
        { id: '12345', duration: '3 days', total: '75.00' }
      );
      if (success) {
        Alert.alert('Success', 'Booking confirmation email sent!');
      } else {
        Alert.alert('Error', 'Failed to send email');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={PrimaryBrand} />
        </TouchableOpacity>
        <Text style={styles.title}>Test Notifications</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleWelcomeNotification}
          disabled={isLoading}
        >
          <Ionicons name="notifications" size={20} color={WhiteBackground} />
          <Text style={styles.buttonText}>Send Welcome Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleReminderNotification}
          disabled={isLoading}
        >
          <Ionicons name="time" size={20} color={WhiteBackground} />
          <Text style={styles.buttonText}>Send Reminder Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleBookingNotification}
          disabled={isLoading}
        >
          <Ionicons name="checkmark-circle" size={20} color={WhiteBackground} />
          <Text style={styles.buttonText}>Send Booking Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleRentalNotification}
          disabled={isLoading}
        >
          <Ionicons name="home" size={20} color={WhiteBackground} />
          <Text style={styles.buttonText}>Send Rental Notification</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Email Notifications</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.emailButton, isLoading && styles.buttonDisabled]} 
          onPress={handleWelcomeEmail}
          disabled={isLoading}
        >
          <Ionicons name="mail" size={20} color={PrimaryBrand} />
          <Text style={[styles.buttonText, styles.emailButtonText]}>Send Welcome Email</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.emailButton, isLoading && styles.buttonDisabled]} 
          onPress={handleReminderEmail}
          disabled={isLoading}
        >
          <Ionicons name="mail" size={20} color={PrimaryBrand} />
          <Text style={[styles.buttonText, styles.emailButtonText]}>Send Reminder Email</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.emailButton, isLoading && styles.buttonDisabled]} 
          onPress={handleBookingEmail}
          disabled={isLoading}
        >
          <Ionicons name="mail" size={20} color={PrimaryBrand} />
          <Text style={[styles.buttonText, styles.emailButtonText]}>Send Booking Email</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={PrimaryBrand} />
          <Text style={styles.infoText}>
            This screen is for testing the notification and email system. 
            In production, these would be triggered automatically based on user actions.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginTop: 20,
    marginBottom: 15,
  },
  button: {
    backgroundColor: PrimaryBrand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: PrimaryBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emailButton: {
    backgroundColor: WhiteBackground,
    borderWidth: 2,
    borderColor: PrimaryBrand,
  },
  buttonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emailButtonText: {
    color: PrimaryBrand,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: WhiteBackground,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Border,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 20,
  },
});

export default TestNotificationsScreen;
