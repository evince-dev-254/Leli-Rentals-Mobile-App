// Google OAuth Configuration for Leli Rentals
export const GOOGLE_CONFIG = {
  // Web Client ID for Google Sign-In
  CLIENT_ID: '323268122303-icn4c6rvtkfro9o8q51c5q44tsc5na33.apps.googleusercontent.com',
  
  // Same as CLIENT_ID for web applications
  WEB_CLIENT_ID: '323268122303-icn4c6rvtkfro9o8q51c5q44tsc5na33.apps.googleusercontent.com',
  
  // Redirect URI for OAuth flow (Expo development)
  REDIRECT_URI: 'https://auth.expo.io/@evincek254/rentals',
  
  // Package name for Android
  PACKAGE_NAME: 'com.Leli.Rentals',
};

// Instructions for setting up Google OAuth:
// 1. Go to Google Cloud Console (https://console.cloud.google.com/)
// 2. Create a new project or select existing one
// 3. Enable Google+ API and Google Sign-In API
// 4. Go to Credentials and create OAuth 2.0 Client IDs
// 5. For Expo apps, create:
//    - Web application client ID (for development)
//    - Android client ID (for Android builds)
//    - iOS client ID (for iOS builds)
// 6. Add your redirect URIs:
//    - For development: https://auth.expo.io/@your-expo-username/your-app-slug
//    - For production: your actual app's redirect URI
// 7. Update the CLIENT_ID above with your web client ID for development
