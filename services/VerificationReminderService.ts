import { Platform } from 'react-native';
import { EmailService } from './EmailService';
import { NotificationService } from './NotificationService';

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

export class VerificationReminderService {
  static async checkVerificationReminders() {
    try {
      const storage = getStorage();
      const reminderDate = await storage.getItem('verificationReminderDate');
      const reminderSent = await storage.getItem('verificationReminderSent');
      const accountType = await storage.getItem('accountType');
      const verificationStatus = await storage.getItem('verificationStatus');
      
      // Only check if user is an owner and not yet verified
      if (accountType !== 'owner' || verificationStatus === 'verified') {
        return;
      }
      
      if (!reminderDate || reminderSent === 'true') {
        return;
      }
      
      const reminderDateTime = new Date(reminderDate);
      const now = new Date();
      
      // Check if it's time to send the reminder
      if (now >= reminderDateTime) {
        await this.sendVerificationReminder();
        await storage.setItem('verificationReminderSent', 'true');
      }
    } catch (error) {
      console.error('Error checking verification reminders:', error);
    }
  }

  static async sendVerificationReminder() {
    try {
      const storage = getStorage();
      const userEmail = await storage.getItem('userEmail');
      const userName = await storage.getItem('userName');
      
      if (!userEmail || !userName) {
        console.log('No user email or name found for verification reminder');
        return;
      }

      // Send email reminder
      await EmailService.sendVerificationReminderEmail(userEmail, userName);
      
      // Send push notification
      await NotificationService.sendVerificationReminderNotification(userName);
      
      console.log(`Verification reminder sent to ${userEmail} for user ${userName}`);
    } catch (error) {
      console.error('Error sending verification reminder:', error);
    }
  }

  static async scheduleVerificationReminder(userEmail: string, userName: string) {
    try {
      const storage = getStorage();
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 2); // 2 days from now
      
      await storage.setItem('verificationReminderDate', reminderDate.toISOString());
      await storage.setItem('verificationReminderSent', 'false');
      await storage.setItem('userEmail', userEmail);
      await storage.setItem('userName', userName);
      
      console.log(`Verification reminder scheduled for ${reminderDate.toISOString()}`);
    } catch (error) {
      console.error('Error scheduling verification reminder:', error);
    }
  }

  static async clearVerificationReminder() {
    try {
      const storage = getStorage();
      await storage.multiRemove([
        'verificationReminderDate',
        'verificationReminderSent',
        'userEmail',
        'userName'
      ]);
    } catch (error) {
      console.error('Error clearing verification reminder:', error);
    }
  }
}
