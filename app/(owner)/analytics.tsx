import {
    Background,
    Border,
    PrimaryText,
    SecondaryText,
    WhiteBackground
} from '@/constants/Colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnalyticsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.cardText}>
            Analytics dashboard will be available soon. Track your rental performance, earnings, and customer insights.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: WhiteBackground,
    borderBottomWidth: 1,
    borderBottomColor: Border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PrimaryText,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: WhiteBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PrimaryText,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default AnalyticsScreen;
