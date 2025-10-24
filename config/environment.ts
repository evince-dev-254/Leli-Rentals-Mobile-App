// Environment configuration for Firebase
// This file can be used to manage different environments (dev, staging, prod)

export const ENV = {
  // Firebase Configuration
  FIREBASE_API_KEY: "AIzaSyDzv5FX8AECAsA0a2--XpMD8GK5NOP1Rhg",
  FIREBASE_AUTH_DOMAIN: "leli-rentals-52a08.firebaseapp.com",
  FIREBASE_PROJECT_ID: "leli-rentals-52a08",
  FIREBASE_STORAGE_BUCKET: "leli-rentals-52a08.firebasestorage.app",
  FIREBASE_MESSAGING_SENDER_ID: "220739389697",
  FIREBASE_APP_ID: "1:220739389697:web:701c8d4141b29d88a13300",
  
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
