import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Simplified storage - use in-memory storage for mobile
const getStorage = () => {
  // Use in-memory storage for mobile to avoid AsyncStorage issues
  const memoryStorage: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => Promise.resolve(memoryStorage[key] || null),
    setItem: (key: string, value: string) => {
      memoryStorage[key] = value;
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      delete memoryStorage[key];
      return Promise.resolve();
    }
  };
};

// Conditional imports to handle development environment
let Device: any = null;
let Notifications: any = null;

try {
  Device = require('expo-device');
  Notifications = require('expo-notifications');
} catch (error) {
  console.log('Native modules not available in development environment');
}

// Configure notification behavior (only if available)
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export class NotificationService {
  static async registerForPushNotificationsAsync() {
    // Return early if native modules aren't available
    if (!Device || !Notifications) {
      console.log('Native modules not available, skipping push notification registration');
      return null;
    }

    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Leli Rentals Notifications',
        description: 'Notifications for rental updates, bookings, and reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
        showBadge: true,
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  static async sendWelcomeNotification(userName: string) {
    if (!Notifications) {
      console.log('Notifications not available, simulating welcome notification');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 Welcome to Leli Rentals!",
        body: `Hi ${userName}! Welcome to the best rental platform. Start exploring amazing items to rent!`,
        data: { type: 'welcome', userId: 'user123' },
        sound: 'default',
      },
      trigger: { seconds: 2 },
    });
  }

  static async sendReminderNotification(userName: string) {
    if (!Notifications) {
      console.log('Notifications not available, simulating reminder notification');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🛍️ Don't miss out!",
        body: `Hi ${userName}! Discover amazing items waiting for you. Start your rental journey today!`,
        data: { type: 'reminder', userId: 'user123' },
        sound: 'default',
      },
      trigger: { seconds: 10 }, // 10 seconds for demo, change to hours/days in production
    });
  }

  static async sendBookingNotification(itemName: string) {
    if (!Notifications) {
      console.log('Notifications not available, simulating booking notification');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✅ Booking Confirmed!",
        body: `Your booking for ${itemName} has been confirmed. Check your bookings for details.`,
        data: { type: 'booking', itemName },
        sound: 'default',
      },
      trigger: { seconds: 1 },
    });
  }

  static async sendRentalNotification(itemName: string, renterName: string) {
    if (!Notifications) {
      console.log('Notifications not available, simulating rental notification');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 New Rental!",
        body: `${renterName} has rented your ${itemName}. Check your dashboard for details.`,
        data: { type: 'rental', itemName, renterName },
        sound: 'default',
      },
      trigger: { seconds: 1 },
    });
  }

  static async sendReminderEmail(userEmail: string, userName: string) {
    // This would typically call your backend API
    console.log(`Sending reminder email to ${userEmail} for user ${userName}`);
    // In a real app, you'd make an API call to your backend
    return true;
  }

  static async sendVerificationReminderNotification(userName: string) {
    if (!Notifications) {
      console.log('Notifications not available, simulating verification reminder notification');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Verification Required",
        body: `Hi ${userName}! Complete your owner ID verification within 2 days to maintain your owner status.`,
        data: { type: 'verification_reminder', userName },
        sound: 'default',
      },
      trigger: { seconds: 1 },
    });
  }

  static async sendWelcomeEmail(userEmail: string, userName: string) {
    // This would typically call your backend API
    console.log(`Sending welcome email to ${userEmail} for user ${userName}`);
    // In a real app, you'd make an API call to your backend
    return true;
  }

  static async checkFirstTimeUser(userId: string): Promise<boolean> {
    try {
      const hasSeenWelcome = await AsyncStorage.getItem(`welcome_shown_${userId}`);
      return hasSeenWelcome === null;
    } catch (error) {
      console.error('Error checking first time user:', error);
      return false;
    }
  }

  static async markWelcomeShown(userId: string) {
    try {
      await AsyncStorage.setItem(`welcome_shown_${userId}`, 'true');
    } catch (error) {
      console.error('Error marking welcome as shown:', error);
    }
  }

  static async scheduleReminderEmail(userId: string, userEmail: string, userName: string) {
    try {
      // Schedule reminder for 24 hours later (in production, you might want longer)
      const reminderTime = new Date();
      reminderTime.setHours(reminderTime.getHours() + 24);
      
      await AsyncStorage.setItem(`reminder_scheduled_${userId}`, reminderTime.toISOString());
      await AsyncStorage.setItem(`reminder_email_${userId}`, userEmail);
      await AsyncStorage.setItem(`reminder_name_${userId}`, userName);
      
      console.log(`Reminder email scheduled for ${reminderTime.toISOString()}`);
    } catch (error) {
      console.error('Error scheduling reminder email:', error);
    }
  }
}
