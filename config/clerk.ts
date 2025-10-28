// Clerk configuration
export const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

// Clerk configuration object
export const clerkConfig = {
  publishableKey: CLERK_PUBLISHABLE_KEY,
  // Token cache is handled in the ClerkProvider component
  // Add other Clerk configuration options here as needed
  // For example:
  // appearance: {
  //   theme: 'light',
  //   variables: {
  //     colorPrimary: '#3b82f6',
  //   },
  // },
};

// Validate that the publishable key is set
if (!CLERK_PUBLISHABLE_KEY) {
  console.warn('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Please add it to your environment variables.');
}
