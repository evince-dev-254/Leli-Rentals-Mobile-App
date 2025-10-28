import {
    Background,
    Border,
    Error,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    Warning,
    WhiteBackground,
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

interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  ownerName: string;
  ownerAvatar: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed' | 'active' | 'completed'>('all');

  const filters = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'pending', label: 'Pending', count: 0 },
    { id: 'confirmed', label: 'Confirmed', count: 0 },
    { id: 'active', label: 'Active', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
  ];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      // In real app, fetch from API
      const mockBookings: Booking[] = [
        {
          id: '1',
          listingId: 'listing1',
          listingTitle: 'Professional Camera Kit - Canon EOS R5',
          listingImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
          ownerName: 'Sarah Johnson',
          ownerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
          startDate: '2024-01-15',
          endDate: '2024-01-17',
          totalDays: 3,
          totalAmount: 7500,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: '2024-01-10T10:00:00Z',
        },
        {
          id: '2',
          listingId: 'listing2',
          listingTitle: 'DJ Controller - Pioneer DDJ-1000',
          listingImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop',
          ownerName: 'Mike Chen',
          ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          totalDays: 3,
          totalAmount: 4500,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: '2024-01-18T14:30:00Z',
        },
        {
          id: '3',
          listingId: 'listing3',
          listingTitle: 'Tesla Model 3 - Electric Vehicle',
          listingImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
          ownerName: 'Emily Rodriguez',
          ownerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
          startDate: '2024-01-05',
          endDate: '2024-01-07',
          totalDays: 3,
          totalAmount: 15000,
          status: 'completed',
          paymentStatus: 'paid',
          createdAt: '2024-01-01T09:15:00Z',
        },
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      NotificationService.getInstance().showError(
        'Loading Failed',
        'Unable to load your bookings. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const getStatusInfo = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Pending Approval',
          color: Warning,
          icon: 'time',
        };
      case 'confirmed':
        return {
          text: 'Confirmed',
          color: Success,
          icon: 'checkmark-circle',
        };
      case 'active':
        return {
          text: 'Active',
          color: PrimaryBrand,
          icon: 'play-circle',
        };
      case 'completed':
        return {
          text: 'Completed',
          color: SecondaryText,
          icon: 'checkmark-done',
        };
      case 'cancelled':
        return {
          text: 'Cancelled',
          color: Error,
          icon: 'close-circle',
        };
      default:
        return {
          text: 'Unknown',
          color: SecondaryText,
          icon: 'help-circle',
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleBookingAction = (booking: Booking) => {
    switch (booking.status) {
      case 'pending':
        Alert.alert(
          'Booking Pending',
          'Your booking request is waiting for owner approval. You can contact the owner or cancel the request.',
          [
            { text: 'Contact Owner', onPress: () => contactOwner(booking) },
            { text: 'Cancel Booking', onPress: () => cancelBooking(booking) },
            { text: 'Close', style: 'cancel' },
          ]
        );
        break;
      case 'confirmed':
        Alert.alert(
          'Booking Confirmed',
          'Your booking has been confirmed! You can contact the owner for pickup details.',
          [
            { text: 'Contact Owner', onPress: () => contactOwner(booking) },
            { text: 'View Details', onPress: () => viewBookingDetails(booking) },
            { text: 'Close', style: 'cancel' },
          ]
        );
        break;
      case 'active':
        Alert.alert(
          'Active Rental',
          'Your rental is currently active. Contact the owner if you need assistance.',
          [
            { text: 'Contact Owner', onPress: () => contactOwner(booking) },
            { text: 'View Details', onPress: () => viewBookingDetails(booking) },
            { text: 'Close', style: 'cancel' },
          ]
        );
        break;
      case 'completed':
        Alert.alert(
          'Completed Rental',
          'This rental has been completed. You can leave a review or contact the owner.',
          [
            { text: 'Leave Review', onPress: () => leaveReview(booking) },
            { text: 'Contact Owner', onPress: () => contactOwner(booking) },
            { text: 'Close', style: 'cancel' },
          ]
        );
        break;
    }
  };

  const contactOwner = (booking: Booking) => {
    router.push({
      pathname: '/(renter)/contact-owner',
      params: {
        ownerId: booking.ownerName,
        listingId: booking.listingId,
        listingTitle: booking.listingTitle,
      },
    });
  };

  const viewBookingDetails = (booking: Booking) => {
    router.push({
      pathname: '/(renter)/booking-details',
      params: { bookingId: booking.id },
    });
  };

  const cancelBooking = async (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await BookingService.cancelBooking(booking.id, 'current-user-id');
              await loadBookings();
              NotificationService.getInstance().showSuccess(
                'Booking Cancelled',
                'Your booking has been cancelled successfully.'
              );
            } catch (error) {
              console.error('Error cancelling booking:', error);
              NotificationService.getInstance().showError(
                'Cancellation Failed',
                'Unable to cancel booking. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const leaveReview = (booking: Booking) => {
    router.push({
      pathname: '/(renter)/write-review',
      params: { bookingId: booking.id, listingId: booking.listingId },
    });
  };

  const filteredBookings = bookings.filter(booking => 
    selectedFilter === 'all' || booking.status === selectedFilter
  );

  const renderBooking = (booking: Booking) => {
    const statusInfo = getStatusInfo(booking.status);
    
    return (
      <TouchableOpacity
        key={booking.id}
        style={styles.bookingCard}
        onPress={() => handleBookingAction(booking)}
      >
        <Image source={{ uri: booking.listingImage }} style={styles.bookingImage} />
        
        <View style={styles.bookingContent}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle} numberOfLines={2}>
              {booking.listingTitle}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
              <Ionicons name={statusInfo.icon as any} size={12} color="white" />
              <Text style={styles.statusText}>{statusInfo.text}</Text>
            </View>
          </View>
          
          <View style={styles.ownerInfo}>
            <Image source={{ uri: booking.ownerAvatar }} style={styles.ownerAvatar} />
            <Text style={styles.ownerName}>{booking.ownerName}</Text>
          </View>
          
          <View style={styles.bookingDetails}>
            <View style={styles.dateInfo}>
              <Ionicons name="calendar" size={14} color={SecondaryText} />
              <Text style={styles.dateText}>
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </Text>
            </View>
            <Text style={styles.durationText}>{booking.totalDays} days</Text>
          </View>
          
          <View style={styles.bookingFooter}>
            <Text style={styles.amountText}>KES {booking.totalAmount.toLocaleString()}</Text>
            <View style={styles.paymentStatus}>
              <Ionicons 
                name={booking.paymentStatus === 'paid' ? 'checkmark-circle' : 'time'} 
                size={14} 
                color={booking.paymentStatus === 'paid' ? Success : Warning} 
              />
              <Text style={[styles.paymentText, { 
                color: booking.paymentStatus === 'paid' ? Success : Warning 
              }]}>
                {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {
            // In real app, show filter modal
            console.log('Show filter options');
          }}
        >
          <Ionicons name="filter" size={20} color={PrimaryBrand} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              selectedFilter === filter.id && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter.id as any)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.id && styles.activeFilterTabText
            ]}>
              {filter.label}
            </Text>
            {filter.count > 0 && (
              <View style={styles.filterCount}>
                <Text style={styles.filterCountText}>{filter.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      <ScrollView
        style={styles.bookingsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={SecondaryText} />
            <Text style={styles.emptyTitle}>No Bookings Found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'all' 
                ? 'You haven\'t made any bookings yet.'
                : `No ${selectedFilter} bookings found.`
              }
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/(renter)/browse')}
            >
              <Text style={styles.browseButtonText}>Browse Items</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredBookings.map(renderBooking)
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  filterButton: {
    padding: 8,
  },
  filterContainer: {
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: Background,
    borderWidth: 1,
    borderColor: Border,
  },
  activeFilterTab: {
    backgroundColor: PrimaryBrand,
    borderColor: PrimaryBrand,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
  },
  activeFilterTabText: {
    color: 'white',
  },
  filterCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  bookingsList: {
    flex: 1,
    padding: 20,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingContent: {
    flex: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 4,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ownerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  ownerName: {
    fontSize: 12,
    color: SecondaryText,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: SecondaryText,
    marginLeft: 4,
  },
  durationText: {
    fontSize: 12,
    color: PrimaryBrand,
    fontWeight: '600',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: SecondaryText,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: PrimaryBrand,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyBookingsScreen;