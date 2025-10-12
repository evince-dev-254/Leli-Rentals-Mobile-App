import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAccount } from '@/contexts/AccountContext';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  PrimaryText, 
  SecondaryText, 
  Border,
  Success,
  Error
} from '@/constants/Colors';

const ProfileScreen = () => {
  const { accountType } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop');
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate about sharing quality items with the community. Always looking for unique finds!',
    accountType: accountType === 'owner' ? 'Owner' : 'Renter',
    joinDate: 'January 2024',
    rating: 4.8,
    totalRentals: 24,
    totalEarnings: '$1,250',
  });

  // Update profile data when account type changes
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      accountType: accountType === 'owner' ? 'Owner' : 'Renter'
    }));
  }, [accountType]);

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };


  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleImageChange = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option to update your profile picture',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Take Photo', 
          onPress: () => {
            // In a real app, this would open the camera
            Alert.alert('Camera', 'Camera functionality would be implemented here');
          }
        },
        { 
          text: 'Choose from Gallery', 
          onPress: () => {
            // In a real app, this would open the image picker
            Alert.alert('Gallery', 'Image picker functionality would be implemented here');
          }
        }
      ]
    );
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
    { title: 'My Listings', icon: 'list' as const, onPress: () => router.push('/my-listings') },
    { title: 'My Bookings', icon: 'calendar' as const, onPress: () => router.push('/my-bookings') },
    { title: 'Favorites', icon: 'heart' as const, onPress: () => router.push('/favorites') },
    { title: 'Reviews', icon: 'star' as const, onPress: () => router.push('/reviews') },
    { title: 'Settings', icon: 'settings' as const, onPress: () => router.push('/settings') },
    { title: 'Help & Support', icon: 'help-circle' as const, onPress: () => router.push('/help') },
  ];

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Ionicons name="arrow-back" size={24} color={PrimaryBrand} />
      </TouchableOpacity>

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
                  onChangeText={(text) => setEditData({...editData, name: text})}
                  placeholder="Enter your full name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editData.email}
                  onChangeText={(text) => setEditData({...editData, email: text})}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editData.phone}
                  onChangeText={(text) => setEditData({...editData, phone: text})}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editData.location}
                  onChangeText={(text) => setEditData({...editData, location: text})}
                  placeholder="Enter your location"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editData.bio}
                  onChangeText={(text) => setEditData({...editData, bio: text})}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
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
              onValueChange={setNotifications}
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
              onValueChange={setEmailUpdates}
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
                <Ionicons name={item.icon} size={20} color={SecondaryText} />
                <Text style={styles.menuItemText}>{item.title}</Text>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default ProfileScreen;