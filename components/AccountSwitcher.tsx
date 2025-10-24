import { PrimaryBrand, VibrantGreen, VibrantOrange, VibrantRed } from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AccountSwitcherProps {
  onSwitch?: () => void;
  showCurrentType?: boolean;
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ 
  onSwitch, 
  showCurrentType = true 
}) => {
  const { accountType, verificationStatus, switchToOwner, switchToRenter } = useAccount();

  const handleSwitchToOwner = async () => {
    Alert.alert(
      'Owner Account - ID Verification Required',
      'To become an owner, you must complete ID verification within 2 days. You\'ll need to upload your ID card or passport. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            try {
              await switchToOwner();
              onSwitch?.();
              Alert.alert(
                'Account Switched!', 
                'You\'re now an owner. Complete ID verification within 2 days to maintain your owner status. You\'ll receive reminder emails and notifications.'
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to switch to owner account');
              console.error('Switch to owner error:', error);
            }
          }
        }
      ]
    );
  };

  const handleSwitchToRenter = async () => {
    try {
      await switchToRenter();
      onSwitch?.();
      Alert.alert('Success', 'Switched to renter account successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to switch to renter account');
      console.error('Switch to renter error:', error);
    }
  };

  const getAccountTypeInfo = () => {
    if (accountType === 'owner') {
      if (verificationStatus === 'verified') {
        return { text: 'Owner (Verified)', color: VibrantGreen, icon: 'checkmark-circle' };
      }
      if (verificationStatus === 'pending') {
        return { text: 'Owner (Pending)', color: VibrantOrange, icon: 'time' };
      }
      if (verificationStatus === 'rejected') {
        return { text: 'Owner (Rejected)', color: VibrantRed, icon: 'close-circle' };
      }
      return { text: 'Owner (Unverified)', color: VibrantOrange, icon: 'warning' };
    }
    return { text: 'Renter', color: PrimaryBrand, icon: 'person' };
  };

  const currentAccountInfo = getAccountTypeInfo();

  return (
    <View style={styles.container}>
      {showCurrentType && (
        <View style={styles.currentAccount}>
          <Ionicons name={currentAccountInfo.icon} size={20} color={currentAccountInfo.color} />
          <Text style={[styles.currentAccountText, { color: currentAccountInfo.color }]}>
            Current: {currentAccountInfo.text}
          </Text>
        </View>
      )}

      <View style={styles.switchButtons}>
        {accountType !== 'renter' && (
          <TouchableOpacity style={styles.switchButton} onPress={handleSwitchToRenter}>
            <Ionicons name="person-outline" size={20} color={PrimaryBrand} />
            <Text style={styles.switchButtonText}>Switch to Renter</Text>
          </TouchableOpacity>
        )}

        {accountType !== 'owner' && (
          <TouchableOpacity style={styles.switchButton} onPress={handleSwitchToOwner}>
            <Ionicons name="business-outline" size={20} color={VibrantGreen} />
            <Text style={styles.switchButtonText}>Switch to Owner</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    margin: 10,
  },
  currentAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  currentAccountText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  switchButtons: {
    gap: 8,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  switchButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: '#333',
  },
});

export default AccountSwitcher;
