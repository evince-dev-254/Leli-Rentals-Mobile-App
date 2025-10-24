import { useAccount } from '@/contexts/AccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Find Perfect Rentals',
    subtitle: 'Discover amazing items to rent near you',
    description: 'Browse through thousands of listings and find exactly what you need for your next project or event.',
    color: '#d97706',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    icon: '🏠',
    categories: [
      {
        name: 'Vehicles',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=150&h=100&fit=crop',
        icon: '🚗'
      },
      {
        name: 'Electronics',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=100&fit=crop',
        icon: '📱'
      },
      {
        name: 'Tools',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=100&fit=crop',
        icon: '🔧'
      },
      {
        name: 'Sports',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop',
        icon: '⚽'
      },
      {
        name: 'Furniture',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=100&fit=crop',
        icon: '🪑'
      },
      {
        name: 'Cameras',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=150&h=100&fit=crop',
        icon: '📷'
      }
    ]
  },
  {
    id: 2,
    title: 'Easy Booking',
    subtitle: 'Book with confidence',
    description: 'Simple booking process with secure payments and instant confirmation.',
    color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    icon: '📱',
  },
  {
    id: 3,
    title: 'Earn Money',
    subtitle: 'List your items and earn',
    description: 'Turn your unused items into extra income by listing them on our platform.',
    color: '#fbbf24',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    icon: '💰',
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { accountType } = useAccount();

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Onboarding completed, navigate based on authentication status
      await navigateAfterOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = async () => {
    // Onboarding skipped, navigate based on authentication status
    await navigateAfterOnboarding();
  };

  const navigateAfterOnboarding = async () => {
    // Mark onboarding as completed (for future reference)
    if (Platform.OS === 'web') {
      localStorage.setItem('hasSeenOnboarding', 'true');
    } else {
      // For mobile, use localStorage as fallback
      try {
        localStorage.setItem('hasSeenOnboarding', 'true');
      } catch (error) {
        // If localStorage is not available, just continue
        console.log('localStorage not available, continuing...');
      }
    }

    // Navigate based on authentication status
    if (user) {
      // User is authenticated, check if they have selected an account type
      if (accountType) {
        // User has selected account type, go to main app
        router.replace('/(tabs)');
      } else {
        // User needs to select account type
        router.replace('/account-type');
      }
    } else {
      // User is not authenticated, show login
      router.replace('/login');
    }
  };

  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.slideContainer}>
          {/* Rental Image or Category Grid */}
          <View style={styles.imageContainer}>
            {currentSlide.categories ? (
              <View style={styles.categoriesGrid}>
                {currentSlide.categories.map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <Image 
                      source={{ uri: category.image }} 
                      style={styles.categoryImage}
                      resizeMode="cover"
                    />
                    <View style={styles.categoryOverlay}>
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <>
                <Image 
                  source={{ uri: currentSlide.image }} 
                  style={styles.rentalImage}
                  resizeMode="cover"
                />
                <View style={[styles.iconOverlay, { backgroundColor: currentSlide.color }]}>
                  <Text style={styles.iconText}>{currentSlide.icon}</Text>
                </View>
              </>
            )}
          </View>
          
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </View>

        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentIndex ? currentSlide.color : '#ccc',
                },
              ]}
            />
          ))}
        </View>

        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.nextButton, { backgroundColor: currentSlide.color }]}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefce8', // Leli Rentals light cream background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  backButtonText: {
    fontSize: 16,
    color: '#d97706',
    fontWeight: '600',
  },
  slideContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingTop: 80, // Space for back button
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  rentalImage: {
    width: 280,
    height: 200,
    borderRadius: 20,
  },
  iconOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#d97706',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827', // Leli Rentals dark text
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
    color: '#6b7280', // Leli Rentals secondary text
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#6b7280', // Leli Rentals secondary text
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 32,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb', // Leli Rentals border color
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6b7280', // Leli Rentals secondary text
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#d97706',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: 280,
    gap: 8,
  },
  categoryItem: {
    width: '48%',
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
