import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const TailwindExample: React.FC = () => {
  return (
    <View className="flex-1 bg-background p-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-text-primary mb-2">
          Welcome to Leli Rentals
        </Text>
        <Text className="text-base text-text-secondary">
          Your items, your way
        </Text>
      </View>

      {/* Cards */}
      <View className="space-y-4">
        <View className="bg-card p-4 rounded-xl shadow-card">
          <Text className="text-lg font-semibold text-text-primary mb-2">
            Find Perfect Rentals
          </Text>
          <Text className="text-sm text-text-secondary mb-4">
            Discover amazing items to rent near you
          </Text>
          <TouchableOpacity className="bg-primary-brand py-3 px-6 rounded-lg">
            <Text className="text-primary-foreground font-semibold text-center">
              Browse Items
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-card p-4 rounded-xl shadow-card">
          <Text className="text-lg font-semibold text-text-primary mb-2">
            Earn Money
          </Text>
          <Text className="text-sm text-text-secondary mb-4">
            List your items and start earning
          </Text>
          <TouchableOpacity className="bg-vibrant-green py-3 px-6 rounded-lg">
            <Text className="text-white font-semibold text-center">
              List Item
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status indicators */}
      <View className="flex-row justify-between mt-6">
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-success rounded-full mr-2" />
          <Text className="text-sm text-text-secondary">Online</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-vibrant-plum rounded-full mr-2" />
          <Text className="text-sm text-text-secondary">Premium</Text>
        </View>
      </View>
    </View>
  );
};
