import {
    Background,
    Error,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Warning,
    WhiteBackground,
} from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  daysRemaining: number;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  visible,
  onClose,
  daysRemaining,
}) => {
  const handleVerifyNow = () => {
    onClose();
    router.push('/(owner)/owner-verification');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={60} color={Warning} />
          </View>

          <Text style={styles.title}>Verify Your Account</Text>
          
          <Text style={styles.message}>
            Please verify your account using your ID or passport within{' '}
            <Text style={styles.highlight}>{daysRemaining} days</Text> or your
            account will be deleted.
          </Text>

          <Text style={styles.subMessage}>
            Verification helps us ensure a safe and trusted marketplace for all
            users.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyNow}
            >
              <Text style={styles.verifyButtonText}>Verify Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.remindButton} onPress={onClose}>
              <Text style={styles.remindButtonText}>Remind Me Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: WhiteBackground,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: PrimaryText,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  highlight: {
    fontWeight: 'bold',
    color: Error,
  },
  subMessage: {
    fontSize: 14,
    color: SecondaryText,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  verifyButton: {
    backgroundColor: PrimaryBrand,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  remindButton: {
    backgroundColor: Background,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  remindButtonText: {
    color: PrimaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerificationModal;

