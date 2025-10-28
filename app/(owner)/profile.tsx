import AccountSwitchVerification from '@/components/AccountSwitchVerification';
import BackButton from '@/components/BackButton';
import { SignOutButton } from '@/components/SignOutButton';
import { useAccount } from '@/contexts/AccountContext';
import { ImagePickerService } from '@/services/ImagePickerService';
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    Background,
    Border,
    Error,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    Success,
    WhiteBackground
} from '@/constants/Colors';

// Web-compatible StyleSheet
const StyleSheet = {
  create: (styles: any) => styles
};

// Use React Native Alert instead of web-compatible version

const ProfileScreen = () => {
  const { accountType, switchToOwner, switchToRenter } = useAccount();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const hasNavigatedRef = useRef(false);
  
  // Initialize with user profile data or defaults
  const [profileData, setProfileData] = useState({
    name: user?.fullName || user?.firstName || 'User',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
    location: '',
    bio: '',
    accountType: accountType === 'owner' ? 'Owner' : 'Renter',
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
    rating: 0,
    totalRentals: 0,
    totalEarnings: '$0',
  });

  const [profileImage, setProfileImage] = useState(
    user?.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'
  );

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  // Update profile data when user or account type changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.fullName || user.firstName || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || '',
        location: '',
        bio: '',
        accountType: accountType === 'owner' ? 'Owner' : 'Renter',
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
        rating: 0,
        totalRentals: 0,
        totalEarnings: '$0',
      });
      
      if (user.imageUrl) {
        setProfileImage(user.imageUrl);
      }
    }
  }, [user, accountType]);

  const [editData, setEditData] = useState(profileData);

  const handleSave = async () => {
    try {
      setLoading(true);
      // Update user profile using Clerk's user object
      if (user) {
        await user.update({
          firstName: editData.name.split(' ')[0],
          lastName: editData.name.split(' ').slice(1).join(' ') || '',
        });
      }
      setProfileData(editData);
      setIsEditing(false);
      showSuccessAlert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorAlert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    showConfirmationAlert(
      'Logout',
      'Are you sure you want to logout?',
      async () => {
        try {
          await signOut();
          router.push('/login');
        } catch {
          showErrorAlert('Error', 'Failed to logout. Please try again.');
        }
      }
    );
  };

  const handleImageChange = async () => {
    try {
      setLoading(true);
      const imageResult = await ImagePickerService.showImagePickerOptions();
      
      if (imageResult) {
        // Validate image
        const validation = ImagePickerService.validateImage(imageResult);
        if (!validation.isValid) {
          showErrorAlert('Invalid Image', validation.error);
          return;
        }
        
        // Upload image
        const imageUrl = await ImagePickerService.uploadImage(imageResult);
        
        // Update profile with new image
        // For now, just update the local state
        // In a real app, you'd update the user's profile image via your backend
        setProfileImage(imageUrl);
        
        showSuccessAlert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      showErrorAlert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key: 'notifications' | 'emailUpdates', value: boolean) => {
    try {
      // For now, just update local state
      // In a real app, you'd save these preferences to your backend
      if (key === 'notifications') {
        setNotifications(value);
      } else {
        setEmailUpdates(value);
      }
      showSuccessAlert('Success', 'Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      showErrorAlert('Error', 'Failed to update preferences. Please try again.');
    }
  };

  const handleAccountSwitch = () => {
    if (accountType === 'renter') {
      // Renter wants to switch to owner - show verification modal
      setShowVerificationModal(true);
    } else if (accountType === 'owner') {
      // Owner wants to switch to renter - direct switch
      showConfirmationAlert(
        'Switch to Renter Account',
        'Are you sure you want to switch to a Renter account? You will lose access to owner features.',
        async () => {
          if (hasNavigatedRef.current) return;
          try {
            hasNavigatedRef.current = true;
            await switchToRenter();
            showSuccessAlert('Success', 'Switched to Renter account successfully!');
            router.push('/(owner)');
          } catch (error) {
            console.error('Error switching to renter:', error);
            showErrorAlert('Error', 'Failed to switch account type. Please try again.');
            hasNavigatedRef.current = false;
          }
        }
      );
    }
  };

  const handleVerificationComplete = async (idImage: string) => {
    if (hasNavigatedRef.current) return;
    
    try {
      setVerificationLoading(true);
      hasNavigatedRef.current = true;
      
      // Here you would typically send the ID image to your backend for verification
      // For now, we'll simulate the verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Switch to owner account
      await switchToOwner();
      
      // Update user profile with verification status
      // In a real app, you'd save this to your backend
      console.log('ID verification completed with image:', idImage);
      
      setShowVerificationModal(false);
      showSuccessAlert(
        'Verification Successful!', 
        'Your identity has been verified. You can now use Owner features!'
      );
      router.push('/(owner)');
    } catch (error) {
      console.error('Error during verification:', error);
      showErrorAlert('Verification Failed', 'Failed to verify your identity. Please try again.');
      hasNavigatedRef.current = false;
    } finally {
      setVerificationLoading(false);
    }
  };

  const stats = [
    { label: 'Total Rentals', value: profileData.totalRentals, icon: 'bag' as const, color: PrimaryBrand },
    { label: 'Rating', value: profileData.rating, icon: 'star' as const, color: '#fbbf24' },
    { label: 'Earnings', value: profileData.totalEarnings, icon: 'cash' as const, color: Success },
    { label: 'Items Listed', value: '12', icon: 'list' as const, color: '#8b5cf6' },
  ];

  const menuItems = [
    { title: 'Edit Profile', icon: 'person' as const, onPress: () => setIsEditing(true) },
    { 
      title: accountType === 'owner' ? 'Switch to Renter' : 'Switch to Owner', 
      icon: accountType === 'owner' ? 'person-outline' as const : 'briefcase-outline' as const, 
      onPress: handleAccountSwitch,
      isAccountSwitch: true,
    },
    { title: 'Billing & Payments', icon: 'card' as const, onPress: () => router.push('/(owner)/billing') },
    { title: 'My Listings', icon: 'list' as const, onPress: () => router.push(accountType === 'owner' ? '/(owner)/owner-listings' : '/(renter)/my-listings') },
    { title: 'My Bookings', icon: 'calendar' as const, onPress: () => router.push('/(owner)/my-bookings') },
    { title: 'Favorites', icon: 'heart' as const, onPress: () => router.push('/(owner)/favorites') },
    { title: 'Reviews', icon: 'star' as const, onPress: () => router.push('/(owner)/reviews') },
    { title: 'Settings', icon: 'settings' as const, onPress: () => router.push('/(owner)/settings') },
    { title: 'Help & Support', icon: 'help-circle' as const, onPress: () => router.push('/(owner)/help') },
    { title: 'Sign Out', icon: 'log-out' as const, onPress: () => {}, isDestructive: true, isSignOut: true },
  ];

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <BackButton onPress={() => router.push('/(owner)')} />

      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton} onPress={handleImageChange}>
              <Ionicons name="camera" size={16} color={WhiteBackground} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileEmail}>{profileData.email}</Text>
            <View style={styles.accountTypeContainer}>
              <View style={[styles.accountTypeBadge, { backgroundColor: profileData.accountType === 'Owner' ? Success + '20' : PrimaryBrand + '20' }]}>
                <Text style={[styles.accountTypeText, { color: profileData.accountType === 'Owner' ? Success : PrimaryBrand }]}>
                  {profileData.accountType}
                </Text>
              </View>
              <View style={[styles.verificationBadge, { backgroundColor: Success + '20' }]}>
                <Ionicons name="checkmark-circle" size={14} color={Success} />
                <Text style={[styles.verificationText, { color: Success }]}>Verified</Text>
              </View>
            </View>
            <Text style={styles.joinDate}>Member since {profileData.joinDate}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Business Subscription</Text>
            <TouchableOpacity onPress={() => router.push('/(owner)/billing')}>
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionInfo}>
              <Ionicons name="briefcase" size={24} color={Success} />
              <View style={styles.subscriptionDetails}>
                <Text style={styles.subscriptionPlan}>Basic Plan</Text>
                <Text style={styles.subscriptionFeatures}>
                  • Up to 5 active listings{'\n'}
                  • Standard commission (15%){'\n'}
                  • Email support{'\n'}
                  • Basic analytics
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/(owner)/billing')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editData.name}
                  onChangeText={(text: string) => setEditData({...editData, name: text})}
                  placeholder="Enter your full name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editData.email}
                  onChangeText={(text: string) => setEditData({...editData, email: text})}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editData.phone}
                  onChangeText={(text: string) => setEditData({...editData, phone: text})}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editData.location}
                  onChangeText={(text: string) => setEditData({...editData, location: text})}
                  placeholder="Enter your location"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editData.bio}
                  onChangeText={(text: string) => setEditData({...editData, bio: text})}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                  onPress={handleSave}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="person" size={20} color={SecondaryText} />
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{profileData.name}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="mail" size={20} color={SecondaryText} />
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{profileData.email}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="call" size={20} color={SecondaryText} />
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{profileData.phone}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="location" size={20} color={SecondaryText} />
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{profileData.location}</Text>
              </View>
              
              <View style={styles.bioContainer}>
                <Text style={styles.bioLabel}>Bio:</Text>
                <Text style={styles.bioText}>{profileData.bio}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color={SecondaryText} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(value) => handlePreferenceChange('notifications', value)}
              trackColor={{ false: '#e5e7eb', true: PrimaryBrand + '40' }}
              thumbColor={notifications ? PrimaryBrand : '#ffffff'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail" size={20} color={SecondaryText} />
              <Text style={styles.settingLabel}>Email Updates</Text>
            </View>
            <Switch
              value={emailUpdates}
              onValueChange={(value) => handlePreferenceChange('emailUpdates', value)}
              trackColor={{ false: '#e5e7eb', true: PrimaryBrand + '40' }}
              thumbColor={emailUpdates ? PrimaryBrand : '#ffffff'}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {menuItems.map((item, index) => (
            <View key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons 
                  name={item.icon} 
                  size={20} 
                  color={item.isDestructive ? Error : (item.isAccountSwitch ? PrimaryBrand : SecondaryText)} 
                />
                <Text style={[
                  styles.menuItemText,
                  item.isDestructive && styles.destructiveText,
                  item.isAccountSwitch && styles.accountSwitchText
                ]}>
                  {item.title}
                </Text>
              </View>
              {item.isSignOut ? (
                <SignOutButton />
              ) : (
                <TouchableOpacity onPress={item.onPress}>
                  <Ionicons name="chevron-forward" size={16} color={SecondaryText} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Account Switch Verification Modal */}
      <AccountSwitchVerification
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerificationComplete}
        loading={verificationLoading}
      />
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
    flexDirection: 'row',
    padding: 20,
    paddingTop: 100,
    backgroundColor: WhiteBackground,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PrimaryBrand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: SecondaryText,
    marginBottom: 8,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  accountTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verificationText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  joinDate: {
    fontSize: 12,
    color: SecondaryText,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginRight: '2%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: SecondaryText,
    textAlign: 'center',
  },
  section: {
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryBrand,
  },
  subscriptionCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  subscriptionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  subscriptionPlan: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  subscriptionFeatures: {
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 22,
  },
  upgradeButton: {
    backgroundColor: PrimaryBrand,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: WhiteBackground,
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
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
    backgroundColor: Background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Border,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: SecondaryText,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: PrimaryBrand,
    alignItems: 'center',
  },
  saveButtonText: {
    color: WhiteBackground,
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  profileDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    minWidth: 60,
  },
  detailValue: {
    fontSize: 14,
    color: SecondaryText,
    flex: 1,
  },
  bioContainer: {
    marginTop: 8,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: SecondaryText,
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: PrimaryText,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: PrimaryText,
  },
  destructiveText: {
    color: Error,
  },
  accountSwitchText: {
    color: PrimaryBrand,
    fontWeight: '600',
  },
});

export default ProfileScreen;