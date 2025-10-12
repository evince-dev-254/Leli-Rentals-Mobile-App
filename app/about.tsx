import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  PrimaryText, 
  SecondaryText, 
  Border 
} from '@/constants/Colors';

const AboutScreen = () => {
  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Items Listed' },
    { number: '25K+', label: 'Successful Rentals' },
    { number: '4.8', label: 'Average Rating' },
  ];

  const values = [
    {
      icon: 'shield-checkmark',
      title: 'Trust & Safety',
      description: 'Verified users and secure payments',
    },
    {
      icon: 'people',
      title: 'Community',
      description: 'Building connections through sharing',
    },
    {
      icon: 'leaf',
      title: 'Sustainability',
      description: 'Reducing waste through sharing',
    },
    {
      icon: 'star',
      title: 'Quality',
      description: 'Curated items and excellent service',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    },
    {
      name: 'David Kim',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Browse & Search',
      description: 'Find the perfect item for your needs',
    },
    {
      number: '2',
      title: 'Book & Pay',
      description: 'Secure booking with instant confirmation',
    },
    {
      number: '3',
      title: 'Pick Up & Use',
      description: 'Convenient pickup and enjoy your rental',
    },
    {
      number: '4',
      title: 'Return & Review',
      description: 'Easy return process and share your experience',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={PrimaryBrand} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.companyBadge}>
              <Text style={styles.badgeText}>Leli Rentals</Text>
            </View>
            <Text style={styles.heroTitle}>Your Universal Rental Marketplace</Text>
            <Text style={styles.heroSubtitle}>
              Connecting people through the power of sharing. Find what you need, when you need it.
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Our Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <View style={styles.storyContainer}>
            <View style={styles.storyContent}>
              <Text style={styles.storyText}>
                Founded in 2020, Leli Rentals began with a simple idea: what if we could make 
                everything accessible to everyone? Our platform connects people who have items 
                with those who need them, creating a sustainable sharing economy.
              </Text>
              <Text style={styles.storyText}>
                Today, we're proud to serve thousands of users across the country, helping them 
                save money, reduce waste, and build stronger communities through sharing.
              </Text>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' }}
              style={styles.storyImage}
            />
          </View>
        </View>

        {/* Values Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesGrid}>
            {values.map((value, index) => (
              <View key={index} style={styles.valueCard}>
                <View style={styles.valueIcon}>
                  <Ionicons name={value.icon as any} size={24} color={PrimaryBrand} />
                </View>
                <Text style={styles.valueTitle}>{value.title}</Text>
                <Text style={styles.valueDescription}>{value.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet Our Team</Text>
          <View style={styles.teamGrid}>
            {team.map((member, index) => (
              <View key={index} style={styles.teamCard}>
                <Image source={{ uri: member.image }} style={styles.teamImage} />
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <Text style={styles.ctaDescription}>
              Join thousands of users who are already sharing and saving with Leli Rentals.
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Start Renting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctaButtonSecondary}>
                <Text style={styles.ctaButtonSecondaryText}>List Your Items</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>Questions? Contact us at</Text>
              <Text style={styles.contactEmail}>hello@lelirentals.com</Text>
            </View>
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
  heroSection: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  companyBadge: {
    backgroundColor: PrimaryBrand,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  badgeText: {
    color: WhiteBackground,
    fontSize: 14,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: WhiteBackground,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    padding: 20,
    backgroundColor: WhiteBackground,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
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
  storyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  storyContent: {
    flex: 1,
  },
  storyText: {
    fontSize: 16,
    color: SecondaryText,
    lineHeight: 22,
    marginBottom: 16,
  },
  storyImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  valueDescription: {
    fontSize: 12,
    color: SecondaryText,
    textAlign: 'center',
    lineHeight: 16,
  },
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PrimaryBrand,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: SecondaryText,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  teamImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
    textAlign: 'center',
  },
  teamRole: {
    fontSize: 12,
    color: SecondaryText,
    textAlign: 'center',
  },
  ctaSection: {
    padding: 20,
    marginBottom: 32,
  },
  ctaCard: {
    backgroundColor: PrimaryBrand,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WhiteBackground,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: WhiteBackground,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  ctaButtonText: {
    color: PrimaryBrand,
    fontSize: 14,
    fontWeight: 'bold',
  },
  ctaButtonSecondary: {
    borderWidth: 1,
    borderColor: WhiteBackground,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  ctaButtonSecondaryText: {
    color: WhiteBackground,
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 14,
    color: WhiteBackground,
    fontWeight: 'bold',
  },
});

export default AboutScreen;
