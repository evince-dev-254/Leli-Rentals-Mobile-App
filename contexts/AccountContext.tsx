import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Simplified storage - use in-memory storage for mobile
const getStorage = () => {
  // Use in-memory storage for mobile to avoid localStorage issues
  const memoryStorage: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => Promise.resolve(memoryStorage[key] || null),
    setItem: (key: string, value: string) => {
      memoryStorage[key] = value;
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      delete memoryStorage[key];
      return Promise.resolve();
    },
    multiRemove: (keys: string[]) => {
      keys.forEach(key => delete memoryStorage[key]);
      return Promise.resolve();
    }
  };
};

export type AccountType = 'renter' | 'owner' | null;
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not_started';

interface AccountContextType {
  accountType: AccountType;
  verificationStatus: VerificationStatus;
  isOwnerVerified: boolean;
  switchToOwner: () => void;
  switchToRenter: () => void;
  updateVerificationStatus: (status: VerificationStatus) => void;
  setAccountType: (type: AccountType) => void;
  logout: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accountType, setAccountTypeState] = useState<AccountType>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_started');

  useEffect(() => {
    loadAccountData();
  }, []);

  // Listen for auth state changes to clear account data when user logs out
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const { auth } = await import('@/config/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            // User logged out, clear account data
            setAccountTypeState(null);
            setVerificationStatus('not_started');
          } else {
            // User logged in, reload account data from Firestore
            loadAccountData();
          }
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error setting up auth state listener:', error);
      }
    };
    
    checkAuthState();
  }, []);

  const loadAccountData = async () => {
    try {
      // Check if user has already selected an account type
      const storage = getStorage();
      const savedAccountType = await storage.getItem('accountType');
      
      if (savedAccountType) {
        setAccountTypeState(savedAccountType as AccountType);
      } else {
        // Check Firestore for user's account type if authenticated
        try {
          const { auth } = await import('@/config/firebase');
          const { FirebaseService } = await import('@/services/FirebaseService');
          
          if (auth.currentUser) {
            const userProfile = await FirebaseService.getUserProfile(auth.currentUser.uid);
            if (userProfile && userProfile.accountType) {
              // Load account type from Firestore and save to local storage
              setAccountTypeState(userProfile.accountType as AccountType);
              await storage.setItem('accountType', userProfile.accountType);
            } else {
              // No account type selected yet - user needs to choose
              setAccountTypeState(null);
            }
          } else {
            // No user authenticated - user needs to choose
            setAccountTypeState(null);
          }
        } catch (firestoreError) {
          console.error('Error loading account type from Firestore:', firestoreError);
          // Fallback to null if Firestore fails
          setAccountTypeState(null);
        }
      }
      setVerificationStatus('not_started');
    } catch (error) {
      console.error('Error loading account data:', error);
      // Default to null if there's an error
      setAccountTypeState(null);
    }
  };

  const setAccountType = async (type: AccountType) => {
    try {
      setAccountTypeState(type);
      // Save account type to storage
      const storage = getStorage();
      await storage.setItem('accountType', type || '');
      
      // Update user profile in Firestore if user is authenticated
      try {
        const { auth } = await import('@/config/firebase');
        const { FirebaseService } = await import('@/services/FirebaseService');
        
        if (auth.currentUser) {
          await FirebaseService.updateUserProfile(auth.currentUser.uid, {
            accountType: type,
          });
        }
      } catch (error) {
        console.error('Error updating account type in Firestore:', error);
      }
    } catch (error) {
      console.error('Error saving account type:', error);
    }
  };

  const updateVerificationStatus = async (status: VerificationStatus) => {
    try {
      setVerificationStatus(status);
      // Simplified - no storage saving
    } catch (error) {
      console.error('Error saving verification status:', error);
    }
  };

  const switchToOwner = async () => {
    try {
      console.log('Switching to owner...');
      await setAccountType('owner');
      // Reset verification status when switching to owner
      setVerificationStatus('not_started');
      const storage = getStorage();
      await storage.setItem('verificationStatus', 'not_started');
      console.log('Successfully switched to owner');
    } catch (error) {
      console.error('Error switching to owner:', error);
    }
  };

  const scheduleVerificationReminder = async () => {
    try {
      const storage = getStorage();
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 2); // 2 days from now
      
      await storage.setItem('verificationReminderDate', reminderDate.toISOString());
      await storage.setItem('verificationReminderSent', 'false');
    } catch (error) {
      console.error('Error scheduling verification reminder:', error);
    }
  };

  const switchToRenter = async () => {
    try {
      console.log('Switching to renter...');
      await setAccountType('renter');
      // Clear verification status when switching to renter
      setVerificationStatus('not_started');
      const storage = getStorage();
      await storage.setItem('verificationStatus', 'not_started');
      console.log('Successfully switched to renter');
    } catch (error) {
      console.error('Error switching to renter:', error);
    }
  };

  const logout = async () => {
    try {
      // Clear all stored data
      const storage = getStorage();
      await storage.multiRemove([
        'accountType',
        'verificationStatus',
        'userSession',
        'userData'
      ]);
      
      // Reset to default state
      setAccountTypeState(null);
      setVerificationStatus('not_started');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isOwnerVerified = verificationStatus === 'verified';

  const value: AccountContextType = {
    accountType,
    verificationStatus,
    isOwnerVerified,
    switchToOwner,
    switchToRenter,
    updateVerificationStatus,
    setAccountType,
    logout,
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
