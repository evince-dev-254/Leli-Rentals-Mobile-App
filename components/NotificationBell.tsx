import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  PrimaryBrand,
  Background,
  WhiteBackground,
  PrimaryText,
  SecondaryText,
  Border,
  Success,
  Error,
  Warning,
  VibrantPurple,
  VibrantPink,
  VibrantGreen,
  VibrantOrange,
  VibrantRed
} from '@/constants/Colors';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'review' | 'system';
  time: string;
  isRead: boolean;
}

const NotificationBell: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Booking!',
      message: 'Sarah Johnson booked your Professional Camera Kit for 3 days',
      type: 'booking',
      time: '2 minutes ago',
      isRead: false,
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'KES 7,500 received from Mike Chen for Power Drill rental',
      type: 'payment',
      time: '1 hour ago',
      isRead: false,
    },
    {
      id: '3',
      title: 'New Review',
      message: 'You received a 5-star review from Emily Rodriguez',
      type: 'review',
      time: '3 hours ago',
      isRead: true,
    },
    {
      id: '4',
      title: 'System Update',
      message: 'New features available! Check out the latest updates.',
      type: 'system',
      time: '1 day ago',
      isRead: true,
    },
  ]);

  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotationAnim] = useState(new Animated.Value(0));

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    // Pulse animation for unread notifications
    if (unreadCount > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Rotation animation
      const rotationAnimation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      rotationAnimation.start();
    }
  }, [unreadCount]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return 'calendar';
      case 'payment': return 'cash';
      case 'review': return 'star';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking': return VibrantGreen;
      case 'payment': return VibrantOrange;
      case 'review': return VibrantPurple;
      case 'system': return PrimaryBrand;
      default: return SecondaryText;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <TouchableOpacity
        style={styles.bellContainer}
        onPress={() => setShowNotifications(true)}
      >
        <Animated.View
          style={[
            styles.bellIcon,
            {
              transform: [
                { scale: pulseAnim },
                { rotate: rotateInterpolate }
              ]
            }
          ]}
        >
          <Ionicons 
            name="notifications" 
            size={24} 
            color={unreadCount > 0 ? VibrantOrange : PrimaryBrand} 
          />
        </Animated.View>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <View style={styles.headerActions}>
                {unreadCount > 0 && (
                  <TouchableOpacity 
                    style={styles.markAllButton}
                    onPress={markAllAsRead}
                  >
                    <Text style={styles.markAllText}>Mark All Read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                  <Ionicons name="close" size={24} color={SecondaryText} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.notificationsList}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.isRead && styles.unreadNotification
                    ]}
                    onPress={() => markAsRead(notification.id)}
                  >
                    <View style={styles.notificationIcon}>
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {notification.time}
                      </Text>
                    </View>
                    {!notification.isRead && (
                      <View style={styles.unreadDot} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="notifications-off" size={48} color={SecondaryText} />
                  <Text style={styles.emptyTitle}>No Notifications</Text>
                  <Text style={styles.emptySubtitle}>
                    You're all caught up! New notifications will appear here.
                  </Text>
                </View>
              )}
            </ScrollView>

            {notifications.length > 0 && (
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={clearAllNotifications}
                >
                  <Ionicons name="trash" size={16} color={Error} />
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bellContainer: {
    position: 'relative',
    padding: 8,
  },
  bellIcon: {
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: VibrantRed,
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
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: WhiteBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  markAllButton: {
    backgroundColor: PrimaryBrand + '20',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllText: {
    color: PrimaryBrand,
    fontSize: 12,
    fontWeight: '600',
  },
  notificationsList: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  unreadNotification: {
    backgroundColor: PrimaryBrand + '05',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: SecondaryText,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: VibrantOrange,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: SecondaryText,
    textAlign: 'center',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Border,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  clearButtonText: {
    color: Error,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationBell;
