import LocationPicker from '@/components/LocationPicker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const OwnerDashboardScreen = () => {
  const [setupStep, setSetupStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');

  const businessTypes = [
    { id: 'individual', name: 'Individual', icon: 'person-outline' },
    { id: 'business', name: 'Business', icon: 'business-outline' },
    { id: 'nonprofit', name: 'Non-profit', icon: 'heart-outline' },
  ];

  const handleNext = () => {
    if (setupStep < 3) {
      setSetupStep(setupStep + 1);
    } else {
      // Complete setup and redirect to main app
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    // Skip setup and redirect to main app
    router.replace('/(tabs)');
  };

  const renderSetupStep = () => {
    switch (setupStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' }}
              style={styles.stepImage}
            />
            <Text style={styles.stepTitle}>Welcome to Leli Rentals!</Text>
            <Text style={styles.stepDescription}>
              Let's set up your account to start earning money by renting out your items.
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.featureText}>List unlimited items</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.featureText}>Set your own prices</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.featureText}>Track your earnings</Text>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <Text style={styles.stepDescription}>
              This helps us personalize your experience
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your business name"
                placeholderTextColor="#6b7280"
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Type</Text>
              <View style={styles.businessTypeContainer}>
                {businessTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.businessTypeCard,
                      businessType === type.id && styles.selectedBusinessType
                    ]}
                    onPress={() => setBusinessType(type.id)}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={24} 
                      color={businessType === type.id ? '#ffffff' : '#d97706'} 
                    />
                    <Text style={[
                      styles.businessTypeText,
                      businessType === type.id && styles.selectedBusinessTypeText
                    ]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ready to start earning!</Text>
            <Text style={styles.stepDescription}>
              Your account is set up. Now let's add your first listing to start earning money.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <LocationPicker
                selectedLocation={location}
                onLocationSelect={setLocation}
                placeholder="Select your location"
              />
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Setup Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Business Name:</Text>
                <Text style={styles.summaryValue}>{businessName || 'Not provided'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Business Type:</Text>
                <Text style={styles.summaryValue}>
                  {businessTypes.find(t => t.id === businessType)?.name || 'Not selected'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Location:</Text>
                <Text style={styles.summaryValue}>{location || 'Not provided'}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.addListingButton}
              onPress={() => router.push('/owner-listings')}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
              <Text style={styles.addListingButtonText}>Manage Your Listings</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.push('/(tabs)')}
      >
        <Ionicons name="arrow-back" size={24} color="#d97706" />
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(setupStep / 3) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Step {setupStep} of 3</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderSetupStep()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip Setup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {setupStep === 3 ? 'Complete Setup' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
  progressContainer: {
    padding: 20,
    paddingTop: 100,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#d97706',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  stepImage: {
    width: 200,
    height: 150,
    borderRadius: 16,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  businessTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  businessTypeCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedBusinessType: {
    backgroundColor: '#d97706',
    borderColor: '#d97706',
  },
  businessTypeText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedBusinessTypeText: {
    color: '#ffffff',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#d97706',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addListingButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addListingButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default OwnerDashboardScreen;
