import BackButton from '@/components/BackButton';
import { useAccount } from '@/contexts/AccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { ImagePickerService } from '@/services/ImagePickerService';
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const { accountType } = useAccount();
  const { logout, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Initialize with user profile data or defaults
  const [profileData, setProfileData] = useState({
    name: userProfile?.displayName || 'User',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    location: userProfile?.location || '',
    bio: userProfile?.bio || '',
    accountType: accountType === 'owner' ? 'Owner' : 'Renter',
    joinDate: userProfile?.joinDate || 'January 2024',
    rating: userProfile?.rating || 0,
    totalRentals: userProfile?.totalRentals || 0,
    totalEarnings: userProfile?.totalEarnings || '$0',
  });

  const [profileImage, setProfileImage] = useState(
    userProfile?.profileImageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'
  );

  const [notifications, setNotifications] = useState(userProfile?.preferences?.notifications ?? true);
  const [emailUpdates, setEmailUpdates] = useState(userProfile?.preferences?.emailUpdates ?? true);

  // Update profile data when userProfile or account type changes
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.displayName,
        email: userProfile.email,
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        bio: userProfile.bio || '',
        accountType: accountType === 'owner' ? 'Owner' : 'Renter',
        joinDate: userProfile.joinDate,
        rating: userProfile.rating || 0,
        totalRentals: userProfile.totalRentals || 0,
        totalEarnings: userProfile.totalEarnings || '$0',
      });
      
      if (userProfile.profileImageUrl) {
        setProfileImage(userProfile.profileImageUrl);
      }
      
      setNotifications(userProfile.preferences?.notifications ?? true);
      setEmailUpdates(userProfile.preferences?.emailUpdates ?? true);
    }
  }, [userProfile, accountType]);

  const [editData, setEditData] = useState(profileData);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserProfile({
        displayName: editData.name,
        phone: editData.phone,
        location: editData.location,
        bio: editData.bio,
      });
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
          await logout();
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
        await updateUserProfile({ profileImageUrl: imageUrl });
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
      await updateUserProfile({
        preferences: {
          notifications: userProfile?.preferences?.notifications ?? true,
          emailUpdates: userProfile?.preferences?.emailUpdates ?? true,
          [key]: value,
        },
      });
      
      if (key === 'notifications') {
        setNotifications(value);
      } else {
        setEmailUpdates(value);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      showErrorAlert('Error', 'Failed to update preferences. Please try again.');
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
    { title: 'Billing & Payments', icon: 'card' as const, onPress: () => router.push('/billing') },
    { title: 'My Listings', icon: 'list' as const, onPress: () => router.push(accountType === 'owner' ? '/owner-listings' : '/my-listings') },
    { title: 'My Bookings', icon: 'calendar' as const, onPress: () => router.push('/my-bookings') },
    { title: 'Favorites', icon: 'heart' as const, onPress: () => router.push('/favorites') },
    { title: 'Reviews', icon: 'star' as const, onPress: () => router.push('/reviews') },
    { title: 'Settings', icon: 'settings' as const, onPress: () => router.push('/settings') },
    { title: 'Help & Support', icon: 'help-circle' as const, onPress: () => router.push('/help') },
    { title: 'Logout', icon: 'log-out' as const, onPress: handleLogout, isDestructive: true },
  ];

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <BackButton onPress={() => router.push('/(tabs)')} />

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
              <Text style={styles.joinDate}>Member since {profileData.joinDate}</Text>
            </View>
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
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <Ionicons 
                  name={item.icon} 
                  size={20} 
                  color={item.isDestructive ? Error : SecondaryText} 
                />
                <Text style={[
                  styles.menuItemText,
                  item.isDestructive && styles.destructiveText
                ]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={SecondaryText} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
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
});

export default ProfileScreen;