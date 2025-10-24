import { db, storage } from '@/config/firebase';
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
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export class FirebaseService {
  // ===== USER PROFILE OPERATIONS =====
  
  static async createUserProfile(profile: UserProfile): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, profile.uid);
    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  }

  // ===== LISTING OPERATIONS =====
  
  static async createListing(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'favorites' | 'inquiries'>): Promise<string> {
    const listingsRef = collection(db, COLLECTIONS.LISTINGS);
    const docRef = await addDoc(listingsRef, {
      ...listing,
      views: 0,
      favorites: 0,
      inquiries: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async updateListing(listingId: string, updates: Partial<Listing>): Promise<void> {
    const listingRef = doc(db, COLLECTIONS.LISTINGS, listingId);
    await updateDoc(listingRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async getListing(listingId: string): Promise<Listing | null> {
    const listingRef = doc(db, COLLECTIONS.LISTINGS, listingId);
    const listingSnap = await getDoc(listingRef);
    
    if (listingSnap.exists()) {
      return { id: listingSnap.id, ...listingSnap.data() } as Listing;
    }
    return null;
  }

  static async getUserListings(ownerId: string): Promise<Listing[]> {
    const listingsRef = collection(db, COLLECTIONS.LISTINGS);
    const q = query(
      listingsRef,
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Listing[];
  }

  static async searchListings(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
  }): Promise<Listing[]> {
    const listingsRef = collection(db, COLLECTIONS.LISTINGS);
    let q = query(listingsRef, where('status', '==', 'active'));
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters.available) {
      q = query(q, where('availability.isAvailable', '==', true));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Listing[];
  }

  // ===== BOOKING OPERATIONS =====
  
  static async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);
    const docRef = await addDoc(bookingsRef, {
      ...booking,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<void> {
    const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async getUserBookings(userId: string, userType: 'renter' | 'owner'): Promise<Booking[]> {
    const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);
    const field = userType === 'renter' ? 'renterId' : 'ownerId';
    const q = query(
      bookingsRef,
      where(field, '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Booking[];
  }

  // ===== FAVORITES OPERATIONS =====
  
  static async addToFavorites(userId: string, listingId: string): Promise<string> {
    const favoritesRef = collection(db, COLLECTIONS.FAVORITES);
    const docRef = await addDoc(favoritesRef, {
      userId,
      listingId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async removeFromFavorites(favoriteId: string): Promise<void> {
    const favoriteRef = doc(db, COLLECTIONS.FAVORITES, favoriteId);
    await deleteDoc(favoriteRef);
  }

  static async getUserFavorites(userId: string): Promise<Favorite[]> {
    const favoritesRef = collection(db, COLLECTIONS.FAVORITES);
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Favorite[];
  }

  static async isFavorite(userId: string, listingId: string): Promise<string | null> {
    const favoritesRef = collection(db, COLLECTIONS.FAVORITES);
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('listingId', '==', listingId)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    return null;
  }

  // ===== REVIEW OPERATIONS =====
  
  static async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
    const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
    const docRef = await addDoc(reviewsRef, {
      ...review,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getListingReviews(listingId: string): Promise<Review[]> {
    const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
    const q = query(
      reviewsRef,
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[];
  }

  static async getUserReviews(userId: string): Promise<Review[]> {
    const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
    const q = query(
      reviewsRef,
      where('revieweeId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[];
  }

  static async getBookingReviews(bookingId: string): Promise<Review[]> {
    const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
    const q = query(
      reviewsRef,
      where('bookingId', '==', bookingId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[];
  }

  static async updateReview(reviewId: string, updates: Partial<Review>): Promise<void> {
    const reviewRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
    await updateDoc(reviewRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteReview(reviewId: string): Promise<void> {
    const reviewRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
    await deleteDoc(reviewRef);
  }

  static async getBooking(bookingId: string): Promise<Booking | null> {
    const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (bookingSnap.exists()) {
      return { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
    }
    return null;
  }

  // ===== NOTIFICATION OPERATIONS =====
  
  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS);
    const docRef = await addDoc(notificationsRef, {
      ...notification,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getUserNotifications(userId: string): Promise<Notification[]> {
    const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS);
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
    });
  }

  // ===== ID VERIFICATION OPERATIONS =====
  
  static async submitIDVerification(verification: Omit<IDVerification, 'id' | 'submittedAt'>): Promise<string> {
    const verificationsRef = collection(db, COLLECTIONS.ID_VERIFICATIONS);
    const docRef = await addDoc(verificationsRef, {
      ...verification,
      submittedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async updateVerificationStatus(verificationId: string, status: IDVerification['status'], reviewedBy: string, notes?: string): Promise<void> {
    const verificationRef = doc(db, COLLECTIONS.ID_VERIFICATIONS, verificationId);
    await updateDoc(verificationRef, {
      status,
      reviewedAt: serverTimestamp(),
      reviewedBy,
      notes,
    });
  }

  static async getUserVerification(userId: string): Promise<IDVerification | null> {
    const verificationsRef = collection(db, COLLECTIONS.ID_VERIFICATIONS);
    const q = query(
      verificationsRef,
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as IDVerification;
    }
    return null;
  }

  // ===== FILE UPLOAD OPERATIONS =====
  
  static async uploadFile(file: Blob, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  static async uploadProfileImage(userId: string, file: Blob): Promise<string> {
    const path = `profile-images/${userId}/${Date.now()}`;
    return await this.uploadFile(file, path);
  }

  static async uploadListingImage(listingId: string, file: Blob, imageIndex: number): Promise<string> {
    const path = `listing-images/${listingId}/${imageIndex}-${Date.now()}`;
    return await this.uploadFile(file, path);
  }

  static async uploadVerificationDocument(userId: string, documentType: 'idFront' | 'idBack' | 'selfie', file: Blob): Promise<string> {
    const path = `verification-documents/${userId}/${documentType}-${Date.now()}`;
    return await this.uploadFile(file, path);
  }

  static async deleteFile(url: string): Promise<void> {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  }

  // ===== PAYMENT OPERATIONS =====
  
  static async createPayment(payment: any): Promise<string> {
    const paymentsRef = collection(db, 'payments');
    const docRef = await addDoc(paymentsRef, {
      ...payment,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getUserPayments(userId: string): Promise<any[]> {
    const paymentsRef = collection(db, 'payments');
    const q = query(
      paymentsRef,
      where('renterId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async getPayment(paymentId: string): Promise<any | null> {
    const paymentRef = doc(db, 'payments', paymentId);
    const paymentSnap = await getDoc(paymentRef);
    
    if (paymentSnap.exists()) {
      return { id: paymentSnap.id, ...paymentSnap.data() };
    }
    return null;
  }

  static async createRefund(refund: any): Promise<string> {
    const refundsRef = collection(db, 'refunds');
    const docRef = await addDoc(refundsRef, {
      ...refund,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getUserRefunds(userId: string): Promise<any[]> {
    const refundsRef = collection(db, 'refunds');
    const q = query(
      refundsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // ===== BILLING OPERATIONS =====
  
  static async createBillingAccount(account: any): Promise<string> {
    const accountsRef = collection(db, 'billing_accounts');
    const docRef = await addDoc(accountsRef, {
      ...account,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async updateBillingAccount(accountId: string, updates: any): Promise<void> {
    const accountRef = doc(db, 'billing_accounts', accountId);
    await updateDoc(accountRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async getBillingAccount(ownerId: string): Promise<any | null> {
    const accountsRef = collection(db, 'billing_accounts');
    const q = query(
      accountsRef,
      where('ownerId', '==', ownerId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    }
    return null;
  }

  static async createEarnings(earnings: any): Promise<string> {
    const earningsRef = collection(db, 'earnings');
    const docRef = await addDoc(earningsRef, {
      ...earnings,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getOwnerEarnings(ownerId: string): Promise<any[]> {
    const earningsRef = collection(db, 'earnings');
    const q = query(
      earningsRef,
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async createPayout(payout: any): Promise<string> {
    const payoutsRef = collection(db, 'payouts');
    const docRef = await addDoc(payoutsRef, {
      ...payout,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getOwnerPayouts(ownerId: string): Promise<any[]> {
    const payoutsRef = collection(db, 'payouts');
    const q = query(
      payoutsRef,
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async getPayout(payoutId: string): Promise<any | null> {
    const payoutRef = doc(db, 'payouts', payoutId);
    const payoutSnap = await getDoc(payoutRef);
    
    if (payoutSnap.exists()) {
      return { id: payoutSnap.id, ...payoutSnap.data() };
    }
    return null;
  }

  static async createTaxDocument(document: any): Promise<string> {
    const documentsRef = collection(db, 'tax_documents');
    const docRef = await addDoc(documentsRef, {
      ...document,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getTaxDocuments(ownerId: string): Promise<any[]> {
    const documentsRef = collection(db, 'tax_documents');
    const q = query(
      documentsRef,
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}
