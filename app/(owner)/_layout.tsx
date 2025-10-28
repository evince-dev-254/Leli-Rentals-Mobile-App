import { Stack } from 'expo-router';

export default function OwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="browse" />
      <Stack.Screen name="my-listings" />
      <Stack.Screen name="create-listing" />
      <Stack.Screen name="booking-calendar" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="listing-detail" />
      <Stack.Screen name="owner-listings" />
      <Stack.Screen name="owner-preview" />
      <Stack.Screen name="owner-verification" />
      <Stack.Screen name="payment-completion" />
      <Stack.Screen name="write-review" />
      <Stack.Screen name="contact-owner" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="billing" />
      <Stack.Screen name="help" />
      <Stack.Screen name="categories" />
    </Stack>
  );
}