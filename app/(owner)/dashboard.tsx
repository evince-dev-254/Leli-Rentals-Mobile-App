import {
    Background,
    Border,
    Error,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    WhiteBackground
} from '@/constants/Colors';
import { BookingService } from '@/services/BookingService';
import { NotificationService } from '@/services/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DashboardBooking {
  id: string;
  renterId: string;
  renterName: string;
  renterAvatar: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
}

interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'system';
}

const OwnerDashboardScreen = () => {
  const [pendingBookings, setPendingBookings] = useState<DashboardBooking[]>([]);
  const [activeRentals, setActiveRentals] = useState<DashboardBooking[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // In a real app, fetch from backend
      const mockPending: DashboardBooking[] = [
        {
          id: 'b1',
          renterId: 'u2',
          renterName: 'John Doe',
          renterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
          listingId: 'l1',
          listingTitle: 'Canon EOS R5 Camera Kit',
          listingImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
          startDate: '2024-02-10',
          endDate: '2024-02-12',
          totalDays: 3,
          totalAmount: 7500,
          status: 'pending',
        },
      ];
      const mockActive: DashboardBooking[] = [
        {
          id: 'b2',
          renterId: 'u3',
          renterName: 'Emily Rodriguez',
          renterAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
          listingId: 'l2',
          listingTitle: 'DJ Controller - Pioneer DDJ-1000',
          listingImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop',
          startDate: '2024-01-28',
          endDate: '2024-01-30',
          totalDays: 3,
          totalAmount: 4500,
          status: 'active',
        },
      ];
      const mockNotifications: DashboardNotification[] = [
        {
          id: 'n1',
          title: 'New Booking Request',
          message: 'John Doe requested Canon EOS R5 Camera Kit',
          createdAt: new Date().toISOString(),
          type: 'booking_request',
        },
        {
          id: 'n2',
          title: 'Payout Incoming',
          message: 'KES 4,500 payout is being processed',
          createdAt: new Date(Date.now() - 3600_000).toISOString(),
          type: 'system',
        },
      ];

      setPendingBookings(mockPending);
      setActiveRentals(mockActive);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      NotificationService.getInstance().showError('Load Failed', 'Unable to load dashboard data.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const approveBooking = (booking: DashboardBooking) => {
    Alert.alert(
      'Approve Booking',
      `Approve booking request for "${booking.listingTitle}" by ${booking.renterName}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Approve',
          onPress: async () => {
            setIsLoadingAction(true);
            try {
              await BookingService.updateBookingStatus(booking.id, 'confirmed', 'current-owner-id');
              NotificationService.getInstance().showSuccess('Booking Approved', 'The renter has been notified.');
              await loadData();
            } catch (e) {
              NotificationService.getInstance().showError('Action Failed', 'Could not approve booking.');
            } finally {
              setIsLoadingAction(false);
            }
          },
        },
      ]
    );
  };

  const declineBooking = (booking: DashboardBooking) => {
    Alert.alert(
      'Decline Booking',
      `Decline booking request for "${booking.listingTitle}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Decline',
          style: 'destructive',
          onPress: async () => {
            setIsLoadingAction(true);
            try {
              await BookingService.updateBookingStatus(booking.id, 'cancelled', 'current-owner-id');
              NotificationService.getInstance().showSuccess('Booking Declined', 'The renter has been notified.');
              await loadData();
            } catch (e) {
              NotificationService.getInstance().showError('Action Failed', 'Could not decline booking.');
            } finally {
              setIsLoadingAction(false);
            }
          },
        },
      ]
    );
  };

  const markActiveAsCompleted = (booking: DashboardBooking) => {
    Alert.alert(
      'Complete Rental',
      `Mark rental for "${booking.listingTitle}" as completed?`,
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            setIsLoadingAction(true);
            try {
              await BookingService.markBookingAsCompleted(booking.id);
              NotificationService.getInstance().showSuccess('Rental Completed', 'Nice! Rental marked as completed.');
              await loadData();
            } catch (e) {
              NotificationService.getInstance().showError('Action Failed', 'Could not complete rental.');
            } finally {
              setIsLoadingAction(false);
            }
          },
        },
      ]
    );
  };

  const contactRenter = (booking: DashboardBooking) => {
    router.push({
      pathname: '/(owner)/contact-owner',
      params: { renterId: booking.renterId, bookingId: booking.id },
    });
  };

  const viewListing = (booking: DashboardBooking) => {
    router.push(`/(renter)/listing-detail?id=${booking.listingId}`);
  };

  const renderBookingCard = (booking: DashboardBooking, kind: 'pending' | 'active') => {
    return (
      <View key={booking.id} style={styles.bookingCard}>
        <Image source={{ uri: booking.listingImage }} style={styles.bookingImage} />
        <View style={styles.bookingContent}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle} numberOfLines={2}>{booking.listingTitle}</Text>
            <TouchableOpacity onPress={() => viewListing(booking)} style={styles.viewLink}>
              <Text style={styles.viewLinkText}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.renterRow}>
            <Image source={{ uri: booking.renterAvatar }} style={styles.renterAvatar} />
            <Text style={styles.renterName}>{booking.renterName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={14} color={SecondaryText} />
            <Text style={styles.detailText}>{booking.startDate} - {booking.endDate}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.detailText}>{booking.totalDays} days</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.amountText}>KES {booking.totalAmount.toLocaleString()}</Text>
          </View>

          {kind === 'pending' ? (
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.declineButton]} 
                onPress={() => declineBooking(booking)}
                disabled={isLoadingAction}
              >
                <Ionicons name="close-circle" size={18} color={Error} />
                <Text style={[styles.actionText, { color: Error }]}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.approveButton]} 
                onPress={() => approveBooking(booking)}
                disabled={isLoadingAction}
              >
                <Ionicons name="checkmark-circle" size={18} color={'white'} />
                <Text style={[styles.actionText, { color: 'white' }]}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.contactButton]} 
                onPress={() => contactRenter(booking)}
              >
                <Ionicons name="chatbubble" size={18} color={PrimaryBrand} />
                <Text style={[styles.actionText, { color: PrimaryBrand }]}>Contact</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.contactButton]} 
                onPress={() => contactRenter(booking)}
              >
                <Ionicons name="chatbubble" size={18} color={PrimaryBrand} />
                <Text style={[styles.actionText, { color: PrimaryBrand }]}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]} 
                onPress={() => markActiveAsCompleted(booking)}
                disabled={isLoadingAction}
              >
                <Ionicons name="checkmark-done" size={18} color={'white'} />
                <Text style={[styles.actionText, { color: 'white' }]}>Mark Completed</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderNotification = (n: DashboardNotification) => {
    const icon =
      n.type === 'booking_request' ? 'notifications' :
      n.type === 'booking_confirmed' ? 'checkmark-circle' :
      n.type === 'booking_cancelled' ? 'close-circle' : 'information-circle';
    const color =
      n.type === 'booking_request' ? PrimaryBrand :
      n.type === 'booking_confirmed' ? Success :
      n.type === 'booking_cancelled' ? Error : SecondaryText;

    return (
      <View key={n.id} style={styles.notificationItem}>
        <Ionicons name={icon as any} size={20} color={color} />
        <View style={styles.notificationTextWrap}>
          <Text style={styles.notificationTitle}>{n.title}</Text>
          <Text style={styles.notificationMessage}>{n.message}</Text>
        </View>
        <Text style={styles.notificationTime}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Owner Dashboard</Text>
        <TouchableOpacity 
          style={styles.headerAction}
          onPress={() => router.push('/(owner)/index')}
        >
          <Ionicons name="home" size={22} color={PrimaryBrand} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickActionCard, styles.primaryCard]} onPress={() => router.push('/(owner)/create-listing')}>
            <Ionicons name="add-circle" size={22} color={'white'} />
            <Text style={styles.quickActionTextPrimary}>New Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/(owner)/listings')}>
            <Ionicons name="albums" size={22} color={PrimaryBrand} />
            <Text style={styles.quickActionText}>My Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/(owner)/payouts')}>
            <Ionicons name="wallet" size={22} color={PrimaryBrand} />
            <Text style={styles.quickActionText}>Payouts</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Bookings</Text>
            <Text style={styles.sectionCount}>{pendingBookings.length}</Text>
          </View>
          {pendingBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="time" size={32} color={SecondaryText} />
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          ) : (
            pendingBookings.map(b => renderBookingCard(b, 'pending'))
          )}
        </View>

        {/* Active Rentals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Rentals</Text>
            <Text style={styles.sectionCount}>{activeRentals.length}</Text>
          </View>
          {activeRentals.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="bicycle" size={32} color={SecondaryText} />
              <Text style={styles.emptyText}>No active rentals</Text>
            </View>
          ) : (
            activeRentals.map(b => renderBookingCard(b, 'active'))
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Text style={styles.sectionCount}>{notifications.length}</Text>
          </View>
          {notifications.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="notifications-off" size={32} color={SecondaryText} />
              <Text style={styles.emptyText}>You're all caught up</Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map(renderNotification)}
            </View>
          )}
        </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  headerAction: {
    padding: 8,
  },
  scroll: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Border,
    alignItems: 'center',
    gap: 8,
  },
  primaryCard: {
    backgroundColor: PrimaryBrand,
    borderColor: PrimaryBrand,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: PrimaryBrand,
  },
  quickActionTextPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: SecondaryText,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  bookingImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingContent: {
    flex: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginRight: 8,
  },
  viewLink: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewLinkText: {
    color: PrimaryBrand,
    fontSize: 12,
    fontWeight: '700',
  },
  renterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  renterAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  renterName: {
    fontSize: 12,
    color: SecondaryText,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: SecondaryText,
  },
  dot: {
    color: SecondaryText,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
    color: PrimaryText,
    marginLeft: 'auto',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  declineButton: {
    borderColor: Error,
    backgroundColor: Error + '10',
  },
  approveButton: {
    borderColor: PrimaryBrand,
    backgroundColor: PrimaryBrand,
  },
  contactButton: {
    borderColor: PrimaryBrand,
    backgroundColor: 'transparent',
  },
  completeButton: {
    borderColor: Success,
    backgroundColor: Success,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: PrimaryBrand,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: Border,
    borderRadius: 12,
    backgroundColor: WhiteBackground,
  },
  emptyText: {
    marginTop: 8,
    color: SecondaryText,
    fontSize: 12,
  },
  notificationsList: {
    backgroundColor: WhiteBackground,
    borderWidth: 1,
    borderColor: Border,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationTextWrap: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: PrimaryText,
  },
  notificationMessage: {
    fontSize: 12,
    color: SecondaryText,
  },
  notificationTime: {
    fontSize: 10,
    color: SecondaryText,
  },
});

export default OwnerDashboardScreen;
