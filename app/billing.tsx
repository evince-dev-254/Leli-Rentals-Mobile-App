import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
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

const BillingScreen = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const paymentMethods = [
    {
      id: 1,
      type: 'mpesa',
      name: 'M-Pesa',
      phone: '+254 712 345 678',
      isDefault: true,
      icon: 'phone-portrait',
      color: '#00A86B',
    },
    {
      id: 2,
      type: 'airtel',
      name: 'Airtel Money',
      phone: '+254 712 345 678',
      isDefault: false,
      icon: 'phone-portrait',
      color: '#E60000',
    },
    {
      id: 3,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: false,
      icon: 'card',
      color: '#1A1F71',
    },
    {
      id: 4,
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiry: '08/26',
      isDefault: false,
      icon: 'card',
      color: '#EB001B',
    },
  ];

  const transactions = [
    {
      id: 1,
      type: 'rental',
      amount: -25.00,
      description: 'Camera Kit Rental',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'earning',
      amount: 45.00,
      description: 'Tool Set Rental',
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: 3,
      type: 'rental',
      amount: -15.00,
      description: 'Drill Set Rental',
      date: '2024-01-13',
      status: 'pending',
    },
    {
      id: 4,
      type: 'earning',
      amount: 30.00,
      description: 'Furniture Rental',
      date: '2024-01-12',
      status: 'completed',
    },
  ];

  const upcomingPayments = [
    {
      id: 1,
      description: 'Camera Kit Rental',
      amount: 25.00,
      dueDate: '2024-01-20',
      status: 'upcoming',
    },
    {
      id: 2,
      description: 'Tool Set Rental',
      amount: 15.00,
      dueDate: '2024-01-22',
      status: 'upcoming',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'grid-outline' },
    { id: 'transactions', label: 'Transactions', icon: 'list-outline' },
    { id: 'payments', label: 'Payments', icon: 'card-outline' },
    { id: 'earnings', label: 'Earnings', icon: 'cash-outline' },
  ];

  const renderPaymentMethod = (method) => (
    <View key={method.id} style={styles.paymentMethodCard}>
      <View style={styles.paymentMethodInfo}>
        <View style={[styles.paymentMethodIcon, { backgroundColor: method.color + '20' }]}>
          <Ionicons 
            name={method.icon} 
            size={24} 
            color={method.color} 
          />
        </View>
        <View style={styles.paymentMethodDetails}>
          {method.type === 'card' ? (
            <>
              <Text style={styles.paymentMethodName}>{method.brand} •••• {method.last4}</Text>
              <Text style={styles.paymentMethodExpiry}>Expires {method.expiry}</Text>
            </>
          ) : method.type === 'mpesa' ? (
            <>
              <Text style={styles.paymentMethodName}>M-Pesa</Text>
              <Text style={styles.paymentMethodExpiry}>{method.phone}</Text>
            </>
          ) : method.type === 'airtel' ? (
            <>
              <Text style={styles.paymentMethodName}>Airtel Money</Text>
              <Text style={styles.paymentMethodExpiry}>{method.phone}</Text>
            </>
          ) : (
            <>
              <Text style={styles.paymentMethodName}>PayPal</Text>
              <Text style={styles.paymentMethodExpiry}>{method.email}</Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.paymentMethodActions}>
        {method.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color={SecondaryText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTransaction = (transaction) => (
    <View key={transaction.id} style={styles.transactionCard}>
      <View style={styles.transactionInfo}>
        <View style={[styles.transactionIcon, { backgroundColor: transaction.type === 'rental' ? Error + '20' : Success + '20' }]}>
          <Ionicons 
            name={transaction.type === 'rental' ? 'arrow-down' : 'arrow-up'} 
            size={16} 
            color={transaction.type === 'rental' ? Error : Success} 
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[styles.amountText, { color: transaction.amount > 0 ? Success : Error }]}>
          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: transaction.status === 'completed' ? Success + '20' : Warning + '20' }]}>
          <Text style={[styles.statusText, { color: transaction.status === 'completed' ? Success : Warning }]}>
            {transaction.status}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Balance Cards */}
      <View style={styles.balanceCards}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>$125.50</Text>
          <Text style={styles.balanceSubtext}>Available to withdraw</Text>
        </View>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>This Month</Text>
          <Text style={styles.balanceAmount}>$245.00</Text>
          <Text style={styles.balanceSubtext}>Total earnings</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="add" size={24} color={WhiteBackground} />
          <Text style={styles.quickActionText}>Add Payment Method</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="download" size={24} color={WhiteBackground} />
          <Text style={styles.quickActionText}>Withdraw Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.slice(0, 3).map(renderTransaction)}
      </View>
    </View>
  );

  const renderTransactions = () => (
    <View style={styles.transactionsContainer}>
      {transactions.map(renderTransaction)}
    </View>
  );

  const renderPayments = () => (
    <View style={styles.paymentsContainer}>
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      {paymentMethods.map(renderPaymentMethod)}
      
      <TouchableOpacity style={styles.addPaymentButton}>
        <Ionicons name="add" size={20} color={PrimaryBrand} />
        <Text style={styles.addPaymentText}>Add New Payment Method</Text>
      </TouchableOpacity>

      <View style={styles.upcomingSection}>
        <Text style={styles.sectionTitle}>Upcoming Payments</Text>
        {upcomingPayments.map((payment) => (
          <View key={payment.id} style={styles.upcomingCard}>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingDescription}>{payment.description}</Text>
              <Text style={styles.upcomingDate}>Due {payment.dueDate}</Text>
            </View>
            <Text style={styles.upcomingAmount}>${payment.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEarnings = () => (
    <View style={styles.earningsContainer}>
      <View style={styles.earningsStats}>
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>$1,250.00</Text>
        </View>
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>This Month</Text>
          <Text style={styles.earningsAmount}>$245.00</Text>
        </View>
      </View>

      <View style={styles.earningsChart}>
        <Text style={styles.sectionTitle}>Earnings Overview</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart" size={48} color={SecondaryText} />
          <Text style={styles.chartText}>Earnings chart would be displayed here</Text>
        </View>
      </View>
    </View>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Billing & Payments</Text>
          <Text style={styles.subtitle}>Manage your payments and earnings</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Ionicons 
                name={tab.icon} 
                size={16} 
                color={selectedTab === tab.id ? WhiteBackground : SecondaryText} 
              />
              <Text style={[styles.tabText, selectedTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'transactions' && renderTransactions()}
          {selectedTab === 'payments' && renderPayments()}
          {selectedTab === 'earnings' && renderEarnings()}
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
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: PrimaryBrand,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: SecondaryText,
  },
  activeTabText: {
    color: WhiteBackground,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  overviewContainer: {
    gap: 20,
  },
  balanceCards: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: SecondaryText,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: SecondaryText,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    color: WhiteBackground,
    fontWeight: 'bold',
  },
  recentSection: {
    backgroundColor: WhiteBackground,
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
  transactionsContainer: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: SecondaryText,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  paymentsContainer: {
    gap: 20,
  },
  paymentMethodCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 2,
  },
  paymentMethodExpiry: {
    fontSize: 12,
    color: SecondaryText,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    backgroundColor: Success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Success,
  },
  editButton: {
    padding: 4,
  },
  addPaymentButton: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: PrimaryBrand,
    borderStyle: 'dashed',
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryBrand,
  },
  upcomingSection: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 2,
  },
  upcomingDate: {
    fontSize: 12,
    color: SecondaryText,
  },
  upcomingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  earningsContainer: {
    gap: 20,
  },
  earningsStats: {
    flexDirection: 'row',
    gap: 12,
  },
  earningsCard: {
    flex: 1,
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  earningsLabel: {
    fontSize: 14,
    color: SecondaryText,
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  earningsChart: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartText: {
    fontSize: 14,
    color: SecondaryText,
    marginTop: 12,
  },
});

export default BillingScreen;
