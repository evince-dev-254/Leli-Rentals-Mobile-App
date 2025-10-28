import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface VersionUpdaterProps {
  children: React.ReactNode;
}

export default function VersionUpdater({ children }: VersionUpdaterProps) {
  const [currentVersion, setCurrentVersion] = useState('1.0.0');

  useEffect(() => {
    checkForUpdatesAndUpdateVersion();
  }, []);

  const checkForUpdatesAndUpdateVersion = async () => {
    try {
      if (__DEV__) {
        // Skip in development
        return;
      }

      // Check if this is a new update
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        // Download and install the update
        await Updates.fetchUpdateAsync();
        
        // Update version to 1.0.1 after successful update
        await updateVersionTo101();
        
        // Reload the app
        await Updates.reloadAsync();
      } else {
        // Check if we need to update version locally
        await checkAndUpdateVersion();
      }
    } catch (error) {
      console.log('Error checking for updates:', error);
    }
  };

  const updateVersionTo101 = async () => {
    try {
      // Store the new version
      await AsyncStorage.setItem('app_version', '1.0.1');
      setCurrentVersion('1.0.1');
      
      // Show update success message
      Alert.alert(
        'Update Complete!',
        'App has been updated to version 1.0.1 with new features and improvements.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('Error updating version:', error);
    }
  };

  const checkAndUpdateVersion = async () => {
    try {
      const storedVersion = await AsyncStorage.getItem('app_version');
      if (storedVersion && storedVersion !== currentVersion) {
        setCurrentVersion(storedVersion);
      }
    } catch (error) {
      console.log('Error checking stored version:', error);
    }
  };

  return <>{children}</>;
}
