import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  InputBackground, 
  PrimaryText, 
  SecondaryText, 
  Border 
} from '@/constants/Colors';

const HelpScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqTab, setActiveFaqTab] = useState('general');

  const quickContact = [
    {
      icon: 'chatbubbles',
      title: 'Live Chat',
      description: 'Get instant help',
      action: 'Start Chat',
    },
    {
      icon: 'call',
      title: 'Phone Support',
      description: 'Call us directly',
      action: 'Call Now',
    },
    {
      icon: 'mail',
      title: 'Email Support',
      description: 'Send us a message',
      action: 'Send Email',
    },
  ];

  const faqTabs = [
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'payments', label: 'Payments' },
  ];

  const faqData = {
    general: [
      {
        question: 'How does Leli Rentals work?',
        answer: 'Leli Rentals is a platform where you can rent items from other users or list your own items for others to rent. Simply browse items, book what you need, and enjoy!',
      },
      {
        question: 'Is it safe to rent from strangers?',
        answer: 'Yes! We verify all users, provide secure payments, and have a comprehensive review system to ensure safety for everyone.',
      },
      {
        question: 'What if an item gets damaged?',
        answer: 'We have insurance coverage and a dispute resolution process. Report any damage immediately through the app.',
      },
    ],
    account: [
      {
        question: 'How do I create an account?',
        answer: 'Download the app, tap "Sign Up", and follow the simple registration process. You can also sign up with Google.',
      },
      {
        question: 'How do I verify my identity?',
        answer: 'Go to your profile settings and follow the identity verification process. This helps build trust in our community.',
      },
    ],
    bookings: [
      {
        question: 'How do I book an item?',
        answer: 'Find the item you want, select your dates, and complete the booking process. You\'ll receive instant confirmation.',
      },
      {
        question: 'Can I cancel a booking?',
        answer: 'Yes, you can cancel up to 24 hours before the rental period starts. Check your bookings for cancellation options.',
      },
    ],
    payments: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.',
      },
      {
        question: 'When do I get paid as an owner?',
        answer: 'Payments are processed within 24-48 hours after the rental period ends, minus our service fee.',
      },
    ],
  };

  const supportTickets = [
    {
      id: 'TKT-001',
      subject: 'Payment issue with booking',
      status: 'Open',
      date: '2 days ago',
    },
    {
      id: 'TKT-002',
      subject: 'Item not as described',
      status: 'Resolved',
      date: '1 week ago',
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  const renderFaqContent = () => {
    const currentFaq = faqData[activeFaqTab] || [];
    return currentFaq.map((item, index) => (
      <View key={index} style={styles.faqItem}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      </View>
    ));
  };

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>We're here to help you succeed</Text>
        </View>

        {/* Quick Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>
          <View style={styles.quickContactGrid}>
            {quickContact.map((contact, index) => (
              <TouchableOpacity key={index} style={styles.contactCard}>
                <View style={styles.contactIcon}>
                  <Ionicons name={contact.icon as any} size={24} color={PrimaryBrand} />
                </View>
                <Text style={styles.contactTitle}>{contact.title}</Text>
                <Text style={styles.contactDescription}>{contact.description}</Text>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>{contact.action}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Help Center</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={SecondaryText} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help topics..."
              placeholderTextColor={SecondaryText}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {/* FAQ Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.faqTabsContainer}>
            {faqTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.faqTab,
                  activeFaqTab === tab.id && styles.activeFaqTab
                ]}
                onPress={() => setActiveFaqTab(tab.id)}
              >
                <Text style={[
                  styles.faqTabText,
                  activeFaqTab === tab.id && styles.activeFaqTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* FAQ Content */}
          <View style={styles.faqContent}>
            {renderFaqContent()}
          </View>
        </View>

        {/* Support Tickets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Support Tickets</Text>
          {supportTickets.length > 0 ? (
            <View style={styles.ticketsContainer}>
              {supportTickets.map((ticket, index) => (
                <View key={index} style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketId}>{ticket.id}</Text>
                    <View style={[
                      styles.statusBadge,
                      ticket.status === 'Open' ? styles.statusOpen : styles.statusResolved
                    ]}>
                      <Text style={styles.statusText}>{ticket.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                  <Text style={styles.ticketDate}>{ticket.date}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyTickets}>
              <Ionicons name="ticket-outline" size={48} color={SecondaryText} />
              <Text style={styles.emptyTicketsText}>No support tickets yet</Text>
              <Text style={styles.emptyTicketsSubtext}>
                Create a ticket if you need help with any issue
              </Text>
            </View>
          )}
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.contactForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="What can we help you with?"
                placeholderTextColor={SecondaryText}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your issue in detail..."
                placeholderTextColor={SecondaryText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Chat */}
        <View style={styles.section}>
          <View style={styles.aiChatCard}>
            <View style={styles.aiChatHeader}>
              <Ionicons name="chatbubble-ellipses" size={24} color={PrimaryBrand} />
              <Text style={styles.aiChatTitle}>AI Assistant</Text>
            </View>
            <Text style={styles.aiChatDescription}>
              Get instant answers to common questions with our AI-powered assistant
            </Text>
            <TouchableOpacity style={styles.aiChatButton}>
              <Text style={styles.aiChatButtonText}>Start AI Chat</Text>
            </TouchableOpacity>
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
  header: {
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
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
  quickContactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactCard: {
    width: '30%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: 12,
    color: SecondaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  contactButtonText: {
    color: WhiteBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: PrimaryText,
  },
  faqTabsContainer: {
    marginBottom: 16,
  },
  faqTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: WhiteBackground,
    borderWidth: 1,
    borderColor: Border,
  },
  activeFaqTab: {
    backgroundColor: PrimaryBrand,
    borderColor: PrimaryBrand,
  },
  faqTabText: {
    fontSize: 14,
    color: SecondaryText,
    fontWeight: '500',
  },
  activeFaqTabText: {
    color: WhiteBackground,
  },
  faqContent: {
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
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 20,
  },
  ticketsContainer: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 12,
    color: PrimaryBrand,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#fef3c7',
  },
  statusResolved: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  ticketSubject: {
    fontSize: 14,
    color: PrimaryText,
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: SecondaryText,
  },
  emptyTickets: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTicketsText: {
    fontSize: 16,
    color: PrimaryText,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyTicketsSubtext: {
    fontSize: 14,
    color: SecondaryText,
    textAlign: 'center',
  },
  contactForm: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
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
  },
  submitButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiChatCard: {
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  aiChatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiChatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: WhiteBackground,
    marginLeft: 8,
  },
  aiChatDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  aiChatButton: {
    backgroundColor: WhiteBackground,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  aiChatButtonText: {
    color: PrimaryBrand,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HelpScreen;
