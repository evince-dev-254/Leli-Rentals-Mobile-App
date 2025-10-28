import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    Error,
    InputBackground,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    Warning,
    WhiteBackground
} from '@/constants/Colors';
import { BookingService } from '@/services/BookingService';
import { NotificationService } from '@/services/NotificationService';
import { PaymentService } from '@/services/PaymentService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Product data from browse page - in real app, this would come from API
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

const ListingDetailScreen = () => {
  const params = useLocalSearchParams();
  const listingId = params.id as string;
  
  const [selectedDates, setSelectedDates] = useState({ start: '', end: '' });
  const [quantity, setQuantity] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [rentalStatus, setRentalStatus] = useState<'available' | 'rented' | 'out_of_stock'>('available');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get product data from categories based on ID
  const getProductById = (id: string) => {
    const productId = parseInt(id);
    for (const category of categories) {
      const product = category.products.find(p => p.id === productId);
      if (product) {
        return {
          ...product,
          category: category.title,
          stock: Math.floor(Math.random() * 5) + 1, // Random stock for demo
          availableStock: Math.floor(Math.random() * 3) + 1, // Random available stock
          status: 'active' as const,
    owner: {
            id: 'owner1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
      rating: 4.9,
      responseTime: 'Within an hour',
      phone: '+254 712 345 678',
      email: 'sarah.johnson@example.com',
            verified: true,
    },
    images: [
            product.image,
            product.image, // Duplicate for demo
            product.image, // Duplicate for demo
          ],
    features: [
            'High Quality',
            'Well Maintained',
            'Easy to Use',
            'Professional Grade',
            'Includes Accessories',
    ],
    reviews: [
      {
        id: 1,
        user: 'Mike Chen',
        rating: 5,
              comment: 'Excellent item, exactly as described. Owner was very responsive and the pickup was smooth.',
        date: '2 weeks ago',
      },
      {
        id: 2,
        user: 'Emily Rodriguez',
        rating: 5,
              comment: 'Perfect for my project. Highly recommend!',
        date: '1 month ago',
      },
    ],
        };
      }
    }
    return null;
  };

  const listing = getProductById(listingId) || {
    id: listingId || '1',
    title: 'Item Not Found',
    price: 0,
    location: 'Unknown',
    rating: 0,
    reviewCount: 0,
    stock: 0,
    availableStock: 0,
    status: 'inactive' as const,
    owner: {
      id: 'owner1',
      name: 'Unknown Owner',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
      rating: 0,
      responseTime: 'Unknown',
      phone: '',
      email: '',
      verified: false,
    },
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'],
    description: 'This item could not be found.',
    features: [],
    reviews: [],
  };

  useEffect(() => {
    // Determine rental status based on available stock
    if (listing.availableStock === 0) {
      setRentalStatus('out_of_stock');
    } else if (listing.status !== 'active') {
      setRentalStatus('rented');
    } else {
      setRentalStatus('available');
    }
  }, [listing.availableStock, listing.status]);

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

  const handleRentalRequest = async () => {
    if (rentalStatus !== 'available') {
      Alert.alert(
        'Item Not Available',
        rentalStatus === 'out_of_stock' 
          ? 'This item is currently out of stock. Please check back later or contact the owner for availability updates.'
          : 'This item is currently rented. Please check back later or contact the owner for availability updates.'
      );
      return;
    }

    if (!selectedDates.start || !selectedDates.end) {
      Alert.alert('Missing Information', 'Please select both start and end dates.');
      return;
    }

    if (parseInt(quantity) > listing.availableStock) {
      Alert.alert('Insufficient Stock', `Only ${listing.availableStock} items available.`);
      return;
    }

    setIsLoading(true);
    try {
      const totalAmount = calculateTotal();
      const bookingId = await BookingService.createBooking(
        'current-user-id', // In real app, get from auth context
        listing.owner.id,
        listing.id,
        listing.title,
        selectedDates.start,
        selectedDates.end,
        totalAmount
      );

      // Process payment immediately (mock flow). In a real app, collect paymentMethodId from UI
      try {
        const paymentMethodId = 'pm_mock_default';
        await PaymentService.processPayment(
          bookingId,
          'current-user-id',
          listing.owner.id,
          totalAmount,
          paymentMethodId
        );
      } catch (paymentError) {
        console.error('Payment error:', paymentError);
        NotificationService.getInstance().showWarning(
          'Payment Pending',
          'We could not complete the payment now. You can pay later from your bookings.'
        );
      }

      NotificationService.getInstance().showSuccess(
        'Rental Request Sent!',
        'Your rental request has been sent to the owner. You will be notified when they respond.',
        {
          label: 'View Bookings',
          onPress: () => router.push('/(renter)/my-bookings')
        }
      );

      setShowRentalModal(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      NotificationService.getInstance().showError(
        'Rental Request Failed',
        'Unable to send rental request. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactOwner = () => {
    router.push({
      pathname: '/(renter)/contact-owner',
      params: {
        ownerId: listing.owner.id,
        listingId: listing.id,
        listingTitle: listing.title
      }
    });
  };

  const handleChatOwner = () => {
    router.push({
      pathname: '/(renter)/contact-owner',
      params: {
        ownerId: listing.owner.id,
        listingId: listing.id,
        ownerName: listing.owner.name
      }
    });
  };

  const getRentalStatusInfo = () => {
    switch (rentalStatus) {
      case 'available':
        return {
          text: 'Available for Rent',
          color: Success,
          icon: 'checkmark-circle'
        };
      case 'rented':
        return {
          text: 'Currently Rented',
          color: Warning,
          icon: 'time'
        };
      case 'out_of_stock':
        return {
          text: 'Out of Stock',
          color: Error,
          icon: 'close-circle'
        };
      default:
        return {
          text: 'Unknown Status',
          color: SecondaryText,
          icon: 'help-circle'
        };
    }
  };

  const statusInfo = getRentalStatusInfo();

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Back Button */}
      <BackButton onPress={() => router.back()} />

      <ScrollView style={styles.scrollView}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            pagingEnabled
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {listing.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.listingImage} />
            ))}
          </ScrollView>
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>{currentImageIndex + 1} of {listing.images.length}</Text>
          </View>
          
          {/* Stock Status Badge */}
          <View style={[styles.stockBadge, { backgroundColor: statusInfo.color }]}>
            <Ionicons name={statusInfo.icon as any} size={16} color="white" />
            <Text style={styles.stockBadgeText}>{statusInfo.text}</Text>
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
          
          <View style={styles.priceAndStockContainer}>
          <Text style={styles.priceText}>KES {listing.price.toLocaleString()}/day</Text>
            <View style={styles.stockInfo}>
              <Ionicons name="cube-outline" size={16} color={SecondaryText} />
              <Text style={styles.stockText}>
                {listing.availableStock} of {listing.stock} available
              </Text>
        </View>
              </View>
              </View>

        {/* Rental Actions */}
        <View style={styles.rentalActionsSection}>
          <Text style={styles.sectionTitle}>Rental Options</Text>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryAction]}
              onPress={() => setShowRentalModal(true)}
              disabled={rentalStatus !== 'available'}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text style={styles.actionButtonText}>
                {rentalStatus === 'available' ? 'Rent Now' : 'Not Available'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryAction]}
              onPress={handleChatOwner}
            >
              <Ionicons name="chatbubble" size={20} color={PrimaryBrand} />
              <Text style={[styles.actionButtonText, { color: PrimaryBrand }]}>Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryAction]}
              onPress={handleContactOwner}
            >
              <Ionicons name="call" size={20} color={PrimaryBrand} />
              <Text style={[styles.actionButtonText, { color: PrimaryBrand }]}>Contact</Text>
            </TouchableOpacity>
          </View>
          
          {/* Stock Warning */}
          {listing.availableStock <= 2 && listing.availableStock > 0 && (
            <View style={styles.stockWarning}>
              <Ionicons name="warning" size={16} color={Warning} />
              <Text style={styles.stockWarningText}>
                Only {listing.availableStock} left! Book now to secure your rental.
              </Text>
            </View>
          )}
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
              <View style={styles.ownerNameRow}>
              <Text style={styles.ownerName}>{listing.owner.name}</Text>
                {listing.owner.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={Success} />
                )}
              </View>
              <View style={styles.ownerRating}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.ownerRatingText}>{listing.owner.rating}</Text>
              <Text style={styles.ownerResponseTime}>Responds {listing.owner.responseTime}</Text>
            </View>
            </View>
            <View style={styles.ownerActions}>
            <TouchableOpacity 
                style={styles.ownerActionButton}
                onPress={handleChatOwner}
              >
                <Ionicons name="chatbubble" size={16} color={PrimaryBrand} />
                <Text style={styles.ownerActionText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.ownerActionButton, styles.primaryOwnerAction]}
                onPress={handleContactOwner}
              >
                <Ionicons name="call" size={16} color="white" />
                <Text style={[styles.ownerActionText, { color: 'white' }]}>Contact</Text>
            </TouchableOpacity>
            </View>
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

      {/* Rental Modal */}
      <Modal
        visible={showRentalModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRentalModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rent This Item</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowRentalModal(false)}
            >
              <Ionicons name="close" size={24} color={SecondaryText} />
            </TouchableOpacity>
    </View>

          <ScrollView style={styles.modalContent}>
            {/* Item Summary */}
            <View style={styles.modalItemSummary}>
              <Image source={{ uri: listing.images[0] }} style={styles.modalItemImage} />
              <View style={styles.modalItemInfo}>
                <Text style={styles.modalItemTitle}>{listing.title}</Text>
                <Text style={styles.modalItemPrice}>KES {listing.price.toLocaleString()}/day</Text>
                <Text style={styles.modalItemStock}>
                  {listing.availableStock} of {listing.stock} available
                </Text>
              </View>
            </View>

            {/* Rental Form */}
            <View style={styles.rentalForm}>
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
                  maxLength={2}
                />
              </View>
              
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>KES {calculateTotal().toLocaleString()}</Text>
              </View>
            </View>

            {/* Rental Terms */}
            <View style={styles.rentalTerms}>
              <Text style={styles.termsTitle}>Rental Terms</Text>
              <View style={styles.termsList}>
                <View style={styles.termItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Success} />
                  <Text style={styles.termText}>Secure payment processing</Text>
                </View>
                <View style={styles.termItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Success} />
                  <Text style={styles.termText}>24/7 customer support</Text>
                </View>
                <View style={styles.termItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Success} />
                  <Text style={styles.termText}>Damage protection included</Text>
                </View>
                <View style={styles.termItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Success} />
                  <Text style={styles.termText}>Easy pickup and return</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowRentalModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton, isLoading && styles.disabledButton]}
              onPress={handleRentalRequest}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.confirmButtonText}>Processing...</Text>
              ) : (
                <Text style={styles.confirmButtonText}>Request Rental</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
  stockBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stockBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  priceAndStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
    color: SecondaryText,
    marginLeft: 4,
  },
  rentalActionsSection: {
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
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryAction: {
    backgroundColor: PrimaryBrand,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: PrimaryBrand,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  stockWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Warning + '20',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Warning,
  },
  stockWarningText: {
    fontSize: 14,
    color: Warning,
    marginLeft: 8,
    flex: 1,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  ownerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PrimaryBrand,
    gap: 4,
  },
  primaryOwnerAction: {
    backgroundColor: PrimaryBrand,
  },
  ownerActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: PrimaryBrand,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalItemSummary: {
    flexDirection: 'row',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  modalItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryBrand,
    marginBottom: 4,
  },
  modalItemStock: {
    fontSize: 14,
    color: SecondaryText,
  },
  rentalForm: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rentalTerms: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 12,
  },
  termsList: {
    gap: 8,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termText: {
    fontSize: 14,
    color: PrimaryText,
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Border,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Border,
  },
  confirmButton: {
    backgroundColor: PrimaryBrand,
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: SecondaryText,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ListingDetailScreen;
