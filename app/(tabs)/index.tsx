import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AIChat from '@/components/AIChat';
import NotificationBell from '@/components/NotificationBell';
import ThemeAwareLogo from '@/components/ThemeAwareLogo';
import {
    Background,
    Border,
    DarkBackground,
    DarkBorder,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantCyan,
    VibrantGreen,
    VibrantOrange,
    VibrantPink,
    VibrantPurple,
    VibrantRed,
    WhiteBackground
} from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { accountType } = useAccount();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [animatedValues] = useState(() => 
    Array.from({ length: 6 }, () => new Animated.Value(1))
  );

  const handleCategoryPress = (index: number) => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to categories
    router.push('/categories');
  };
  
  // Add timeout to prevent 6000ms error
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded) {
        console.log('Video loading timeout - using fallback');
        setVideoLoaded(true);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, [videoLoaded]);
  
  const featuredListings = [
    {
      id: 1,
      title: 'Professional Camera Kit',
      price: 25,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.8,
      location: 'Downtown SF',
    },
    {
      id: 2,
      title: 'Power Drill Set',
      price: 15,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      rating: 4.6,
      location: 'Mission District',
    },
    {
      id: 3,
      title: 'Mountain Bike',
      price: 35,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      rating: 4.9,
      location: 'SOMA',
    },
  ];

  const categories = [
    { 
      name: 'Electronics', 
      icon: 'phone-portrait', 
      count: 1250, 
      color: VibrantPurple,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
    },
    { 
      name: 'Tools', 
      icon: 'hammer', 
      count: 890, 
      color: VibrantOrange,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop'
    },
    { 
      name: 'Furniture', 
      icon: 'bed', 
      count: 650, 
      color: VibrantPink,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    },
    { 
      name: 'Vehicles', 
      icon: 'car', 
      count: 320, 
      color: VibrantGreen,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    { 
      name: 'Sports', 
      icon: 'football', 
      count: 280, 
      color: VibrantRed,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    { 
      name: 'Books', 
      icon: 'book', 
      count: 150, 
      color: VibrantCyan,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
    },
  ];

  // Owner Dashboard Content
  const renderOwnerContent = () => (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]} showsVerticalScrollIndicator={false}>

      {/* Owner Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ThemeAwareLogo size={140} variant="default" showText={false} />
          </View>
          <View style={styles.headerRight}>
            <NotificationBell />
          </View>
        </View>
      </View>

      {/* Business Analytics */}
      <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>Business Analytics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color={VibrantGreen} />
            <Text style={[styles.statValue, { color: isDark ? DarkText : PrimaryText }]}>+23%</Text>
            <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Revenue Growth</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={VibrantPurple} />
            <Text style={[styles.statValue, { color: isDark ? DarkText : PrimaryText }]}>156</Text>
            <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Total Customers</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color={VibrantOrange} />
            <Text style={[styles.statValue, { color: isDark ? DarkText : PrimaryText }]}>2.3</Text>
            <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Avg. Response Time</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="shield-checkmark" size={24} color={VibrantGreen} />
            <Text style={[styles.statValue, { color: isDark ? DarkText : PrimaryText }]}>98%</Text>
            <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Success Rate</Text>
          </View>
        </View>
      </View>

      {/* Dashboard Quick Actions */}
      <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>Dashboard Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/owner-listings')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="list" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>My Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/create-listing')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="add" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>Create Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/admin/analytics')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="analytics" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/my-bookings')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="calendar" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/reviews')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="star" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/settings')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="settings" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Business Insights */}
      <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>Business Insights</Text>
          <TouchableOpacity onPress={() => router.push('/admin/analytics')}>
            <Text style={styles.seeAllText}>View Analytics</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bookingsList}>
          <View style={styles.bookingItem}>
            <View style={styles.bookingInfo}>
              <Text style={[styles.bookingTitle, { color: isDark ? DarkText : PrimaryText }]}>Top Performing Item</Text>
              <Text style={[styles.bookingDate, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Tesla Model 3 - 15 bookings this month</Text>
            </View>
            <View style={styles.bookingStatus}>
              <Text style={styles.statusText}>+45% Revenue</Text>
            </View>
          </View>
          <View style={styles.bookingItem}>
            <View style={styles.bookingInfo}>
              <Text style={[styles.bookingTitle, { color: isDark ? DarkText : PrimaryText }]}>Customer Satisfaction</Text>
              <Text style={[styles.bookingDate, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Average rating: 4.8/5.0</Text>
            </View>
            <View style={styles.bookingStatus}>
              <Text style={styles.statusText}>Excellent</Text>
            </View>
          </View>
        </View>
      </View>

      {/* AI Assistant */}
      <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>AI Assistant</Text>
          <View style={styles.aiStatusContainer}>
            <View style={[styles.aiStatusDot, { backgroundColor: VibrantGreen }]} />
            <Text style={[styles.aiStatusText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Online</Text>
          </View>
        </View>
        <Text style={[styles.aiDescription, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Get instant help with your rental business. Ask about analytics, customer management, pricing strategies, and more.
        </Text>
        <AIChat onClose={() => {}} />
      </View>
    </ScrollView>
  );

  // Renter Home Content
  const renderRenterContent = () => (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]} showsVerticalScrollIndicator={false}>
      {/* Clean Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ThemeAwareLogo size={140} variant="default" showText={false} />
          </View>
          <View style={styles.headerRight}>
            <NotificationBell />
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchSection, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={SecondaryText} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search for items to rent...</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color={PrimaryBrand} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions - Moved up for better accessibility */}
      <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/profile')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="person" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/favorites')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="heart" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/help')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="help-circle" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>Get Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/owner-preview')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="trending-up" size={24} color={VibrantGreen} />
            </View>
            <Text style={styles.quickActionText}>Become Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/about')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="information-circle" size={24} color={PrimaryBrand} />
            </View>
            <Text style={styles.quickActionText}>About Us</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <TouchableOpacity onPress={() => router.push('/categories')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <Animated.View
              key={index}
              style={{
                transform: [{ scale: animatedValues[index] }]
              }}
            >
              <TouchableOpacity 
                style={[styles.categoryCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
                onPress={() => handleCategoryPress(index)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <View style={styles.categoryOverlay}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon as any} size={24} color={category.color} />
                  </View>
                  <Text style={[styles.categoryName, { color: isDark ? DarkText : PrimaryText }]}>{category.name}</Text>
                  <Text style={[styles.categoryCount, { color: category.color }]}>
                    {category.count} items
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Featured Listings */}
      <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Listings</Text>
          <TouchableOpacity onPress={() => router.push('/renter-listing')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listingsScroll}>
          {featuredListings.map((listing) => (
            <TouchableOpacity 
              key={listing.id} 
              style={styles.listingCard}
              onPress={() => router.push('/listing-detail')}
            >
              <Image source={{ uri: listing.image }} style={styles.listingImage} />
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <View style={styles.listingMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <Text style={styles.ratingText}>{listing.rating}</Text>
                  </View>
                  <Text style={styles.locationText}>{listing.location}</Text>
                </View>
                <Text style={styles.listingPrice}>KES {listing.price.toLocaleString()}/day</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Why Choose Us Section */}
      <View style={[styles.section, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>Why Choose Leli Rentals?</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Ionicons name="shield-checkmark" size={32} color={PrimaryBrand} />
            <Text style={[styles.featureTitle, { color: isDark ? DarkText : PrimaryText }]}>Secure</Text>
            <Text style={[styles.featureDescription, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Safe transactions</Text>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="time" size={32} color={PrimaryBrand} />
            <Text style={[styles.featureTitle, { color: isDark ? DarkText : PrimaryText }]}>Fast</Text>
            <Text style={[styles.featureDescription, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Quick delivery</Text>
            </View>
          <View style={styles.featureCard}>
            <Ionicons name="star" size={32} color={PrimaryBrand} />
            <Text style={[styles.featureTitle, { color: isDark ? DarkText : PrimaryText }]}>Quality</Text>
            <Text style={[styles.featureDescription, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Verified items</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>10K+</Text>
            <Text style={styles.statLabel}>Items Available</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5K+</Text>
            <Text style={styles.statLabel}>Happy Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  // Conditional rendering based on account type
  return accountType === 'owner' ? renderOwnerContent() : renderRenterContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  fallbackBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: PrimaryBrand,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  notificationContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  heroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginRight: 12,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WhiteBackground,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: WhiteBackground,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  heroButton: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: PrimaryBrand,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  heroImageContent: {
    width: '100%',
    height: '100%',
  },
  searchSection: {
    padding: 20,
    backgroundColor: WhiteBackground,
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Background,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: SecondaryText,
    paddingVertical: 16,
  },
  filterButton: {
    padding: 8,
  },
  section: {
    padding: 20,
    backgroundColor: WhiteBackground,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  seeAllText: {
    fontSize: 14,
    color: PrimaryBrand,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    height: 140,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: WhiteBackground,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  listingsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  listingCard: {
    width: 200,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingImage: {
    width: '100%',
    height: 120,
  },
  listingInfo: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: PrimaryText,
    marginLeft: 4,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 12,
    color: SecondaryText,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryBrand,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingsList: {
    gap: 12,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
  },
  bookingStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: VibrantGreen,
    backgroundColor: VibrantGreen + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statsSection: {
    backgroundColor: PrimaryBrand,
    padding: 20,
    marginTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WhiteBackground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  videoSection: {
    padding: 20,
    backgroundColor: WhiteBackground,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  videoContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  videoContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WhiteBackground,
    marginBottom: 8,
    textAlign: 'center',
  },
  videoSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  videoButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  videoButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  featureCard: {
    alignItems: 'center',
    flex: 1,
    padding: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  aiStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  aiStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  aiDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});