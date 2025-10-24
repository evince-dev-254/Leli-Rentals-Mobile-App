import { PrimaryBrand, WhiteBackground } from '@/constants/Colors';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TestOnboardingScreen() {
  const resetOnboarding = () => {
    try {
      localStorage.removeItem('hasSeenOnboarding');
      alert('Onboarding flag reset! App will show onboarding on next restart.');
    } catch (error) {
      alert('Error resetting onboarding flag: ' + error);
    }
  };

  const setOnboardingSeen = () => {
    try {
      localStorage.setItem('hasSeenOnboarding', 'true');
      alert('Onboarding marked as seen! App will skip onboarding on next restart.');
    } catch (error) {
      alert('Error setting onboarding flag: ' + error);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Test Controls</Text>
      <Text style={styles.description}>
        Use these buttons to test onboarding flow
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={resetOnboarding}>
        <Text style={styles.buttonText}>Reset Onboarding (Show Onboarding)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={setOnboardingSeen}>
        <Text style={styles.buttonText}>Mark Onboarding Seen (Skip Onboarding)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={goBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhiteBackground,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: PrimaryBrand,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: PrimaryBrand,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
