import ThemeAwareLogo from '@/components/ThemeAwareLogo';
import {
    Background,
    Border,
    DarkBackground,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    PrimaryBrand,
    PrimaryText,
    SecondaryText,
    VibrantGreen,
    VibrantOrange,
    WhiteBackground
} from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useTheme } from '@/contexts/ThemeContext';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertUtils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PaymentCompletionScreen() {
  const { isDark } = useTheme();
  const { accountType } = useAccount();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock booking data - in real app this would come from navigation params
  const bookingData = {
    itemTitle: 'Professional Camera Kit',
    itemImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    dailyRate: 2500,
    totalDays: 3,
    totalAmount: 7500,
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    ownerName: 'John Doe',
    ownerPhone: '+254 700 123 456'
  };

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: 'phone-portrait', color: VibrantGreen },
    { id: 'airtel', name: 'Airtel Money', icon: 'phone-portrait', color: VibrantOrange },
    { id: 'card', name: 'Card Payment', icon: 'card', color: PrimaryBrand },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      showSuccessAlert(
        'Payment Successful!',
        'Your booking has been confirmed. You will receive a confirmation SMS shortly.',
        () => router.push('/(tabs)')
      );
    } catch (error) {
      showErrorAlert('Payment Failed', 'Please try again or use a different payment method.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethod = (method: any) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        {
          backgroundColor: selectedPaymentMethod === method.id 
            ? PrimaryBrand 
            : isDark ? DarkCard : WhiteBackground,
          borderColor: selectedPaymentMethod === method.id 
            ? PrimaryBrand 
            : isDark ? DarkBorder : Border,
        }
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View style={styles.paymentMethodContent}>
        <View style={[styles.paymentMethodIcon, { backgroundColor: method.color }]}>
          <Ionicons name={method.icon as any} size={24} color={WhiteBackground} />
        </View>
        <Text style={[
          styles.paymentMethodText,
          {
            color: selectedPaymentMethod === method.id 
              ? WhiteBackground 
              : isDark ? DarkText : PrimaryText
          }
        ]}>
          {method.name}
        </Text>
        {selectedPaymentMethod === method.id && (
          <Ionicons name="checkmark-circle" size={24} color={WhiteBackground} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? DarkBackground : Background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ThemeAwareLogo size={100} variant="default" showText={false} />
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isDark ? DarkText : PrimaryText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: isDark ? DarkText : PrimaryText }]}>
          Complete Payment
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Secure your booking with payment
        </Text>
      </View>

      {/* Booking Summary */}
      <View style={[styles.summaryCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <Text style={[styles.summaryTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Booking Summary
        </Text>
        
        <View style={styles.itemContainer}>
          <Image source={{ uri: bookingData.itemImage }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={[styles.itemTitle, { color: isDark ? DarkText : PrimaryText }]}>
              {bookingData.itemTitle}
            </Text>
            <Text style={[styles.itemOwner, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              Owner: {bookingData.ownerName}
            </Text>
            <Text style={[styles.itemPeriod, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              {bookingData.startDate} - {bookingData.endDate} ({bookingData.totalDays} days)
            </Text>
          </View>
        </View>

        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              Daily Rate
            </Text>
            <Text style={[styles.priceValue, { color: isDark ? DarkText : PrimaryText }]}>
              KSh {bookingData.dailyRate.toLocaleString()}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              Duration
            </Text>
            <Text style={[styles.priceValue, { color: isDark ? DarkText : PrimaryText }]}>
              {bookingData.totalDays} days
            </Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: isDark ? DarkText : PrimaryText }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: PrimaryBrand }]}>
              KSh {bookingData.totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Select Payment Method
        </Text>
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map(renderPaymentMethod)}
        </View>
      </View>

      {/* Payment Button */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity
          style={[
            styles.paymentButton,
            { backgroundColor: isProcessing ? VibrantOrange : PrimaryBrand }
          ]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={styles.paymentButtonText}>
            {isProcessing ? 'Processing Payment...' : `Pay KSh ${bookingData.totalAmount.toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Security Notice */}
      <View style={[styles.securityNotice, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <Ionicons name="shield-checkmark" size={20} color={VibrantGreen} />
        <Text style={[styles.securityText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Your payment is secure and encrypted. We use industry-standard security measures.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemOwner: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemPeriod: {
    fontSize: 14,
  },
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: Border,
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Border,
    paddingTop: 12,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  paymentMethodsContainer: {
    gap: 12,
  },
  paymentMethodCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  paymentButtonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  paymentButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Border,
  },
  securityText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
  },
});
