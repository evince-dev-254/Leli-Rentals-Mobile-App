import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  Dimensions,
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
  VibrantOrange,
  VibrantGreen,
  VibrantPurple,
  VibrantPink,
  VibrantCyan,
  VibrantBlue,
  DarkText,
  DarkCard,
  DarkBorder,
  DarkSecondaryText,
  DarkBackground
} from '@/constants/Colors';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: 'tools', name: 'Tools', icon: 'hammer-outline' },
    { id: 'furniture', name: 'Furniture', icon: 'bed-outline' },
    { id: 'vehicles', name: 'Vehicles', icon: 'car-outline' },
    { id: 'sports', name: 'Sports', icon: 'football-outline' },
    { id: 'books', name: 'Books', icon: 'book-outline' },
  ];

  const sortOptions = [
    { id: 'popular', name: 'Popular', icon: 'trending-up' },
    { id: 'price_low', name: 'Price: Low to High', icon: 'arrow-up' },
    { id: 'price_high', name: 'Price: High to Low', icon: 'arrow-down' },
    { id: 'rating', name: 'Highest Rated', icon: 'star' },
    { id: 'newest', name: 'Newest', icon: 'time' },
  ];

  const exploreItems = [
    {
      id: 1,
      title: 'Professional Camera Kit',
      price: 'KSh 2,500/day',
      originalPrice: 'KSh 3,000/day',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 128,
      location: 'Creative District',
      category: 'electronics',
      available: true,
      badge: 'Popular',
      badgeColor: VibrantGreen,
      owner: 'John Doe',
      distance: '2.3 km',
    },
    {
      id: 2,
      title: 'Tesla Model 3',
      price: 'KSh 15,000/day',
      originalPrice: 'KSh 18,000/day',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 89,
      location: 'Downtown',
      category: 'vehicles',
      available: true,
      badge: 'Premium',
      badgeColor: VibrantBlue,
      owner: 'Sarah Wilson',
      distance: '1.2 km',
    },
    {
      id: 3,
      title: 'MacBook Pro M2',
      price: 'KSh 3,000/day',
      originalPrice: 'KSh 3,500/day',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      location: 'Tech Hub',
      category: 'electronics',
      available: false,
      badge: 'New',
      badgeColor: VibrantPurple,
      owner: 'Mike Chen',
      distance: '0.8 km',
    },
    {
      id: 4,
      title: 'Power Drill Set',
      price: 'KSh 800/day',
      originalPrice: 'KSh 1,000/day',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      rating: 4.6,
      reviews: 67,
      location: 'Hardware Store',
      category: 'tools',
      available: true,
      badge: 'Best Deal',
      badgeColor: VibrantOrange,
      owner: 'David Kim',
      distance: '3.1 km',
    },
    {
      id: 5,
      title: 'Luxury Sofa Set',
      price: 'KSh 1,200/day',
      originalPrice: 'KSh 1,500/day',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      rating: 4.5,
      reviews: 43,
      location: 'Furniture District',
      category: 'furniture',
      available: true,
      badge: 'Trending',
      badgeColor: VibrantPink,
      owner: 'Emma Brown',
      distance: '4.2 km',
    },
    {
      id: 6,
      title: 'Mountain Bike',
      price: 'KSh 1,500/day',
      originalPrice: 'KSh 1,800/day',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 92,
      location: 'Sports Center',
      category: 'sports',
      available: true,
      badge: 'Hot',
      badgeColor: VibrantCyan,
      owner: 'Alex Johnson',
      distance: '2.7 km',
    },
  ];

  const quickActions = [
    { title: 'My Listings', icon: 'list', color: VibrantGreen, route: '/my-listings' },
    { title: 'Analytics', icon: 'analytics', color: VibrantPurple, route: '/dashboard' },
    { title: 'Bookings', icon: 'calendar', color: VibrantBlue, route: '/my-bookings' },
    { title: 'Reviews', icon: 'star', color: VibrantOrange, route: '/reviews' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? exploreItems 
    : exploreItems.filter(item => item.category === selectedCategory);

  const renderCategoryFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        { 
          backgroundColor: selectedCategory === item.id 
            ? PrimaryBrand 
            : (isDark ? DarkCard : WhiteBackground),
          borderColor: isDark ? DarkBorder : Border
        }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={18} 
        color={selectedCategory === item.id ? 'white' : (isDark ? DarkText : PrimaryText)} 
      />
      <Text style={[
        styles.categoryFilterText,
        { 
          color: selectedCategory === item.id 
            ? 'white' 
            : (isDark ? DarkText : PrimaryText)
        }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSortOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        { 
          backgroundColor: sortBy === item.id 
            ? PrimaryBrand 
            : (isDark ? DarkCard : WhiteBackground),
          borderColor: isDark ? DarkBorder : Border
        }
      ]}
      onPress={() => setSortBy(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={sortBy === item.id ? 'white' : (isDark ? DarkText : PrimaryText)} 
      />
      <Text style={[
        styles.sortOptionText,
        { 
          color: sortBy === item.id 
            ? 'white' 
            : (isDark ? DarkText : PrimaryText)
        }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderExploreItem = ({ item }) => (
    <TouchableOpacity style={[styles.exploreCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
      <View style={styles.exploreImageContainer}>
        <Image source={{ uri: item.image }} style={styles.exploreImage} />
        <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={18} color="white" />
        </TouchableOpacity>
        {!item.available && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
      </View>
      <View style={styles.exploreInfo}>
        <Text style={[styles.exploreTitle, { color: isDark ? DarkText : PrimaryText }]}>
          {item.title}
        </Text>
        <View style={styles.exploreMeta}>
          <View style={styles.ownerInfo}>
            <Ionicons name="person" size={12} color={isDark ? DarkSecondaryText : SecondaryText} />
            <Text style={[styles.ownerText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {item.owner}
            </Text>
          </View>
          <View style={styles.distanceInfo}>
            <Ionicons name="location" size={12} color={isDark ? DarkSecondaryText : SecondaryText} />
            <Text style={[styles.distanceText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {item.distance}
            </Text>
          </View>
        </View>
        <Text style={[styles.exploreLocation, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          {item.location}
        </Text>
        <View style={styles.exploreFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={VibrantOrange} />
            <Text style={[styles.ratingText, { color: isDark ? DarkText : PrimaryText }]}>
              {item.rating}
            </Text>
            <Text style={[styles.reviewsText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              ({item.reviews})
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.explorePrice, { color: PrimaryBrand }]}>
              {item.price}
            </Text>
            <Text style={[styles.originalPrice, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {item.originalPrice}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity 
      style={[styles.quickActionCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
      onPress={() => router.push(item.route)}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={20} color="white" />
      </View>
      <Text style={[styles.quickActionText, { color: isDark ? DarkText : PrimaryText }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? DarkBackground : '#f8fafc' }]} showsVerticalScrollIndicator={false}>
      {/* Modern Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <ThemeAwareLogo size={100} variant="default" showText={false} />
            <View style={styles.headerText}>
              <Text style={[styles.welcomeText, { color: isDark ? DarkText : PrimaryText }]}>
                Explore Rentals
              </Text>
              <Text style={[styles.subtitleText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Find the perfect item
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: PrimaryBrand }]}>
            <Ionicons name="options" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
          <Ionicons name="search" size={20} color={isDark ? DarkSecondaryText : SecondaryText} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? DarkText : PrimaryText }]}
            placeholder="Search items, categories, locations..."
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={[styles.searchFilterButton, { backgroundColor: isDark ? DarkBackground : '#f1f5f9' }]}>
            <Ionicons name="funnel" size={16} color={isDark ? DarkText : PrimaryText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Categories
        </Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Sort By
        </Text>
        <FlatList
          data={sortOptions}
          renderItem={renderSortOption}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortList}
        />
      </View>

      {/* Explore Items */}
      <View style={styles.itemsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Available Items ({filteredItems.length})
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: PrimaryBrand }]}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredItems}
          renderItem={renderExploreItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.exploreList}
          scrollEnabled={false}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Quick Actions
        </Text>
        <FlatList
          data={quickActions}
          renderItem={renderQuickAction}
          keyExtractor={(item) => item.title}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsList}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 14,
    opacity: 0.8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  searchFilterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filtersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryFilterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  sortSection: {
    marginBottom: 20,
  },
  sortList: {
    paddingHorizontal: 20,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  sortOptionText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  itemsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exploreList: {
    paddingHorizontal: 20,
  },
  exploreCard: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreImageContainer: {
    position: 'relative',
  },
  exploreImage: {
    width: '100%',
    height: 120,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exploreInfo: {
    padding: 12,
  },
  exploreTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  exploreMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerText: {
    marginLeft: 4,
    fontSize: 10,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 10,
  },
  exploreLocation: {
    fontSize: 11,
    marginBottom: 8,
    opacity: 0.7,
  },
  exploreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  reviewsText: {
    marginLeft: 2,
    fontSize: 10,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  explorePrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  quickActionsList: {
    paddingHorizontal: 20,
  },
  quickActionCard: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ExploreScreen;