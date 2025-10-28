import { PrimaryBrand, PrimaryText, WhiteBackground } from '@/constants/Colors';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && !user) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PrimaryBrand} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WhiteBackground,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: PrimaryText,
  },
});

export default AuthGuard;
