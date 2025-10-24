import { Review } from '@/types/FirebaseTypes';
import { FirebaseService } from './FirebaseService';

export class ReviewService {
  static async createReview(
    reviewerId: string,
    reviewerName: string,
    reviewerImage: string | undefined,
    revieweeId: string,
    listingId: string | undefined,
    bookingId: string,
    rating: number,
    title: string,
    comment: string
  ): Promise<string> {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5 stars.');
      }

      // Check if review already exists for this booking
      const existingReviews = await FirebaseService.getBookingReviews(bookingId);
      const existingReview = existingReviews.find(review => review.reviewerId === reviewerId);
      
      if (existingReview) {
        throw new Error('You have already reviewed this booking.');
      }

      // Create review
      const reviewId = await FirebaseService.createReview({
        reviewerId,
        reviewerName,
        reviewerImage,
        revieweeId,
        listingId,
        bookingId,
        rating,
        title,
        comment,
        isVerified: true, // Assuming verified for now
      });

      // Create notification for reviewee
      await FirebaseService.createNotification({
        userId: revieweeId,
        type: 'new_review',
        title: 'New Review Received',
        message: `You received a ${rating}-star review from ${reviewerName}`,
        data: {
          reviewId,
          bookingId,
          rating,
        },
        isRead: false,
      });

      return reviewId;
    } catch (error) {
      console.error('Error creating review:', error);
      if (error instanceof Error && (error.message.includes('already reviewed') || error.message.includes('Rating must be'))) {
        throw error;
      }
      throw new Error('Failed to create review. Please try again.');
    }
  }

  static async getListingReviews(listingId: string): Promise<Review[]> {
    try {
      return await FirebaseService.getListingReviews(listingId);
    } catch (error) {
      console.error('Error getting listing reviews:', error);
      throw new Error('Failed to get reviews. Please try again.');
    }
  }

  static async getUserReviews(userId: string): Promise<Review[]> {
    try {
      return await FirebaseService.getUserReviews(userId);
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw new Error('Failed to get your reviews. Please try again.');
    }
  }

  static async getBookingReviews(bookingId: string): Promise<Review[]> {
    try {
      return await FirebaseService.getBookingReviews(bookingId);
    } catch (error) {
      console.error('Error getting booking reviews:', error);
      throw new Error('Failed to get booking reviews. Please try again.');
    }
  }

  static async updateReview(
    reviewId: string,
    updates: {
      rating?: number;
      title?: string;
      comment?: string;
    }
  ): Promise<void> {
    try {
      // Validate rating if provided
      if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
        throw new Error('Rating must be between 1 and 5 stars.');
      }

      await FirebaseService.updateReview(reviewId, updates);
    } catch (error) {
      console.error('Error updating review:', error);
      if (error instanceof Error && error.message.includes('Rating must be')) {
        throw error;
      }
      throw new Error('Failed to update review. Please try again.');
    }
  }

  static async deleteReview(reviewId: string): Promise<void> {
    try {
      await FirebaseService.deleteReview(reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error('Failed to delete review. Please try again.');
    }
  }

  static async getAverageRating(userId: string): Promise<number> {
    try {
      const reviews = await this.getUserReviews(userId);
      
      if (reviews.length === 0) {
        return 0;
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  }

  static async getReviewStats(userId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  }> {
    try {
      const reviews = await this.getUserReviews(userId);
      
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews) * 10) / 10
        : 0;

      const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      };

      return {
        totalReviews,
        averageRating,
        ratingDistribution,
      };
    } catch (error) {
      console.error('Error getting review stats:', error);
      throw new Error('Failed to get review statistics. Please try again.');
    }
  }
}
