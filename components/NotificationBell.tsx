import { PrimaryBrand, PrimaryText, WhiteBackground } from '@/constants/Colors';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Conditional import for notifications
let Notifications: any = null;
let notificationsSupported = false;

try {
  Notifications = require('expo-notifications');
  // Check if the required methods exist
  if (Notifications && 
      typeof Notifications.addNotificationReceivedListener === 'function' &&
      typeof Notifications.addNotificationResponseReceivedListener === 'function') {
    notificationsSupported = true;
  }
} catch (error) {
  console.log('Notifications not available in development environment');
}

interface NotificationBellProps {
  onPress?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onPress }) => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();

    // Set up notification listeners (only if available and supported)
    if (Notifications && notificationsSupported) {
      let notificationListener: any = null;
      let responseListener: any = null;

      try {
        notificationListener = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification received:', notification);
          setNotificationCount(prev => prev + 1);
          setHasNewNotifications(true);
        });

        responseListener = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('Notification response:', response);
          const data = response.notification.request.content.data;
          
          if (data?.type === 'welcome') {
            Alert.alert('Welcome!', 'Thanks for joining Leli Rentals!');
          } else if (data?.type === 'reminder') {
            Alert.alert('Reminder', 'Don\'t forget to explore our amazing items!');
          } else if (data?.type === 'booking') {
            Alert.alert('Booking Update', `Your booking for ${data.itemName} has been updated.`);
          } else if (data?.type === 'rental') {
            Alert.alert('New Rental!', `${data.renterName} has rented your ${data.itemName}. Check your dashboard for details.`);
          }
        });
      } catch (error) {
        console.log('Error setting up notification listeners:', error);
      }

      return () => {
        // Clean up listeners safely
        try {
          if (notificationListener && typeof notificationListener.remove === 'function') {
            notificationListener.remove();
          }
          if (responseListener && typeof responseListener.remove === 'function') {
            responseListener.remove();
          }
        } catch (error) {
          console.log('Error cleaning up notification listeners:', error);
        }
      };
    }
  }, []);

  const registerForPushNotifications = async () => {
    try {
      // Check if Notifications is available and supported
      if (!Notifications || !notificationsSupported) {
        console.log('Notifications not available or not supported in this environment');
        return;
      }

      // Check if the method exists
      if (typeof Notifications.registerForPushNotificationsAsync === 'function') {
        const token = await Notifications.registerForPushNotificationsAsync();
        if (token) {
          console.log('Push notification token:', token);
          // In a real app, you would send this token to your backend
        }
      } else {
        console.log('Push notifications not supported in this environment');
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
          <Ionicons 
          name="notifications-outline" 
            size={24} 
          color={hasNewNotifications ? PrimaryBrand : PrimaryText} 
          />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Text>
          </View>
        )}
        {hasNewNotifications && notificationCount === 0 && (
          <View style={styles.newIndicator} />
            )}
          </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: WhiteBackground,
  },
  badgeText: {
    color: WhiteBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  newIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: PrimaryBrand,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: WhiteBackground,
  },
});

export default NotificationBell;