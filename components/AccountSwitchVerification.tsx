import {
    Border,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    WhiteBackground
} from '@/constants/Colors';
import { ImagePickerService } from '@/services/ImagePickerService';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface AccountSwitchVerificationProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (idImage: string) => void;
  loading?: boolean;
}

const AccountSwitchVerification: React.FC<AccountSwitchVerificationProps> = ({
  visible,
  onClose,
  onVerify,
  loading = false,
}) => {
  const [idImage, setIdImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    try {
      setUploading(true);
      const result = await ImagePickerService.showImagePickerOptions();
      
      if (result) {
        const validation = ImagePickerService.validateImage(result);
        if (!validation.isValid) {
          showErrorAlert('Invalid Image', validation.error);
          return;
        }
        
        const imageUrl = await ImagePickerService.uploadImage(result);
        setIdImage(imageUrl);
        showSuccessAlert('Success', 'ID image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading ID image:', error);
      showErrorAlert('Error', 'Failed to upload ID image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = () => {
    if (!idImage) {
      showErrorAlert('Missing ID', 'Please upload a photo of your ID or passport.');
      return;
    }
    onVerify(idImage);
  };

  const handleClose = () => {
    setIdImage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={PrimaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Your Identity</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={48} color={PrimaryBrand} />
            </View>
            <Text style={styles.title}>Account Verification Required</Text>
            <Text style={styles.description}>
              To switch to an Owner account, we need to verify your identity for security purposes. 
              This helps protect both you and other users on our platform.
            </Text>
          </View>

          {/* Requirements */}
          <View style={styles.requirementsSection}>
            <Text style={styles.sectionTitle}>What you need:</Text>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color={Success} />
              <Text style={styles.requirementText}>Valid government-issued ID or passport</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color={Success} />
              <Text style={styles.requirementText}>Clear, well-lit photo of your ID</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color={Success} />
              <Text style={styles.requirementText}>All text must be clearly readable</Text>
            </View>
          </View>

          {/* ID Upload Section */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>Upload Your ID</Text>
            
            {idImage ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: idImage }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handleImageUpload}
                  disabled={uploading}
                >
                  <Ionicons name="camera" size={16} color={WhiteBackground} />
                  <Text style={styles.changeImageText}>
                    {uploading ? 'Uploading...' : 'Change Image'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImageUpload}
                disabled={uploading}
              >
                <Ionicons name="camera" size={32} color={PrimaryBrand} />
                <Text style={styles.uploadButtonText}>
                  {uploading ? 'Uploading...' : 'Take Photo of ID'}
                </Text>
                <Text style={styles.uploadSubtext}>
                  Tap to open camera or select from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Ionicons name="lock-closed" size={20} color={SecondaryText} />
            <Text style={styles.securityText}>
              Your ID information is encrypted and stored securely. We only use it for verification purposes.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.verifyButton, (!idImage || loading) && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={!idImage || loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? 'Verifying...' : 'Verify & Switch to Owner'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PrimaryBrand + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
    lineHeight: 24,
  },
  requirementsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 16,
    color: PrimaryText,
    marginLeft: 12,
  },
  uploadSection: {
    marginBottom: 32,
  },
  imagePreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PrimaryBrand,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  changeImageText: {
    color: WhiteBackground,
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: Border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryBrand,
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    color: SecondaryText,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: SecondaryText,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Border,
  },
  verifyButton: {
    backgroundColor: PrimaryBrand,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  verifyButtonDisabled: {
    backgroundColor: SecondaryText,
  },
  verifyButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: SecondaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountSwitchVerification;
