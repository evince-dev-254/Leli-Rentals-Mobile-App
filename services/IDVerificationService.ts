import { IDVerification } from '@/types/FirebaseTypes';
import { FirebaseService } from './FirebaseService';

export class IDVerificationService {
  static async submitVerification(
    userId: string,
    documents: {
      idFront: Blob;
      idBack: Blob;
      selfie: Blob;
    }
  ): Promise<string> {
    try {
      // Upload all documents to Firebase Storage
      const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
        FirebaseService.uploadVerificationDocument(userId, 'idFront', documents.idFront),
        FirebaseService.uploadVerificationDocument(userId, 'idBack', documents.idBack),
        FirebaseService.uploadVerificationDocument(userId, 'selfie', documents.selfie),
      ]);

      // Create verification record in Firestore
      const verificationId = await FirebaseService.submitIDVerification({
        userId,
        status: 'pending',
        documents: {
          idFront: idFrontUrl,
          idBack: idBackUrl,
          selfie: selfieUrl,
        },
      });

      // Update user profile to indicate verification is pending
      await FirebaseService.updateUserProfile(userId, {
        verificationStatus: 'pending',
      });

      return verificationId;
    } catch (error) {
      console.error('Error submitting ID verification:', error);
      throw new Error('Failed to submit verification documents. Please try again.');
    }
  }

  static async getVerificationStatus(userId: string): Promise<IDVerification | null> {
    try {
      return await FirebaseService.getUserVerification(userId);
    } catch (error) {
      console.error('Error getting verification status:', error);
      throw new Error('Failed to get verification status. Please try again.');
    }
  }

  static async checkVerificationEligibility(userId: string): Promise<{
    canSubmit: boolean;
    reason?: string;
  }> {
    try {
      const existingVerification = await this.getVerificationStatus(userId);
      
      if (!existingVerification) {
        return { canSubmit: true };
      }

      switch (existingVerification.status) {
        case 'pending':
          return {
            canSubmit: false,
            reason: 'Your verification is currently being reviewed. Please wait for the result.',
          };
        case 'approved':
          return {
            canSubmit: false,
            reason: 'Your account is already verified.',
          };
        case 'rejected':
          return {
            canSubmit: true,
            reason: 'Your previous verification was rejected. You can submit new documents.',
          };
        default:
          return { canSubmit: true };
      }
    } catch (error) {
      console.error('Error checking verification eligibility:', error);
      return {
        canSubmit: false,
        reason: 'Unable to check verification status. Please try again.',
      };
    }
  }

  static async getVerificationDocuments(verificationId: string): Promise<{
    idFront: string;
    idBack: string;
    selfie: string;
  } | null> {
    try {
      const verification = await FirebaseService.getUserVerification(verificationId);
      return verification?.documents || null;
    } catch (error) {
      console.error('Error getting verification documents:', error);
      throw new Error('Failed to get verification documents. Please try again.');
    }
  }
}
