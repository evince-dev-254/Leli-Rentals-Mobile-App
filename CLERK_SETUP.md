# Clerk Authentication Setup

This guide shows how to set up Clerk authentication in your Leli Rentals app.

## Installation

First, install the Clerk Expo package:

```bash
npm install @clerk/clerk-expo
```

## Environment Variables

Add your Clerk publishable key to your environment variables:

### For Development (.env.local)
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
```

### For Production
Set the environment variable in your deployment platform (Netlify, Vercel, etc.):
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_live_clerk_publishable_key_here
```

## Configuration

The ClerkProvider has been added to your root layout (`app/_layout.tsx`) and will wrap your entire app with secure token caching:

```tsx
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { clerkConfig } from '@/config/clerk';

export default function RootLayout() {
  return (
    <ClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      tokenCache={tokenCache}
    >
      {/* Your existing providers and app content */}
    </ClerkProvider>
  );
}
```

### Token Cache Benefits:
- **Secure Storage**: Tokens are stored securely using Expo SecureStore
- **Automatic Persistence**: User sessions persist across app restarts
- **Performance**: Faster authentication state restoration
- **Security**: Tokens are encrypted and stored safely

## Route Protection

Your auth routes are now protected with a dedicated layout:

### **Auth Route Group (`app/(auth)/_layout.tsx`)**
```tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={'/'} />;
  }

  return <Stack />;
}
```

### **Protected Auth Routes:**
- `app/(auth)/login.tsx` - Sign in page
- `app/(auth)/signup.tsx` - Sign up page  
- `app/(auth)/forgot-password.tsx` - Password reset page

### **How It Works:**
- ✅ **Automatic Redirect**: Signed-in users are redirected to home
- ✅ **Route Protection**: Auth screens only accessible when not signed in
- ✅ **Clean Navigation**: Proper route structure with auth group

## Usage

Now you can use Clerk hooks and components throughout your app:

### Authentication Hooks
```tsx
import { useAuth, useUser, useSignIn, useSignUp } from '@clerk/clerk-expo';

function MyComponent() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  
  // Your component logic
}
```

### Authentication Components
```tsx
import { SignIn, SignUp, UserButton } from '@clerk/clerk-expo';

function AuthScreen() {
  return (
    <View>
      <SignIn />
      <SignUp />
      <UserButton />
    </View>
  );
}
```

## Integration with Existing Auth

Your app currently uses Firebase Auth. You can:

1. **Keep both systems** - Use Clerk for new features, Firebase for existing functionality
2. **Migrate gradually** - Replace Firebase Auth with Clerk over time
3. **Use Clerk only** - Replace all Firebase Auth with Clerk

## Next Steps

1. Get your Clerk publishable key from [clerk.com](https://clerk.com)
2. Add it to your environment variables
3. Test authentication in your app
4. Consider migrating your existing Firebase Auth to Clerk

## Benefits of Clerk

- **Pre-built UI components** - SignIn, SignUp, UserButton
- **Social authentication** - Google, GitHub, etc.
- **User management** - Built-in user profiles and management
- **Security** - Enterprise-grade security features
- **Analytics** - Built-in authentication analytics
