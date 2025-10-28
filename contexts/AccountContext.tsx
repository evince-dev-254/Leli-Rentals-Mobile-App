import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

export type AccountType = 'renter' | 'owner' | null;
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not_started';

export interface OwnerProfile {
  businessName: string;
  businessType: string;
  location: string;
  setupCompleted: boolean;
  idVerificationCompleted: boolean;
  idVerificationDeadline: string | null; // ISO date string
  idVerificationReminderShown: boolean;
}

interface AccountContextType {
  accountType: AccountType;
  verificationStatus: VerificationStatus;
  isOwnerVerified: boolean;
  ownerProfile: OwnerProfile | null;
  loading: boolean;
  switchToOwner: () => void;
  switchToRenter: () => void;
  updateVerificationStatus: (status: VerificationStatus) => void;
  updateOwnerProfile: (profile: Partial<OwnerProfile>) => void;
  checkVerificationDeadline: () => { shouldShowReminder: boolean; daysRemaining: number; shouldSignOut: boolean };
  markVerificationReminderShown: () => void;
  logout: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_started');
  const [isOwnerVerified, setIsOwnerVerified] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const lastSignedInStateRef = useRef<boolean | null>(null);

  const storage = AsyncStorage;

  useEffect(() => {
    if (isLoaded && !hasLoadedRef.current) {
      loadAccountData();
    } else if (isLoaded && lastSignedInStateRef.current !== isSignedIn) {
      // Only reload if the signed-in state actually changed
      lastSignedInStateRef.current = isSignedIn;
      loadAccountData();
    }
  }, [isLoaded, isSignedIn]);

  // Reset account data when user signs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setAccountType(null);
      setVerificationStatus('not_started');
      setIsOwnerVerified(false);
      setOwnerProfile(null);
      setLoading(false);
      hasLoadedRef.current = false; // Reset the loaded flag
    }
  }, [isLoaded, isSignedIn]);

  const loadAccountData = async () => {
    try {
      setLoading(true);
      hasLoadedRef.current = true;
      console.log('AccountContext: Loading account data, isSignedIn:', isSignedIn);
      
      if (!isSignedIn) {
        // User is not signed in, reset account data
        console.log('AccountContext: User not signed in, resetting account data');
        setAccountType(null);
        setVerificationStatus('not_started');
        setIsOwnerVerified(false);
        setLoading(false);
        return;
      }

      // Load account type from storage
      const savedAccountType = await storage.getItem('accountType');
      console.log('AccountContext: Loaded account type from storage:', savedAccountType);
      if (savedAccountType && (savedAccountType === 'renter' || savedAccountType === 'owner')) {
        setAccountType(savedAccountType as AccountType);
        console.log('AccountContext: Set account type to:', savedAccountType);
      }

      // Load verification status
      const savedVerificationStatus = await storage.getItem('verificationStatus');
      if (savedVerificationStatus && ['pending', 'verified', 'rejected', 'not_started'].includes(savedVerificationStatus)) {
        setVerificationStatus(savedVerificationStatus as VerificationStatus);
      }

      // Load owner verification status
      const savedIsOwnerVerified = await storage.getItem('isOwnerVerified');
      setIsOwnerVerified(savedIsOwnerVerified === 'true');

      // Load owner profile
      const savedOwnerProfile = await storage.getItem('ownerProfile');
      if (savedOwnerProfile) {
        try {
          const profile = JSON.parse(savedOwnerProfile);
          setOwnerProfile(profile);
          console.log('AccountContext: Loaded owner profile:', profile);
        } catch (parseError) {
          console.error('Error parsing owner profile:', parseError);
        }
      }

    } catch (error) {
      console.error('Error loading account data:', error);
    } finally {
      setLoading(false);
      console.log('AccountContext: Finished loading account data');
    }
  };

  const switchToOwner = async () => {
    try {
      console.log('Switching to owner account type...');
      setAccountType('owner');
      await storage.setItem('accountType', 'owner');
      console.log('Successfully switched to owner');
    } catch (error) {
      console.error('Error switching to owner:', error);
    }
  };

  const switchToRenter = async () => {
    try {
      console.log('Switching to renter account type...');
      setAccountType('renter');
      await storage.setItem('accountType', 'renter');
      console.log('Successfully switched to renter');
    } catch (error) {
      console.error('Error switching to renter:', error);
    }
  };

  const updateVerificationStatus = async (status: VerificationStatus) => {
    try {
      setVerificationStatus(status);
      await storage.setItem('verificationStatus', status);
      
      if (status === 'verified') {
        setIsOwnerVerified(true);
        await storage.setItem('isOwnerVerified', 'true');
      } else {
        setIsOwnerVerified(false);
        await storage.setItem('isOwnerVerified', 'false');
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const updateOwnerProfile = async (profile: Partial<OwnerProfile>) => {
    try {
      const updatedProfile = { ...ownerProfile, ...profile };
      setOwnerProfile(updatedProfile);
      await storage.setItem('ownerProfile', JSON.stringify(updatedProfile));
      console.log('Owner profile updated:', updatedProfile);
    } catch (error) {
      console.error('Error updating owner profile:', error);
    }
  };

  const checkVerificationDeadline = () => {
    if (!ownerProfile || ownerProfile.idVerificationCompleted) {
      return { shouldShowReminder: false, daysRemaining: 0, shouldSignOut: false };
    }

    if (!ownerProfile.idVerificationDeadline) {
      return { shouldShowReminder: false, daysRemaining: 0, shouldSignOut: false };
    }

    const deadline = new Date(ownerProfile.idVerificationDeadline);
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const shouldShowReminder = daysRemaining <= 2 && !ownerProfile.idVerificationReminderShown;
    const shouldSignOut = daysRemaining <= 0;

    return { shouldShowReminder, daysRemaining, shouldSignOut };
  };

  const markVerificationReminderShown = async () => {
    if (ownerProfile) {
      await updateOwnerProfile({ idVerificationReminderShown: true });
    }
  };

  const logout = async () => {
    try {
      // Clear all account data from storage
      await storage.multiRemove(['accountType', 'verificationStatus', 'isOwnerVerified', 'ownerProfile']);
      
      // Reset state
      setAccountType(null);
      setVerificationStatus('not_started');
      setIsOwnerVerified(false);
      setOwnerProfile(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value: AccountContextType = {
    accountType,
    verificationStatus,
    isOwnerVerified,
    ownerProfile,
    loading,
    switchToOwner,
    switchToRenter,
    updateVerificationStatus,
    updateOwnerProfile,
    checkVerificationDeadline,
    markVerificationReminderShown,
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