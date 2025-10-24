import { useAccount } from '@/contexts/AccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
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
        name: 'Clothing',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=100&fit=crop',
        icon: '👕'
      }
    ]
  },
  {
    id: 2,
    title: 'Earn Money',
    subtitle: 'List your items and start earning',
    description: 'Turn your unused items into income. List anything from tools to vehicles and start earning money today.',
    color: '#10b981',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    icon: '💰',
    features: [
      'Set your own prices',
      'Flexible rental periods',
      'Secure payments',
      'Easy item management'
    ]
  },
  {
    id: 3,
    title: 'Safe & Secure',
    subtitle: 'Your safety is our priority',
    description: 'We verify all users and provide secure payment processing to ensure safe transactions for everyone.',
    color: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    icon: '🛡️',
    features: [
      'User verification',
      'Secure payments',
      'Insurance coverage',
      '24/7 support'
    ]
  }
];

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();
  const { accountType } = useAccount();
  const insets = useSafeAreaInsets();

  const navigateAfterOnboarding = () => {
    // Mark onboarding as completed
    if (Platform.OS === 'web') {
      localStorage.setItem('onboardingCompleted', 'true');
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.setItem('onboardingCompleted', 'true');
    }

    // Navigate based on authentication status
    if (user) {
      if (accountType) {
        // User is authenticated and has account type, go to main app
        router.replace('/(tabs)');
      } else {
        // User is authenticated but hasn't selected account type
        router.replace('/account-type');
      }
    } else {
      // User is not authenticated, go to login
      router.replace('/login');
    }
  };

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigateAfterOnboarding();
    }
  };

  const handleSkip = () => {
    navigateAfterOnboarding();
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentData = onboardingData[currentSlide];

  return (
    <View className="flex-1 bg-background">
      {/* Header with progress indicator */}
      <View className="flex-row justify-between items-center px-6 pt-4" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row space-x-2">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-1 flex-1 rounded ${
                index === currentSlide ? 'bg-primary-brand' : 'bg-border'
              }`}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleSkip} className="px-4 py-2">
          <Text className="text-primary-brand font-medium">Skip</Text>
          </TouchableOpacity>
      </View>

      {/* Main content */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View className="px-6 py-8">
                    <Image 
            source={{ uri: currentData.image }}
            className="w-full h-64 rounded-2xl mb-6"
                      resizeMode="cover"
                    />
        </View>

        {/* Content */}
        <View className="px-6 flex-1">
          <View className="items-center mb-8">
            <Text className="text-4xl mb-4">{currentData.icon}</Text>
            <Text className="text-3xl font-bold text-text-primary text-center mb-3">
              {currentData.title}
            </Text>
            <Text className="text-lg text-text-secondary text-center mb-4">
              {currentData.subtitle}
            </Text>
            <Text className="text-base text-text-secondary text-center leading-6">
              {currentData.description}
            </Text>
                    </View>

          {/* Categories for slide 1 */}
          {currentSlide === 0 && (
            <View className="mb-8">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                Popular Categories
              </Text>
              <View className="flex-row flex-wrap justify-center space-x-2 space-y-2">
                {currentData.categories.map((category, index) => (
                  <View
                    key={index}
                    className="bg-card p-3 rounded-xl items-center min-w-[80px] shadow-card"
                  >
                    <Text className="text-2xl mb-1">{category.icon}</Text>
                    <Text className="text-xs text-text-primary font-medium text-center">
                      {category.name}
                    </Text>
                  </View>
                ))}
              </View>
                </View>
          )}

          {/* Features for slides 2 and 3 */}
          {(currentSlide === 1 || currentSlide === 2) && (
            <View className="mb-8">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                Key Features
              </Text>
              <View className="space-y-3">
                {currentData.features.map((feature, index) => (
                  <View key={index} className="flex-row items-center">
                    <View className="w-2 h-2 bg-primary-brand rounded-full mr-3" />
                    <Text className="text-text-secondary flex-1">{feature}</Text>
        </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Navigation buttons */}
        <View className="px-6 pb-8" style={{ paddingBottom: Math.max(insets.bottom, 32) }}>
          <View className="flex-row justify-between items-center">
          <TouchableOpacity
              onPress={handlePrevious}
              className={`py-3 px-6 rounded-xl ${
                currentSlide === 0 ? 'opacity-0' : 'bg-muted-background'
              }`}
              disabled={currentSlide === 0}
            >
              <Text className="text-text-secondary font-medium">Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
              className="bg-primary-brand py-4 px-8 rounded-xl flex-1 mx-4"
          >
              <Text className="text-white font-semibold text-center text-base">
                {currentSlide === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>

            <View className="w-20" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OnboardingScreen;