// Firebase Firestore data types for Leli Rentals

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
  // Owner-specific fields
  isVerified?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: {
    idFront?: string;
    idBack?: string;
    selfie?: string;
    submittedAt?: string;
  };
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  priceUnit: 'hour' | 'day' | 'week' | 'month';
  images: string[];
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  availability: {
    startDate: string;
    endDate: string;
    isAvailable: boolean;
  };
  features: string[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'active' | 'inactive' | 'rented';
  createdAt: string;
  updatedAt: string;
  // Analytics
  views: number;
  favorites: number;
  inquiries: number;
}

export interface Booking {
  id: string;
  renterId: string;
  ownerId: string;
  listingId: string;
  listingTitle: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  // Communication
  messages?: BookingMessage[];
  // Reviews
  renterReview?: Review;
  ownerReview?: Review;
}

export interface BookingMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerImage?: string;
  revieweeId: string;
  listingId?: string;
  bookingId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: string;
  isVerified: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'new_review' | 'payment_received' | 'reminder' | 'system';
  title: string;
  message: string;
  data?: any; // Additional data for the notification
  isRead: boolean;
  createdAt: string;
}

export interface IDVerification {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    idFront: string;
    idBack: string;
    selfie: string;
  };
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  LISTINGS: 'listings',
  BOOKINGS: 'bookings',
  FAVORITES: 'favorites',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  ID_VERIFICATIONS: 'id_verifications',
} as const;
