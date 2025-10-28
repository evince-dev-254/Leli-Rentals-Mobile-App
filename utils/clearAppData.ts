import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility to clear all app data and start fresh
 * This will clear all stored data including:
 * - Onboarding completion status
 * - Account type selection
 * - Navigation state
 * - User preferences
 * - Any other cached data
 */
export const clearAllAppData = async (): Promise<void> => {
  try {
    console.log('🧹 Clearing all app data...');
    
    // List of all keys we want to clear
    const keysToRemove = [
      'onboarding_completed',
      'accountType',
      'verificationStatus',
      'isOwnerVerified',
      'ownerProfile',
      'app_navigation_completed',
      // Add any other keys you want to clear
    ];

    // Remove all specified keys
    await AsyncStorage.multiRemove(keysToRemove);
    
    // Also clear all keys (more aggressive approach)
    const allKeys = await AsyncStorage.getAllKeys();
    if (allKeys.length > 0) {
      await AsyncStorage.multiRemove(allKeys);
    }
    
    console.log('✅ All app data cleared successfully');
    
    // Reset global navigation lock if it exists
    if (typeof global !== 'undefined' && (global as any).globalNavigationLock !== undefined) {
      (global as any).globalNavigationLock = false;
    }
    
  } catch (error) {
    console.error('❌ Error clearing app data:', error);
    throw error;
  }
};

/**
 * Clear only authentication-related data
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    console.log('🔐 Clearing authentication data...');
    
    const authKeys = [
      'accountType',
      'verificationStatus',
      'isOwnerVerified',
      'ownerProfile',
      'app_navigation_completed',
    ];

    await AsyncStorage.multiRemove(authKeys);
    console.log('✅ Authentication data cleared successfully');
    
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Clear only onboarding data
 */
export const clearOnboardingData = async (): Promise<void> => {
  try {
    console.log('📱 Clearing onboarding data...');
    
    await AsyncStorage.removeItem('onboarding_completed');
    console.log('✅ Onboarding data cleared successfully');
    
  } catch (error) {
    console.error('❌ Error clearing onboarding data:', error);
    throw error;
  }
};
