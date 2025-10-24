import { Listing } from '@/types/FirebaseTypes';
import { FirebaseService } from './FirebaseService';

export class ListingService {
  static async createListing(
    ownerId: string,
    listingData: {
      title: string;
      description: string;
      category: string;
      subcategory?: string;
      price: number;
      priceUnit: 'hour' | 'day' | 'week' | 'month';
      images: Blob[];
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
    }
  ): Promise<string> {
    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        listingData.images.map((imageBlob, index) =>
          FirebaseService.uploadListingImage('temp', imageBlob, index)
        )
      );

      // Create listing in Firestore
      const listingId = await FirebaseService.createListing({
        ownerId,
        title: listingData.title,
        description: listingData.description,
        category: listingData.category,
        subcategory: listingData.subcategory,
        price: listingData.price,
        priceUnit: listingData.priceUnit,
        images: imageUrls,
        location: listingData.location,
        availability: listingData.availability,
        features: listingData.features,
        condition: listingData.condition,
        status: 'active',
      });

      // Update image paths with actual listing ID
      const updatedImageUrls = await Promise.all(
        listingData.images.map((imageBlob, index) =>
          FirebaseService.uploadListingImage(listingId, imageBlob, index)
        )
      );

      // Update listing with correct image URLs
      await FirebaseService.updateListing(listingId, {
        images: updatedImageUrls,
      });

      return listingId;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw new Error('Failed to create listing. Please try again.');
    }
  }

  static async updateListing(
    listingId: string,
    updates: Partial<{
      title: string;
      description: string;
      price: number;
      priceUnit: 'hour' | 'day' | 'week' | 'month';
      availability: {
        startDate: string;
        endDate: string;
        isAvailable: boolean;
      };
      features: string[];
      condition: 'excellent' | 'good' | 'fair' | 'poor';
      status: 'active' | 'inactive' | 'rented';
    }>
  ): Promise<void> {
    try {
      await FirebaseService.updateListing(listingId, updates);
    } catch (error) {
      console.error('Error updating listing:', error);
      throw new Error('Failed to update listing. Please try again.');
    }
  }

  static async getUserListings(ownerId: string): Promise<Listing[]> {
    try {
      return await FirebaseService.getUserListings(ownerId);
    } catch (error) {
      console.error('Error getting user listings:', error);
      throw new Error('Failed to get your listings. Please try again.');
    }
  }

  static async getListing(listingId: string): Promise<Listing | null> {
    try {
      return await FirebaseService.getListing(listingId);
    } catch (error) {
      console.error('Error getting listing:', error);
      throw new Error('Failed to get listing details. Please try again.');
    }
  }

  static async searchListings(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
  }): Promise<Listing[]> {
    try {
      return await FirebaseService.searchListings(filters);
    } catch (error) {
      console.error('Error searching listings:', error);
      throw new Error('Failed to search listings. Please try again.');
    }
  }

  static async incrementListingViews(listingId: string): Promise<void> {
    try {
      const listing = await FirebaseService.getListing(listingId);
      if (listing) {
        await FirebaseService.updateListing(listingId, {
          views: (listing.views || 0) + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing listing views:', error);
      // Don't throw error for view tracking
    }
  }

  static async incrementListingFavorites(listingId: string): Promise<void> {
    try {
      const listing = await FirebaseService.getListing(listingId);
      if (listing) {
        await FirebaseService.updateListing(listingId, {
          favorites: (listing.favorites || 0) + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing listing favorites:', error);
      // Don't throw error for favorite tracking
    }
  }

  static async decrementListingFavorites(listingId: string): Promise<void> {
    try {
      const listing = await FirebaseService.getListing(listingId);
      if (listing) {
        await FirebaseService.updateListing(listingId, {
          favorites: Math.max((listing.favorites || 0) - 1, 0),
        });
      }
    } catch (error) {
      console.error('Error decrementing listing favorites:', error);
      // Don't throw error for favorite tracking
    }
  }

  static async incrementListingInquiries(listingId: string): Promise<void> {
    try {
      const listing = await FirebaseService.getListing(listingId);
      if (listing) {
        await FirebaseService.updateListing(listingId, {
          inquiries: (listing.inquiries || 0) + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing listing inquiries:', error);
      // Don't throw error for inquiry tracking
    }
  }
}
