import {
    Background,
    Border,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    WhiteBackground,
} from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ExploreScreen = () => {
  const [animatedValues] = useState(() =>
    Array.from({ length: 6 }, () => new Animated.Value(1))
  );

  const handleCardPress = (index: number, route: string) => {
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
    router.push(route as any);
  };

  const featuredListings = [
    {
      id: 1,
      title: 'Canon EOS R5',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      price: 45,
      rating: 4.9,
      category: 'Electronics',
    },
    {
      id: 2,
      title: 'DJ Controller',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop',
      price: 60,
      rating: 4.8,
      category: 'Events',
    },
    {
      id: 3,
      title: 'Mountain Bike',
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
      price: 25,
      rating: 4.7,
      category: 'Sports',
    },
  ];

  const categories = [
    { name: 'Electronics', icon: 'laptop-outline', color: '#4A90E2' },
    { name: 'Transportation', icon: 'car-outline', color: '#50C878' },
    { name: 'Events', icon: 'musical-notes-outline', color: '#9B59B6' },
    { name: 'Sports', icon: 'basketball-outline', color: '#E67E22' },
    { name: 'Tools', icon: 'construct-outline', color: '#E74C3C' },
    { name: 'Fashion', icon: 'shirt-outline', color: '#F39C12' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Discover amazing items to rent</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.name}
                style={{ transform: [{ scale: animatedValues[index] }] }}
              >
                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={() => handleCardPress(index, '/(renter)/browse')}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon as any} size={28} color={category.color} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Featured Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Items</Text>
            <TouchableOpacity onPress={() => router.push('/(renter)/browse')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredListings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={styles.featuredCard}
                onPress={() => router.push(`/(renter)/listing-detail?id=${listing.id}`)}
              >
                <Image source={{ uri: listing.image }} style={styles.featuredImage} />
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <View style={styles.featuredMeta}>
                    <Text style={styles.featuredPrice}>${listing.price}/day</Text>
                    <View style={styles.rating}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{listing.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Near You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Near You</Text>
          <View style={styles.popularContainer}>
            {featuredListings.map((listing) => (
              <TouchableOpacity
                key={`popular-${listing.id}`}
                style={styles.popularCard}
                onPress={() => router.push(`/(renter)/listing-detail?id=${listing.id}`)}
              >
                <Image source={{ uri: listing.image }} style={styles.popularImage} />
                <View style={styles.popularInfo}>
                  <Text style={styles.popularTitle}>{listing.title}</Text>
                  <Text style={styles.popularCategory}>{listing.category}</Text>
                  <View style={styles.popularFooter}>
                    <Text style={styles.popularPrice}>${listing.price}/day</Text>
                    <View style={styles.rating}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.ratingText}>{listing.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  headerSubtitle: {
    fontSize: 14,
    color: SecondaryText,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: PrimaryBrand,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryCard: {
    width: 110,
    margin: 8,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Border,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: PrimaryText,
    textAlign: 'center',
  },
  featuredCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Border,
  },
  featuredImage: {
    width: '100%',
    height: 150,
  },
  featuredInfo: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryBrand,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: SecondaryText,
    fontWeight: '600',
  },
  popularContainer: {
    gap: 12,
  },
  popularCard: {
    flexDirection: 'row',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Border,
  },
  popularImage: {
    width: 100,
    height: 100,
  },
  popularInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
  },
  popularCategory: {
    fontSize: 12,
    color: SecondaryText,
  },
  popularFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryBrand,
  },
});

export default ExploreScreen;
