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

const PrivacyScreen = () => {
  const keyPoints = [
    {
      icon: 'shield-checkmark',
      title: 'Data Protection',
      description: 'We use industry-standard encryption to protect your data',
    },
    {
      icon: 'eye-off',
      title: 'Privacy First',
      description: 'We never sell your personal information to third parties',
    },
    {
      icon: 'settings',
      title: 'Your Control',
      description: 'You can manage your privacy settings at any time',
    },
    {
      icon: 'document-text',
      title: 'Transparency',
      description: 'Clear information about how we use your data',
    },
  ];

  const dataRights = [
    {
      title: 'Access Your Data',
      description: 'Request a copy of all data we have about you',
    },
    {
      title: 'Correct Information',
      description: 'Update or correct any inaccurate personal information',
    },
    {
      title: 'Delete Your Data',
      description: 'Request deletion of your personal information',
    },
    {
      title: 'Data Portability',
      description: 'Export your data in a machine-readable format',
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
          <View style={styles.privacyBadge}>
            <Ionicons name="shield-checkmark" size={20} color={WhiteBackground} />
            <Text style={styles.badgeText}>Privacy Policy</Text>
          </View>
          <Text style={styles.heroTitle}>Your Privacy Matters</Text>
          <Text style={styles.heroSubtitle}>
            Last updated: December 2024
          </Text>
        </View>

        {/* Key Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Privacy Commitment</Text>
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
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.contentText}>
            We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.
          </Text>
          <Text style={styles.subsectionTitle}>Personal Information:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Name, email address, and phone number</Text>
            <Text style={styles.bulletPoint}>• Profile information and preferences</Text>
            <Text style={styles.bulletPoint}>• Payment and billing information</Text>
            <Text style={styles.bulletPoint}>• Identity verification documents</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.contentText}>
            We use the information we collect to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Provide, maintain, and improve our services</Text>
            <Text style={styles.bulletPoint}>• Process transactions and send related information</Text>
            <Text style={styles.bulletPoint}>• Send technical notices and support messages</Text>
            <Text style={styles.bulletPoint}>• Respond to your comments and questions</Text>
            <Text style={styles.bulletPoint}>• Monitor and analyze trends and usage</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.contentText}>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• With your explicit consent</Text>
            <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
            <Text style={styles.bulletPoint}>• To protect our rights and safety</Text>
            <Text style={styles.bulletPoint}>• With service providers who assist our operations</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.contentText}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• SSL encryption for data transmission</Text>
            <Text style={styles.bulletPoint}>• Secure data storage with access controls</Text>
            <Text style={styles.bulletPoint}>• Regular security audits and updates</Text>
            <Text style={styles.bulletPoint}>• Employee training on data protection</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Cookies and Tracking</Text>
          <Text style={styles.contentText}>
            We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie preferences through your browser settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Data Rights</Text>
          <Text style={styles.contentText}>
            You have the following rights regarding your personal information:
          </Text>
          <View style={styles.dataRightsGrid}>
            {dataRights.map((right, index) => (
              <View key={index} style={styles.dataRightCard}>
                <Text style={styles.dataRightTitle}>{right.title}</Text>
                <Text style={styles.dataRightDescription}>{right.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.contentText}>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. International Transfers</Text>
          <Text style={styles.contentText}>
            Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.contentText}>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.contentText}>
            If you have any questions about this privacy policy or our data practices, please contact us:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>Email: privacy@lelirentals.com</Text>
            <Text style={styles.contactText}>Phone: +1 (555) 123-4567</Text>
            <Text style={styles.contactText}>Address: 123 Rental Street, San Francisco, CA 94102</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Leli Rentals, you acknowledge that you have read and understood this privacy policy.
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
  privacyBadge: {
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
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
  dataRightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataRightCard: {
    width: '48%',
    backgroundColor: Background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Border,
  },
  dataRightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  dataRightDescription: {
    fontSize: 12,
    color: SecondaryText,
    lineHeight: 16,
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

export default PrivacyScreen;
