import Constants from 'expo-constants';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables
// Priority: 1. Environment variables (NEXT_PUBLIC_*), 2. Expo constants
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
          Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 
              Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
             Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 
                 Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 
                     Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 
         Constants.expoConfig?.extra?.firebaseAppId
};

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
