import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  PrimaryText, 
  SecondaryText, 
  Border,
  Success,
  Error,
  Warning
} from '@/constants/Colors';

const ContactOwnerScreen = () => {
  const [message, setMessage] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('message');

  const owner = {
    name: 'Sarah Johnson',
    phone: '+254 712 345 678',
    email: 'sarah.johnson@example.com',
    rating: 4.9,
    responseTime: 'Usually responds within an hour',
    location: 'Nairobi, Kenya',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
    verified: true,
    memberSince: 'January 2023',
    totalRentals: 156,
  };

  const listing = {
    title: 'Professional Camera Kit - Canon EOS R5',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
  };

  const contactMethods = [
    {
      id: 'message',
      title: 'Send Message',
      description: 'Send a direct message through the app',
      icon: 'chatbubble-outline',
      color: PrimaryBrand,
    },
    {
      id: 'call',
      title: 'Call Owner',
      description: 'Call directly on their phone',
      icon: 'call-outline',
      color: Success,
    },
    {
      id: 'email',
      title: 'Send Email',
      description: 'Send an email to the owner',
      icon: 'mail-outline',
      color: Warning,
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Contact via WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
    },
  ];

  const quickMessages = [
    'Hi! I\'m interested in renting this item. Is it available?',
    'What are the pickup and return times?',
    'Do you have any additional accessories included?',
    'Is there a security deposit required?',
    'Can I extend the rental period if needed?',
  ];

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please enter a message before sending.');
      return;
    }

    Alert.alert(
      'Message Sent!',
      'Your message has been sent to the owner. They will respond soon.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const handleContactMethod = (method) => {
    switch (method) {
      case 'call':
        Alert.alert('Call Owner', `Calling ${owner.phone}...`);
        break;
      case 'email':
        Alert.alert('Send Email', `Opening email to ${owner.email}...`);
        break;
      case 'whatsapp':
        Alert.alert('WhatsApp', `Opening WhatsApp to contact ${owner.name}...`);
        break;
    }
  };

  const renderContactMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[styles.contactMethod, selectedMethod === method.id && styles.selectedMethod]}
      onPress={() => {
        setSelectedMethod(method.id);
        if (method.id !== 'message') {
          handleContactMethod(method.id);
        }
      }}
    >
      <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
        <Ionicons name={method.icon} size={24} color={method.color} />
      </View>
      <View style={styles.methodInfo}>
        <Text style={styles.methodTitle}>{method.title}</Text>
        <Text style={styles.methodDescription}>{method.description}</Text>
      </View>
      {selectedMethod === method.id && (
        <Ionicons name="checkmark-circle" size={20} color={method.color} />
      )}
    </TouchableOpacity>
  );

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
        {/* Owner Profile */}
        <View style={styles.ownerSection}>
          <View style={styles.ownerHeader}>
            <Image source={{ uri: owner.avatar }} style={styles.ownerAvatar} />
            <View style={styles.ownerInfo}>
              <View style={styles.ownerNameRow}>
                <Text style={styles.ownerName}>{owner.name}</Text>
                {owner.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={Success} />
                )}
              </View>
              <View style={styles.ownerRating}>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={styles.ratingText}>{owner.rating}</Text>
                <Text style={styles.responseTime}>{owner.responseTime}</Text>
              </View>
              <Text style={styles.ownerLocation}>{owner.location}</Text>
            </View>
          </View>

          <View style={styles.ownerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{owner.totalRentals}</Text>
              <Text style={styles.statLabel}>Rentals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{owner.memberSince}</Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Response Rate</Text>
            </View>
          </View>
        </View>

        {/* Listing Info */}
        <View style={styles.listingSection}>
          <Text style={styles.sectionTitle}>About This Item</Text>
          <View style={styles.listingCard}>
            <Image source={{ uri: listing.image }} style={styles.listingImage} />
            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle}>{listing.title}</Text>
              <Text style={styles.listingPrice}>KES {listing.price.toLocaleString()}/day</Text>
            </View>
          </View>
        </View>

        {/* Contact Methods */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>How would you like to contact?</Text>
          {contactMethods.map(renderContactMethod)}
        </View>

        {/* Message Form */}
        {selectedMethod === 'message' && (
          <View style={styles.messageSection}>
            <Text style={styles.sectionTitle}>Send a Message</Text>
            
            <View style={styles.quickMessagesContainer}>
              <Text style={styles.quickMessagesTitle}>Quick Messages</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {quickMessages.map((quickMessage, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickMessageButton}
                    onPress={() => setMessage(quickMessage)}
                  >
                    <Text style={styles.quickMessageText}>{quickMessage}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message here..."
                placeholderTextColor={SecondaryText}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="send" size={20} color={WhiteBackground} />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.contactInfoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfoCard}>
            <View style={styles.contactInfoRow}>
              <Ionicons name="call" size={20} color={Success} />
              <Text style={styles.contactInfoText}>{owner.phone}</Text>
              <TouchableOpacity style={styles.contactActionButton}>
                <Ionicons name="copy" size={16} color={PrimaryBrand} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.contactInfoRow}>
              <Ionicons name="mail" size={20} color={Warning} />
              <Text style={styles.contactInfoText}>{owner.email}</Text>
              <TouchableOpacity style={styles.contactActionButton}>
                <Ionicons name="copy" size={16} color={PrimaryBrand} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Safety Tips */}
        <View style={styles.safetySection}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.safetyCard}>
            <View style={styles.safetyTip}>
              <Ionicons name="shield-checkmark" size={16} color={Success} />
              <Text style={styles.safetyText}>Always meet in a public place for pickup</Text>
            </View>
            <View style={styles.safetyTip}>
              <Ionicons name="document-text" size={16} color={Success} />
              <Text style={styles.safetyText}>Take photos of the item before and after use</Text>
            </View>
            <View style={styles.safetyTip}>
              <Ionicons name="card" size={16} color={Success} />
              <Text style={styles.safetyText}>Use the app's secure payment system</Text>
            </View>
            <View style={styles.safetyTip}>
              <Ionicons name="chatbubble" size={16} color={Success} />
              <Text style={styles.safetyText}>Keep all communication within the app</Text>
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
  ownerSection: {
    backgroundColor: WhiteBackground,
    padding: 20,
    paddingTop: 100,
    marginBottom: 20,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginRight: 8,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: PrimaryText,
    marginLeft: 4,
    marginRight: 12,
  },
  responseTime: {
    fontSize: 12,
    color: SecondaryText,
  },
  ownerLocation: {
    fontSize: 14,
    color: SecondaryText,
  },
  ownerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Background,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryBrand,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: SecondaryText,
  },
  listingSection: {
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 14,
    color: PrimaryBrand,
    fontWeight: 'bold',
  },
  contactSection: {
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Border,
    marginBottom: 12,
  },
  selectedMethod: {
    borderColor: PrimaryBrand,
    backgroundColor: PrimaryBrand + '10',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 12,
    color: SecondaryText,
  },
  messageSection: {
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickMessagesContainer: {
    marginBottom: 16,
  },
  quickMessagesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  quickMessageButton: {
    backgroundColor: Background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  quickMessageText: {
    fontSize: 12,
    color: PrimaryText,
  },
  messageInputContainer: {
    marginBottom: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: Border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: PrimaryText,
    backgroundColor: Background,
    minHeight: 100,
  },
  sendButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfoSection: {
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfoCard: {
    backgroundColor: Background,
    borderRadius: 8,
    padding: 16,
  },
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfoText: {
    flex: 1,
    fontSize: 14,
    color: PrimaryText,
    marginLeft: 12,
  },
  contactActionButton: {
    padding: 4,
  },
  safetySection: {
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  safetyCard: {
    backgroundColor: Background,
    borderRadius: 8,
    padding: 16,
  },
  safetyTip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 14,
    color: PrimaryText,
    marginLeft: 8,
    flex: 1,
  },
});

export default ContactOwnerScreen;
