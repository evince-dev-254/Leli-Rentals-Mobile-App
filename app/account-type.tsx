import React, { useState } from 'react';
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
import { useAccount } from '@/contexts/AccountContext';

const AccountTypeScreen = () => {
  const { setAccountType } = useAccount();
  const [selectedType, setSelectedType] = useState('');

  const handleContinue = async () => {
    if (selectedType === 'renter') {
      await setAccountType('renter');
      router.replace('/(tabs)');
    } else if (selectedType === 'owner') {
      await setAccountType('owner');
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Animated Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.push('/login')}
      >
        <Ionicons name="arrow-back" size={24} color="#d97706" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Account Type</Text>
        <Text style={styles.subtitle}>Select how you'd like to use Leli Rentals</Text>

        {/* Renter Option */}
        <TouchableOpacity 
          style={[
            styles.optionCard,
            selectedType === 'renter' && styles.selectedCard
          ]}
          onPress={() => setSelectedType('renter')}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop' }}
              style={styles.optionImage}
              resizeMode="cover"
            />
            <View style={styles.iconOverlay}>
              <Text style={styles.iconText}>🔍</Text>
            </View>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>I'm a Renter</Text>
            <Text style={styles.optionDescription}>
              Find and rent items for your projects, events, or daily needs
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Browse thousands of items</Text>
              <Text style={styles.featureItem}>• Easy booking process</Text>
              <Text style={styles.featureItem}>• Secure payments</Text>
            </View>
          </View>
          {selectedType === 'renter' && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color="#d97706" />
            </View>
          )}
        </TouchableOpacity>

        {/* Owner Option */}
        <TouchableOpacity 
          style={[
            styles.optionCard,
            selectedType === 'owner' && styles.selectedCard
          ]}
          onPress={() => setSelectedType('owner')}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' }}
              style={styles.optionImage}
              resizeMode="cover"
            />
            <View style={styles.iconOverlay}>
              <Text style={styles.iconText}>💰</Text>
            </View>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>I'm an Owner</Text>
            <Text style={styles.optionDescription}>
              List your items and earn money by renting them out
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• List unlimited items</Text>
              <Text style={styles.featureItem}>• Set your own prices</Text>
              <Text style={styles.featureItem}>• Track earnings</Text>
            </View>
          </View>
          {selectedType === 'owner' && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color="#d97706" />
            </View>
          )}
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedType && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedType}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedType && styles.disabledButtonText
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefce8',
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#d97706',
    shadowColor: '#d97706',
    shadowOpacity: 0.2,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(217, 119, 6, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  optionContent: {
    padding: 20,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  continueButton: {
    backgroundColor: '#d97706',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
});

export default AccountTypeScreen;
