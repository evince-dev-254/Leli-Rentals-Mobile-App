import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
  FlatList,
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

const { width } = Dimensions.get('window');

const RenterListingScreen = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Items', icon: 'grid', color: VibrantPurple },
    { id: 'vehicles', name: 'Vehicles', icon: 'car', color: VibrantGreen },
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait', color: VibrantOrange },
    { id: 'tools', name: 'Tools', icon: 'hammer', color: VibrantRed },
    { id: 'furniture', name: 'Furniture', icon: 'bed', color: VibrantPink },
    { id: 'sports', name: 'Sports', icon: 'football', color: VibrantCyan },
  ];

  const rentalItems = [
    {
      id: 1,
      title: 'Tesla Model 3',
      price: 'KSh 15,000',
      period: 'per day',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      category: 'vehicles',
      rating: 4.9,
      reviews: 128,
      location: 'Westlands, Nairobi',
      distance: '2.5 km',
      owner: 'John M.',
      verified: true,
      instantBook: true,
    },
    {
      id: 2,
      title: 'MacBook Pro M3',
      price: 'KSh 8,500',
      period: 'per day',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      category: 'electronics',
      rating: 4.8,
      reviews: 95,
      location: 'Kilimani, Nairobi',
      distance: '1.2 km',
      owner: 'Sarah K.',
      verified: true,
      instantBook: true,
    },
    {
      id: 3,
      title: 'Professional Camera Kit',
      price: 'KSh 5,500',
      period: 'per day',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      category: 'electronics',
      rating: 4.9,
      reviews: 67,
      location: 'Karen, Nairobi',
      distance: '8.3 km',
      owner: 'Mike W.',
      verified: true,
      instantBook: false,
    },
    {
      id: 4,
      title: 'Mountain Bike',
      price: 'KSh 4,500',
      period: 'per day',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      category: 'sports',
      rating: 4.7,
      reviews: 43,
      location: 'Lavington, Nairobi',
      distance: '3.1 km',
      owner: 'David L.',
      verified: true,
      instantBook: true,
    },
    {
      id: 5,
      title: 'Power Drill Set',
      price: 'KSh 3,000',
      period: 'per day',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
      category: 'tools',
      rating: 4.8,
      reviews: 89,
      location: 'Eastleigh, Nairobi',
      distance: '5.7 km',
      owner: 'Peter N.',
      verified: true,
      instantBook: true,
    },
    {
      id: 6,
      title: 'Conference Table',
      price: 'KSh 6,000',
      period: 'per day',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      category: 'furniture',
      rating: 4.6,
      reviews: 34,
      location: 'CBD, Nairobi',
      distance: '0.8 km',
      owner: 'Grace M.',
      verified: true,
      instantBook: false,
    },
  ];

  const filteredItems = rentalItems.filter(item => 
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.itemCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
      onPress={() => router.push('/listing-detail')}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        {item.instantBook && (
          <View style={styles.instantBadge}>
            <Text style={styles.instantBadgeText}>Instant Book</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color={WhiteBackground} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTitle, { color: isDark ? DarkText : PrimaryText }]}>
            {item.title}
          </Text>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={VibrantGreen} />
            </View>
          )}
        </View>
        
        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={[styles.rating, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {item.rating}
            </Text>
            <Text style={[styles.reviews, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              ({item.reviews})
            </Text>
          </View>
          <Text style={[styles.distance, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            {item.distance}
          </Text>
        </View>
        
        <Text style={[styles.location, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          {item.location}
        </Text>
        
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: PrimaryBrand }]}>{item.price}</Text>
            <Text style={[styles.period, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {item.period}
            </Text>
          </View>
          <View style={styles.ownerContainer}>
            <Text style={[styles.ownerLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              by {item.owner}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/(tabs)')}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? DarkText : PrimaryText} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ThemeAwareLogo size={100} variant="default" showText={false} />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={isDark ? DarkText : PrimaryText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Ionicons name="search" size={20} color={isDark ? DarkSecondaryText : SecondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? DarkText : PrimaryText }]}
            placeholder="Search for items..."
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={isDark ? DarkSecondaryText : SecondaryText} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === category.id ? category.color : (isDark ? DarkCard : WhiteBackground) },
                { borderColor: selectedCategory === category.id ? category.color : (isDark ? DarkBorder : Border) }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={18} 
                color={selectedCategory === category.id ? WhiteBackground : category.color} 
              />
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category.id ? WhiteBackground : (isDark ? DarkText : PrimaryText) }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: isDark ? DarkText : PrimaryText }]}>
          {filteredItems.length} items found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
          <Text style={[styles.sortText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Sort
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
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
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    backgroundColor: WhiteBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Border,
  },
  sortText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  itemsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemCard: {
    width: (width - 60) / 2,
    backgroundColor: WhiteBackground,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  instantBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: VibrantGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  instantBadgeText: {
    color: WhiteBackground,
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  verifiedBadge: {
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    marginLeft: 2,
  },
  distance: {
    fontSize: 12,
    fontWeight: '500',
  },
  location: {
    fontSize: 12,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 12,
    marginTop: 2,
  },
  ownerContainer: {
    alignItems: 'flex-end',
  },
  ownerLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default RenterListingScreen;
