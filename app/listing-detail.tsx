import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    InputBackground,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    WhiteBackground
} from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ListingDetailScreen = () => {
  const [selectedDates, setSelectedDates] = useState({ start: '', end: '' });
  const [quantity, setQuantity] = useState('1');

  const listing = {
    id: 1,
    title: 'Professional Camera Kit - Canon EOS R5',
    price: 2500, // KES per day
    location: 'Nairobi, Kenya',
    rating: 4.8,
    reviewCount: 124,
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
      rating: 4.9,
      responseTime: 'Within an hour',
      phone: '+254 712 345 678',
      email: 'sarah.johnson@example.com',
    },
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
    ],
    description: 'Professional-grade Canon EOS R5 camera with 45MP full-frame sensor, perfect for photography and videography. Includes camera body, 24-70mm lens, memory cards, and carrying case.',
    features: [
      '45MP Full-Frame Sensor',
      '8K Video Recording',
      'In-Body Image Stabilization',
      'Dual Pixel CMOS AF',
      'Weather Sealed',
    ],
    reviews: [
      {
        id: 1,
        user: 'Mike Chen',
        rating: 5,
        comment: 'Excellent camera, exactly as described. Sarah was very responsive and the pickup was smooth.',
        date: '2 weeks ago',
      },
      {
        id: 2,
        user: 'Emily Rodriguez',
        rating: 5,
        comment: 'Perfect for my wedding photography project. Highly recommend!',
        date: '1 month ago',
      },
    ],
  };

  const similarItems = [
    {
      id: 2,
      title: 'Sony A7R IV Camera',
      price: 30,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Nikon Z7 II Kit',
      price: 28,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.6,
    },
  ];

  const calculateTotal = () => {
    if (!selectedDates.start || !selectedDates.end) return 0;
    const startDate = new Date(selectedDates.start);
    const endDate = new Date(selectedDates.end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * listing.price * (parseInt(quantity) || 1);
  };

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <BackButton onPress={() => router.back()} />

      <ScrollView style={styles.scrollView}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
            {listing.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.listingImage} />
            ))}
          </ScrollView>
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>1 of {listing.images.length}</Text>
          </View>
        </View>

        {/* Listing Info */}
        <View style={styles.listingInfo}>
          <Text style={styles.listingTitle}>{listing.title}</Text>
          <View style={styles.listingMeta}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>{listing.rating}</Text>
              <Text style={styles.reviewCount}>({listing.reviewCount} reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color={SecondaryText} />
              <Text style={styles.locationText}>{listing.location}</Text>
            </View>
          </View>
          <Text style={styles.priceText}>KES {listing.price.toLocaleString()}/day</Text>
        </View>

        {/* Booking Form */}
        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>Book This Item</Text>
          <View style={styles.bookingForm}>
            <View style={styles.dateInputs}>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Select start date"
                  placeholderTextColor={SecondaryText}
                  value={selectedDates.start}
                  onChangeText={(text: string) => setSelectedDates((prev: any) => ({ ...prev, start: text }))}
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Select end date"
                  placeholderTextColor={SecondaryText}
                  value={selectedDates.end}
                  onChangeText={(text: string) => setSelectedDates((prev: any) => ({ ...prev, end: text }))}
                />
              </View>
            </View>
            <View style={styles.quantityInput}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>KES {calculateTotal().toLocaleString()}</Text>
            </View>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => router.push('/payment-completion')}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{listing.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            {listing.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={Success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Owner Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet the Owner</Text>
          <View style={styles.ownerCard}>
            <Image source={{ uri: listing.owner.avatar }} style={styles.ownerAvatar} />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{listing.owner.name}</Text>
              <View style={styles.ownerRating}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.ownerRatingText}>{listing.owner.rating}</Text>
              </View>
              <Text style={styles.ownerResponseTime}>Responds {listing.owner.responseTime}</Text>
            </View>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => router.push('/contact-owner')}
            >
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {listing.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? "star" : "star-outline"}
                      size={16}
                      color="#fbbf24"
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>

        {/* Similar Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Similar Items</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {similarItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.similarItemCard}>
                <Image source={{ uri: item.image }} style={styles.similarItemImage} />
                <Text style={styles.similarItemTitle}>{item.title}</Text>
                <Text style={styles.similarItemPrice}>${item.price}/day</Text>
                <View style={styles.similarItemRating}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.similarItemRatingText}>{item.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  listingImage: {
    width: 400,
    height: 300,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  imageCounterText: {
    color: WhiteBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  listingInfo: {
    backgroundColor: WhiteBackground,
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  listingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 12,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: SecondaryText,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: SecondaryText,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryBrand,
  },
  bookingSection: {
    backgroundColor: WhiteBackground,
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
  },
  bookingForm: {
    gap: 16,
  },
  dateInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  quantityInput: {
    width: 100,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: InputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: PrimaryText,
    borderWidth: 1,
    borderColor: Border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryBrand,
  },
  bookButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  bookButtonText: {
    color: WhiteBackground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    color: SecondaryText,
    lineHeight: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: PrimaryText,
    marginLeft: 12,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Background,
    borderRadius: 12,
    padding: 16,
  },
  ownerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ownerRatingText: {
    fontSize: 14,
    color: PrimaryText,
    marginLeft: 4,
  },
  ownerResponseTime: {
    fontSize: 14,
    color: SecondaryText,
  },
  contactButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  contactButtonText: {
    color: WhiteBackground,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: Background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: SecondaryText,
  },
  similarItemCard: {
    width: 150,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Border,
  },
  similarItemImage: {
    width: '100%',
    height: 100,
  },
  similarItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    margin: 8,
    marginBottom: 4,
  },
  similarItemPrice: {
    fontSize: 14,
    color: PrimaryBrand,
    fontWeight: 'bold',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  similarItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  similarItemRatingText: {
    fontSize: 12,
    color: PrimaryText,
    marginLeft: 4,
  },
});

export default ListingDetailScreen;
