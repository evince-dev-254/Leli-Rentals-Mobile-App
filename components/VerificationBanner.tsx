import {
    Border,
    Error,
    PrimaryBrand,
    PrimaryText,
    Warning,
    WhiteBackground,
} from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VerificationBannerProps {
  daysRemaining: number;
  onDismiss?: () => void;
}

const VerificationBanner: React.FC<VerificationBannerProps> = ({
  daysRemaining,
  onDismiss,
}) => {
  const handleVerifyNow = () => {
    router.push('/(owner)/owner-verification');
  };

  const isUrgent = daysRemaining <= 2;

  return (
    <View style={[styles.container, isUrgent && styles.urgentContainer]}>
      <View style={styles.content}>
        <Ionicons
          name="warning"
          size={24}
          color={isUrgent ? Error : Warning}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {isUrgent ? 'Urgent: ' : ''}Account Verification Required
          </Text>
          <Text style={styles.message}>
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining to
            verify your account
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyNow}>
          <Text style={styles.verifyButtonText}>Verify Now</Text>
        </TouchableOpacity>
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Ionicons name="close" size={20} color={PrimaryText} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: Warning,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  urgentContainer: {
    backgroundColor: Error + '20',
    borderLeftColor: Error,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: PrimaryText,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifyButton: {
    backgroundColor: PrimaryBrand,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: WhiteBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dismissButton: {
    padding: 4,
  },
});

export default VerificationBanner;

