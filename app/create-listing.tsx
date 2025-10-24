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
    VibrantOrange,
    VibrantRed,
    WhiteBackground
} from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useTheme } from '@/contexts/ThemeContext';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const categories = [
  'Electronics',
  'Tools',
  'Sports & Recreation',
  'Home & Garden',
  'Fashion & Accessories',
  'Vehicles',
  'Books & Media',
  'Other'
];

const kenyanLocations = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Malindi',
  'Kitale',
  'Garissa',
  'Kakamega',
  'Nyeri',
  'Meru',
  'Machakos',
  'Kitui',
  'Kericho',
  'Bungoma',
  'Busia',
  'Vihiga',
  'Siaya',
  'Kisii',
  'Nyamira',
  'Migori',
  'Homa Bay',
  'Trans Nzoia',
  'Uasin Gishu',
  'Elgeyo Marakwet',
  'Nandi',
  'Baringo',
  'Laikipia',
  'Narok',
  'Kajiado',
  'Makueni',
  'Taita Taveta',
  'Kwale',
  'Kilifi',
  'Tana River',
  'Lamu',
  'Isiolo',
  'Marsabit',
  'Samburu',
  'Turkana',
  'West Pokot',
  'Bomet'
];

export default function CreateListingScreen() {
  const { isDark } = useTheme();
  const { accountType } = useAccount();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    condition: 'excellent',
    availability: 'available',
    images: [] as string[],
    termsAccepted: false,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async () => {
    try {
      // TODO: Implement actual image picker when native module is available
      // For now, show a message and add sample images for testing
      showSuccessAlert(
        'Image Upload',
        'Image upload will be available in production builds. For now, sample images are added for testing.'
      );
      
      // Add sample images for testing
      const sampleImages = [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
      ];
      
      const remainingSlots = 5 - formData.images.length;
      const imagesToAdd = sampleImages.slice(0, Math.min(remainingSlots, 3));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imagesToAdd].slice(0, 5) // Max 5 images
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      showErrorAlert('Error', 'Failed to upload images. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const selectLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location: location
    }));
    setShowLocationPicker(false);
  };

  const handleLocationPickerOpen = () => {
    if (kenyanLocations.length === 0) {
      showErrorAlert('Error', 'No locations available. Please try again later.');
      return;
    }
    setShowLocationPicker(true);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.title.trim()) {
      showErrorAlert('Error', 'Please enter a title for your listing');
      return;
    }
    if (!formData.description.trim()) {
      showErrorAlert('Error', 'Please enter a description');
      return;
    }
    if (!formData.price.trim()) {
      showErrorAlert('Error', 'Please enter a price');
      return;
    }
    if (!formData.category) {
      showErrorAlert('Error', 'Please select a category');
      return;
    }
    if (!formData.termsAccepted) {
      showErrorAlert('Error', 'Please accept the terms and conditions');
      return;
    }
    if (!formData.location) {
      showErrorAlert('Error', 'Please select a location');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual listing creation with Firebase
      console.log('Creating listing:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccessAlert(
        'Success!',
        'Your listing has been created successfully!',
        () => router.push('/owner-listings')
      );
    } catch (error) {
      showErrorAlert('Error', 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        {
          backgroundColor: formData.category === category 
            ? PrimaryBrand 
            : isDark ? DarkCard : WhiteBackground,
          borderColor: formData.category === category 
            ? PrimaryBrand 
            : isDark ? DarkBorder : Border,
        }
      ]}
      onPress={() => handleInputChange('category', category)}
    >
      <Text style={[
        styles.categoryButtonText,
        {
          color: formData.category === category 
            ? WhiteBackground 
            : isDark ? DarkText : PrimaryText
        }
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ThemeAwareLogo size={100} variant="default" showText={false} />
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isDark ? DarkText : PrimaryText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: isDark ? DarkText : PrimaryText }]}>
          Create New Listing
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Add your item to start earning
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? DarkText : PrimaryText }]}>
            Item Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? DarkCard : WhiteBackground,
                borderColor: isDark ? DarkBorder : Border,
                color: isDark ? DarkText : PrimaryText,
              }
            ]}
            placeholder="Enter item title"
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? DarkText : PrimaryText }]}>
            Description *
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: isDark ? DarkCard : WhiteBackground,
                borderColor: isDark ? DarkBorder : Border,
                color: isDark ? DarkText : PrimaryText,
              }
            ]}
            placeholder="Describe your item in detail"
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? DarkText : PrimaryText }]}>
            Daily Rental Price *
          </Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.currencySymbol, { color: isDark ? DarkText : PrimaryText }]}>
              KSh
            </Text>
            <TextInput
              style={[
                styles.priceInput,
                {
                  backgroundColor: isDark ? DarkCard : WhiteBackground,
                  borderColor: isDark ? DarkBorder : Border,
                  color: isDark ? DarkText : PrimaryText,
                }
              ]}
              placeholder="0"
              placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
              value={formData.price}
              onChangeText={(text) => handleInputChange('price', text)}
              keyboardType="numeric"
            />
            <Text style={[styles.priceUnit, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              /day
            </Text>
          </View>
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? DarkText : PrimaryText }]}>
            Category *
          </Text>
          <View style={styles.categoriesContainer}>
            {categories.map(renderCategoryButton)}
          </View>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? DarkText : PrimaryText }]}>
            Location *
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.locationPicker,
              {
                backgroundColor: isDark ? DarkCard : WhiteBackground,
                borderColor: isDark ? DarkBorder : Border,
              }
            ]}
            onPress={handleLocationPickerOpen}
          >
            <Text style={[
              styles.locationText,
              { color: formData.location ? (isDark ? DarkText : PrimaryText) : (isDark ? DarkSecondaryText : SecondaryText) }
            ]}>
              {formData.location || 'Select a location in Kenya'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={isDark ? DarkSecondaryText : SecondaryText} />
          </TouchableOpacity>
        </View>

        {/* Condition */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? DarkText : PrimaryText }]}>
            Condition
          </Text>
          <View style={styles.conditionContainer}>
            {['excellent', 'good', 'fair'].map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.conditionButton,
                  {
                    backgroundColor: formData.condition === condition 
                      ? PrimaryBrand 
                      : isDark ? DarkCard : WhiteBackground,
                    borderColor: formData.condition === condition 
                      ? PrimaryBrand 
                      : isDark ? DarkBorder : Border,
                  }
                ]}
                onPress={() => handleInputChange('condition', condition)}
              >
                <Text style={[
                  styles.conditionButtonText,
                  {
                    color: formData.condition === condition 
                      ? WhiteBackground 
                      : isDark ? DarkText : PrimaryText
                  }
                ]}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? DarkText : PrimaryText }]}>
            Images (Max 5)
          </Text>
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity
              style={[
                styles.imageUploadButton,
                { 
                  backgroundColor: isDark ? DarkCard : WhiteBackground, 
                  borderColor: isDark ? DarkBorder : Border,
                  opacity: formData.images.length >= 5 ? 0.5 : 1
                }
              ]}
              onPress={formData.images.length >= 5 ? undefined : handleImageUpload}
              disabled={formData.images.length >= 5}
            >
              <Ionicons name="camera" size={24} color={isDark ? DarkText : PrimaryText} />
              <Text style={[styles.imageUploadText, { color: isDark ? DarkText : PrimaryText }]}>
                {formData.images.length >= 5 ? 'Max Images Reached' : `Add Images (${formData.images.length}/5)`}
              </Text>
            </TouchableOpacity>
            
            {formData.images.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {formData.images.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: image }} style={styles.imagePreviewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close" size={16} color={WhiteBackground} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => handleInputChange('termsAccepted', !formData.termsAccepted)}
          >
            <View style={[
              styles.checkbox,
              {
                backgroundColor: formData.termsAccepted ? PrimaryBrand : (isDark ? DarkCard : WhiteBackground),
                borderColor: formData.termsAccepted ? PrimaryBrand : (isDark ? DarkBorder : Border),
              }
            ]}>
              {formData.termsAccepted && (
                <Ionicons name="checkmark" size={16} color={WhiteBackground} />
              )}
            </View>
            <Text style={[styles.termsText, { color: isDark ? DarkText : PrimaryText }]}>
              I agree to the{' '}
              <Text 
                style={[styles.termsLink, { color: PrimaryBrand }]}
                onPress={() => showSuccessAlert('Listing Terms', 'Terms for listing items on Leli Rentals platform. By listing, you agree to provide accurate information, maintain item security, and comply with local regulations.')}
              >
                Listing Terms
              </Text>
              {' '}and{' '}
              <Text 
                style={[styles.termsLink, { color: PrimaryBrand }]}
                onPress={() => showSuccessAlert('Security Policy', 'Security measures for item listings include: proper identification, secure storage, insurance coverage, and compliance with safety standards.')}
              >
                Security Policy
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.previewButton,
            { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }
          ]}
          onPress={() => {
            if (!formData.title && !formData.description && !formData.price) {
              showErrorAlert('Preview', 'Please fill in some details before previewing.');
              return;
            }
            setShowPreview(true);
          }}
        >
          <Ionicons name="eye" size={20} color={isDark ? DarkText : PrimaryText} />
          <Text style={[styles.previewButtonText, { color: isDark ? DarkText : PrimaryText }]}>
            Preview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: isSubmitting ? VibrantOrange : PrimaryBrand }
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? DarkText : PrimaryText }]}>
                Select Location
              </Text>
              <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                <Ionicons name="close" size={24} color={isDark ? DarkText : PrimaryText} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={kenyanLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.locationItem,
                    { borderBottomColor: isDark ? DarkBorder : Border }
                  ]}
                  onPress={() => selectLocation(item)}
                >
                  <Text style={[styles.locationItemText, { color: isDark ? DarkText : PrimaryText }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? DarkText : PrimaryText }]}>
                Listing Preview
              </Text>
              <TouchableOpacity onPress={() => setShowPreview(false)}>
                <Ionicons name="close" size={24} color={isDark ? DarkText : PrimaryText} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.previewContent}>
              {formData.images.length > 0 && (
                <Image source={{ uri: formData.images[0] }} style={styles.previewImage} />
              )}
              <Text style={[styles.previewTitle, { color: isDark ? DarkText : PrimaryText }]}>
                {formData.title || 'Your listing title'}
              </Text>
              <Text style={[styles.previewPrice, { color: PrimaryBrand }]}>
                KSh {formData.price || '0'}/day
              </Text>
              <Text style={[styles.previewDescription, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                {formData.description || 'Your listing description'}
              </Text>
              <View style={styles.previewDetails}>
                <View style={styles.previewDetailItem}>
                  <Ionicons name="location" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
                  <Text style={[styles.previewDetailText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                    {formData.location || 'Location not selected'}
                  </Text>
                </View>
                <View style={styles.previewDetailItem}>
                  <Ionicons name="tag" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
                  <Text style={[styles.previewDetailText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                    {formData.category || 'Category not selected'}
                  </Text>
                </View>
                <View style={styles.previewDetailItem}>
                  <Ionicons name="checkmark-circle" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
                  <Text style={[styles.previewDetailText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                    {formData.condition || 'excellent'} condition
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: WhiteBackground,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderWidth: 0,
  },
  priceUnit: {
    fontSize: 16,
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  conditionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  conditionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  // Location picker styles
  locationPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    flex: 1,
  },
  // Image upload styles
  imageUploadContainer: {
    marginTop: 8,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 12,
  },
  imageUploadText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imagePreview: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreviewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: VibrantRed,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Terms styles
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
  },
  // Action buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40, // Increased padding to avoid system navigation bar
    paddingTop: 20,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  previewButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  locationItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  locationItemText: {
    fontSize: 16,
  },
  // Preview styles
  previewContent: {
    maxHeight: 400,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewPrice: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  previewDetails: {
    gap: 8,
  },
  previewDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewDetailText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
