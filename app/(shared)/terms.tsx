import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
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

const TermsScreen = () => {
  const keyPoints = [
    {
      icon: 'shield-checkmark',
      title: 'User Safety',
      description: 'We verify all users and provide secure payment processing',
    },
    {
      icon: 'document-text',
      title: 'Clear Terms',
      description: 'Transparent policies for rentals and bookings',
    },
    {
      icon: 'people',
      title: 'Community Guidelines',
      description: 'Respectful behavior and fair treatment for all users',
    },
    {
      icon: 'card',
      title: 'Payment Protection',
      description: 'Secure transactions with dispute resolution',
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
          <View style={styles.legalBadge}>
            <Ionicons name="document-text" size={20} color={WhiteBackground} />
            <Text style={styles.badgeText}>Legal Document</Text>
          </View>
          <Text style={styles.heroTitle}>Terms of Service</Text>
          <Text style={styles.heroSubtitle}>
            Last updated: December 2024
          </Text>
        </View>

        {/* Key Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Points</Text>
          <View style={styles.keyPointsGrid}>
            {keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPointCard}>
                <View style={styles.keyPointIcon}>
                  <Ionicons name={point.icon as any} size={24} color={PrimaryBrand} />
                </View>
                <Text style={styles.keyPointTitle}>{point.title}</Text>
                <Text style={styles.keyPointDescription}>{point.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Content Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.contentText}>
            By accessing and using Leli Rentals, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.contentText}>
            Permission is granted to temporarily download one copy of Leli Rentals per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Modify or copy the materials</Text>
            <Text style={styles.bulletPoint}>• Use the materials for any commercial purpose or for any public display</Text>
            <Text style={styles.bulletPoint}>• Attempt to reverse engineer any software contained on the website</Text>
            <Text style={styles.bulletPoint}>• Remove any copyright or other proprietary notations from the materials</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.contentText}>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Rental Transactions</Text>
          <Text style={styles.contentText}>
            Leli Rentals facilitates connections between renters and owners. We are not a party to the rental agreement between users. All transactions are between the renter and owner directly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Payment Terms</Text>
          <Text style={styles.contentText}>
            Payments are processed securely through our platform. Service fees are clearly disclosed before booking. Refunds are subject to our cancellation policy and dispute resolution process.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. User Responsibilities</Text>
          <Text style={styles.contentText}>
            Users are responsible for:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Providing accurate information</Text>
            <Text style={styles.bulletPoint}>• Maintaining the security of their account</Text>
            <Text style={styles.bulletPoint}>• Following all applicable laws and regulations</Text>
            <Text style={styles.bulletPoint}>• Treating other users with respect</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Prohibited Uses</Text>
          <Text style={styles.contentText}>
            You may not use our service:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• For any unlawful purpose or to solicit others to perform unlawful acts</Text>
            <Text style={styles.bulletPoint}>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</Text>
            <Text style={styles.bulletPoint}>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</Text>
            <Text style={styles.bulletPoint}>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Disclaimers</Text>
          <Text style={styles.contentText}>
            The information on this site is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our website and the use of this website.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Limitations</Text>
          <Text style={styles.contentText}>
            In no event shall Leli Rentals or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Leli Rentals' website.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Governing Law</Text>
          <Text style={styles.contentText}>
            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
          <Text style={styles.contentText}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Contact Information</Text>
          <Text style={styles.contentText}>
            If you have any questions about these Terms of Service, please contact us at:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>Email: legal@lelirentals.com</Text>
            <Text style={styles.contactText}>Phone: +1 (555) 123-4567</Text>
            <Text style={styles.contactText}>Address: 123 Rental Street, San Francisco, CA 94102</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Leli Rentals, you acknowledge that you have read and understood these terms and agree to be bound by them.
          </Text>
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
    backgroundColor: PrimaryBrand,
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  legalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  badgeText: {
    color: WhiteBackground,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: WhiteBackground,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    backgroundColor: WhiteBackground,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: SecondaryText,
    lineHeight: 24,
    marginBottom: 16,
  },
  keyPointsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  keyPointCard: {
    width: '48%',
    backgroundColor: Background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  keyPointIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  keyPointTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  keyPointDescription: {
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 18,
  },
  bulletList: {
    marginLeft: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: SecondaryText,
    lineHeight: 24,
    marginBottom: 8,
  },
  contactInfo: {
    backgroundColor: Background,
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  contactText: {
    fontSize: 14,
    color: PrimaryText,
    marginBottom: 4,
  },
  footer: {
    backgroundColor: PrimaryBrand,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: WhiteBackground,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TermsScreen;
