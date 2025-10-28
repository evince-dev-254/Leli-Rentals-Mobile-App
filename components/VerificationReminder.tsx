import { useAccount } from '@/contexts/AccountContext';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VerificationReminderProps {
  onDismiss?: () => void;
}

const VerificationReminder: React.FC<VerificationReminderProps> = ({ onDismiss }) => {
  const { ownerProfile, checkVerificationDeadline, markVerificationReminderShown, logout } = useAccount();
  const { signOut } = useAuth();
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  const { shouldShowReminder, daysRemaining, shouldSignOut } = checkVerificationDeadline();

  useEffect(() => {
    if (shouldShowReminder) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shouldShowReminder]);

  useEffect(() => {
    if (shouldSignOut) {
      // Auto sign out after deadline
      const timer = setTimeout(async () => {
        await logout();
        await signOut();
        router.replace('/(auth)/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shouldSignOut]);

  const handleVerifyNow = () => {
    markVerificationReminderShown();
    router.push('/(owner)/owner-verification');
    onDismiss?.();
  };

  const handleDismiss = () => {
    markVerificationReminderShown();
    onDismiss?.();
  };

  if (!shouldShowReminder && !shouldSignOut) {
    return null;
  }

  if (shouldSignOut) {
    return (
      <Animated.View
        style={[
          styles.container,
          styles.criticalContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          <Ionicons name="warning" size={24} color="#ffffff" />
          <View style={styles.textContainer}>
            <Text style={styles.criticalTitle}>Verification Deadline Expired</Text>
            <Text style={styles.criticalMessage}>
              Your ID verification deadline has passed. You will be signed out automatically.
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="shield-checkmark" size={24} color="#ffffff" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>ID Verification Required</Text>
          <Text style={styles.message}>
            {daysRemaining === 1 
              ? 'You have 1 day left to verify your ID or passport.'
              : `You have ${daysRemaining} days left to verify your ID or passport.`
            }
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyNow}>
            <Text style={styles.verifyButtonText}>Verify Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
            <Ionicons name="close" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#d97706',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  criticalContainer: {
    backgroundColor: '#dc2626',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  criticalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  criticalMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dismissButton: {
    padding: 4,
  },
});

export default VerificationReminder;
