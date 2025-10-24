import BackButton from '@/components/BackButton';
import ThemeAwareLogo from '@/components/ThemeAwareLogo';
import {
    Background,
    Border,
    DarkBackground,
    DarkBorder,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantGreen,
    VibrantOrange,
    VibrantPurple,
    VibrantRed,
    WhiteBackground
} from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OwnerVerificationScreen = () => {
  const { isDark } = useTheme();
  const { updateVerificationStatus } = useAccount();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    fullName: '',
    idNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    idDocument: null,
    paymentPlan: '',
    bankAccount: '',
  });

  const paymentPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 'KSh 2,500',
      period: 'per month',
      features: ['Up to 5 listings', 'Basic analytics', 'Email support'],
      color: VibrantPurple,
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 'KSh 5,000',
      period: 'per month',
      features: ['Up to 20 listings', 'Advanced analytics', 'Priority support', 'Featured listings'],
      color: VibrantOrange,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 'KSh 10,000',
      period: 'per month',
      features: ['Unlimited listings', 'Full analytics', '24/7 support', 'Custom branding'],
      color: VibrantGreen,
    },
  ];

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete verification
      try {
        // Save verification data (in a real app, this would be sent to a server)
        console.log('Verification data:', verificationData);
        
        // Update account context
        await updateVerificationStatus('pending');
        
        Alert.alert(
          'Verification Submitted',
          'Your owner verification has been submitted for review. You will receive an email confirmation within 24 hours.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } catch (error) {
        console.error('Error saving verification data:', error);
        Alert.alert('Error', 'Failed to submit verification. Please try again.');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: VibrantOrange }]}>
          <Ionicons name="person" size={24} color={WhiteBackground} />
        </View>
        <Text style={[styles.stepTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Personal Information
        </Text>
        <Text style={[styles.stepSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Tell us about yourself to get started
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: isDark ? DarkText : PrimaryText }]}>
            Full Name *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? DarkCard : WhiteBackground,
              color: isDark ? DarkText : PrimaryText,
              borderColor: isDark ? DarkBorder : Border
            }]}
            placeholder="Enter your full name"
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={verificationData.fullName}
            onChangeText={(text) => setVerificationData({...verificationData, fullName: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: isDark ? DarkText : PrimaryText }]}>
            ID Number *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? DarkCard : WhiteBackground,
              color: isDark ? DarkText : PrimaryText,
              borderColor: isDark ? DarkBorder : Border
            }]}
            placeholder="Enter your National ID number"
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={verificationData.idNumber}
            onChangeText={(text) => setVerificationData({...verificationData, idNumber: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: isDark ? DarkText : PrimaryText }]}>
            Phone Number *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? DarkCard : WhiteBackground,
              color: isDark ? DarkText : PrimaryText,
              borderColor: isDark ? DarkBorder : Border
            }]}
            placeholder="+254 700 000 000"
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={verificationData.phoneNumber}
            onChangeText={(text) => setVerificationData({...verificationData, phoneNumber: text})}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: isDark ? DarkText : PrimaryText }]}>
            Email Address *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? DarkCard : WhiteBackground,
              color: isDark ? DarkText : PrimaryText,
              borderColor: isDark ? DarkBorder : Border
            }]}
            placeholder="your.email@example.com"
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={verificationData.email}
            onChangeText={(text) => setVerificationData({...verificationData, email: text})}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: isDark ? DarkText : PrimaryText }]}>
            Physical Address *
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { 
              backgroundColor: isDark ? DarkCard : WhiteBackground,
              color: isDark ? DarkText : PrimaryText,
              borderColor: isDark ? DarkBorder : Border
            }]}
            placeholder="Enter your complete address"
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={verificationData.address}
            onChangeText={(text) => setVerificationData({...verificationData, address: text})}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: VibrantRed }]}>
          <Ionicons name="card" size={24} color={WhiteBackground} />
        </View>
        <Text style={[styles.stepTitle, { color: isDark ? DarkText : PrimaryText }]}>
          ID Verification
        </Text>
        <Text style={[styles.stepSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Upload a clear photo of your National ID
        </Text>
      </View>

      <View style={styles.documentUpload}>
        <TouchableOpacity style={[styles.uploadButton, { 
          backgroundColor: isDark ? DarkCard : WhiteBackground,
          borderColor: isDark ? DarkBorder : Border
        }]}>
          <Ionicons name="camera" size={32} color={isDark ? DarkSecondaryText : SecondaryText} />
          <Text style={[styles.uploadText, { color: isDark ? DarkText : PrimaryText }]}>
            Tap to Upload ID Photo
          </Text>
          <Text style={[styles.uploadSubtext, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
            Make sure the ID is clearly visible
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.requirementsContainer}>
        <Text style={[styles.requirementsTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Photo Requirements:
        </Text>
        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={16} color={VibrantGreen} />
            <Text style={[styles.requirementText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              Clear, well-lit photo
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={16} color={VibrantGreen} />
            <Text style={[styles.requirementText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              All text must be readable
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={16} color={VibrantGreen} />
            <Text style={[styles.requirementText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              No blur or glare
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={16} color={VibrantGreen} />
            <Text style={[styles.requirementText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              Valid National ID only
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: VibrantGreen }]}>
          <Ionicons name="card-outline" size={24} color={WhiteBackground} />
        </View>
        <Text style={[styles.stepTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Choose Payment Plan
        </Text>
        <Text style={[styles.stepSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Select the plan that works best for your business
        </Text>
      </View>

      <View style={styles.plansContainer}>
        {paymentPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              { 
                backgroundColor: isDark ? DarkCard : WhiteBackground,
                borderColor: verificationData.paymentPlan === plan.id ? plan.color : (isDark ? DarkBorder : Border)
              }
            ]}
            onPress={() => setVerificationData({...verificationData, paymentPlan: plan.id})}
          >
            {plan.popular && (
              <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: isDark ? DarkText : PrimaryText }]}>
                {plan.name}
              </Text>
              <View style={styles.planPrice}>
                <Text style={[styles.priceAmount, { color: plan.color }]}>
                  {plan.price}
                </Text>
                <Text style={[styles.pricePeriod, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                  {plan.period}
                </Text>
              </View>
            </View>

            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark" size={16} color={VibrantGreen} />
                  <Text style={[styles.featureText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: isDark ? DarkText : PrimaryText }]}>
          Bank Account Number (for payouts)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: isDark ? DarkCard : WhiteBackground,
            color: isDark ? DarkText : PrimaryText,
            borderColor: isDark ? DarkBorder : Border
          }]}
          placeholder="Enter your bank account number"
          placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
          value={verificationData.bankAccount}
          onChangeText={(text) => setVerificationData({...verificationData, bankAccount: text})}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <BackButton onPress={() => router.back()} />
        
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ThemeAwareLogo size={100} variant="default" showText={false} />
          </View>
          <Text style={[styles.headerTitle, { color: isDark ? DarkText : PrimaryText }]}>
            Owner Verification
          </Text>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                styles.progressStep,
                { backgroundColor: step <= currentStep ? PrimaryBrand : (isDark ? DarkBorder : Border) }
              ]}
            />
          ))}
        </View>
        <Text style={[styles.progressText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Step {currentStep} of 3
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.navigationContainer, { backgroundColor: isDark ? DarkCard : WhiteBackground, paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton, { borderColor: isDark ? DarkBorder : Border }]}
              onPress={handlePrevious}
            >
              <Text style={[styles.buttonText, { color: isDark ? DarkText : PrimaryText }]}>
                Previous
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton, { backgroundColor: PrimaryBrand }]}
            onPress={handleNext}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              {currentStep === 3 ? 'Complete Verification' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  documentUpload: {
    marginBottom: 32,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  requirementsContainer: {
    marginTop: 20,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: WhiteBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  planPrice: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pricePeriod: {
    fontSize: 14,
  },
  planFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  navigationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Border,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: PrimaryBrand,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: WhiteBackground,
  },
});

export default OwnerVerificationScreen;
