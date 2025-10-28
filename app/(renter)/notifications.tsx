import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    Warning,
    WhiteBackground,
} from '@/constants/Colors';
import { NotificationService } from '@/services/NotificationService';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'reminder' | 'payment' | 'review';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
}

const NotificationsScreen = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Mock notifications for demo
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'booking',
          title: 'Booking Confirmed',
          message: 'Your booking for Canon EOS R5 has been confirmed',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          isRead: false,
        },
        {
          id: '2',
          type: 'message',
          title: 'New Message',
          message: 'Sarah Johnson sent you a message',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          isRead: false,
        },
        {
          id: '3',
          type: 'reminder',
          title: 'Pickup Reminder',
          message: 'Don\'t forget to pick up your rental tomorrow',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          isRead: true,
        },
        {
          id: '4',
          type: 'payment',
          title: 'Payment Successful',
          message: 'Your payment of $45.00 was processed successfully',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          isRead: true,
        },
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    NotificationService.showSuccess('All notifications marked as read');
  };

  const handleNotificationPress = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'booking') {
      router.push('/(renter)/my-bookings');
    } else if (notification.type === 'message') {
      router.push('/(renter)/chat');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return { name: 'calendar-outline', color: PrimaryBrand };
      case 'message':
        return { name: 'chatbubble-outline', color: Success };
      case 'reminder':
        return { name: 'alarm-outline', color: Warning };
      case 'payment':
        return { name: 'card-outline', color: Success };
      case 'review':
        return { name: 'star-outline', color: '#FFD700' };
      default:
        return { name: 'notifications-outline', color: PrimaryBrand };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive,
            ]}
          >
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'unread' && styles.filterButtonTextActive,
            ]}
          >
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={SecondaryText} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              You'll see booking updates and messages here
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => {
            const icon = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadCard,
                ]}
                onPress={() => handleNotificationPress(notification)}
              >
                <View
                  style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}
                >
                  <Ionicons name={icon.name as any} size={24} color={icon.color} />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notification.message}
                  </Text>
                  <Text style={styles.timestamp}>
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  markAllText: {
    fontSize: 14,
    color: PrimaryBrand,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: WhiteBackground,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Background,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: PrimaryBrand,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
  },
  filterButtonTextActive: {
    color: WhiteBackground,
  },
  content: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
    gap: 12,
  },
  unreadCard: {
    backgroundColor: PrimaryBrand + '08',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PrimaryBrand,
  },
  notificationMessage: {
    fontSize: 14,
    color: SecondaryText,
    marginBottom: 4,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: SecondaryText,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: PrimaryText,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: SecondaryText,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default NotificationsScreen;

