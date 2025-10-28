import { checkNetworkConnectivity, waitForConnectivity } from '@/utils/networkUtils';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NetworkStatusProps {
  onRetry?: () => void;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ onRetry }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const status = await checkNetworkConnectivity();
      setIsConnected(status.isConnected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      const connected = await waitForConnectivity(5000); // Wait up to 5 seconds
      setIsConnected(connected);
      if (connected && onRetry) {
        onRetry();
      }
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected) {
    return null; // Don't show anything when connected
  }

  return (
    <View className="bg-red-50 border border-red-200 p-4 mx-4 rounded-lg">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-3 h-3 bg-red-500 rounded-full mr-3" />
          <View className="flex-1">
            <Text className="text-red-800 font-medium text-sm">
              No Internet Connection
            </Text>
            <Text className="text-red-600 text-xs mt-1">
              Please check your network settings
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={handleRetry}
          disabled={isChecking}
          className={`px-3 py-2 rounded-lg ${
            isChecking ? 'bg-gray-300' : 'bg-red-600'
          }`}
        >
          <Text className={`text-xs font-medium ${
            isChecking ? 'text-gray-600' : 'text-white'
          }`}>
            {isChecking ? 'Checking...' : 'Retry'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
