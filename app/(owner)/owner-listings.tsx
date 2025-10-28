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
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OwnerListingsScreen() {
  const { isDark } = useTheme();
  const { accountType } = useAccount();
  
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
      color: VibrantOrange,
      description: 'Professional camera kit with multiple lenses and accessories',
      location: 'Nairobi, Kenya',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      title: 'Mountain Bike',
      price: 'KSh 4,500/day',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.8,
      status: 'active',
      bookings: 8,
      earnings: 'KSh 36,000',
      category: 'Sports',
      color: VibrantGreen,
      description: 'High-quality mountain bike for outdoor adventures',
      location: 'Nairobi, Kenya',
      createdAt: '2024-01-05',
    },
    {
      id: 3,
      title: 'Power Drill Set',
      price: 'KSh 2,500/day',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      rating: 4.7,
      status: 'inactive',
      bookings: 5,
      earnings: 'KSh 15,000',
      category: 'Tools',
      color: VibrantPurple,
      description: 'Complete power drill set with various bits and accessories',
      location: 'Nairobi, Kenya',
      createdAt: '2024-01-10',
    },
  ]);

  const toggleListingStatus = (id: number) => {
    setListings(prev => prev.map(listing => 
      listing.id === id 
        ? { ...listing, status: listing.status === 'active' ? 'inactive' : 'active' }
        : listing
    ));
  };

  const deleteListing = (id: number) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setListings(prev => prev.filter(listing => listing.id !== id));
          }
        }
      ]
    );
  };

  const renderListingCard = (listing) => (
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
          <View style={[styles.statusBadge, { backgroundColor: listing.status === 'active' ? VibrantGreen + '20' : VibrantRed + '20' }]}>
            <Text style={[styles.statusText, { color: listing.status === 'active' ? VibrantGreen : VibrantRed }]}>
              {listing.status}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.listingDescription, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          {listing.description}
        </Text>
        
        <Text style={[styles.listingPrice, { color: PrimaryBrand }]}>
          {listing.price}
        </Text>
        
        <View style={styles.listingStats}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
            <Text style={[styles.statText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {listing.bookings} bookings
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cash" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
            <Text style={[styles.statText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {listing.earnings}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={[styles.statText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {listing.rating}
            </Text>
          </View>
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
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: VibrantOrange + '20' }]}
            onPress={() => router.push('/renter-listing')}
          >
            <Text style={[styles.actionButtonText, { color: VibrantOrange }]}>
              Edit
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
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: VibrantRed + '20' }]}
            onPress={() => deleteListing(listing.id)}
          >
            <Text style={[styles.actionButtonText, { color: VibrantRed }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
          My Listings
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Manage your rental items and create new listings
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
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
            {listings.reduce((sum, l) => sum + parseInt(l.earnings.replace('KSh ', '').replace(',', '')), 0).toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Total Earnings
          </Text>
        </View>
      </View>

      {/* Add New Listing Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/create-listing')}
        >
          <Ionicons name="add" size={24} color={WhiteBackground} />
          <Text style={styles.addButtonText}>Create New Listing</Text>
        </TouchableOpacity>
      </View>

      {/* Listings */}
      <View style={styles.listingsContainer}>
        {listings.length > 0 ? (
          listings.map(renderListingCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={64} color={isDark ? DarkSecondaryText : SecondaryText} />
            <Text style={[styles.emptyStateTitle, { color: isDark ? DarkText : PrimaryText }]}>
              No Listings Yet
            </Text>
            <Text style={[styles.emptyStateText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              Create your first listing to start earning money
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push('/renter-listing')}
            >
              <Text style={styles.emptyStateButtonText}>Create First Listing</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
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
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
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
  listingDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: PrimaryBrand,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: '600',
  },
});
