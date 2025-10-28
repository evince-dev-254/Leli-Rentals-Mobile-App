import { useAccount } from '@/contexts/AccountContext';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Reset global navigation lock
declare let globalNavigationLock: boolean;

const AuthDebugger: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { accountType, loading } = useAccount();

  const clearAccountData = async () => {
    try {
      // Clear account type and navigation state from storage
      const storage = {
        getItem: (key: string) => Promise.resolve(null),
        setItem: (key: string, value: string) => Promise.resolve(),
        removeItem: (key: string) => Promise.resolve(),
      };
      
      await storage.removeItem('accountType');
      await storage.removeItem('app_navigation_completed');
      
      // Reset global navigation lock
      if (typeof globalNavigationLock !== 'undefined') {
        globalNavigationLock = false;
      }
      
      console.log('Account data and navigation state cleared');
      
      // Reload the app
      router.replace('/');
    } catch (error) {
      console.error('Error clearing account data:', error);
    }
  };

  if (!__DEV__) return null; // Only show in development

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Auth Debugger</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Auth Loaded:</Text>
        <Text style={[styles.value, { color: isLoaded ? '#10b981' : '#ef4444' }]}>
          {isLoaded ? 'Yes' : 'No'}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Signed In:</Text>
        <Text style={[styles.value, { color: isSignedIn ? '#10b981' : '#ef4444' }]}>
          {isSignedIn ? 'Yes' : 'No'}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user?.id || 'None'}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Account Type:</Text>
        <Text style={[styles.value, { color: accountType ? '#10b981' : '#f59e0b' }]}>
          {accountType || 'Not Set'}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Account Loading:</Text>
        <Text style={[styles.value, { color: loading ? '#f59e0b' : '#10b981' }]}>
          {loading ? 'Yes' : 'No'}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.clearButton} onPress={clearAccountData}>
        <Text style={styles.clearButtonText}>Clear Account Data</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.clearButton, styles.advancedButton]} 
        onPress={() => router.push('/debug-clear-data')}
      >
        <Text style={styles.clearButtonText}>🧹 Advanced Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    zIndex: 1000,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
  },
  value: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  advancedButton: {
    backgroundColor: '#3b82f6',
    marginTop: 4,
  },
});

export default AuthDebugger;
