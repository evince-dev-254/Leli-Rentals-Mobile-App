import AIChat from '@/components/AIChat';
import NotificationBell from '@/components/NotificationBell';
import ThemeAwareLogo from '@/components/ThemeAwareLogo';
import {
  Background,
  Border,
  DarkBackground,
  DarkBorder,
  DarkCard,
  DarkSecondaryText,
  DarkText,
  PrimaryBrand,
  PrimaryText,
  SecondaryText,
  VibrantBlue,
  VibrantCyan,
  VibrantGreen,
  VibrantOrange,
  VibrantPink,
  VibrantPurple,
  WhiteBackground
} from '@/constants/Colors';
import { useAccount } from '@/contexts/AccountContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const OwnerExploreScreen = () => {
  const { isDark } = useTheme();
  const { accountType } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [showAIChat, setShowAIChat] = useState(false);


  const sortOptions = [
    { id: 'revenue', name: 'Revenue', icon: 'trending-up' },
    { id: 'bookings', name: 'Bookings', icon: 'calendar' },
    { id: 'rating', name: 'Rating', icon: 'star' },
    { id: 'price_high', name: 'Price: High to Low', icon: 'arrow-down' },
    { id: 'price_low', name: 'Price: Low to High', icon: 'arrow-up' },
    { id: 'newest', name: 'Recently Added', icon: 'time' },
  ];


  const businessStats = [
    { title: 'Total Revenue', value: 'KSh 729,700', change: '+23%', color: VibrantGreen },
    { title: 'Active Listings', value: '12', change: '+2', color: VibrantBlue },
    { title: 'Total Bookings', value: '224', change: '+18%', color: VibrantPurple },
    { title: 'Avg. Rating', value: '4.8', change: '+0.2', color: VibrantOrange },
  ];

  const quickActions = [
    { title: 'Add New Item', icon: 'add-circle', color: VibrantGreen, route: '/add-listing' },
    { title: 'Analytics', icon: 'analytics', color: VibrantPurple, route: '/admin/analytics' },
    { title: 'AI Assistant', icon: 'chatbubbles', color: VibrantCyan, action: 'ai-chat' },
    { title: 'Bookings', icon: 'calendar', color: VibrantBlue, route: '/my-bookings' },
    { title: 'Reviews', icon: 'star', color: VibrantOrange, route: '/reviews' },
    { title: 'Explore Items', icon: 'compass', color: VibrantPink, route: '/(tabs)/renter-explore' },
  ];



  const renderSortOption = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        { 
          backgroundColor: sortBy === item.id 
            ? PrimaryBrand 
            : (isDark ? DarkCard : WhiteBackground),
          borderColor: isDark ? DarkBorder : Border
        }
      ]}
      onPress={() => setSortBy(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={sortBy === item.id ? 'white' : (isDark ? DarkText : PrimaryText)} 
      />
      <Text style={[
        styles.sortOptionText,
        { 
          color: sortBy === item.id 
            ? 'white' 
            : (isDark ? DarkText : PrimaryText)
        }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );


  const renderQuickAction = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.quickActionCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}
      onPress={() => {
        if (item.action === 'ai-chat') {
          setShowAIChat(true);
        } else {
          router.push(item.route);
        }
      }}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={20} color="white" />
      </View>
      <Text style={[styles.quickActionText, { color: isDark ? DarkText : PrimaryText }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderStatCard = ({ item }: { item: any }) => (
    <View style={[styles.statCard, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
      <View style={styles.statHeader}>
        <Text style={[styles.statTitle, { color: isDark ? DarkText : PrimaryText }]}>{item.title}</Text>
        <View style={[styles.changeIndicator, { backgroundColor: item.color + '20' }]}>
          <Text style={[styles.changeText, { color: item.color }]}>{item.change}</Text>
        </View>
      </View>
      <Text style={[styles.statValue, { color: isDark ? DarkText : PrimaryText }]}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.scrollView, { backgroundColor: isDark ? DarkBackground : '#f8fafc' }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? DarkCard : WhiteBackground }]}>
        <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
            <ThemeAwareLogo size={100} variant="default" showText={false} />
            <View style={styles.headerText}>
              <Text style={[styles.welcomeText, { color: isDark ? DarkText : PrimaryText }]}>
                My Business
              </Text>
              <Text style={[styles.subtitleText, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
                Manage your listings
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <NotificationBell />
          </View>
        </View>
      </View>

      {/* Business Stats */}
      <View style={styles.statsSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Business Overview
        </Text>
        <FlatList
          data={businessStats}
          renderItem={renderStatCard}
          keyExtractor={(item) => item.title}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.statsList}
          scrollEnabled={false}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
          <Ionicons name="search" size={20} color={isDark ? DarkSecondaryText : SecondaryText} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? DarkText : PrimaryText }]}
            placeholder="Search your listings..."
            placeholderTextColor={isDark ? DarkSecondaryText : SecondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={[styles.searchFilterButton, { backgroundColor: isDark ? DarkBackground : '#f1f5f9' }]}>
            <Ionicons name="funnel" size={16} color={isDark ? DarkText : PrimaryText} />
          </TouchableOpacity>
        </View>
      </View>


      {/* Sort Options */}
      <View style={styles.sortSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Sort By
        </Text>
        <FlatList
          data={sortOptions}
          renderItem={renderSortOption}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortList}
        />
      </View>


      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Business Tools
        </Text>
        <FlatList
          data={quickActions}
          renderItem={renderQuickAction}
          keyExtractor={(item) => item.title}
          numColumns={2}
        showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsList}
          scrollEnabled={false}
        />
      </View>

      {/* Account Management Section */}
      <View style={[styles.accountSection, { backgroundColor: isDark ? DarkCard : WhiteBackground, borderColor: isDark ? DarkBorder : Border }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? DarkText : PrimaryText }]}>
          Account Management
        </Text>
        <Text style={[styles.sectionSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
          Access your profile and explore items from here
        </Text>
        <View style={styles.accountManagementGrid}>
          <TouchableOpacity
            style={[styles.accountManagementCard, { backgroundColor: isDark ? DarkBackground : Background, borderColor: isDark ? DarkBorder : Border }]}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={24} color={VibrantPink} />
            <Text style={[styles.accountManagementTitle, { color: isDark ? DarkText : PrimaryText }]}>
              Profile
            </Text>
            <Text style={[styles.accountManagementSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              Manage your account
            </Text>
          </TouchableOpacity>
                    <TouchableOpacity
            style={[styles.accountManagementCard, { backgroundColor: isDark ? DarkBackground : Background, borderColor: isDark ? DarkBorder : Border }]}
            onPress={() => router.push('/(renter)/explore')}
          >
            <Ionicons name="compass" size={24} color={VibrantCyan} />
            <Text style={[styles.accountManagementTitle, { color: isDark ? DarkText : PrimaryText }]}>
              Explore
                      </Text>
            <Text style={[styles.accountManagementSubtitle, { color: isDark ? DarkSecondaryText : SecondaryText }]}>
              Browse all items
                      </Text>
                    </TouchableOpacity>
            </View>
          </View>
      </ScrollView>

      {/* AI Chat Modal */}
      <Modal
        visible={showAIChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIChat onClose={() => setShowAIChat(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 14,
    opacity: 0.8,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsList: {
    gap: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  changeIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  searchFilterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sortSection: {
    marginBottom: 20,
  },
  sortList: {
    paddingHorizontal: 20,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  sortOptionText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  quickActionsList: {
    paddingHorizontal: 20,
  },
  quickActionCard: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  accountSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  accountManagementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountManagementCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountManagementTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  accountManagementSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default OwnerExploreScreen;