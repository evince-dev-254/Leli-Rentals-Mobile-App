import ThemeAwareLogo from '@/components/ThemeAwareLogo';
import {
    Background,
    Border,
    DarkBackground,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantGreen,
    VibrantOrange,
    VibrantPurple,
    VibrantRed,
    WhiteBackground
} from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function MyListingsScreen() {
  const { isDark } = useTheme();
  const { accountType } = useAccount();

  // Redirect owners to the dedicated owner listings page
  useEffect(() => {
    if (accountType === 'owner') {
      router.replace('/owner-listings');
      return;
    }
  }, [accountType]);

  // Don't render anything for owners since we redirect them
  if (accountType === 'owner') {
    return null;
  }
  // Owner listings data
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Professional Camera Kit',
      price: 'KSh 5,500/day',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.9,
      status: 'active',
      bookings: 12,
      earnings: 'KSh 66,000',
      category: 'Electronics',
      color: VibrantOrange
    },
    {
      id: 2,
      title: 'Mountain Bike',
      price: 'KSh 4,500/day',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.7,
      status: 'active',
      bookings: 8,
      earnings: 'KSh 36,000',
      category: 'Sports',
      color: VibrantRed
    },
    {
      id: 3,
      title: 'Power Drill Set',
      price: 'KSh 3,000/day',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
      rating: 4.8,
      status: 'inactive',
      bookings: 5,
      earnings: 'KSh 15,000',
      category: 'Tools',
      color: VibrantPurple
    }
  ]);

  // Renter rental data
  const [rentals, setRentals] = useState([
    {
      id: 1,
      title: 'Professional Camera Kit',
      price: 'KSh 5,500/day',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.9,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      totalCost: 'KSh 11,000',
      owner: 'John Doe',
      category: 'Electronics',
      color: VibrantOrange
    },
    {
      id: 2,
      title: 'Mountain Bike',
      price: 'KSh 4,500/day',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.8,
      status: 'completed',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      totalCost: 'KSh 9,000',
      owner: 'Jane Smith',
      category: 'Sports',
      color: VibrantGreen
    },
    {
      id: 3,
      title: 'Power Drill Set',
      price: 'KSh 2,500/day',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      rating: 4.7,
      status: 'upcoming',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      totalCost: 'KSh 5,000',
      owner: 'Mike Johnson',
      category: 'Tools',
      color: VibrantPurple
    },
  ]);

  const toggleListingStatus = (id: number) => {
    setListings(prev => prev.map(listing => 
      listing.id === id 
        ? { ...listing, status: listing.status === 'active' ? 'inactive' : 'active' }
        : listing
    ));
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
          {accountType === 'owner' ? 'My Listings' : 'My Rentals'}
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          {accountType === 'owner' ? 'Manage your rental items' : 'Items you are currently renting'}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {accountType === 'owner' ? (
          <>
        <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.statNumber, { color: VibrantGreen }]}>
            {listings.filter(l => l.status === 'active').length}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Active
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.statNumber, { color: VibrantOrange }]}>
            {listings.reduce((sum, l) => sum + l.bookings, 0)}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Total Bookings
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.statNumber, { color: VibrantPurple }]}>
            ${listings.reduce((sum, l) => sum + parseInt(l.earnings.replace('$', '')), 0)}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Total Earnings
          </Text>
        </View>
          </>
        ) : (
          <>
            <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
              <Text style={[styles.statNumber, { color: VibrantGreen }]}>
                {rentals.filter(r => r.status === 'active').length}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Active Rentals
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
              <Text style={[styles.statNumber, { color: VibrantOrange }]}>
                {rentals.filter(r => r.status === 'completed').length}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Completed
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
              <Text style={[styles.statNumber, { color: VibrantPurple }]}>
                {rentals.reduce((sum, r) => sum + parseInt(r.totalCost.replace('KSh ', '').replace(',', '')), 0).toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Total Spent
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Add New Button - Only for owners */}
      {accountType === 'owner' && (
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
            onPress={() => router.push('/renter-listing')}
        >
          <Ionicons name="add" size={24} color={WhiteBackground} />
          <Text style={styles.addButtonText}>Add New Listing</Text>
        </TouchableOpacity>
      </View>
      )}

      {/* Listings/Rentals */}
      <View style={styles.listingsContainer}>
        {accountType === 'owner' ? (
          listings.map((listing) => (
          <View 
            key={listing.id} 
            style={[styles.listingCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
          >
            <Image source={{ uri: listing.image }} style={styles.listingImage} />
            <View style={styles.listingInfo}>
              <View style={styles.listingHeader}>
                <Text style={[styles.listingTitle, { color: isDark ? DarkText : PrimaryText }]}>
                  {listing.title}
                </Text>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: listing.status === 'active' ? VibrantGreen + '20' : VibrantRed + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: listing.status === 'active' ? VibrantGreen : VibrantRed }
                  ]}>
                    {listing.status}
                  </Text>
                </View>
              </View>
              <Text style={[styles.listingCategory, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                {listing.category}
              </Text>
              <View style={styles.listingStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={[styles.statText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                    {listing.rating}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="calendar" size={14} color={VibrantOrange} />
                  <Text style={[styles.statText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                    {listing.bookings} bookings
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="cash" size={14} color={VibrantGreen} />
                  <Text style={[styles.statText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                    {listing.earnings}
                  </Text>
                </View>
              </View>
              <View style={styles.listingActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: PrimaryBrand + '20' }]}
                  onPress={() => router.push('/listing-detail')}
                >
                  <Text style={[styles.actionButtonText, { color: PrimaryBrand }]}>
                    View Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    { backgroundColor: listing.status === 'active' ? VibrantRed + '20' : VibrantGreen + '20' }
                  ]}
                  onPress={() => toggleListingStatus(listing.id)}
                >
                  <Text style={[
                    styles.actionButtonText, 
                    { color: listing.status === 'active' ? VibrantRed : VibrantGreen }
                  ]}>
                    {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
        ) : (
          rentals.map((rental) => (
            <View 
              key={rental.id} 
              style={[styles.listingCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
            >
              <Image source={{ uri: rental.image }} style={styles.listingImage} />
              <View style={styles.listingInfo}>
                <View style={styles.listingHeader}>
                  <Text style={[styles.listingTitle, { color: isDark ? DarkText : PrimaryText }]}>
                    {rental.title}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: rental.status === 'active' ? VibrantGreen + '20' : rental.status === 'completed' ? VibrantOrange + '20' : VibrantPurple + '20' }]}>
                    <Text style={[styles.statusText, { color: rental.status === 'active' ? VibrantGreen : rental.status === 'completed' ? VibrantOrange : VibrantPurple }]}>
                      {rental.status}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.listingPrice, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                  {rental.price}
                </Text>
                
                <View style={styles.rentalDetails}>
                  <View style={styles.rentalDetailItem}>
                    <Ionicons name="calendar" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
                    <Text style={[styles.rentalDetailText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                      {rental.startDate} - {rental.endDate}
                    </Text>
                  </View>
                  <View style={styles.rentalDetailItem}>
                    <Ionicons name="person" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
                    <Text style={[styles.rentalDetailText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                      Owner: {rental.owner}
                    </Text>
                  </View>
                  <View style={styles.rentalDetailItem}>
                    <Ionicons name="cash" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
                    <Text style={[styles.rentalDetailText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                      Total: {rental.totalCost}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text style={[styles.ratingText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                    {rental.rating}
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: PrimaryBrand + '20' }]}
                    onPress={() => router.push('/listing-detail')}
                  >
                    <Text style={[styles.actionButtonText, { color: PrimaryBrand }]}>
                      View Details
                    </Text>
                  </TouchableOpacity>
                  {rental.status === 'active' && (
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: VibrantRed + '20' }]}
                      onPress={() => Alert.alert('Cancel Rental', 'Are you sure you want to cancel this rental?')}
                    >
                      <Text style={[styles.actionButtonText, { color: VibrantRed }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: PrimaryBrand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  listingsContainer: {
    padding: 20,
  },
  listingCard: {
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
  listingImage: {
    width: '100%',
    height: 200,
  },
  listingInfo: {
    padding: 16,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listingCategory: {
    fontSize: 14,
    marginBottom: 12,
  },
  listingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  listingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rentalDetails: {
    marginVertical: 8,
    gap: 4,
  },
  rentalDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rentalDetailText: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});