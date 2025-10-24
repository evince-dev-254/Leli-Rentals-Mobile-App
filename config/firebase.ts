import Constants from 'expo-constants';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables
// Priority: 1. Environment variables (NEXT_PUBLIC_*), 2. Expo constants, 3. Development fallbacks
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
          Constants.expoConfig?.extra?.firebaseApiKey ||
          (__DEV__ ? "AIzaSyDzv5FX8AECAsA0a2--XpMD8GK5NOP1Rhg" : undefined),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 
              Constants.expoConfig?.extra?.firebaseAuthDomain ||
              (__DEV__ ? "leli-rentals-52a08.firebaseapp.com" : undefined),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
             Constants.expoConfig?.extra?.firebaseProjectId ||
             (__DEV__ ? "leli-rentals-52a08" : undefined),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 
                 Constants.expoConfig?.extra?.firebaseStorageBucket ||
                 (__DEV__ ? "leli-rentals-52a08.firebasestorage.app" : undefined),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 
                     Constants.expoConfig?.extra?.firebaseMessagingSenderId ||
                     (__DEV__ ? "220739389697" : undefined),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 
         Constants.expoConfig?.extra?.firebaseAppId ||
         (__DEV__ ? "1:220739389697:web:701c8d4141b29d88a13300" : undefined)
};

// Validate that all required config values are present
const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingConfig = requiredConfig.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingConfig.length > 0) {
  console.error('Firebase configuration missing:', missingConfig);
  console.error('Please set the following environment variables:');
  missingConfig.forEach(key => {
    console.error(`- NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);
  });
}

// Initialize Firebase (guard against HMR / multiple inits)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication with simplified persistence
let auth: any = (globalThis as any).__LELI_AUTH__;
if (!auth) {
  // Use default auth for all platforms to prevent timeout issues
  auth = getAuth(app);
  (globalThis as any).__LELI_AUTH__ = auth;
}

// Initialize Firestore
let db: any = (globalThis as any).__LELI_DB__;
if (!db) {
  db = getFirestore(app);
  (globalThis as any).__LELI_DB__ = db;
}

// Initialize Firebase Storage
let storage: any = (globalThis as any).__LELI_STORAGE__;
if (!storage) {
  storage = getStorage(app);
  (globalThis as any).__LELI_STORAGE__ = storage;
}

export { auth, db, storage };
export default app;
