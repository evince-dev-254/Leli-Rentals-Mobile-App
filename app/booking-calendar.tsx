import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
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

const BookingCalendarScreen = () => {
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
  const [selectedTime, setSelectedTime] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const listing = {
    id: 1,
    title: 'Professional Camera Kit - Canon EOS R5',
    price: 2500, // KES per day
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    owner: {
      name: 'Sarah Johnson',
      phone: '+254 712 345 678',
      email: 'sarah.johnson@example.com',
      rating: 4.9,
    },
    location: 'Nairobi, Kenya',
    description: 'Professional-grade Canon EOS R5 camera with 45MP full-frame sensor, perfect for photography and videography.',
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ];

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-KE', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateTotal = () => {
    if (!selectedDates.start || !selectedDates.end) return 0;
    const days = Math.ceil((selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24)) + 1;
    return days * listing.price * quantity;
  };

  const handleDateSelect = (date) => {
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      setSelectedDates({ start: date, end: null });
    } else if (selectedDates.start && !selectedDates.end) {
      if (date > selectedDates.start) {
        setSelectedDates({ ...selectedDates, end: date });
      } else {
        setSelectedDates({ start: date, end: null });
      }
    }
  };

  const handleBooking = () => {
    if (!selectedDates.start || !selectedDates.end) {
      Alert.alert('Select Dates', 'Please select both start and end dates for your booking.');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Select Time', 'Please select a pickup time.');
      return;
    }

    Alert.alert(
      'Booking Confirmed!',
      `Your booking for ${listing.title} has been confirmed.\n\nDates: ${formatDate(selectedDates.start)} - ${formatDate(selectedDates.end)}\nTime: ${selectedTime}\nTotal: KES ${calculateTotal().toLocaleString()}`,
      [
        { text: 'View Bookings', onPress: () => router.push('/my-bookings') },
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const renderCalendar = () => (
    <Modal visible={showCalendar} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.calendarModal}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Select Dates</Text>
            <TouchableOpacity onPress={() => setShowCalendar(false)}>
              <Ionicons name="close" size={24} color={PrimaryText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.calendarContainer}>
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const isSelected = selectedDates.start && selectedDates.end && 
                  day >= selectedDates.start && day <= selectedDates.end;
                const isStart = selectedDates.start && day.getTime() === selectedDates.start.getTime();
                const isEnd = selectedDates.end && day.getTime() === selectedDates.end.getTime();
                const isPast = day < new Date().setHours(0, 0, 0, 0);
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      isSelected && styles.selectedDay,
                      isStart && styles.startDay,
                      isEnd && styles.endDay,
                      isPast && styles.pastDay
                    ]}
                    onPress={() => !isPast && handleDateSelect(day)}
                    disabled={isPast}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      isPast && styles.pastDayText
                    ]}>
                      {day.getDate()}
                    </Text>
                    <Text style={[
                      styles.dayName,
                      isSelected && styles.selectedDayText,
                      isPast && styles.pastDayText
                    ]}>
                      {day.toLocaleDateString('en-KE', { weekday: 'short' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          
          <View style={styles.calendarFooter}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.confirmButtonText}>Confirm Dates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderTimePicker = () => (
    <Modal visible={showTimePicker} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.timeModal}>
          <View style={styles.timeHeader}>
            <Text style={styles.timeTitle}>Select Pickup Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(false)}>
              <Ionicons name="close" size={24} color={PrimaryText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.timeContainer}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot
                ]}
                onPress={() => {
                  setSelectedTime(time);
                  setShowTimePicker(false);
                }}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Animated Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={PrimaryBrand} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* Listing Header */}
        <View style={styles.listingHeader}>
          <Text style={styles.listingTitle}>{listing.title}</Text>
          <Text style={styles.listingLocation}>{listing.location}</Text>
          <Text style={styles.listingPrice}>KES {listing.price.toLocaleString()}/day</Text>
        </View>

        {/* Owner Contact */}
        <View style={styles.ownerSection}>
          <Text style={styles.sectionTitle}>Contact Owner</Text>
          <View style={styles.ownerCard}>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{listing.owner.name}</Text>
              <View style={styles.ownerRating}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.ratingText}>{listing.owner.rating}</Text>
              </View>
            </View>
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call" size={16} color={WhiteBackground} />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="mail" size={16} color={WhiteBackground} />
                <Text style={styles.contactButtonText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Booking Form */}
        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>Book This Item</Text>
          
          {/* Date Selection */}
          <View style={styles.bookingField}>
            <Text style={styles.fieldLabel}>Select Dates</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowCalendar(true)}
            >
              <Ionicons name="calendar" size={20} color={PrimaryBrand} />
              <Text style={styles.dateButtonText}>
                {selectedDates.start && selectedDates.end 
                  ? `${formatDate(selectedDates.start)} - ${formatDate(selectedDates.end)}`
                  : 'Choose dates'
                }
              </Text>
              <Ionicons name="chevron-down" size={16} color={SecondaryText} />
            </TouchableOpacity>
          </View>

          {/* Time Selection */}
          <View style={styles.bookingField}>
            <Text style={styles.fieldLabel}>Pickup Time</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time" size={20} color={PrimaryBrand} />
              <Text style={styles.dateButtonText}>
                {selectedTime || 'Choose time'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={SecondaryText} />
            </TouchableOpacity>
          </View>

          {/* Quantity */}
          <View style={styles.bookingField}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={16} color={PrimaryBrand} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={16} color={PrimaryBrand} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalAmount}>KES {calculateTotal().toLocaleString()}</Text>
          </View>

          {/* Book Button */}
          <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
            <Ionicons name="checkmark" size={20} color={WhiteBackground} />
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderCalendar()}
      {renderTimePicker()}
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
  listingHeader: {
    backgroundColor: WhiteBackground,
    padding: 20,
    paddingTop: 100,
    marginBottom: 20,
  },
  listingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 8,
  },
  listingLocation: {
    fontSize: 16,
    color: SecondaryText,
    marginBottom: 8,
  },
  listingPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryBrand,
  },
  ownerSection: {
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
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: SecondaryText,
    marginLeft: 4,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactButtonText: {
    color: WhiteBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingSection: {
    backgroundColor: WhiteBackground,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: PrimaryText,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WhiteBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PrimaryBrand,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    minWidth: 30,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PrimaryBrand + '10',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryBrand,
  },
  bookButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: PrimaryBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bookButtonText: {
    color: WhiteBackground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarModal: {
    backgroundColor: WhiteBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  calendarContainer: {
    maxHeight: 400,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2,
  },
  selectedDay: {
    backgroundColor: PrimaryBrand + '20',
  },
  startDay: {
    backgroundColor: PrimaryBrand,
  },
  endDay: {
    backgroundColor: PrimaryBrand,
  },
  pastDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  selectedDayText: {
    color: WhiteBackground,
  },
  pastDayText: {
    color: SecondaryText,
  },
  dayName: {
    fontSize: 10,
    color: SecondaryText,
  },
  calendarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Border,
  },
  confirmButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeModal: {
    backgroundColor: WhiteBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  timeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  timeContainer: {
    padding: 20,
  },
  timeSlot: {
    backgroundColor: Background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: PrimaryBrand,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
  },
  selectedTimeText: {
    color: WhiteBackground,
  },
});

export default BookingCalendarScreen;
