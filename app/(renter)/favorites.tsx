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

export default function FavoritesScreen() {
  const { isDark } = useTheme();
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: 'Tesla Model 3',
      price: 'KSh 15,000/day',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      rating: 4.9,
      location: 'Downtown',
      category: 'Vehicles',
      color: VibrantGreen
    },
    {
      id: 2,
      title: 'MacBook Pro M3',
      price: 'KSh 10,500/day',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      rating: 4.8,
      location: 'Tech Hub',
      category: 'Electronics',
      color: VibrantPurple
    },
    {
      id: 3,
      title: 'Professional Camera Kit',
      price: 'KSh 5,500/day',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.9,
      location: 'Media District',
      category: 'Electronics',
      color: VibrantOrange
    }
  ]);

  const removeFromFavorites = (id: number) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
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
          My Favorites
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          {favorites.length} saved items
        </Text>
      </View>

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <View style={styles.favoritesList}>
          {favorites.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.favoriteCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
              onPress={() => router.push('/(renter)/listing-detail')}
            >
              <Image source={{ uri: item.image }} style={styles.favoriteImage} />
              <View style={styles.favoriteInfo}>
                <Text style={[styles.favoriteTitle, { color: isDark ? DarkText : PrimaryText }]}>
                  {item.title}
                </Text>
                <Text style={[styles.favoriteLocation, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                  {item.location}
                </Text>
                <View style={styles.favoriteFooter}>
                  <Text style={[styles.favoritePrice, { color: item.color }]}>
                    {item.price}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFromFavorites(item.id)}
              >
                <Ionicons name="heart" size={20} color={VibrantRed} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={SecondaryText} />
          <Text style={[styles.emptyTitle, { color: isDark ? DarkText : PrimaryText }]}>
            No Favorites Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Start exploring and save items you love!
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/(renter)/explore')}
          >
            <Text style={styles.exploreButtonText}>Explore Items</Text>
          </TouchableOpacity>
        </View>
      )}
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
  favoritesList: {
    padding: 20,
  },
  favoriteCard: {
    flexDirection: 'row',
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
  favoriteImage: {
    width: 100,
    height: 100,
  },
  favoriteInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  favoriteLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoritePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: SecondaryText,
    marginLeft: 4,
    fontWeight: '600',
  },
  removeButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
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