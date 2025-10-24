import AccountSwitcher from '@/components/AccountSwitcher';
import { useAccount } from '@/contexts/AccountContext';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TestAccountSwitching() {
  const { accountType, verificationStatus } = useAccount();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account Switching Test</Text>
        <Text style={styles.subtitle}>Test switching between renter and owner accounts</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Account Status:</Text>
        <Text style={styles.statusText}>Type: {accountType}</Text>
        <Text style={styles.statusText}>Verification: {verificationStatus}</Text>
      </View>

      <AccountSwitcher 
        onSwitch={() => {
          console.log('Account switched successfully!');
        }}
        showCurrentType={true}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to Test:</Text>
        <Text style={styles.infoText}>1. Tap "Switch to Owner" to become an owner</Text>
        <Text style={styles.infoText}>2. Tap "Switch to Renter" to become a renter</Text>
        <Text style={styles.infoText}>3. Check the status above to confirm the switch</Text>
        <Text style={styles.infoText}>4. The account type is saved automatically</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
});
