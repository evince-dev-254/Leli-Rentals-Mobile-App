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
import { ImagePickerService } from '@/services/ImagePickerService';
import { NotificationService } from '@/services/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
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
    idDocumentFront: null as string | null,
    idDocumentBack: null as string | null,
    selfie: null as string | null,
    paymentPlan: '',
    bankAccount: '',
  });
  const [uploadingDocument, setUploadingDocument] = useState(false);

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

  const handleUploadDocument = async (documentType: 'front' | 'back' | 'selfie') => {
    try {
      setUploadingDocument(true);
      const imageUri = await ImagePickerService.pickImage();
      
      if (imageUri) {
        if (documentType === 'front') {
          setVerificationData({ ...verificationData, idDocumentFront: imageUri });
          NotificationService.showSuccess('ID Front uploaded successfully');
        } else if (documentType === 'back') {
          setVerificationData({ ...verificationData, idDocumentBack: imageUri });
          NotificationService.showSuccess('ID Back uploaded successfully');
        } else {
          setVerificationData({ ...verificationData, selfie: imageUri });
          NotificationService.showSuccess('Selfie uploaded successfully');
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      NotificationService.showError('Failed to upload document');
    } finally {
      setUploadingDocument(false);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!verificationData.fullName || !verificationData.idNumber || 
          !verificationData.phoneNumber || !verificationData.email || !verificationData.address) {
        NotificationService.showError('Please fill in all required fields');
        return false;
      }
    } else if (currentStep === 2) {
      if (!verificationData.idDocumentFront || !verificationData.idDocumentBack || !verificationData.selfie) {
        NotificationService.showError('Please upload all required documents');
        return false;
      }
    } else if (currentStep === 3) {
      if (!verificationData.paymentPlan || !verificationData.bankAccount) {
        NotificationService.showError('Please select a plan and add bank account');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete verification
      try {
        // Save verification data to AsyncStorage
        await AsyncStorage.setItem('verification_data', JSON.stringify(verificationData));
        await AsyncStorage.setItem('owner_verified', 'true');
        await AsyncStorage.removeItem('verification_modal_shown');
        
        // Update account context
        await updateVerificationStatus('pending');
        
        NotificationService.showSuccess('Verification submitted successfully!');
        
        setTimeout(() => {
          router.replace('/(owner)');
        }, 1500);
      } catch (error) {
        console.error('Error saving verification data:', error);
        NotificationService.showError('Failed to submit verification. Please try again.');
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
          Upload photos of your National ID and a selfie
        </Text>
      </View>

      {/* ID Front Upload */}
      <View style={styles.documentUpload}>
        <Text style={[styles.uploadLabel, { color: isDark ? DarkText : PrimaryText }]}>
          ID Front Side *
        </Text>
        <TouchableOpacity 
          style={[styles.uploadButton, { 
            backgroundColor: isDark ? DarkCard : WhiteBackground,
            borderColor: verificationData.idDocumentFront ? VibrantGreen : (isDark ? DarkBorder : Border)
          }]}
          onPress={() => handleUploadDocument('front')}
          disabled={uploadingDocument}
        >
          {verificationData.idDocumentFront ? (
            <>
              <Image source={{ uri: verificationData.idDocumentFront }} style={styles.uploadedImage} />
              <View style={styles.uploadedOverlay}>
                <Ionicons name="checkmark-circle" size={32} color={VibrantGreen} />
                <Text style={[styles.uploadedText, { color: VibrantGreen }]}>Uploaded</Text>
              </View>
            </>
          ) : (
            <>
              <Ionicons name="camera" size={32} color={isDark ? DarkSecondaryText : SecondaryText} />
              <Text style={[styles.uploadText, { color: isDark ? DarkText : PrimaryText }]}>
                {uploadingDocument ? 'Uploading...' : 'Tap to Upload ID Front'}
              </Text>
              <Text style={[styles.uploadSubtext, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Front side of your National ID
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ID Back Upload */}
      <View style={styles.documentUpload}>
        <Text style={[styles.uploadLabel, { color: isDark ? DarkText : PrimaryText }]}>
          ID Back Side *
        </Text>
        <TouchableOpacity 
          style={[styles.uploadButton, { 
            backgroundColor: isDark ? DarkCard : WhiteBackground,
            borderColor: verificationData.idDocumentBack ? VibrantGreen : (isDark ? DarkBorder : Border)
          }]}
          onPress={() => handleUploadDocument('back')}
          disabled={uploadingDocument}
        >
          {verificationData.idDocumentBack ? (
            <>
              <Image source={{ uri: verificationData.idDocumentBack }} style={styles.uploadedImage} />
              <View style={styles.uploadedOverlay}>
                <Ionicons name="checkmark-circle" size={32} color={VibrantGreen} />
                <Text style={[styles.uploadedText, { color: VibrantGreen }]}>Uploaded</Text>
              </View>
            </>
          ) : (
            <>
              <Ionicons name="camera" size={32} color={isDark ? DarkSecondaryText : SecondaryText} />
              <Text style={[styles.uploadText, { color: isDark ? DarkText : PrimaryText }]}>
                {uploadingDocument ? 'Uploading...' : 'Tap to Upload ID Back'}
              </Text>
              <Text style={[styles.uploadSubtext, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Back side of your National ID
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Selfie Upload */}
      <View style={styles.documentUpload}>
        <Text style={[styles.uploadLabel, { color: isDark ? DarkText : PrimaryText }]}>
          Selfie with ID *
        </Text>
        <TouchableOpacity 
          style={[styles.uploadButton, { 
            backgroundColor: isDark ? DarkCard : WhiteBackground,
            borderColor: verificationData.selfie ? VibrantGreen : (isDark ? DarkBorder : Border)
          }]}
          onPress={() => handleUploadDocument('selfie')}
          disabled={uploadingDocument}
        >
          {verificationData.selfie ? (
            <>
              <Image source={{ uri: verificationData.selfie }} style={styles.uploadedImage} />
              <View style={styles.uploadedOverlay}>
                <Ionicons name="checkmark-circle" size={32} color={VibrantGreen} />
                <Text style={[styles.uploadedText, { color: VibrantGreen }]}>Uploaded</Text>
              </View>
            </>
          ) : (
            <>
              <Ionicons name="camera" size={32} color={isDark ? DarkSecondaryText : SecondaryText} />
              <Text style={[styles.uploadText, { color: isDark ? DarkText : PrimaryText }]}>
                {uploadingDocument ? 'Uploading...' : 'Tap to Upload Selfie'}
              </Text>
              <Text style={[styles.uploadSubtext, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Take a selfie holding your ID
              </Text>
            </>
          )}
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
              Clear, well-lit photos
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
              Valid National ID or Passport only
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
    marginBottom: 24,
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    position: 'relative',
    overflow: 'hidden',
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
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  uploadedOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: WhiteBackground,
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadedText: {
    fontSize: 12,
    fontWeight: 'bold',
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
