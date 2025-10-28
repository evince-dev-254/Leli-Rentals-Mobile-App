import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    DarkBackground,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantBlue,
    VibrantGreen,
    VibrantOrange,
    VibrantPink,
    VibrantPurple,
    WhiteBackground
} from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function OwnerPreviewScreen() {
  const { isDark } = useTheme();
  const [currentFeature, setCurrentFeature] = useState(0);

  const ownerFeatures = [
    {
      id: 1,
      title: 'Earn Money from Your Items',
      description: 'Turn your unused items into income. List anything from electronics to vehicles and start earning.',
      icon: 'cash-outline',
      color: VibrantGreen,
      stats: 'Average earnings: KSh 15,000/month',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Advanced Analytics Dashboard',
      description: 'Track your earnings, popular items, and customer satisfaction with detailed analytics.',
      icon: 'analytics-outline',
      color: VibrantPurple,
      stats: 'Real-time performance metrics',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Manage Your Listings',
      description: 'Easily add, edit, and manage all your rental items from one central dashboard.',
      icon: 'list-outline',
      color: VibrantOrange,
      stats: 'Unlimited listings',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Booking Management',
      description: 'See all your bookings, manage availability, and communicate with renters.',
      icon: 'calendar-outline',
      color: VibrantBlue,
      stats: 'Track all rental requests',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Customer Reviews',
      description: 'Build your reputation with customer reviews and ratings for your items.',
      icon: 'star-outline',
      color: VibrantPink,
      stats: 'Build trust with reviews',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
    }
  ];

  const successStories = [
    {
      name: 'Sarah M.',
      earnings: 'KSh 45,000',
      period: 'this month',
      items: 'Camera equipment',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'John K.',
      earnings: 'KSh 32,000',
      period: 'this month',
      items: 'Power tools',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Mary W.',
      earnings: 'KSh 28,000',
      period: 'this month',
      items: 'Furniture',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const renderFeatureCard = (feature, index) => (
    <TouchableOpacity
      key={feature.id}
      style={[
        styles.featureCard,
        { backgroundColor: isDark ? DarkCard : WhiteBackground },
        currentFeature === index && styles.activeFeatureCard
      ]}
      onPress={() => setCurrentFeature(index)}
    >
      <View style={styles.featureHeader}>
        <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
          <Ionicons name={feature.icon} size={24} color={feature.color} />
        </View>
        <View style={styles.featureInfo}>
          <Text style={[styles.featureTitle, { color: isDark ? DarkText : PrimaryText }]}>
            {feature.title}
          </Text>
          <Text style={[styles.featureStats, { color: feature.color }]}>
            {feature.stats}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSuccessStory = (story, index) => (
    <View key={index} style={[styles.successCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
      <Image source={{ uri: story.avatar }} style={styles.avatar} />
      <View style={styles.successInfo}>
        <Text style={[styles.successName, { color: isDark ? DarkText : PrimaryText }]}>
          {story.name}
        </Text>
        <Text style={[styles.successEarnings, { color: VibrantGreen }]}>
          {story.earnings} {story.period}
        </Text>
        <Text style={[styles.successItems, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Renting {story.items}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]}>
      <BackButton onPress={() => router.back()} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? DarkText : PrimaryText }]}>
            Become an Owner
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Start earning from your unused items
          </Text>
        </View>

        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Image 
            source={{ uri: ownerFeatures[currentFeature].image }} 
            style={styles.heroImage}
          />
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: isDark ? DarkText : PrimaryText }]}>
              {ownerFeatures[currentFeature].title}
            </Text>
            <Text style={[styles.heroDescription, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {ownerFeatures[currentFeature].description}
            </Text>
            <View style={styles.heroStats}>
              <Ionicons name="trending-up" size={20} color={VibrantGreen} />
              <Text style={[styles.heroStatsText, { color: VibrantGreen }]}>
                {ownerFeatures[currentFeature].stats}
              </Text>
            </View>
          </View>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Owner Features
          </Text>
          {ownerFeatures.map((feature, index) => renderFeatureCard(feature, index))}
        </View>

        {/* Success Stories */}
        <View style={styles.successSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Success Stories
          </Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Real owners earning with Leli Rentals
          </Text>
          {successStories.map((story, index) => renderSuccessStory(story, index))}
        </View>

        {/* Benefits List */}
        <View style={[styles.benefitsSection, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Why Become an Owner?
          </Text>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color={VibrantGreen} />
            <Text style={[styles.benefitText, { color: isDark ? DarkText : PrimaryText }]}>
              Earn money from items you're not using
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color={VibrantGreen} />
            <Text style={[styles.benefitText, { color: isDark ? DarkText : PrimaryText }]}>
              Set your own prices and availability
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color={VibrantGreen} />
            <Text style={[styles.benefitText, { color: isDark ? DarkText : PrimaryText }]}>
              Track performance with detailed analytics
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color={VibrantGreen} />
            <Text style={[styles.benefitText, { color: isDark ? DarkText : PrimaryText }]}>
              Build reputation with customer reviews
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color={VibrantGreen} />
            <Text style={[styles.benefitText, { color: isDark ? DarkText : PrimaryText }]}>
              Secure payments and insurance coverage
            </Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: PrimaryBrand }]}
            onPress={() => router.push('/account-type')}
          >
            <Ionicons name="arrow-forward" size={20} color={WhiteBackground} />
            <Text style={styles.primaryButtonText}>Switch to Owner Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: PrimaryBrand }]}
            onPress={() => router.push('/help')}
          >
            <Ionicons name="help-circle-outline" size={20} color={PrimaryBrand} />
            <Text style={[styles.secondaryButtonText, { color: PrimaryBrand }]}>
              Learn More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  heroSection: {
    borderRadius: 16,
    marginBottom: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Border,
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStatsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  featureCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  activeFeatureCard: {
    borderColor: PrimaryBrand,
    borderWidth: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureStats: {
    fontSize: 14,
    fontWeight: '500',
  },
  successSection: {
    marginBottom: 30,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  successInfo: {
    flex: 1,
  },
  successName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  successEarnings: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  successItems: {
    fontSize: 14,
  },
  benefitsSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Border,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  ctaSection: {
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: WhiteBackground,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
