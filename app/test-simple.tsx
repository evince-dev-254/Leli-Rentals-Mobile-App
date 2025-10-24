import { StyleSheet, Text, View } from 'react-native';

export default function TestSimple() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World - App is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#000',
  },
});
