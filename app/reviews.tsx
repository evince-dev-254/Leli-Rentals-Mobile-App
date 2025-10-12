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

export default function ReviewsScreen() {
  const { isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('received');
  const [reviews, setReviews] = useState([
    {
      id: 1,
      type: 'received',
      title: 'Tesla Model 3',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      rating: 5,
      comment: 'Excellent car, very clean and well maintained. Owner was punctual and professional.',
      reviewer: 'Sarah Johnson',
      date: '2024-01-10',
      reviewerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      type: 'received',
      title: 'MacBook Pro M3',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      rating: 4,
      comment: 'Great laptop, worked perfectly for my project. Would rent again.',
      reviewer: 'Mike Chen',
      date: '2024-01-08',
      reviewerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      type: 'given',
      title: 'Professional Camera Kit',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 5,
      comment: 'Amazing camera equipment, perfect for my photography project. Highly recommended!',
      reviewer: 'You',
      date: '2024-01-05',
      reviewerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ]);

  const filteredReviews = reviews.filter(review => review.type === selectedTab);
  const averageRating = reviews.filter(r => r.type === 'received').reduce((sum, r) => sum + r.rating, 0) / reviews.filter(r => r.type === 'received').length || 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#fbbf24"
      />
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
          Reviews
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Manage your reviews and ratings
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.statNumber, { color: VibrantOrange }]}>
            {averageRating.toFixed(1)}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Average Rating
          </Text>
          <View style={styles.starsContainer}>
            {renderStars(Math.round(averageRating))}
          </View>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.statNumber, { color: VibrantGreen }]}>
            {reviews.filter(r => r.type === 'received').length}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Reviews Received
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.statNumber, { color: VibrantPurple }]}>
            {reviews.filter(r => r.type === 'given').length}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Reviews Given
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedTab === 'received' && styles.activeTab,
            { backgroundColor: selectedTab === 'received' ? PrimaryBrand : (isDark ? DarkCard : WhiteBackground) }
          ]}
          onPress={() => setSelectedTab('received')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'received' ? WhiteBackground : (isDark ? DarkText : PrimaryText) }
          ]}>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedTab === 'given' && styles.activeTab,
            { backgroundColor: selectedTab === 'given' ? PrimaryBrand : (isDark ? DarkCard : WhiteBackground) }
          ]}
          onPress={() => setSelectedTab('given')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'given' ? WhiteBackground : (isDark ? DarkText : PrimaryText) }
          ]}>
            Given
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <View style={styles.reviewsContainer}>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <View 
              key={review.id} 
              style={[styles.reviewCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
            >
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.image }} style={styles.reviewItemImage} />
                <View style={styles.reviewItemInfo}>
                  <Text style={[styles.reviewItemTitle, { color: isDark ? DarkText : PrimaryText }]}>
                    {review.title}
                  </Text>
                  <View style={styles.reviewRating}>
                    {renderStars(review.rating)}
                    <Text style={[styles.ratingText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                      {review.rating}/5
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.reviewContent}>
                <View style={styles.reviewerInfo}>
                  <Image source={{ uri: review.reviewerImage }} style={styles.reviewerImage} />
                  <View style={styles.reviewerDetails}>
                    <Text style={[styles.reviewerName, { color: isDark ? DarkText : PrimaryText }]}>
                      {review.reviewer}
                    </Text>
                    <Text style={[styles.reviewDate, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                      {review.date}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.reviewComment, { color: isDark ? DarkText : PrimaryText }]}>
                  "{review.comment}"
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={64} color={SecondaryText} />
            <Text style={[styles.emptyTitle, { color: isDark ? DarkText : PrimaryText }]}>
              No {selectedTab} Reviews
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {selectedTab === 'received' ? 'You haven\'t received any reviews yet' : 
               'You haven\'t given any reviews yet'}
            </Text>
            {selectedTab === 'given' && (
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => router.push('/my-bookings')}
              >
                <Text style={styles.exploreButtonText}>View Bookings</Text>
              </TouchableOpacity>
            )}
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
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: PrimaryBrand,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsContainer: {
    padding: 20,
  },
  reviewCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  reviewContent: {
    borderTopWidth: 1,
    borderTopColor: Border,
    paddingTop: 16,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
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