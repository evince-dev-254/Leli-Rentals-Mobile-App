import { Platform } from 'react-native';
import { EmailService } from './EmailService';

// Platform-specific storage
const getStorage = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
      getAllKeys: () => Promise.resolve(Object.keys(localStorage)),
      multiRemove: (keys: string[]) => Promise.resolve(keys.forEach(key => localStorage.removeItem(key)))
    };
  } else {
    // Use AsyncStorage for mobile
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage;
  }
};

export class ReminderService {
  static async checkAndSendReminders() {
    try {
      const storage = getStorage();
      // Get all scheduled reminders
      const keys = await storage.getAllKeys();
      const reminderKeys = keys.filter(key => key.startsWith('reminder_scheduled_'));
      
      for (const key of reminderKeys) {
        const userId = key.replace('reminder_scheduled_', '');
        const scheduledTime = await storage.getItem(key);
        const userEmail = await storage.getItem(`reminder_email_${userId}`);
        const userName = await storage.getItem(`reminder_name_${userId}`);
        
        if (scheduledTime && userEmail && userName) {
          const scheduledDate = new Date(scheduledTime);
          const now = new Date();
          
          // Check if it's time to send the reminder
          if (now >= scheduledDate) {
            console.log(`Sending reminder email to ${userEmail} for user ${userName}`);
            
            // Send reminder email
            const success = await EmailService.sendReminderEmail(userEmail, userName);
            
            if (success) {
              // Send reminder notification
              const { NotificationService } = await import('./NotificationService');
              await NotificationService.sendReminderNotification(userName);
              
              // Clean up the scheduled reminder
              await storage.multiRemove([
                key,
                `reminder_email_${userId}`,
                `reminder_name_${userId}`
              ]);
              
              console.log(`Reminder sent successfully to ${userEmail}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking and sending reminders:', error);
    }
  }

  static async schedulePeriodicReminders(userId: string, userEmail: string, userName: string) {
    try {
      const storage = getStorage();
      // Schedule multiple reminders at different intervals
      const reminders = [
        { days: 1, label: '1 day' },
        { days: 3, label: '3 days' },
        { days: 7, label: '1 week' },
        { days: 14, label: '2 weeks' }
      ];

      for (const reminder of reminders) {
        const reminderTime = new Date();
        reminderTime.setDate(reminderTime.getDate() + reminder.days);
        
        await storage.setItem(
          `reminder_${reminder.days}_${userId}`, 
          reminderTime.toISOString()
        );
        await storage.setItem(`reminder_email_${reminder.days}_${userId}`, userEmail);
        await storage.setItem(`reminder_name_${reminder.days}_${userId}`, userName);
        
        console.log(`Reminder scheduled for ${reminder.label} at ${reminderTime.toISOString()}`);
      }
    } catch (error) {
      console.error('Error scheduling periodic reminders:', error);
    }
  }

  static async checkPeriodicReminders() {
    try {
      const storage = getStorage();
      const keys = await storage.getAllKeys();
      const reminderKeys = keys.filter(key => key.startsWith('reminder_') && key.includes('_') && !key.includes('email_') && !key.includes('name_'));
      
      for (const key of reminderKeys) {
        const parts = key.split('_');
        if (parts.length >= 3) {
          const days = parts[1];
          const userId = parts.slice(2).join('_');
          const scheduledTime = await storage.getItem(key);
          const userEmail = await storage.getItem(`reminder_email_${days}_${userId}`);
          const userName = await storage.getItem(`reminder_name_${days}_${userId}`);
          
          if (scheduledTime && userEmail && userName) {
            const scheduledDate = new Date(scheduledTime);
            const now = new Date();
            
            if (now >= scheduledDate) {
              console.log(`Sending ${days}-day reminder to ${userEmail}`);
              
              const success = await EmailService.sendReminderEmail(userEmail, userName);
              
              if (success) {
                // Clean up this specific reminder
                await storage.multiRemove([
                  key,
                  `reminder_email_${days}_${userId}`,
                  `reminder_name_${days}_${userId}`
                ]);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking periodic reminders:', error);
    }
  }
}
