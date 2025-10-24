// Environment configuration for Firebase
// This file can be used to manage different environments (dev, staging, prod)

export const ENV = {
  // Firebase Configuration - using environment variables
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  
  // App Configuration
  APP_NAME: "Leli Rentals",
  APP_VERSION: "1.0.0",
  
  // API Configuration (if needed)
  API_BASE_URL: "https://your-api-url.com",
  
  // Feature Flags
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
};

// Development environment overrides
if (__DEV__) {
  ENV.API_BASE_URL = "http://localhost:3000";
  ENV.ENABLE_ANALYTICS = false;
}

export default ENV;
