import { Stack } from 'expo-router';

export default function RenterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="browse" />
      <Stack.Screen name="my-bookings" />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="listing-detail" />
      <Stack.Screen name="contact-owner" />
      <Stack.Screen name="write-review" />
      <Stack.Screen name="payment-completion" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="billing" />
      <Stack.Screen name="help" />
    </Stack>
  );
}