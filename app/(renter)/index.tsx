import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import NotificationBell from '@/components/NotificationBell';
import QuickActionCard from '@/components/QuickActionCard';
import ThemeAwareLogo from '@/components/ThemeAwareLogo';
import {
    Border,
    DarkBackground,
    DarkBorder,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantBlue,
    VibrantCyan,
    VibrantGreen,
    VibrantOrange,
    VibrantPink,
    VibrantPurple,
    WhiteBackground
} from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function RenterHomeScreen() {
  const { user } = useUser();
  const { isDark } = useTheme();
  const [animatedValues] = useState(() => 
    Array.from({ length: 8 }, () => new Animated.Value(1))
  );

  const handleCardPress = (index: number, route: any) => {
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
    
    // Navigate to the route
    router.push(route);
  };

  const renterStats = [
    { title: 'Total Rentals', value: '24', icon: 'bag-outline', color: VibrantBlue },
    { title: 'Active Bookings', value: '3', icon: 'calendar-outline', color: VibrantGreen },
    { title: 'Money Saved', value: '$1,200', icon: 'cash-outline', color: VibrantOrange },
    { title: 'Rating', value: '4.9', icon: 'star-outline', color: VibrantPurple },
  ];

  const renterQuickActions = [
    { title: 'My Bookings', icon: 'calendar-outline', route: '/(renter)/my-bookings', color: VibrantGreen },
    { title: 'Favorites', icon: 'heart-outline', route: '/(renter)/favorites', color: VibrantPink },
    { title: 'Reviews', icon: 'star-outline', route: '/(renter)/reviews', color: VibrantOrange },
    { title: 'Profile', icon: 'person-outline', route: '/(renter)/profile', color: VibrantBlue },
    { title: 'Settings', icon: 'settings-outline', route: '/(renter)/settings', color: VibrantCyan },
    { title: 'Help', icon: 'help-circle-outline', route: '/(renter)/help', color: VibrantPurple },
  ];

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
      icon: 'phone-portrait-outline', 
      color: VibrantBlue,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
    },
    { 
      name: 'Tools', 
      icon: 'hammer-outline', 
      color: VibrantOrange,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
    },
    { 
      name: 'Sports', 
      icon: 'football-outline', 
      color: VibrantGreen,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    { 
      name: 'Furniture', 
      icon: 'bed-outline', 
      color: VibrantPurple,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    },
    { 
      name: 'Books', 
      icon: 'book-outline', 
      color: VibrantPink,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
    },
    { 
      name: 'Cars', 
      icon: 'car-outline', 
      color: VibrantCyan,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      {/* Auth Debugger */}
      <AuthDebugger />
      
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <View style={styles.headerLeft}>
          <ThemeAwareLogo size={32} />
          <View style={styles.headerText}>
            <Text style={[styles.greeting, isDark && styles.darkText]}>
              Welcome back, {user?.firstName || 'User'}!
            </Text>
            <Text style={[styles.subGreeting, isDark && styles.darkSecondaryText]}>
              What would you like to rent today?
            </Text>
          </View>
        </View>
        <NotificationBell onPress={() => router.push('/(renter)/notifications')} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Your Activity</Text>
          <View style={styles.statsGrid}>
            {renterStats.map((stat, index) => (
              <Animated.View
                key={stat.title}
                style={[
                  styles.statCard,
                  isDark && styles.darkCard,
                  { transform: [{ scale: animatedValues[index] }] }
                ]}
              >
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Ionicons name={stat.icon as any} size={24} color="#ffffff" />
                </View>
                <Text style={[styles.statValue, isDark && styles.darkText]}>{stat.value}</Text>
                <Text style={[styles.statTitle, isDark && styles.darkSecondaryText]}>{stat.title}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Quick Actions</Text>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
            style={styles.quickActionsScrollView}
          >
            {renterQuickActions.map((action, index) => (
              <Animated.View
                key={action.title}
                style={{ transform: [{ scale: animatedValues[index + 4] }] }}
              >
                <QuickActionCard
                  title={action.title}
                  icon={action.icon}
                  color={action.color}
                  onPress={() => handleCardPress(index + 4, action.route)}
                  isDark={isDark}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Browse Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.name}
                style={{ transform: [{ scale: animatedValues[index + 10] }] }}
              >
                <TouchableOpacity
                  style={[styles.categoryCard, isDark && styles.darkCard]}
                  onPress={() => handleCardPress(index + 10, '/categories')}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: category.image }} style={styles.categoryImage} />
                  <View style={styles.categoryOverlay}>
                    <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                      <Ionicons name={category.icon as any} size={24} color="#ffffff" />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Featured Listings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Featured Listings</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {featuredListings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={[styles.featuredCard, isDark && styles.darkCard]}
                onPress={() => router.push(`/(renter)/listing-detail?id=${listing.id}`)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: listing.image }} style={styles.featuredImage} />
                <View style={styles.featuredContent}>
                  <Text style={[styles.featuredTitle, isDark && styles.darkText]}>{listing.title}</Text>
                  <Text style={[styles.featuredPrice, isDark && styles.darkText]}>${listing.price}/day</Text>
                  <View style={styles.featuredRating}>
                    <Ionicons name="star" size={16} color="#fbbf24" />
                    <Text style={[styles.ratingText, isDark && styles.darkSecondaryText]}>{listing.rating}</Text>
                    <Text style={[styles.locationText, isDark && styles.darkSecondaryText]}>{listing.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteBackground,
  },
  darkContainer: {
    backgroundColor: DarkBackground,
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
  darkHeader: {
    backgroundColor: DarkBackground,
    borderBottomColor: DarkBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  darkText: {
    color: DarkText,
  },
  subGreeting: {
    fontSize: 14,
    color: SecondaryText,
    marginTop: 2,
  },
  darkSecondaryText: {
    color: DarkSecondaryText,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: DarkCard,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: SecondaryText,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    height: 151.5,
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Border,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  featuredScroll: {
    marginTop: 8,
  },
  featuredCard: {
    width: 200,
    height: 151.5,
    backgroundColor: WhiteBackground,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Border,
  },
  featuredImage: {
    width: '100%',
    height: 120,
  },
  featuredContent: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryBrand,
    marginBottom: 8,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: SecondaryText,
    marginLeft: 4,
    marginRight: 8,
  },
  locationText: {
    fontSize: 12,
    color: SecondaryText,
  },
  quickActionsContainer: {
    paddingBottom: 20,
  },
  quickActionsScrollView: {
    maxHeight: 300,
  },
});
