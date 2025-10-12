import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AIChat from '@/components/AIChat';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  InputBackground, 
  PrimaryText, 
  SecondaryText, 
  Border, 
  Success 
} from '@/constants/Colors';

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showAIChat, setShowAIChat] = useState(false);

  const handlePhoneCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleEmail = (email: string) => {
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const contactMethods = [
    {
      icon: 'mail',
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'lelirentalsmail@gmail.com',
      action: 'Send Email',
      onPress: () => handleEmail('lelirentalsmail@gmail.com'),
    },
    {
      icon: 'call',
      title: 'Phone Support',
      description: 'Call us directly',
      contact: '+254 112 081 866',
      action: 'Call Now',
      onPress: () => handlePhoneCall('+254112081866'),
    },
    {
      icon: 'chatbubbles',
      title: 'AI Chat Support',
      description: 'Chat with our AI assistant',
      contact: 'Available 24/7',
      action: 'Start Chat',
      onPress: () => setShowAIChat(true),
    },
    {
      icon: 'warning',
      title: 'Emergency',
      description: 'Urgent issues only',
      contact: '+254 112 081 866',
      action: 'Emergency',
      onPress: () => handlePhoneCall('+254112081866'),
    },
  ];

  const faqItems = [
    {
      question: 'How do I create a listing?',
      answer: 'Go to your profile, click "List Items", and follow the step-by-step process to add your item details, photos, and pricing.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.',
    },
    {
      question: 'How do I cancel a booking?',
      answer: 'You can cancel a booking up to 24 hours before the rental period starts. Go to your bookings and click "Cancel".',
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, we use bank-level encryption to protect your data and never share your information with third parties.',
    },
    {
      question: 'What if an item is damaged?',
      answer: 'Report any damage immediately through the app. We have insurance coverage and a dispute resolution process.',
    },
  ];

  const supportStats = [
    { number: '< 2 min', label: 'Average Response' },
    { number: '24/7', label: 'Support Available' },
    { number: '98%', label: 'Satisfaction Rate' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields.');
      return;
    }
    // Handle form submission
    alert('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Animated Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Ionicons name="arrow-back" size={24} color={PrimaryBrand} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.contactBadge}>
            <Text style={styles.badgeText}>Contact Us</Text>
          </View>
          <Text style={styles.heroTitle}>We're Here to Help</Text>
          <Text style={styles.heroSubtitle}>
            Get in touch with our support team for any questions or assistance.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactMethodsGrid}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity key={index} style={styles.contactMethodCard}>
                <View style={styles.contactIcon}>
                  <Ionicons name={method.icon as any} size={24} color={PrimaryBrand} />
                </View>
                <Text style={styles.contactMethodTitle}>{method.title}</Text>
                <Text style={styles.contactMethodDescription}>{method.description}</Text>
                <Text style={styles.contactMethodContact}>{method.contact}</Text>
                <TouchableOpacity 
                  style={styles.contactMethodButton}
                  onPress={method.onPress}
                >
                  <Text style={styles.contactMethodButtonText}>{method.action}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={SecondaryText}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={SecondaryText}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="What's this about?"
                placeholderTextColor={SecondaryText}
                value={formData.subject}
                onChangeText={(value) => handleInputChange('subject', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us how we can help..."
                placeholderTextColor={SecondaryText}
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Support Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Support Promise</Text>
          <View style={styles.statsContainer}>
            {supportStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Office Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Offices</Text>
          <View style={styles.officeCard}>
            <View style={styles.officeHeader}>
              <Ionicons name="location" size={20} color={PrimaryBrand} />
              <Text style={styles.officeTitle}>Headquarters</Text>
            </View>
            <Text style={styles.officeAddress}>
              Nairobi, Kenya{'\n'}
              East Africa{'\n'}
              Phone: +254 112 081 866
            </Text>
            <Text style={styles.officeHours}>
              Monday - Friday: 8:00 AM - 6:00 PM EAT{'\n'}
              Saturday: 9:00 AM - 4:00 PM EAT{'\n'}
              Sunday: 10:00 AM - 2:00 PM EAT
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* AI Chat Modal */}
      <Modal
        visible={showAIChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIChat onClose={() => setShowAIChat(false)} />
      </Modal>
    </KeyboardAvoidingView>
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
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: WhiteBackground,
  },
  contactBadge: {
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
    color: PrimaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
    lineHeight: 22,
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
  contactMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactMethodCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactMethodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactMethodDescription: {
    fontSize: 12,
    color: SecondaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactMethodContact: {
    fontSize: 12,
    color: PrimaryBrand,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactMethodButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  contactMethodButtonText: {
    color: WhiteBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Border,
  },
  inputGroup: {
    marginBottom: 16,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqContainer: {
    gap: 16,
  },
  faqItem: {
    backgroundColor: WhiteBackground,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryBrand,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: SecondaryText,
    textAlign: 'center',
  },
  officeCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  officeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  officeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginLeft: 8,
  },
  officeAddress: {
    fontSize: 14,
    color: SecondaryText,
    marginBottom: 12,
    lineHeight: 20,
  },
  officeHours: {
    fontSize: 12,
    color: SecondaryText,
    lineHeight: 18,
  },
});

export default ContactScreen;
