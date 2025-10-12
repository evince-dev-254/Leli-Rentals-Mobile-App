import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AccountType = 'renter' | 'owner';
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
  const [accountType, setAccountTypeState] = useState<AccountType>('renter');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_started');

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      const storedAccountType = await AsyncStorage.getItem('accountType');
      const storedVerificationStatus = await AsyncStorage.getItem('verificationStatus');
      
      if (storedAccountType) {
        setAccountTypeState(storedAccountType as AccountType);
      }
      if (storedVerificationStatus) {
        setVerificationStatus(storedVerificationStatus as VerificationStatus);
      }
    } catch (error) {
      console.error('Error loading account data:', error);
    }
  };

  const setAccountType = async (type: AccountType) => {
    try {
      setAccountTypeState(type);
      await AsyncStorage.setItem('accountType', type);
    } catch (error) {
      console.error('Error saving account type:', error);
    }
  };

  const updateVerificationStatus = async (status: VerificationStatus) => {
    try {
      setVerificationStatus(status);
      await AsyncStorage.setItem('verificationStatus', status);
    } catch (error) {
      console.error('Error saving verification status:', error);
    }
  };

  const switchToOwner = () => {
    setAccountType('owner');
  };

  const switchToRenter = () => {
    setAccountType('renter');
  };

  const logout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove([
        'accountType',
        'verificationStatus',
        'userSession',
        'userData'
      ]);
      
      // Reset to default state
      setAccountTypeState('renter');
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
