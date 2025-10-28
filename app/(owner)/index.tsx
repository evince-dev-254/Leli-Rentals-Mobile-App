import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Animated,
    Image,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AIChat from '@/components/AIChat';
import CustomAlert from '@/components/CustomAlert';
import NotificationBell from '@/components/NotificationBell';
import QuickActionCard from '@/components/QuickActionCard';
import SuccessAnimation from '@/components/SuccessAnimation';
import ThemeSelector from '@/components/ThemeSelector';
import VerificationBanner from '@/components/VerificationBanner';
import VerificationModal from '@/components/VerificationModal';
import VerificationReminder from '@/components/VerificationReminder';
import {
    Background,
    Border,
    DarkBackground,
    DarkCard,
    DarkSecondaryText,
    DarkText,
    NatureDarkBackground,
    NatureDarkBorder,
    NatureDarkCard,
    NatureDarkText,
    NatureTranslucentWhite,
    PrimaryBrand,
    PrimaryButton,
    PrimaryText,
    SecondaryText,
    VibrantBlue,
    VibrantGreen,
    VibrantOrange,
    VibrantPurple,
    WhiteBackground
} from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OwnerDashboardScreen() {
  const { user } = useUser();
  const { isDark, theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(5);
  const [animatedValues] = useState(() => 
    Array.from({ length: 15 }, () => new Animated.Value(1))
  );

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      // Check if user is verified (mock for demo)
      const verified = await AsyncStorage.getItem('owner_verified');
      setIsVerified(verified === 'true');

      // Check if modal has been shown this session
      const modalShown = await AsyncStorage.getItem('verification_modal_shown');
      
      if (!verified && !modalShown) {
        setShowVerificationModal(true);
        await AsyncStorage.setItem('verification_modal_shown', 'true');
      }

      // Calculate days remaining (mock - in real app, calculate from account creation date)
      const createdAt = await AsyncStorage.getItem('owner_created_at');
      if (createdAt) {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = 5 * 24 * 60 * 60 * 1000 - (now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysRemaining(Math.max(0, diffDays));
      } else {
        // Set creation date if not exists
        await AsyncStorage.setItem('owner_created_at', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleCardPress = (index: number, route: any, action?: string) => {
    if (animatedValues[index]) {
      Animated.sequence([
        Animated.timing(animatedValues[index], {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Handle specific actions
    if (action === 'ai-chat') {
      setShowAIChat(true);
    } else if (action === 'success-demo') {
      setShowSuccessAnimation(true);
    } else if (action === 'custom-alert') {
      setShowCustomAlert(true);
    } else if (route) {
      router.push(route);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const ownerStats = [
    { title: 'Total Listings', value: '12', icon: 'list-outline', color: VibrantBlue, change: '+2 this week' },
    { title: 'Active Bookings', value: '8', icon: 'calendar-outline', color: VibrantGreen, change: '+3 today' },
    { title: 'Total Earnings', value: '$2,450', icon: 'cash-outline', color: VibrantOrange, change: '+$180 this week' },
    { title: 'Rating', value: '4.9', icon: 'star-outline', color: VibrantPurple, change: '+0.2 this month' },
  ];

  const quickActions = [
    { title: 'Create Listing', icon: 'add-circle-outline', route: '/(owner)/create-listing', color: VibrantGreen },
    { title: 'My Listings', icon: 'list-outline', route: '/(owner)/my-listings', color: VibrantBlue },
    { title: 'AI Assistant', icon: 'chatbubbles-outline', action: 'ai-chat', color: VibrantPurple },
    { title: 'Reviews', icon: 'star-outline', route: '/(owner)/reviews', color: VibrantOrange },
    { title: 'Booking Calendar', icon: 'calendar-outline', route: '/(owner)/booking-calendar', color: '#FF6B6B' },
    { title: 'Success Demo', icon: 'checkmark-circle-outline', action: 'success-demo', color: '#4ECDC4' },
    { title: 'Custom Alert', icon: 'alert-circle-outline', action: 'custom-alert', color: '#FF9F43' },
  ];




  const getContainerStyle = () => {
    if (theme === 'nature') return styles.natureContainer;
    if (isDark) return styles.darkContainer;
    return styles.container;
  };

  const getBackgroundColor = () => {
    if (theme === 'nature') return NatureDarkBackground;
    if (isDark) return DarkBackground;
    return Background;
  };

  return (
    <SafeAreaView style={[styles.container, getContainerStyle()]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={getBackgroundColor()}
        translucent={false}
      />
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <View style={styles.headerLeft}>
          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: user?.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' }}
              style={styles.profileImage}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.greeting, isDark && styles.darkText]}>
              Hi, {user?.firstName || 'Owner'}
            </Text>
            <Text style={[styles.subGreeting, isDark && styles.darkSecondaryText]}>
              Welcome Back
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[
              styles.themeButton,
              theme === 'nature' && { backgroundColor: NatureTranslucentWhite, borderColor: NatureDarkBorder }
            ]}
            onPress={() => setShowThemeSelector(true)}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={theme === 'nature' ? 'leaf' : theme === 'dark' ? 'moon' : 'sunny'} 
              size={20} 
              color={theme === 'nature' ? NatureDarkText : isDark ? DarkText : PrimaryText} 
            />
          </TouchableOpacity>
          <NotificationBell onPress={() => router.push('/(owner)/notifications')} />
        </View>
      </View>

      {/* Main Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.mainTitle, isDark && styles.darkText]}>
          Rental Business Dashboard
        </Text>
      </View>

      {/* Verification Banner */}
      {!isVerified && <VerificationBanner daysRemaining={daysRemaining} />}

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PrimaryBrand}
            colors={[PrimaryBrand]}
          />
        }
      >
        {/* Business Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Business Overview</Text>
            <TouchableOpacity onPress={() => router.push('/(owner)/my-listings')}>
              <Text style={[styles.viewAllText, { color: PrimaryBrand }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {ownerStats.map((stat, index) => (
              <Animated.View
                key={stat.title}
                style={[
                  theme === 'nature' ? styles.natureGridBox : styles.gridBox,
                  isDark && styles.darkCard,
                  { transform: [{ scale: animatedValues[index] || 1 }] }
                ]}
              >
                <View style={styles.gridBoxHeader}>
                  <View style={[styles.gridBoxIcon, { backgroundColor: stat.color }]}>
                    <Ionicons name={stat.icon as any} size={24} color="#ffffff" />
                  </View>
                  <Text style={[styles.gridBoxChange, { color: VibrantGreen }]}>{stat.change}</Text>
                </View>
                <Text style={[styles.gridBoxValue, isDark && styles.darkText, theme === 'nature' && { color: NatureDarkText }]}>{stat.value}</Text>
                <Text style={[styles.gridBoxTitle, isDark && styles.darkSecondaryText, theme === 'nature' && { color: NatureDarkText }]}>{stat.title}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Quick Actions</Text>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
            style={styles.quickActionsScrollView}
          >
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.title}
                style={{ transform: [{ scale: animatedValues[index + 4] || 1 }] }}
              >
                <QuickActionCard
                  title={action.title}
                  icon={action.icon}
                  color={action.color}
                  onPress={() => handleCardPress(index + 4, action.route, action.action)}
                  isDark={isDark}
                  theme={theme}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Performance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Performance</Text>
          <View style={styles.gridContainer}>
            <View style={[theme === 'nature' ? styles.natureGridBox : styles.gridBox, styles.fullWidthBox, isDark && styles.darkCard]}>
              <View style={styles.gridBoxHeader}>
                <View style={[styles.gridBoxIcon, { backgroundColor: VibrantGreen }]}>
                  <Ionicons name="trending-up" size={24} color="#ffffff" />
                </View>
                <Text style={[styles.gridBoxValue, isDark && styles.darkText, theme === 'nature' && { color: NatureDarkText }]}>$1,250</Text>
              </View>
              <Text style={[styles.gridBoxTitle, isDark && styles.darkText, theme === 'nature' && { color: NatureDarkText }]}>Earnings This Month</Text>
              <Text style={[styles.gridBoxSubtitle, isDark && styles.darkSecondaryText, theme === 'nature' && { color: NatureDarkText }]}>+15% from last month</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, isDark && styles.darkBottomNav]}>
        <TouchableOpacity 
          style={[styles.navItem, styles.activeNavItem]}
          onPress={() => router.push('/(owner)')}
        >
          <Ionicons name="home" size={24} color={PrimaryButton} />
          <Text style={[styles.navLabel, { color: PrimaryButton }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(owner)/explore')}
        >
          <Ionicons name="grid-outline" size={24} color={isDark ? DarkSecondaryText : SecondaryText} />
          <Text style={[styles.navLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(renter)/browse')}
        >
          <Ionicons name="search-outline" size={24} color={isDark ? DarkSecondaryText : SecondaryText} />
          <Text style={[styles.navLabel, { color: isDark ? DarkSecondaryText : SecondaryText }]}>Browse</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <View style={styles.modalOverlay}>
          <ThemeSelector onClose={() => setShowThemeSelector(false)} />
        </View>
      )}

      {/* AI Chat Modal */}
      <Modal
        visible={showAIChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIChat onClose={() => setShowAIChat(false)} />
      </Modal>

      {/* Success Animation */}
      {showSuccessAnimation && (
        <SuccessAnimation 
          onComplete={() => setShowSuccessAnimation(false)}
          message="Welcome to your dashboard!"
        />
      )}

      {/* Custom Alert Demo */}
      <CustomAlert
        visible={showCustomAlert}
        title="Custom Alert Demo"
        message="This is a demonstration of the custom alert component with different styling and animations!"
        type="success"
        onClose={() => setShowCustomAlert(false)}
        onConfirm={() => setShowCustomAlert(false)}
        showCancel={true}
        confirmText="Got it!"
        cancelText="Close"
      />

      {/* Verification Reminder */}
      <VerificationReminder />

      {/* Verification Modal */}
      <VerificationModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        daysRemaining={daysRemaining}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  darkContainer: {
    backgroundColor: DarkBackground,
  },
  natureContainer: {
    backgroundColor: NatureDarkBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  darkHeader: {
    backgroundColor: 'transparent',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Border,
  },
  darkSearchBar: {
    backgroundColor: WhiteBackground,
    borderColor: Border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: SecondaryText,
  },
  filterButton: {
    padding: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: WhiteBackground,
    borderWidth: 1,
    borderColor: Border,
  },
  darkCategoryButton: {
    backgroundColor: WhiteBackground,
    borderColor: Border,
  },
  activeCategory: {
    backgroundColor: PrimaryButton,
    borderColor: PrimaryButton,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: SecondaryText,
  },
  activeCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: VibrantGreen,
    borderWidth: 2,
    borderColor: WhiteBackground,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  darkText: {
    color: DarkText,
  },
  subGreeting: {
    fontSize: 14,
    color: SecondaryText,
    marginTop: 2,
  },
  darkSecondaryText: {
    color: DarkSecondaryText,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridBox: {
    width: '48%',
    backgroundColor: WhiteBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Border,
    minHeight: 151.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  natureGridBox: {
    width: '48%',
    backgroundColor: NatureDarkCard,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: NatureDarkBorder,
    minHeight: 151.5,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  fullWidthBox: {
    width: '100%',
  },
  darkCard: {
    backgroundColor: DarkCard,
  },
  gridBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridBoxIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  gridBoxChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridBoxValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 4,
  },
  gridBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 4,
    textAlign: 'center',
  },
  gridBoxSubtitle: {
    fontSize: 12,
    color: SecondaryText,
    marginBottom: 2,
  },
  gridBoxTime: {
    fontSize: 10,
    color: SecondaryText,
  },
  gridBoxAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: VibrantGreen,
    marginTop: 4,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: WhiteBackground,
    borderTopWidth: 1,
    borderTopColor: Border,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 16,
    paddingHorizontal: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  darkBottomNav: {
    backgroundColor: WhiteBackground,
    borderTopColor: Border,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeNavItem: {
    backgroundColor: PrimaryButton + '15',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    zIndex: 1000,
  },
  quickActionsContainer: {
    paddingBottom: 20,
  },
  quickActionsScrollView: {
    maxHeight: 300,
  },
});