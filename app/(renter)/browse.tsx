import {
  Border,
  DarkBackground,
  DarkBorder,
  DarkCard,
  DarkSecondaryText,
  DarkText,
  PrimaryText,
  SecondaryText,
  WhiteBackground,
} from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BrowseScreen = () => {
  const { isDark } = useTheme();
  const { accountType } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animatedValues] = useState(() => 
    Array.from({ length: 50 }, () => new Animated.Value(1))
  );

  const categories = [
    {
      id: 'electronics',
      title: 'Electronics',
      icon: 'phone-portrait-outline',
      color: '#45B7D1',
      description: 'Laptops, cameras, gaming consoles, and more',
      products: [
        {
          id: 1,
          title: 'MacBook Pro M2',
          price: 150,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
          rating: 4.8,
          location: 'Nairobi, Kenya',
          description: 'Latest MacBook Pro with M2 chip, perfect for work and creative projects'
        },
        {
          id: 2,
          title: 'Professional Camera Kit',
          price: 80,
          image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
          rating: 4.9,
          location: 'Mombasa, Kenya',
          description: 'Complete camera setup with lenses and accessories'
        },
        {
          id: 3,
          title: 'Gaming Console',
          price: 60,
          image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
          rating: 4.7,
          location: 'Kisumu, Kenya',
          description: 'Latest gaming console with controllers and games'
        },
        {
          id: 4,
          title: 'iPad Pro 12.9"',
          price: 45,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
          rating: 4.6,
          location: 'Nairobi, Kenya',
          description: 'High-performance tablet for creative work and entertainment'
        },
        {
          id: 5,
          title: 'DJ Controller',
          price: 35,
          image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop',
          rating: 4.5,
          location: 'Mombasa, Kenya',
          description: 'Professional DJ controller for events and parties'
        },
        {
          id: 6,
          title: 'VR Headset',
          price: 25,
          image: 'https://images.unsplash.com/photo-1592478411213-6153e4c4c8f4?w=400&h=300&fit=crop',
          rating: 4.4,
          location: 'Kisumu, Kenya',
          description: 'Immersive virtual reality headset for gaming and experiences'
        }
      ]
    },
    {
      id: 'vehicles',
      title: 'Vehicles',
      icon: 'car-outline',
      color: '#4ECDC4',
      description: 'Cars, motorcycles, and transportation',
      products: [
        {
          id: 7,
          title: 'Tesla Model 3',
          price: 500,
          image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
          rating: 4.9,
          location: 'Nairobi, Kenya',
          description: 'Electric vehicle with autopilot features'
        },
        {
          id: 8,
          title: 'Motorcycle',
          price: 120,
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
          rating: 4.6,
          location: 'Eldoret, Kenya',
          description: 'Reliable motorcycle for city commuting'
        },
        {
          id: 9,
          title: 'Toyota Land Cruiser',
          price: 300,
          image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
          rating: 4.8,
          location: 'Nairobi, Kenya',
          description: 'Rugged SUV perfect for safari and off-road adventures'
        },
        {
          id: 10,
          title: 'Bicycle',
          price: 15,
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
          rating: 4.3,
          location: 'Nakuru, Kenya',
          description: 'Mountain bike for city tours and exercise'
        },
        {
          id: 11,
          title: 'Scooter',
          price: 20,
          image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
          rating: 4.2,
          location: 'Mombasa, Kenya',
          description: 'Electric scooter for short city trips'
        },
        {
          id: 12,
          title: 'Boat',
          price: 200,
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
          rating: 4.7,
          location: 'Kisumu, Kenya',
          description: 'Motorboat for lake fishing and water activities'
        }
      ]
    },
    {
      id: 'tools',
      title: 'Tools & Equipment',
      icon: 'construct-outline',
      color: '#96CEB4',
      description: 'Construction tools and professional equipment',
      products: [
        {
          id: 13,
          title: 'Power Drill Set',
          price: 25,
          image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
          rating: 4.5,
          location: 'Nakuru, Kenya',
          description: 'Complete power drill set with various bits'
        },
        {
          id: 14,
          title: 'Welding Machine',
          price: 80,
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
          rating: 4.7,
          location: 'Thika, Kenya',
          description: 'Professional welding machine for metal work'
        },
        {
          id: 15,
          title: 'Generator 5KVA',
          price: 50,
          image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
          rating: 4.6,
          location: 'Nairobi, Kenya',
          description: 'Portable generator for power backup during events'
        },
        {
          id: 16,
          title: 'Ladder Set',
          price: 12,
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
          rating: 4.3,
          location: 'Mombasa, Kenya',
          description: 'Extension ladder for construction and maintenance work'
        },
        {
          id: 17,
          title: 'Pressure Washer',
          price: 30,
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
          rating: 4.4,
          location: 'Kisumu, Kenya',
          description: 'High-pressure washer for cleaning and maintenance'
        },
        {
          id: 18,
          title: 'Concrete Mixer',
          price: 40,
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
          rating: 4.5,
          location: 'Eldoret, Kenya',
          description: 'Portable concrete mixer for construction projects'
        }
      ]
    },
    {
      id: 'furniture',
      title: 'Furniture',
      icon: 'bed-outline',
      color: '#A55EEA',
      description: 'Office furniture and home decor',
      products: [
        {
          id: 19,
          title: 'Office Desk',
          price: 40,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          rating: 4.4,
          location: 'Nairobi, Kenya',
          description: 'Modern office desk with storage compartments'
        },
        {
          id: 20,
          title: 'Dining Table Set',
          price: 60,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          rating: 4.6,
          location: 'Mombasa, Kenya',
          description: '6-seater dining table with chairs'
        },
        {
          id: 21,
          title: 'Sofa Set',
          price: 80,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          rating: 4.5,
          location: 'Nairobi, Kenya',
          description: '3-seater sofa with matching armchairs'
        },
        {
          id: 22,
          title: 'Office Chair',
          price: 25,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          rating: 4.3,
          location: 'Kisumu, Kenya',
          description: 'Ergonomic office chair with lumbar support'
        },
        {
          id: 23,
          title: 'Coffee Table',
          price: 20,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          rating: 4.2,
          location: 'Nakuru, Kenya',
          description: 'Glass-top coffee table for living room'
        },
        {
          id: 24,
          title: 'Bookshelf',
          price: 15,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          rating: 4.1,
          location: 'Mombasa, Kenya',
          description: '5-tier wooden bookshelf for storage'
        }
      ]
    },
    {
      id: 'sports',
      title: 'Sports & Recreation',
      icon: 'football-outline',
      color: '#FF6B6B',
      description: 'Sports equipment and recreational items',
      products: [
        {
          id: 25,
          title: 'Tennis Racket Set',
          price: 18,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
          rating: 4.4,
          location: 'Nairobi, Kenya',
          description: 'Professional tennis racket with balls and case'
        },
        {
          id: 26,
          title: 'Golf Clubs Set',
          price: 45,
          image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop',
          rating: 4.6,
          location: 'Mombasa, Kenya',
          description: 'Complete golf club set with bag and accessories'
        },
        {
          id: 27,
          title: 'Basketball',
          price: 8,
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
          rating: 4.2,
          location: 'Kisumu, Kenya',
          description: 'Official size basketball for court games'
        },
        {
          id: 28,
          title: 'Fitness Equipment',
          price: 35,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          rating: 4.5,
          location: 'Nairobi, Kenya',
          description: 'Dumbbells and resistance bands set'
        },
        {
          id: 29,
          title: 'Swimming Pool',
          price: 100,
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
          rating: 4.7,
          location: 'Mombasa, Kenya',
          description: 'Inflatable swimming pool for events'
        },
        {
          id: 30,
          title: 'Tent & Camping',
          price: 30,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
          rating: 4.3,
          location: 'Nakuru, Kenya',
          description: '4-person tent with camping accessories'
        }
      ]
    },
    {
      id: 'events',
      title: 'Events & Parties',
      icon: 'musical-notes-outline',
      color: '#FFD93D',
      description: 'Event equipment and party supplies',
      products: [
        {
          id: 31,
          title: 'Sound System',
          price: 75,
          image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop',
          rating: 4.8,
          location: 'Nairobi, Kenya',
          description: 'Professional PA system with microphones'
        },
        {
          id: 32,
          title: 'Projector & Screen',
          price: 40,
          image: 'https://images.unsplash.com/photo-1592478411213-6153e4c4c8f4?w=400&h=300&fit=crop',
          rating: 4.5,
          location: 'Mombasa, Kenya',
          description: 'HD projector with 100" screen for presentations'
        },
        {
          id: 33,
          title: 'Party Tent',
          price: 50,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
          rating: 4.4,
          location: 'Kisumu, Kenya',
          description: 'Large party tent for outdoor events'
        },
        {
          id: 34,
          title: 'Lighting Setup',
          price: 25,
          image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop',
          rating: 4.3,
          location: 'Nairobi, Kenya',
          description: 'LED lighting system for events and parties'
        },
        {
          id: 35,
          title: 'Tables & Chairs',
          price: 35,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          rating: 4.2,
          location: 'Mombasa, Kenya',
          description: 'Set of 10 tables and 40 chairs for events'
        },
        {
          id: 36,
          title: 'Catering Equipment',
          price: 45,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
          rating: 4.6,
          location: 'Kisumu, Kenya',
          description: 'Complete catering setup with serving dishes'
        }
      ]
    }
  ];

  const handleCardPress = (index: number, productId: number) => {
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
    router.push(`/(renter)/listing-detail?id=${productId}`);
  };

  const renderProduct = (product: any, productIndex: number, categoryIndex: number) => {
    const globalIndex = categoryIndex * 10 + productIndex;
    return (
      <Animated.View
        key={product.id}
        style={{ transform: [{ scale: animatedValues[globalIndex] || 1 }] }}
      >
        <TouchableOpacity
          style={[styles.productCard, isDark && styles.darkCard]}
          onPress={() => handleCardPress(globalIndex, product.id)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productContent}>
            <Text style={[styles.productTitle, isDark && styles.darkText]} numberOfLines={2}>
              {product.title}
            </Text>
            <View style={styles.productLocation}>
              <Ionicons name="location-outline" size={12} color={isDark ? DarkSecondaryText : SecondaryText} />
              <Text style={[styles.productLocationText, isDark && styles.darkSecondaryText]} numberOfLines={1}>
                {product.location}
              </Text>
            </View>
            <View style={styles.productFooter}>
              <View style={styles.productRating}>
                <Ionicons name="star" size={12} color="#FF6B35" />
                <Text style={[styles.productRatingText, isDark && styles.darkSecondaryText]}>
                  {product.rating}
                </Text>
              </View>
              <Text style={[styles.productPrice, isDark && styles.darkText]}>
                KSh {product.price}/day
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Filter products based on selected category and search query
  const filteredProducts = selectedCategory === 'all' 
    ? categories.flatMap(category => category.products)
    : categories.find(cat => cat.id === selectedCategory)?.products || [];

  const searchFilteredProducts = searchQuery 
    ? filteredProducts.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProducts;

  console.log('Selected category:', selectedCategory);
  console.log('Search query:', searchQuery);
  console.log('Filtered products count:', searchFilteredProducts.length);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>
          {accountType === 'owner' ? 'Browse Items to Rent' : 'Find Perfect Rentals'}
        </Text>
        <Text style={[styles.headerSubtitle, isDark && styles.darkSecondaryText]}>
          {accountType === 'owner' ? 'Discover items you can rent for your business' : 'Discover amazing items to rent near you'}
        </Text>
      </View>

      {/* Category Navigation - Top Level */}
      <View style={styles.topCategoryNav}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topCategoryNavContent}>
          <TouchableOpacity
            style={[
              styles.topCategoryTab,
              selectedCategory === 'all' && styles.activeTopCategoryTab,
              isDark && styles.darkTopCategoryTab
            ]}
            onPress={() => setSelectedCategory('all')}
            activeOpacity={0.8}
          >
            <Ionicons name="grid-outline" size={20} color={selectedCategory === 'all' ? 'white' : (isDark ? DarkText : PrimaryText)} />
            <Text style={[
              styles.topCategoryTabText,
              selectedCategory === 'all' && styles.activeTopCategoryTabText,
              isDark && styles.darkTopCategoryTabText
            ]}>
              All Items
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.topCategoryTab,
                selectedCategory === category.id && styles.activeTopCategoryTab,
                isDark && styles.darkTopCategoryTab
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.8}
            >
              <Ionicons name={category.icon as any} size={20} color={selectedCategory === category.id ? 'white' : (isDark ? DarkText : PrimaryText)} />
              <Text style={[
                styles.topCategoryTabText,
                selectedCategory === category.id && styles.activeTopCategoryTabText,
                isDark && styles.darkTopCategoryTabText
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDark && styles.darkSearchContainer]}>
        <Ionicons name="search" size={20} color={isDark ? DarkSecondaryText : SecondaryText} />
        <TextInput
          style={[styles.searchInput, isDark && styles.darkText]}
          placeholder="Search items to rent..."
          placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Products Grid */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.productsGrid}>
          {searchFilteredProducts.map((product, index) => 
            renderProduct(product, index, 0)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCE8',
  },
  darkContainer: {
    backgroundColor: DarkBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  darkHeader: {
    backgroundColor: DarkBackground,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: SecondaryText,
    textAlign: 'center',
    opacity: 0.8,
  },
  topCategoryNav: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  topCategoryNavContent: {
    paddingRight: 20,
  },
  topCategoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 44,
  },
  activeTopCategoryTab: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  darkTopCategoryTab: {
    backgroundColor: '#2a2a2a',
    borderColor: '#404040',
  },
  topCategoryTabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeTopCategoryTabText: {
    color: 'white',
  },
  darkTopCategoryTabText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkSearchContainer: {
    backgroundColor: DarkCard,
    borderColor: DarkBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: PrimaryText,
  },
  categoryNav: {
    marginBottom: 20,
  },
  categoryNavContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Border,
    backgroundColor: WhiteBackground,
  },
  activeCategoryTab: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  darkCategoryTab: {
    borderColor: DarkBorder,
    backgroundColor: DarkCard,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: PrimaryText,
    marginLeft: 6,
  },
  activeCategoryTabText: {
    color: '#000000',
    fontWeight: '600',
  },
  darkCategoryTabText: {
    color: DarkText,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 8,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 20,
  },
  productsScrollContainer: {
    paddingRight: 20,
  },
  productCard: {
    width: (width - 60) / 2, // Two columns with proper spacing
    backgroundColor: WhiteBackground,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Border,
    overflow: 'hidden',
  },
  darkCard: {
    backgroundColor: DarkCard,
    borderColor: DarkBorder,
  },
  productImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productContent: {
    padding: 14,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 6,
    lineHeight: 18,
  },
  darkText: {
    color: DarkText,
  },
  productLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productLocationText: {
    fontSize: 12,
    color: SecondaryText,
    marginLeft: 4,
  },
  darkSecondaryText: {
    color: DarkSecondaryText,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRatingText: {
    fontSize: 12,
    color: SecondaryText,
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 4,
  },
});

export default BrowseScreen;