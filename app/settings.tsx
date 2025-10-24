import BackButton from '@/components/BackButton';
import {
    Background,
    Border,
    DarkBackground,
    DarkBorder,
    DarkCard,
    DarkForeground,
    DarkMutedText,
    DarkSecondaryText,
    DarkText,
    Error,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantGreen,
    VibrantOrange,
    VibrantRed,
    WhiteBackground
} from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const SettingsScreen = () => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const { accountType, verificationStatus, isOwnerVerified, switchToOwner, switchToRenter } = useAccount();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSwitchToOwner = () => {
    if (verificationStatus === 'not_started') {
      showConfirmationAlert(
        'Owner Verification Required',
        'To become an owner, you need to complete ID verification within 2 days of account creation. This includes uploading your ID card or passport for verification.',
        async () => {
          try {
            await switchToOwner();
            setShowAccountTypeModal(false);
            showSuccessAlert('Success', 'Switched to owner account! Please complete verification to access all owner features.');
          } catch (error) {
            showErrorAlert('Error', 'Failed to switch to owner account');
            console.error('Switch to owner error:', error);
          }
        }
      );
    } else if (verificationStatus === 'pending') {
      showConfirmationAlert(
        'Verification Pending',
        'Your owner verification is currently under review. You can still switch to owner account, but some features may be limited until verification is complete.',
        async () => {
          try {
            await switchToOwner();
            setShowAccountTypeModal(false);
            showSuccessAlert('Success', 'Switched to owner account! Your verification is still pending.');
          } catch (error) {
            showErrorAlert('Error', 'Failed to switch to owner account');
            console.error('Switch to owner error:', error);
          }
        }
      );
    } else if (verificationStatus === 'rejected') {
      showConfirmationAlert(
        'Verification Rejected',
        'Your previous verification was rejected. You can still switch to owner account, but you\'ll need to reapply for verification.',
        async () => {
          try {
            await switchToOwner();
            setShowAccountTypeModal(false);
            showSuccessAlert('Success', 'Switched to owner account! Please reapply for verification.');
          } catch (error) {
            showErrorAlert('Error', 'Failed to switch to owner account');
            console.error('Switch to owner error:', error);
          }
        }
      );
    } else if (verificationStatus === 'verified') {
      showConfirmationAlert(
        'Switch to Owner Account',
        'You are verified as an owner. Switch to owner account to access owner features?',
        async () => {
          try {
            await switchToOwner();
            setShowAccountTypeModal(false);
            showSuccessAlert('Success', 'Switched to owner account successfully!');
          } catch (error) {
            showErrorAlert('Error', 'Failed to switch to owner account');
            console.error('Switch to owner error:', error);
          }
        }
      );
    }
  };

  const handleSwitchToRenter = () => {
    showConfirmationAlert(
      'Switch to Renter Account',
      'Switch to renter account to access renter features?',
      async () => {
        try {
          await switchToRenter();
          setShowAccountTypeModal(false);
          showSuccessAlert('Success', 'Switched to renter account successfully!');
        } catch (error) {
          showErrorAlert('Error', 'Failed to switch to renter account');
          console.error('Switch to renter error:', error);
        }
      }
    );
  };

  const getAccountTypeStatus = () => {
    if (accountType === 'owner') {
      if (isOwnerVerified) return { text: 'Owner (Verified)', color: VibrantGreen };
      if (verificationStatus === 'pending') return { text: 'Owner (Pending)', color: VibrantOrange };
      if (verificationStatus === 'rejected') return { text: 'Owner (Rejected)', color: VibrantRed };
      return { text: 'Owner (Unverified)', color: VibrantOrange };
    }
    return { text: 'Renter', color: PrimaryBrand };
  };

  const accountSettings = [
    {
      title: 'Personal Information',
      icon: 'person-outline',
      onPress: () => router.push('/profile/'),
      showArrow: true,
    },
    {
      title: 'Change Password',
      icon: 'lock-closed-outline',
      onPress: () => setShowChangePassword(true),
      showArrow: true,
    },
    {
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => router.push('/billing'),
      showArrow: true,
    },
    {
      title: 'Account Type',
      icon: 'business-outline',
      onPress: () => setShowAccountTypeModal(true),
      showArrow: true,
      status: getAccountTypeStatus(),
    },
  ];

  const privacySettings = [
    {
      title: 'Privacy Policy',
      icon: 'shield-outline',
      onPress: () => router.push('/privacy'),
      showArrow: true,
    },
    {
      title: 'Terms of Service',
      icon: 'document-text-outline',
      onPress: () => router.push('/terms'),
      showArrow: true,
    },
    {
      title: 'Data & Privacy',
      icon: 'eye-outline',
      onPress: () => showSuccessAlert('Data & Privacy', 'Manage your data preferences'),
      showArrow: true,
    },
  ];

  const supportSettings = [
    {
      title: 'Help Center',
      icon: 'help-circle-outline',
      onPress: () => router.push('/help'),
      showArrow: true,
    },
    {
      title: 'Contact Support',
      icon: 'chatbubble-outline',
      onPress: () => router.push('/contact'),
      showArrow: true,
    },
    {
      title: 'Report a Problem',
      icon: 'flag-outline',
      onPress: () => showSuccessAlert('Report Problem', 'Report a technical issue'),
      showArrow: true,
    },
  ];

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showErrorAlert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      showErrorAlert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showErrorAlert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    showSuccessAlert('Success', 'Password changed successfully');
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    showConfirmationAlert(
      'Sign Out',
      'Are you sure you want to sign out?',
      async () => {
        try {
          // Use the logout function from AccountContext
          await logout();
          
          // Navigate to login page
          router.push('/login');
        } catch (error) {
          console.error('Error during logout:', error);
          // Still navigate to login page even if logout fails
          router.push('/login');
        }
      }
    );
  };

  const handleDeleteAccount = async () => {
    showConfirmationAlert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      async () => {
        try {
          // Delete user from Firebase Auth
          const { deleteUser } = await import('firebase/auth');
          const { auth } = await import('@/config/firebase');
          const { UserDataService } = await import('@/services/UserDataService');
          
          if (auth.currentUser) {
            await deleteUser(auth.currentUser);
            await UserDataService.clearUserData();
            showSuccessAlert('Account Deleted', 'Your account has been permanently deleted');
            router.push('/signup');
          }
        } catch (error) {
          console.error('Error deleting account:', error);
          showErrorAlert('Error', 'Failed to delete account. Please try again.');
        }
      }
    );
  };

  const renderSettingItem = (item) => (
    <TouchableOpacity
      key={item.title}
      style={styles.settingItem}
      onPress={item.onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon} size={20} color={PrimaryBrand} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: isDark ? DarkText : PrimaryText }]}>
            {item.title}
          </Text>
          {item.status && (
            <Text style={[styles.settingStatus, { color: item.status.color }]}>
              {item.status.text}
            </Text>
          )}
        </View>
      </View>
      {item.showArrow && (
        <Ionicons name="chevron-forward" size={16} color={isDark ? DarkSecondaryText : SecondaryText} />
      )}
    </TouchableOpacity>
  );

  const renderSwitchItem = (title, value, onValueChange, icon) => (
    <View key={title} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color={PrimaryBrand} />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Border, true: PrimaryBrand + '40' }}
        thumbColor={value ? PrimaryBrand : SecondaryText}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]}>
      {/* Animated Back Button */}
      <BackButton onPress={() => router.push('/(tabs)')} />

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? DarkForeground : PrimaryText }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: isDark ? DarkMutedText : SecondaryText }]}>Manage your account and preferences</Text>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? DarkForeground : PrimaryText }]}>Account</Text>
          <View style={[styles.settingsCard, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
            {accountSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={[styles.settingsCard, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
            {renderSwitchItem('Push Notifications', pushNotifications, setPushNotifications, 'notifications-outline')}
            {renderSwitchItem('Email Updates', emailUpdates, setEmailUpdates, 'mail-outline')}
            {renderSwitchItem('Booking Alerts', notifications, setNotifications, 'calendar-outline')}
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={[styles.settingsCard, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
            {renderSwitchItem('Location Services', locationServices, setLocationServices, 'location-outline')}
            {renderSwitchItem('Biometric Authentication', biometricAuth, setBiometricAuth, 'finger-print-outline')}
            {renderSwitchItem('Auto Sync', autoSync, setAutoSync, 'sync-outline')}
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={[styles.settingsCard, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setShowThemeModal(true)}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="color-palette-outline" size={20} color={PrimaryBrand} />
                </View>
                <Text style={styles.settingTitle}>Theme</Text>
              </View>
              <View style={styles.themeValue}>
                <Text style={styles.themeText}>
                  {themeMode === 'light' ? 'Light' : themeMode === 'dark' ? 'Dark' : 'System'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={SecondaryText} />
              </View>
            </TouchableOpacity>
            {renderSwitchItem('Dark Mode', isDark, (value) => {
              setThemeMode(value ? 'dark' : 'light');
            }, 'moon-outline')}
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={[styles.settingsCard, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
            {privacySettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={[styles.settingsCard, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
            {supportSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={[styles.settingsCard, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="information-circle-outline" size={20} color={PrimaryBrand} />
                </View>
                <Text style={styles.settingTitle}>Version</Text>
              </View>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="refresh-outline" size={20} color={PrimaryBrand} />
                </View>
                <Text style={styles.settingTitle}>Check for Updates</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={SecondaryText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={[styles.settingsCard, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
            <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, styles.dangerIcon]}>
                  <Ionicons name="log-out-outline" size={20} color={Error} />
                </View>
                <Text style={[styles.settingTitle, styles.dangerText]}>Sign Out</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleDeleteAccount}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, styles.dangerIcon]}>
                  <Ionicons name="trash-outline" size={20} color={Error} />
                </View>
                <Text style={[styles.settingTitle, styles.dangerText]}>Delete Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      {showChangePassword && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <Ionicons name="close" size={24} color={SecondaryText} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                />
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowChangePassword(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Theme</Text>
              <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                <Ionicons name="close" size={24} color={SecondaryText} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeMode === 'light' && styles.selectedThemeOption
                ]}
                  onPress={() => {
                    setThemeMode('light');
                    setShowThemeModal(false);
                  }}
              >
                <View style={styles.themeOptionLeft}>
                  <Ionicons name="sunny" size={24} color="#f59e0b" />
                  <View style={styles.themeOptionText}>
                    <Text style={styles.themeOptionTitle}>Light</Text>
                    <Text style={styles.themeOptionDescription}>Always use light theme</Text>
                  </View>
                </View>
                {themeMode === 'light' && (
                  <Ionicons name="checkmark" size={20} color={PrimaryBrand} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeMode === 'dark' && styles.selectedThemeOption
                ]}
                  onPress={() => {
                    setThemeMode('dark');
                    setShowThemeModal(false);
                  }}
              >
                <View style={styles.themeOptionLeft}>
                  <Ionicons name="moon" size={24} color="#6366f1" />
                  <View style={styles.themeOptionText}>
                    <Text style={styles.themeOptionTitle}>Dark</Text>
                    <Text style={styles.themeOptionDescription}>Always use dark theme</Text>
                  </View>
                </View>
                {themeMode === 'dark' && (
                  <Ionicons name="checkmark" size={20} color={PrimaryBrand} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeMode === 'system' && styles.selectedThemeOption
                ]}
                onPress={() => {
                  setThemeMode('system');
                  setShowThemeModal(false);
                }}
              >
                <View style={styles.themeOptionLeft}>
                  <Ionicons name="phone-portrait" size={24} color={PrimaryBrand} />
                  <View style={styles.themeOptionText}>
                    <Text style={styles.themeOptionTitle}>System</Text>
                    <Text style={styles.themeOptionDescription}>Follow system setting</Text>
                  </View>
                </View>
                {themeMode === 'system' && (
                  <Ionicons name="checkmark" size={20} color={PrimaryBrand} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Account Type Modal */}
      {showAccountTypeModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? DarkText : PrimaryText }]}>
                Account Type
              </Text>
              <TouchableOpacity onPress={() => setShowAccountTypeModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? DarkSecondaryText : SecondaryText} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.accountTypeContent}>
              <Text style={[styles.accountTypeDescription, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Switch between renter and owner accounts to access different features.
              </Text>

              <View style={styles.accountTypeOptions}>
                <TouchableOpacity
                  style={[
                    styles.accountTypeOption,
                    { 
                      backgroundColor: isDark ? DarkBackground : Background,
                      borderColor: accountType === 'renter' ? PrimaryBrand : (isDark ? DarkBorder : Border)
                    }
                  ]}
                  onPress={handleSwitchToRenter}
                >
                  <View style={styles.accountTypeLeft}>
                    <View style={[styles.accountTypeIcon, { backgroundColor: PrimaryBrand + '20' }]}>
                      <Ionicons name="person" size={24} color={PrimaryBrand} />
                    </View>
                    <View style={styles.accountTypeText}>
                      <Text style={[styles.accountTypeTitle, { color: isDark ? DarkText : PrimaryText }]}>
                        Renter Account
                      </Text>
                      <Text style={[styles.accountTypeSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                        Browse and rent items
                      </Text>
                    </View>
                  </View>
                  {accountType === 'renter' && (
                    <Ionicons name="checkmark-circle" size={20} color={PrimaryBrand} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.accountTypeOption,
                    { 
                      backgroundColor: isDark ? DarkBackground : Background,
                      borderColor: accountType === 'owner' ? PrimaryBrand : (isDark ? DarkBorder : Border)
                    }
                  ]}
                  onPress={handleSwitchToOwner}
                >
                  <View style={styles.accountTypeLeft}>
                    <View style={[styles.accountTypeIcon, { backgroundColor: VibrantGreen + '20' }]}>
                      <Ionicons name="business" size={24} color={VibrantGreen} />
                    </View>
                    <View style={styles.accountTypeText}>
                      <Text style={[styles.accountTypeTitle, { color: isDark ? DarkText : PrimaryText }]}>
                        Owner Account
                      </Text>
                      <Text style={[styles.accountTypeSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                        List items and earn money
                      </Text>
                      {verificationStatus === 'not_started' && (
                        <Text style={[styles.verificationRequired, { color: VibrantOrange }]}>
                          Verification required
                        </Text>
                      )}
                      {verificationStatus === 'pending' && (
                        <Text style={[styles.verificationPending, { color: VibrantOrange }]}>
                          Verification pending
                        </Text>
                      )}
                      {verificationStatus === 'rejected' && (
                        <Text style={[styles.verificationRejected, { color: VibrantRed }]}>
                          Verification rejected
                        </Text>
                      )}
                      {verificationStatus === 'verified' && (
                        <Text style={[styles.verificationVerified, { color: VibrantGreen }]}>
                          ✓ Verified
                        </Text>
                      )}
                    </View>
                  </View>
                  {accountType === 'owner' && (
                    <Ionicons name="checkmark-circle" size={20} color={PrimaryBrand} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: SecondaryText,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  settingsCard: {
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PrimaryBrand + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: PrimaryText,
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    color: SecondaryText,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerIcon: {
    backgroundColor: Error + '20',
  },
  dangerText: {
    color: Error,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    margin: 20,
    maxWidth: 400,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  modalContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: PrimaryText,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Background,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: SecondaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: PrimaryBrand,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeText: {
    fontSize: 14,
    color: SecondaryText,
  },
  themeOptions: {
    padding: 20,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Border,
  },
  selectedThemeOption: {
    backgroundColor: PrimaryBrand + '10',
    borderColor: PrimaryBrand,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeOptionText: {
    marginLeft: 16,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 2,
  },
  themeOptionDescription: {
    fontSize: 14,
    color: SecondaryText,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  accountTypeContent: {
    padding: 20,
  },
  accountTypeDescription: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  accountTypeOptions: {
    gap: 12,
  },
  accountTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  accountTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountTypeText: {
    flex: 1,
  },
  accountTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountTypeSubtitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  verificationRequired: {
    fontSize: 12,
    fontWeight: '600',
  },
  verificationPending: {
    fontSize: 12,
    fontWeight: '600',
  },
  verificationRejected: {
    fontSize: 12,
    fontWeight: '600',
  },
  verificationVerified: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SettingsScreen;
