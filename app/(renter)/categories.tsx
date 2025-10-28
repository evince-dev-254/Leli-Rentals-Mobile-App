import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  InputBackground, 
  PrimaryText, 
  SecondaryText, 
  Border, 
  Success,
  ElectronicsColor,
  ToolsColor,
  FurnitureColor,
  VehiclesColor,
  SportsColor,
  ClothingColor,
  BooksColor,
  MusicColor,
  HomeColor,
  GardenColor
} from '@/constants/Colors';

const CategoriesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      icon: 'phone-portrait',
      color: ElectronicsColor,
      itemCount: 1250,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      products: [
        { name: 'iPhone 15 Pro', price: '$45/day', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'MacBook Pro M3', price: '$85/day', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Sony Camera Kit', price: '$65/day', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'DJI Drone', price: '$95/day', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'Gaming Console', price: '$25/day', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop', rating: 4.6 },
        { name: 'VR Headset', price: '$35/day', image: 'https://images.unsplash.com/photo-1592478411213-6153e4c4c8d8?w=300&h=200&fit=crop', rating: 4.5 },
      ]
    },
    {
      id: 2,
      name: 'Tools',
      icon: 'hammer',
      color: ToolsColor,
      itemCount: 890,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      products: [
        { name: 'Power Drill Set', price: '$15/day', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Circular Saw', price: '$20/day', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'Welding Kit', price: '$45/day', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'Ladder Set', price: '$12/day', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop', rating: 4.6 },
        { name: 'Toolbox Kit', price: '$18/day', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop', rating: 4.5 },
        { name: 'Pressure Washer', price: '$25/day', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop', rating: 4.8 },
      ]
    },
    {
      id: 3,
      name: 'Furniture',
      icon: 'bed',
      color: FurnitureColor,
      itemCount: 650,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      products: [
        { name: 'Conference Table', price: '$40/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'Office Chairs', price: '$8/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.6 },
        { name: 'Dining Set', price: '$30/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Sofa Set', price: '$35/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'Bookshelf', price: '$15/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.5 },
        { name: 'Coffee Table', price: '$12/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.6 },
      ]
    },
    {
      id: 4,
      name: 'Vehicles',
      icon: 'car',
      color: VehiclesColor,
      itemCount: 320,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      products: [
        { name: 'Tesla Model 3', price: '$120/day', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'BMW X5', price: '$150/day', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Honda Civic', price: '$80/day', image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'Ford F-150', price: '$100/day', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Mercedes C-Class', price: '$180/day', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'Toyota Camry', price: '$90/day', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop', rating: 4.6 },
      ]
    },
    {
      id: 5,
      name: 'Sports',
      icon: 'football',
      color: SportsColor,
      itemCount: 450,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      products: [
        { name: 'Tennis Racket', price: '$12/day', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'Golf Clubs', price: '$25/day', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Skateboard', price: '$8/day', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', rating: 4.6 },
        { name: 'Surfboard', price: '$30/day', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'Basketball', price: '$5/day', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', rating: 4.5 },
        { name: 'Yoga Mat', price: '$3/day', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', rating: 4.4 },
      ]
    },
    {
      id: 6,
      name: 'Clothing',
      icon: 'shirt',
      color: ClothingColor,
      itemCount: 680,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      products: [
        { name: 'Formal Suit', price: '$25/day', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Wedding Dress', price: '$85/day', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'Costume Set', price: '$15/day', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'Winter Jacket', price: '$12/day', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', rating: 4.6 },
        { name: 'Swimwear', price: '$8/day', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', rating: 4.5 },
        { name: 'Accessories', price: '$5/day', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', rating: 4.4 },
      ]
    },
    {
      id: 7,
      name: 'Books',
      icon: 'book',
      color: BooksColor,
      itemCount: 320,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      products: [
        { name: 'Textbook Set', price: '$8/day', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', rating: 4.6 },
        { name: 'Novel Collection', price: '$5/day', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', rating: 4.5 },
        { name: 'Reference Books', price: '$6/day', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'Children Books', price: '$4/day', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Magazines', price: '$2/day', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', rating: 4.3 },
        { name: 'Comic Books', price: '$3/day', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', rating: 4.6 },
      ]
    },
    {
      id: 8,
      name: 'Music',
      icon: 'musical-notes',
      color: MusicColor,
      itemCount: 180,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      products: [
        { name: 'Guitar', price: '$15/day', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Piano', price: '$45/day', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', rating: 4.9 },
        { name: 'Drum Kit', price: '$35/day', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'Microphone', price: '$12/day', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', rating: 4.6 },
        { name: 'Speakers', price: '$20/day', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'DJ Equipment', price: '$65/day', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', rating: 4.9 },
      ]
    },
    {
      id: 9,
      name: 'Home & Garden',
      icon: 'home',
      color: HomeColor,
      itemCount: 420,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      products: [
        { name: 'Garden Tools', price: '$10/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.7 },
        { name: 'Cleaning Equipment', price: '$15/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.6 },
        { name: 'Kitchen Appliances', price: '$20/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.8 },
        { name: 'Decor Items', price: '$8/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.5 },
        { name: 'Plants', price: '$5/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.4 },
        { name: 'Lighting', price: '$12/day', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', rating: 4.6 },
      ]
    },
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoryCard = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryCard, { borderLeftColor: category.color }]}
      onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
    >
      <View style={styles.categoryHeader}>
        <View style={styles.categoryInfo}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
            <Ionicons name={category.icon} size={24} color={category.color} />
          </View>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryCount}>{category.itemCount} items</Text>
          </View>
        </View>
        <Ionicons 
          name={selectedCategory === category.id ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={SecondaryText} 
        />
      </View>
      
      {selectedCategory === category.id && (
        <View style={styles.productsContainer}>
          <Text style={styles.productsTitle}>Popular Items</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {category.products.map((product, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.productCard}
                onPress={() => router.push('/(renter)/listing-detail')}
              >
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <View style={styles.productRating}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Ionicons name="arrow-back" size={24} color={PrimaryBrand} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Browse Categories</Text>
          <Text style={styles.subtitle}>Discover items to rent by category</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={SecondaryText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor={SecondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {filteredCategories.map(renderCategoryCard)}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5,000+</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Active Owners</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: SecondaryText,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
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
    paddingVertical: 16,
    fontSize: 16,
    color: PrimaryText,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 20,
    marginBottom: 20,
    padding: 24,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Border,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '700',
    color: PrimaryText,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  categoryCount: {
    fontSize: 15,
    color: SecondaryText,
    fontWeight: '500',
  },
  productsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: Border,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PrimaryText,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  productCard: {
    width: 160,
    backgroundColor: WhiteBackground,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: '100%',
    height: 100,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 6,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: PrimaryBrand,
    marginBottom: 6,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: SecondaryText,
    marginLeft: 4,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryBrand,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: SecondaryText,
    textAlign: 'center',
  },
});

export default CategoriesScreen;