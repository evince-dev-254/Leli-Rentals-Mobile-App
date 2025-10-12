import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  PrimaryBrand, 
  Background, 
  WhiteBackground, 
  PrimaryText, 
  SecondaryText, 
  Border,
  Success,
  Error,
  Warning
} from '@/constants/Colors';

interface LocationPickerProps {
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
  placeholder?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocation,
  onLocationSelect,
  placeholder = "Select location"
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale',
    'Garissa', 'Kakamega', 'Nyeri', 'Meru', 'Machakos', 'Kisii', 'Kericho', 'Embu',
    'Narok', 'Kitui', 'Bungoma', 'Athi River', 'Voi', 'Kilifi', 'Lamu', 'Taita Taveta',
    'Kwale', 'Tana River', 'Lamu', 'Isiolo', 'Marsabit', 'Turkana', 'West Pokot',
    'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo',
    'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega',
    'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori',
    'Kisii', 'Nyamira', 'Nairobi', 'Kiambu', 'Murang\'a', 'Nyeri', 'Kirinyaga',
    'Embu', 'Tharaka Nithi', 'Meru', 'Isiolo', 'Marsabit', 'Samburu', 'Turkana',
    'West Pokot', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi',
    'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet',
    'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay',
    'Migori', 'Kisii', 'Nyamira'
  ];

  const filteredCounties = kenyanCounties.filter(county =>
    county.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    onLocationSelect(location);
    setShowModal(false);
    setSearchQuery('');
  };

  const handleCurrentLocation = () => {
    Alert.alert(
      'Use Current Location',
      'Allow Leli Rentals to access your location to automatically set your listing location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Allow', 
          onPress: () => {
            // In a real app, this would use geolocation
            onLocationSelect('Nairobi, Kenya');
            setShowModal(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="location" size={20} color={PrimaryBrand} />
        <Text style={[styles.locationText, !selectedLocation && styles.placeholderText]}>
          {selectedLocation || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={SecondaryText} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={SecondaryText} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={SecondaryText} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search counties..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={SecondaryText}
              />
            </View>

            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={handleCurrentLocation}
            >
              <Ionicons name="locate" size={20} color={PrimaryBrand} />
              <Text style={styles.currentLocationText}>Use Current Location</Text>
            </TouchableOpacity>

            <ScrollView style={styles.countiesList}>
              {filteredCounties.map((county, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.countyItem,
                    selectedLocation === county && styles.selectedCountyItem
                  ]}
                  onPress={() => handleLocationSelect(county)}
                >
                  <Text style={[
                    styles.countyText,
                    selectedLocation === county && styles.selectedCountyText
                  ]}>
                    {county}
                  </Text>
                  {selectedLocation === county && (
                    <Ionicons name="checkmark" size={20} color={PrimaryBrand} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Border,
    gap: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: PrimaryText,
  },
  placeholderText: {
    color: SecondaryText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: WhiteBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Background,
    borderRadius: 8,
    margin: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: PrimaryText,
    paddingVertical: 12,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PrimaryBrand + '10',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryBrand,
  },
  countiesList: {
    maxHeight: 300,
    paddingHorizontal: 20,
  },
  countyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedCountyItem: {
    backgroundColor: PrimaryBrand + '10',
  },
  countyText: {
    fontSize: 16,
    color: PrimaryText,
  },
  selectedCountyText: {
    color: PrimaryBrand,
    fontWeight: '600',
  },
});

export default LocationPicker;
