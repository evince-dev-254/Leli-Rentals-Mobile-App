import { Alert } from 'react-native';

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

export class ImagePickerService {
  /**
   * Show image picker options (camera or gallery)
   */
  static async showImagePickerOptions(): Promise<ImagePickerResult | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Profile Picture',
        'Choose how you want to update your profile picture',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
          {
            text: 'Take Photo',
            onPress: () => this.openCamera().then(resolve),
          },
          {
            text: 'Choose from Gallery',
            onPress: () => this.openGallery().then(resolve),
          },
        ]
      );
    });
  }

  /**
   * Open camera to take a photo
   */
  private static async openCamera(): Promise<ImagePickerResult | null> {
    try {
      // For now, we'll simulate camera functionality
      // In a real app, you would use expo-image-picker or react-native-image-picker
      Alert.alert(
        'Camera',
        'Camera functionality would be implemented here. For now, using a placeholder image.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Return a placeholder image
              return {
                uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
                width: 300,
                height: 300,
                type: 'image/jpeg',
                fileName: 'profile_image.jpg',
              };
            },
          },
        ]
      );
      
      // Return placeholder for now
      return {
        uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
        width: 300,
        height: 300,
        type: 'image/jpeg',
        fileName: 'profile_image.jpg',
      };
    } catch (error) {
      console.error('Error opening camera:', error);
      return null;
    }
  }

  /**
   * Open gallery to select an image
   */
  private static async openGallery(): Promise<ImagePickerResult | null> {
    try {
      // For now, we'll simulate gallery functionality
      Alert.alert(
        'Gallery',
        'Gallery functionality would be implemented here. For now, using a placeholder image.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Return a placeholder image
              return {
                uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
                width: 300,
                height: 300,
                type: 'image/jpeg',
                fileName: 'profile_image.jpg',
              };
            },
          },
        ]
      );
      
      // Return placeholder for now
      return {
        uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
        width: 300,
        height: 300,
        type: 'image/jpeg',
        fileName: 'profile_image.jpg',
      };
    } catch (error) {
      console.error('Error opening gallery:', error);
      return null;
    }
  }

  /**
   * Upload image to a storage service (placeholder implementation)
   */
  static async uploadImage(imageResult: ImagePickerResult): Promise<string> {
    try {
      // In a real app, you would upload to Firebase Storage, AWS S3, or another service
      // For now, we'll just return the URI
      console.log('Image upload simulation:', imageResult);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return imageResult.uri;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Validate image dimensions and size
   */
  static validateImage(imageResult: ImagePickerResult): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const minDimension = 100;
    const maxDimension = 2048;

    if (imageResult.width < minDimension || imageResult.height < minDimension) {
      return {
        isValid: false,
        error: `Image must be at least ${minDimension}x${minDimension} pixels`,
      };
    }

    if (imageResult.width > maxDimension || imageResult.height > maxDimension) {
      return {
        isValid: false,
        error: `Image must be no larger than ${maxDimension}x${maxDimension} pixels`,
      };
    }

    return { isValid: true };
  }
}
