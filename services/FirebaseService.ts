// Mock data storage - in a real app, this would be replaced with your backend API
import {
  Booking,
  COLLECTIONS,
  Favorite,
  IDVerification,
  Listing,
  Notification,
  Review,
  UserProfile,
} from '@/types/FirebaseTypes';

// Mock data storage
const mockData = {
  users: new Map<string, UserProfile>(),
  listings: new Map<string, Listing>(),
  bookings: new Map<string, Booking>(),
  payments: new Map<string, any>(),
  notifications: new Map<string, Notification>(),
  reviews: new Map<string, Review>(),
  favorites: new Map<string, Favorite>(),
  idVerifications: new Map<string, IDVerification>(),
};

// Helper function to generate IDs
const generateId = () => `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to simulate async delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export class FirebaseService {
  // ===== USER PROFILE OPERATIONS =====
  
  static async createUserProfile(profile: UserProfile): Promise<void> {
    await delay();
    mockData.users.set(profile.uid, profile);
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    await delay();
    return mockData.users.get(uid) || null;
  }

  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    await delay();
    const existing = mockData.users.get(uid);
    if (existing) {
      mockData.users.set(uid, { ...existing, ...updates });
    }
  }

  static async deleteUserProfile(uid: string): Promise<void> {
    await delay();
    mockData.users.delete(uid);
  }

  // ===== LISTING OPERATIONS =====
  
  static async createListing(listing: Omit<Listing, 'id'>): Promise<string> {
    await delay();
    const id = generateId();
    const newListing: Listing = {
      ...listing,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockData.listings.set(id, newListing);
    return id;
  }

  static async getListing(id: string): Promise<Listing | null> {
    await delay();
    return mockData.listings.get(id) || null;
  }

  static async updateListing(id: string, updates: Partial<Listing>): Promise<void> {
    await delay();
    const existing = mockData.listings.get(id);
    if (existing) {
      mockData.listings.set(id, { ...existing, ...updates, updatedAt: new Date().toISOString() });
    }
  }

  static async deleteListing(id: string): Promise<void> {
    await delay();
    mockData.listings.delete(id);
  }

  static async getUserListings(ownerId: string): Promise<Listing[]> {
    await delay();
    return Array.from(mockData.listings.values()).filter(listing => listing.ownerId === ownerId);
  }

  static async getListingsByCategory(category: string): Promise<Listing[]> {
    await delay();
    return Array.from(mockData.listings.values()).filter(listing => listing.category === category);
  }

  static async searchListings(searchTerm: string): Promise<Listing[]> {
    await delay();
    const term = searchTerm.toLowerCase();
    return Array.from(mockData.listings.values()).filter(listing => 
      listing.title.toLowerCase().includes(term) ||
      listing.description.toLowerCase().includes(term) ||
      listing.location.address.toLowerCase().includes(term)
    );
  }

  // ===== BOOKING OPERATIONS =====
  
  static async createBooking(booking: Omit<Booking, 'id'>): Promise<string> {
    await delay();
    const id = generateId();
    const newBooking: Booking = {
      ...booking,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockData.bookings.set(id, newBooking);
    return id;
  }

  static async getBooking(id: string): Promise<Booking | null> {
    await delay();
    return mockData.bookings.get(id) || null;
  }

  static async updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
    await delay();
    const existing = mockData.bookings.get(id);
    if (existing) {
      mockData.bookings.set(id, { ...existing, ...updates, updatedAt: new Date().toISOString() });
    }
  }

  static async deleteBooking(id: string): Promise<void> {
    await delay();
    mockData.bookings.delete(id);
  }

  static async getUserBookings(userId: string, userType: 'renter' | 'owner'): Promise<Booking[]> {
    await delay();
    return Array.from(mockData.bookings.values()).filter(booking => 
      userType === 'renter' ? booking.renterId === userId : booking.ownerId === userId
    );
  }

  // ===== FAVORITE OPERATIONS =====
  
  static async addToFavorites(userId: string, listingId: string): Promise<string> {
    await delay();
    const id = generateId();
    const favorite: Favorite = {
      id,
      userId,
      listingId,
      createdAt: new Date().toISOString(),
    };
    mockData.favorites.set(id, favorite);
    return id;
  }

  static async removeFromFavorites(userId: string, listingId: string): Promise<void> {
    await delay();
    const favorite = Array.from(mockData.favorites.values()).find(f => 
      f.userId === userId && f.listingId === listingId
    );
    if (favorite) {
      mockData.favorites.delete(favorite.id);
    }
  }

  static async getUserFavorites(userId: string): Promise<Favorite[]> {
    await delay();
    return Array.from(mockData.favorites.values()).filter(favorite => favorite.userId === userId);
  }

  static async isFavorite(userId: string, listingId: string): Promise<boolean> {
    await delay();
    return Array.from(mockData.favorites.values()).some(f => 
      f.userId === userId && f.listingId === listingId
    );
  }

  // ===== REVIEW OPERATIONS =====
  
  static async createReview(review: Omit<Review, 'id'>): Promise<string> {
    await delay();
    const id = generateId();
    const newReview: Review = {
      ...review,
      id,
      createdAt: new Date().toISOString(),
    };
    mockData.reviews.set(id, newReview);
    return id;
  }

  static async getReviews(listingId: string): Promise<Review[]> {
    await delay();
    return Array.from(mockData.reviews.values()).filter(review => review.listingId === listingId);
  }

  static async getUserReviews(userId: string): Promise<Review[]> {
    await delay();
    return Array.from(mockData.reviews.values()).filter(review => review.reviewerId === userId);
  }

  // ===== NOTIFICATION OPERATIONS =====
  
  static async createNotification(notification: Omit<Notification, 'id'>): Promise<string> {
    await delay();
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date().toISOString(),
    };
    mockData.notifications.set(id, newNotification);
    return id;
  }

  static async getUserNotifications(userId: string): Promise<Notification[]> {
    await delay();
    return Array.from(mockData.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    await delay();
    const notification = mockData.notifications.get(notificationId);
    if (notification) {
      mockData.notifications.set(notificationId, { ...notification, isRead: true });
    }
  }

  static async markAllNotificationsAsRead(userId: string): Promise<void> {
    await delay();
    const userNotifications = Array.from(mockData.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead);
    
    userNotifications.forEach(notification => {
      mockData.notifications.set(notification.id, { ...notification, isRead: true });
    });
  }

  // ===== ID VERIFICATION OPERATIONS =====
  
  static async createIDVerification(verification: Omit<IDVerification, 'id'>): Promise<string> {
    await delay();
    const id = generateId();
    const newVerification: IDVerification = {
      ...verification,
      id,
      submittedAt: new Date().toISOString(),
    };
    mockData.idVerifications.set(id, newVerification);
    return id;
  }

  static async getIDVerification(userId: string): Promise<IDVerification | null> {
    await delay();
    return Array.from(mockData.idVerifications.values())
      .find(verification => verification.userId === userId) || null;
  }

  static async updateIDVerification(id: string, updates: Partial<IDVerification>): Promise<void> {
    await delay();
    const existing = mockData.idVerifications.get(id);
    if (existing) {
      mockData.idVerifications.set(id, { ...existing, ...updates });
    }
  }

  // ===== PAYMENT OPERATIONS =====
  
  static async createPayment(payment: any): Promise<string> {
    await delay();
    const id = generateId();
    const newPayment = {
      ...payment,
      id,
      createdAt: new Date().toISOString(),
    };
    mockData.payments.set(id, newPayment);
    return id;
  }

  static async getUserPayments(userId: string): Promise<any[]> {
    await delay();
    return Array.from(mockData.payments.values()).filter(payment => 
      payment.renterId === userId || payment.ownerId === userId
    );
  }

  // ===== FILE UPLOAD OPERATIONS =====
  
  static async uploadFile(file: any, path: string): Promise<string> {
    await delay();
    // Mock file upload - return a mock URL
    return `https://mock-storage.com/${path}/${generateId()}`;
  }

  static async deleteFile(url: string): Promise<void> {
    await delay();
    // Mock file deletion
    console.log('Mock file deletion:', url);
  }

  // ===== ANALYTICS OPERATIONS =====
  
  static async getListingAnalytics(listingId: string): Promise<any> {
    await delay();
    return {
      views: Math.floor(Math.random() * 1000),
      favorites: Math.floor(Math.random() * 100),
      inquiries: Math.floor(Math.random() * 50),
      bookings: Math.floor(Math.random() * 20),
    };
  }

  static async getUserAnalytics(userId: string): Promise<any> {
    await delay();
    return {
      totalListings: Array.from(mockData.listings.values()).filter(l => l.ownerId === userId).length,
      totalBookings: Array.from(mockData.bookings.values()).filter(b => b.ownerId === userId).length,
      totalEarnings: Math.floor(Math.random() * 10000),
      averageRating: 4.5 + Math.random() * 0.5,
    };
  }
}