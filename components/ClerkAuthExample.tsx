import { useAuth, useUser, UserButton } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * Example component showing how to use Clerk authentication
 * This can be used as a reference for implementing Clerk auth in your app
 */
export const ClerkAuthExample: React.FC = () => {
  const { isSignedIn, userId, signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!isSignedIn) {
    return (
      <View className="p-6 bg-card rounded-xl">
        <Text className="text-lg font-semibold text-text-primary mb-4">
          Clerk Authentication Example
        </Text>
        <Text className="text-text-secondary mb-4">
          You are not signed in. Use Clerk components to sign in.
        </Text>
        <TouchableOpacity 
          className="bg-primary-brand py-3 px-6 rounded-xl"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white font-semibold text-center">
            Go to Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="p-6 bg-card rounded-xl">
      <Text className="text-lg font-semibold text-text-primary mb-4">
        Clerk Authentication Example
      </Text>
      
      <View className="mb-4">
        <Text className="text-text-secondary mb-2">User ID:</Text>
        <Text className="text-text-primary font-mono text-sm">{userId}</Text>
      </View>

      {user && (
        <View className="mb-4">
          <Text className="text-text-secondary mb-2">Email:</Text>
          <Text className="text-text-primary">{user.emailAddresses[0]?.emailAddress}</Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <UserButton />
        
        <TouchableOpacity 
          className="bg-error py-2 px-4 rounded-lg"
          onPress={handleSignOut}
        >
          <Text className="text-white font-medium">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
