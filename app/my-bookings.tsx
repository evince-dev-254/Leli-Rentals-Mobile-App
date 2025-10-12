import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Text, 
  Image,
  Animated
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeAwareLogo from '@/components/ThemeAwareLogo';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  PrimaryText, 
  SecondaryText, 
  Border,
  DarkBackground,
  DarkCard,
  DarkText,
  DarkSecondaryText,
  DarkBorder,
  VibrantPurple,
  VibrantOrange,
  VibrantPink,
  VibrantGreen,
  VibrantRed,
  VibrantCyan
} from '@/constants/Colors';

export default function MyBookingsScreen() {
  const { isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [bookings, setBookings] = useState([
    {
      id: 1,
      title: 'Tesla Model 3',
      price: 'KSh 15,000/day',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      status: 'upcoming',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      totalPrice: 'KSh 30,000',
      owner: 'John Smith',
      location: 'Downtown'
    },
    {
      id: 2,
      title: 'MacBook Pro M3',
      price: 'KSh 10,500/day',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      status: 'active',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      totalPrice: 'KSh 21,000',
      owner: 'Sarah Johnson',
      location: 'Tech Hub'
    },
    {
      id: 3,
      title: 'Professional Camera Kit',
      price: 'KSh 5,500/day',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      status: 'completed',
      startDate: '2024-01-05',
      endDate: '2024-01-07',
      totalPrice: 'KSh 11,000',
      owner: 'Mike Chen',
      location: 'Media District'
    }
  ]);

  const filteredBookings = bookings.filter(booking => booking.status === selectedTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return VibrantOrange;
      case 'active': return VibrantGreen;
      case 'completed': return VibrantPurple;
      case 'cancelled': return VibrantRed;
      default: return SecondaryText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return 'time';
      case 'active': return 'play-circle';
      case 'completed': return 'checkmark-circle';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ThemeAwareLogo size={100} variant="default" showText={false} />
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)')}>
            <Ionicons name="arrow-back" size={24} color={isDark ? DarkText : PrimaryText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: isDark ? DarkText : PrimaryText }]}>
          My Bookings
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Manage your rental bookings
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedTab === 'upcoming' && styles.activeTab,
            { backgroundColor: selectedTab === 'upcoming' ? PrimaryBrand : (isDark ? DarkCard : WhiteBackground) }
          ]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'upcoming' ? WhiteBackground : (isDark ? DarkText : PrimaryText) }
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedTab === 'active' && styles.activeTab,
            { backgroundColor: selectedTab === 'active' ? PrimaryBrand : (isDark ? DarkCard : WhiteBackground) }
          ]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'active' ? WhiteBackground : (isDark ? DarkText : PrimaryText) }
          ]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedTab === 'completed' && styles.activeTab,
            { backgroundColor: selectedTab === 'completed' ? PrimaryBrand : (isDark ? DarkCard : WhiteBackground) }
          ]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'completed' ? WhiteBackground : (isDark ? DarkText : PrimaryText) }
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <View style={styles.bookingsContainer}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <View 
              key={booking.id} 
              style={[styles.bookingCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
            >
              <Image source={{ uri: booking.image }} style={styles.bookingImage} />
              <View style={styles.bookingInfo}>
                <View style={styles.bookingHeader}>
                  <Text style={[styles.bookingTitle, { color: isDark ? DarkText : PrimaryText }]}>
                    {booking.title}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(booking.status) + '20' }
                  ]}>
                    <Ionicons 
                      name={getStatusIcon(booking.status) as any} 
                      size={12} 
                      color={getStatusColor(booking.status)} 
                    />
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(booking.status) }
                    ]}>
                      {booking.status}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.bookingOwner, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                  Owner: {booking.owner}
                </Text>
                <Text style={[styles.bookingLocation, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                  📍 {booking.location}
                </Text>
                <View style={styles.bookingDates}>
                  <View style={styles.dateItem}>
                    <Ionicons name="calendar" size={14} color={VibrantOrange} />
                    <Text style={[styles.dateText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                      Start: {booking.startDate}
                    </Text>
                  </View>
                  <View style={styles.dateItem}>
                    <Ionicons name="calendar" size={14} color={VibrantRed} />
                    <Text style={[styles.dateText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                      End: {booking.endDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingFooter}>
                  <Text style={[styles.bookingPrice, { color: VibrantGreen }]}>
                    Total: {booking.totalPrice}
                  </Text>
                  <View style={styles.bookingActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: PrimaryBrand + '20' }]}
                      onPress={() => router.push('/listing-detail')}
                    >
                      <Text style={[styles.actionButtonText, { color: PrimaryBrand }]}>
                        View Details
                      </Text>
                    </TouchableOpacity>
                    {booking.status === 'upcoming' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: VibrantRed + '20' }]}
                      >
                        <Text style={[styles.actionButtonText, { color: VibrantRed }]}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={SecondaryText} />
            <Text style={[styles.emptyTitle, { color: isDark ? DarkText : PrimaryText }]}>
              No {selectedTab} Bookings
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {selectedTab === 'upcoming' ? 'You have no upcoming bookings' : 
               selectedTab === 'active' ? 'You have no active bookings' : 
               'You have no completed bookings'}
            </Text>
            {selectedTab === 'upcoming' && (
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => router.push('/explore')}
              >
                <Text style={styles.exploreButtonText}>Explore Items</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: PrimaryBrand,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookingsContainer: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingImage: {
    width: '100%',
    height: 200,
  },
  bookingInfo: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingOwner: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookingLocation: {
    fontSize: 14,
    marginBottom: 12,
  },
  bookingDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: PrimaryBrand,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: '600',
  },
});