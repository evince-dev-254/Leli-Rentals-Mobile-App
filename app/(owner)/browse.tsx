import {
    Background,
    Border,
    PrimaryText,
    SecondaryText,
    WhiteBackground
} from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OwnerBrowseScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Items</Text>
        <Text style={styles.headerSubtitle}>Discover items you can rent for your business</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.message}>
          This is the owner's browse page. You can view available items to rent for your business needs.
        </Text>
      </View>
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
  headerSubtitle: {
    fontSize: 14,
    color: SecondaryText,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: SecondaryText,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default OwnerBrowseScreen;
