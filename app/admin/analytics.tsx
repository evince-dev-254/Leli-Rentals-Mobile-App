import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
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

const AdminAnalyticsScreen = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin access on component mount
  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    // Simulate admin check - in real app, this would verify JWT token or user role
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll show a mock admin check
    // In production, this would check user permissions from your backend
    const mockUserRole = 'admin'; // This would come from your auth system
    
    if (mockUserRole !== 'admin') {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this page. Admin privileges required.',
        [
          {
            text: 'Go Back',
            onPress: () => router.back(),
          },
        ]
      );
      return;
    }
    
    setIsAdmin(true);
    setIsLoading(false);
  };

  // Show loading screen while checking admin access
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Ionicons name="shield-checkmark" size={48} color={PrimaryBrand} />
          <Text style={styles.loadingTitle}>Verifying Access</Text>
          <Text style={styles.loadingSubtitle}>Checking admin privileges...</Text>
        </View>
      </View>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <View style={styles.accessDeniedContainer}>
        <View style={styles.accessDeniedContent}>
          <Ionicons name="lock-closed" size={64} color={Error} />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedSubtitle}>
            You do not have permission to access this page.
          </Text>
          <TouchableOpacity 
            style={styles.goBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'grid-outline' },
    { id: 'categories', label: 'Categories', icon: 'list-outline' },
    { id: 'users', label: 'Users', icon: 'people-outline' },
    { id: 'revenue', label: 'Revenue', icon: 'trending-up-outline' },
    { id: 'listings', label: 'Listings', icon: 'home-outline' },
  ];

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+12.5%',
      trend: 'up',
      color: Success,
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      color: PrimaryBrand,
    },
    {
      title: 'Bookings',
      value: '1,234',
      change: '+15.3%',
      trend: 'up',
      color: '#3b82f6',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-2.1%',
      trend: 'down',
      color: Warning,
    },
  ];

  const additionalMetrics = [
    { label: 'Active Users', value: '1,234' },
    { label: 'Conversion Rate', value: '3.2%' },
    { label: 'Avg Booking Value', value: '$89' },
  ];

  const topUsers = [
    { name: 'Sarah Johnson', bookings: 45, revenue: '$2,340' },
    { name: 'Mike Chen', bookings: 38, revenue: '$1,890' },
    { name: 'Emily Rodriguez', bookings: 32, revenue: '$1,650' },
    { name: 'David Kim', bookings: 28, revenue: '$1,420' },
  ];

  const categoryStats = [
    { name: 'Electronics', items: 1250, bookings: 456, revenue: '$12,340' },
    { name: 'Tools', items: 890, bookings: 234, revenue: '$8,920' },
    { name: 'Furniture', items: 650, bookings: 189, revenue: '$6,750' },
    { name: 'Vehicles', items: 320, bookings: 98, revenue: '$4,200' },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.metricsGrid}>
        {keyMetrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <Text style={styles.metricTitle}>{metric.title}</Text>
            <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
            <View style={styles.metricChange}>
              <Ionicons 
                name={metric.trend === 'up' ? 'trending-up' : 'trending-down'} 
                size={16} 
                color={metric.trend === 'up' ? Success : Error} 
              />
              <Text style={[
                styles.changeText,
                { color: metric.trend === 'up' ? Success : Error }
              ]}>
                {metric.change}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.additionalMetrics}>
        <Text style={styles.sectionTitle}>Additional Metrics</Text>
        <View style={styles.additionalMetricsGrid}>
          {additionalMetrics.map((metric, index) => (
            <View key={index} style={styles.additionalMetricCard}>
              <Text style={styles.additionalMetricValue}>{metric.value}</Text>
              <Text style={styles.additionalMetricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.topUsers}>
        <Text style={styles.sectionTitle}>Top Users</Text>
        {topUsers.map((user, index) => (
          <View key={index} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitial}>{user.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userStats}>{user.bookings} bookings</Text>
              </View>
            </View>
            <Text style={styles.userRevenue}>{user.revenue}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Category Performance</Text>
      {categoryStats.map((category, index) => (
        <View key={index} style={styles.categoryCard}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <View style={styles.categoryStats}>
            <View style={styles.categoryStat}>
              <Text style={styles.categoryStatValue}>{category.items}</Text>
              <Text style={styles.categoryStatLabel}>Items</Text>
            </View>
            <View style={styles.categoryStat}>
              <Text style={styles.categoryStatValue}>{category.bookings}</Text>
              <Text style={styles.categoryStatLabel}>Bookings</Text>
            </View>
            <View style={styles.categoryStat}>
              <Text style={styles.categoryStatValue}>{category.revenue}</Text>
              <Text style={styles.categoryStatLabel}>Revenue</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'categories':
        return renderCategories();
      default:
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - Coming Soon</Text>
          </View>
        );
    }
  };

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
          <Text style={styles.title}>Analytics Dashboard</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color={PrimaryBrand} />
          </TouchableOpacity>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.metricsGrid}>
            {keyMetrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
                <View style={styles.metricChange}>
                  <Ionicons 
                    name={metric.trend === 'up' ? 'trending-up' : 'trending-down'} 
                    size={16} 
                    color={metric.trend === 'up' ? Success : Error} 
                  />
                  <Text style={[
                    styles.changeText,
                    { color: metric.trend === 'up' ? Success : Error }
                  ]}>
                    {metric.change}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  activeTab === tab.id && styles.activeTab
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={20} 
                  color={activeTab === tab.id ? WhiteBackground : SecondaryText} 
                />
                <Text style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WhiteBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  metricTitle: {
    fontSize: 14,
    color: SecondaryText,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  additionalMetrics: {
    marginTop: 20,
  },
  additionalMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  additionalMetricCard: {
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Border,
  },
  additionalMetricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryBrand,
    marginBottom: 4,
  },
  additionalMetricLabel: {
    fontSize: 12,
    color: SecondaryText,
    textAlign: 'center',
  },
  topUsers: {
    marginTop: 20,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PrimaryBrand,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 2,
  },
  userStats: {
    fontSize: 12,
    color: SecondaryText,
  },
  userRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Success,
  },
  tabsContainer: {
    backgroundColor: WhiteBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Background,
  },
  activeTab: {
    backgroundColor: PrimaryBrand,
  },
  tabText: {
    fontSize: 14,
    color: SecondaryText,
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: WhiteBackground,
  },
  tabContent: {
    padding: 20,
  },
  categoryCard: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Border,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 12,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryStat: {
    alignItems: 'center',
  },
  categoryStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryBrand,
    marginBottom: 4,
  },
  categoryStatLabel: {
    fontSize: 12,
    color: SecondaryText,
  },
  comingSoon: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
    padding: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
  },
  accessDeniedContainer: {
    flex: 1,
    backgroundColor: Background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessDeniedContent: {
    alignItems: 'center',
    padding: 40,
  },
  accessDeniedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryText,
    marginTop: 16,
    marginBottom: 12,
  },
  accessDeniedSubtitle: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  goBackButton: {
    backgroundColor: PrimaryBrand,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  goBackButtonText: {
    color: WhiteBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminAnalyticsScreen;
