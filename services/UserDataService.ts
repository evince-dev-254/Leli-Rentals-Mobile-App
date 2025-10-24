import { Platform } from 'react-native';

// Simplified storage - use in-memory storage for mobile
const getStorage = () => {
  // Use in-memory storage for mobile to avoid AsyncStorage issues
  const memoryStorage: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => Promise.resolve(memoryStorage[key] || null),
    setItem: (key: string, value: string) => {
      memoryStorage[key] = value;
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      delete memoryStorage[key];
      return Promise.resolve();
    },
    multiRemove: (keys: string[]) => {
      keys.forEach(key => delete memoryStorage[key]);
      return Promise.resolve();
    }
  };
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  location?: string;
  bio?: string;
  profileImageUrl?: string;
  accountType: 'renter' | 'owner';
  joinDate: string;
  rating?: number;
  totalRentals?: number;
  totalEarnings?: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
  };
}

export class UserDataService {
  private static readonly USER_DATA_KEY = 'userProfile';
  private static readonly USERS_COLLECTION_KEY = 'users';

  /**
   * Save user profile data
   */
  static async saveUserProfile(userData: UserProfile): Promise<void> {
    try {
      const storage = getStorage();
      await storage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
      
      // Also save to a users collection for future reference
      const usersCollection = await this.getUsersCollection();
      usersCollection[userData.uid] = userData;
      await storage.setItem(this.USERS_COLLECTION_KEY, JSON.stringify(usersCollection));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  /**
   * Get current user profile data
   */
  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const storage = getStorage();
      const userData = await storage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update specific user profile fields
   */
  static async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      const currentProfile = await this.getUserProfile();
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...updates };
        await this.saveUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Create initial user profile after signup/signin
   */
  static async createInitialProfile(
    uid: string,
    email: string,
    displayName: string,
    accountType: 'renter' | 'owner'
  ): Promise<UserProfile> {
    const initialProfile: UserProfile = {
      uid,
      email,
      displayName,
      accountType,
      joinDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      rating: 0,
      totalRentals: 0,
      totalEarnings: '$0',
      preferences: {
        notifications: true,
        emailUpdates: true,
      },
    };

    await this.saveUserProfile(initialProfile);
    return initialProfile;
  }

  /**
   * Get users collection (for admin purposes)
   */
  private static async getUsersCollection(): Promise<Record<string, UserProfile>> {
    try {
      const storage = getStorage();
      const collection = await storage.getItem(this.USERS_COLLECTION_KEY);
      return collection ? JSON.parse(collection) : {};
    } catch (error) {
      console.error('Error getting users collection:', error);
      return {};
    }
  }

  /**
   * Clear user data on logout
   */
  static async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.USER_DATA_KEY,
        this.USERS_COLLECTION_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }

  /**
   * Update profile image URL
   */
  static async updateProfileImage(imageUrl: string): Promise<void> {
    try {
      await this.updateUserProfile({ profileImageUrl: imageUrl });
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(preferences: Partial<UserProfile['preferences']>): Promise<void> {
    try {
      const currentProfile = await this.getUserProfile();
      if (currentProfile) {
        const updatedPreferences = { ...currentProfile.preferences, ...preferences };
        await this.updateUserProfile({ preferences: updatedPreferences });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}
