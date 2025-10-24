import { Favorite, Listing } from '@/types/FirebaseTypes';
import { FirebaseService } from './FirebaseService';

export class FavoriteService {
  static async addToFavorites(userId: string, listingId: string): Promise<string> {
    try {
      // Check if already favorited
      const existingFavorite = await FirebaseService.isFavorite(userId, listingId);
      if (existingFavorite) {
        throw new Error('This item is already in your favorites.');
      }

      // Add to favorites
      const favoriteId = await FirebaseService.addToFavorites(userId, listingId);

      // Increment listing favorites count
      await FirebaseService.incrementListingFavorites(listingId);

      return favoriteId;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      if (error instanceof Error && error.message.includes('already in your favorites')) {
        throw error;
      }
      throw new Error('Failed to add to favorites. Please try again.');
    }
  }

  static async removeFromFavorites(userId: string, listingId: string): Promise<void> {
    try {
      // Find the favorite record
      const favoriteId = await FirebaseService.isFavorite(userId, listingId);
      if (!favoriteId) {
        throw new Error('This item is not in your favorites.');
      }

      // Remove from favorites
      await FirebaseService.removeFromFavorites(favoriteId);

      // Decrement listing favorites count
      await FirebaseService.decrementListingFavorites(listingId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      if (error instanceof Error && error.message.includes('not in your favorites')) {
        throw error;
      }
      throw new Error('Failed to remove from favorites. Please try again.');
    }
  }

  static async toggleFavorite(userId: string, listingId: string): Promise<{
    isFavorite: boolean;
    favoriteId?: string;
  }> {
    try {
      const existingFavorite = await FirebaseService.isFavorite(userId, listingId);
      
      if (existingFavorite) {
        await this.removeFromFavorites(userId, listingId);
        return { isFavorite: false };
      } else {
        const favoriteId = await this.addToFavorites(userId, listingId);
        return { isFavorite: true, favoriteId };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to update favorites. Please try again.');
    }
  }

  static async getUserFavorites(userId: string): Promise<Favorite[]> {
    try {
      return await FirebaseService.getUserFavorites(userId);
    } catch (error) {
      console.error('Error getting user favorites:', error);
      throw new Error('Failed to get your favorites. Please try again.');
    }
  }

  static async getFavoriteListings(userId: string): Promise<Listing[]> {
    try {
      const favorites = await this.getUserFavorites(userId);
      
      // Get listing details for each favorite
      const listings = await Promise.all(
        favorites.map(async (favorite) => {
          try {
            const listing = await FirebaseService.getListing(favorite.listingId);
            return listing;
          } catch (error) {
            console.error(`Error getting listing ${favorite.listingId}:`, error);
            return null;
          }
        })
      );

      // Filter out null values (deleted listings)
      return listings.filter((listing): listing is Listing => listing !== null);
    } catch (error) {
      console.error('Error getting favorite listings:', error);
      throw new Error('Failed to get your favorite listings. Please try again.');
    }
  }

  static async isFavorite(userId: string, listingId: string): Promise<boolean> {
    try {
      const favoriteId = await FirebaseService.isFavorite(userId, listingId);
      return favoriteId !== null;
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }

  static async clearAllFavorites(userId: string): Promise<void> {
    try {
      const favorites = await this.getUserFavorites(userId);
      
      // Remove all favorites
      await Promise.all(
        favorites.map(async (favorite) => {
          await FirebaseService.removeFromFavorites(favorite.id);
          // Decrement listing favorites count
          await FirebaseService.decrementListingFavorites(favorite.listingId);
        })
      );
    } catch (error) {
      console.error('Error clearing all favorites:', error);
      throw new Error('Failed to clear favorites. Please try again.');
    }
  }
}
