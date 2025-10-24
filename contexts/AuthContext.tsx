import {
    User,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { FirebaseService } from '../services/FirebaseService';
import { GoogleAuthService } from '../services/GoogleAuthService';
import { UserProfile } from '../types/FirebaseTypes';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Load user profile when user is authenticated
        try {
          const profile = await FirebaseService.getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // Create initial profile if it doesn't exist
            const initialProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'User',
              accountType: 'renter', // Default to renter, will be updated when they select account type
              joinDate: new Date().toISOString(),
              preferences: {
                notifications: true,
                emailUpdates: true,
              },
            };
            try {
              await FirebaseService.createUserProfile(initialProfile);
              setUserProfile(initialProfile);
            } catch (createError) {
              console.error('Error creating user profile:', createError);
              // Set profile anyway to prevent blocking the user
              setUserProfile(initialProfile);
            }
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Create a fallback profile to prevent blocking the user
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            accountType: 'renter',
            joinDate: new Date().toISOString(),
            preferences: {
              notifications: true,
              emailUpdates: true,
            },
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Simplified - Firebase will handle the rest via onAuthStateChanged
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        // Update Firebase Auth profile
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
        
        // Create user profile in Firestore
        const userProfile: UserProfile = {
          uid: userCredential.user.uid,
          email: email,
          displayName: displayName || 'User',
          accountType: 'renter', // Default to renter, will be updated when they select account type
          joinDate: new Date().toISOString(),
          preferences: {
            notifications: true,
            emailUpdates: true,
          },
        };
        
        await FirebaseService.createUserProfile(userProfile);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Simplified - Firebase will handle the rest via onAuthStateChanged
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await GoogleAuthService.signInWithGoogle();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google Sign-In failed'
      };
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (user) {
        // Update Firebase profile
        await updateProfile(user, updates);
        
        // Update Firestore profile
        await FirebaseService.updateUserProfile(user.uid, updates);
        
        // Update local user profile
        if (userProfile) {
          const updatedProfile = { ...userProfile, ...updates };
          setUserProfile(updatedProfile);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
