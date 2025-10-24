import { auth } from '@/config/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { UserDataService } from './UserDataService';

// Dynamic import for Google Sign-In
const loadGoogleSignIn = async () => {
  try {
    const { GoogleSignin: GS } = await import('@react-native-google-signin/google-signin');
    return GS;
  } catch (error) {
    console.warn('Google Sign-In package not available:', error);
    return null;
  }
};

export class GoogleAuthService {
  static async signInWithGoogle() {
    try {
      // Try native Google Sign-In
      return await this.signInWithGoogleNative();
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during Google Sign-In',
      };
    }
  }

  static async signInWithGoogleNative() {
    try {
      const GoogleSignIn = await loadGoogleSignIn();
      if (!GoogleSignIn) {
        return {
          success: false,
          error: 'Google Sign-In package not available. Please install @react-native-google-signin/google-signin',
        };
      }

      // Configure Google Sign-In
      GoogleSignIn.configure({
        webClientId: '323268122303-icn4c6rvtkfro9o8q51c5q44tsc5na33.apps.googleusercontent.com',
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });

      // Check if your device supports Google Play
      await GoogleSignIn.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the users ID token
      const { idToken } = await GoogleSignIn.signIn();

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      // Create or update user profile
      let profile = await UserDataService.getUserProfile();
      if (!profile) {
        profile = await UserDataService.createInitialProfile(
          user.uid,
          user.email || '',
          user.displayName || 'User',
          'renter'
        );
      }

      return {
        success: true,
        user: user,
        profile: profile,
      };
    } catch (error: any) {
      console.error('Native Google Sign-In Error:', error);
      return {
        success: false,
        error: error.message || 'Native Google Sign-In failed',
      };
    }
  }



  static async signOut() {
    try {
      const GoogleSignIn = await loadGoogleSignIn();
      if (GoogleSignIn) {
        // Sign out from Google Sign-In
        await GoogleSignIn.signOut();
      }
      
      // Sign out from Firebase
      await auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      };
    }
  }
}