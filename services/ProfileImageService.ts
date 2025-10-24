import { FirebaseService } from './FirebaseService';

export class ProfileImageService {
  static async uploadProfilePicture(userId: string, imageBlob: Blob): Promise<string> {
    try {
      // Upload image to Firebase Storage
      const imageUrl = await FirebaseService.uploadProfileImage(userId, imageBlob);
      
      // Update user profile with new image URL
      await FirebaseService.updateUserProfile(userId, {
        profileImageUrl: imageUrl,
      });
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw new Error('Failed to upload profile picture. Please try again.');
    }
  }

  static async deleteProfilePicture(userId: string, currentImageUrl: string): Promise<void> {
    try {
      // Delete image from Firebase Storage
      await FirebaseService.deleteFile(currentImageUrl);
      
      // Update user profile to remove image URL
      await FirebaseService.updateUserProfile(userId, {
        profileImageUrl: null,
      });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      throw new Error('Failed to delete profile picture. Please try again.');
    }
  }

  static async updateProfilePicture(userId: string, newImageBlob: Blob, currentImageUrl?: string): Promise<string> {
    try {
      // Delete old image if it exists
      if (currentImageUrl) {
        try {
          await FirebaseService.deleteFile(currentImageUrl);
        } catch (error) {
          console.warn('Could not delete old profile picture:', error);
        }
      }
      
      // Upload new image
      return await this.uploadProfilePicture(userId, newImageBlob);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw new Error('Failed to update profile picture. Please try again.');
    }
  }
}
