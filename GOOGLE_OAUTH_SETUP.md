# Google OAuth Setup Guide

This guide will help you set up Google Sign-In authentication for your Leli Rentals app.

## Current Status

✅ **Packages Installed** - `expo-auth-session` and `expo-web-browser` are now installed
⚠️ **Google OAuth Configuration Required** - You need to configure your Google OAuth credentials to enable Google Sign-In

## Prerequisites

- Google Cloud Console account
- Firebase project set up
- Expo development environment

## Step 1: Google Cloud Console Setup

### 1.1 Create or Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 1.2 Enable Required APIs
1. Go to "APIs & Services" > "Library"
2. Search for and enable:
   - Google+ API
   - Google Sign-In API
   - Google Identity API

### 1.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have Google Workspace)
3. Fill in the required information:
   - App name: "Leli Rentals"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`

## Step 2: Create OAuth 2.0 Credentials

### 2.1 Create Web Application Credential
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Name: "Leli Rentals Web Client"
5. Add authorized redirect URIs:
   - `https://auth.expo.io/@your-expo-username/your-app-slug`
   - Replace `your-expo-username` with your Expo username
   - Replace `your-app-slug` with your app slug
6. Save and copy the Client ID

### 2.2 Create Android Credential (for production)
1. Create another OAuth 2.0 Client ID
2. Choose "Android"
3. Name: "Leli Rentals Android"
4. Package name: Your app's package name (e.g., `com.leli.rentals`)
5. SHA-1 certificate fingerprint: Get from your keystore
6. Save and copy the Client ID

### 2.3 Create iOS Credential (for production)
1. Create another OAuth 2.0 Client ID
2. Choose "iOS"
3. Name: "Leli Rentals iOS"
4. Bundle ID: Your app's bundle ID (e.g., `com.leli.rentals`)
5. Save and copy the Client ID

## Step 3: Update Configuration Files

### 3.1 Update Google Config
Edit `config/google.ts`:

```typescript
export const GOOGLE_CONFIG = {
  CLIENT_ID: 'your-web-client-id-here', // From Step 2.1
  WEB_CLIENT_ID: 'your-web-client-id-here', // Same as above for development
  REDIRECT_URI: 'https://auth.expo.io/@your-expo-username/your-app-slug',
};
```

### 3.2 Update Firebase Config (if needed)
Make sure your `config/firebase.ts` has the correct Firebase project configuration.

## Step 4: Test the Implementation

### 4.1 Development Testing
1. Run your Expo app: `npm start`
2. Test Google Sign-In on both login and signup screens
3. Check that users are properly authenticated with Firebase

### 4.2 Production Considerations
- Use platform-specific client IDs for production builds
- Configure proper redirect URIs for your production domain
- Test on both Android and iOS devices

## Step 5: Troubleshooting

### Common Issues:

1. **"Invalid client" error**
   - Check that your client ID is correct
   - Ensure the redirect URI matches exactly

2. **"Redirect URI mismatch" error**
   - Verify the redirect URI in Google Console matches your app's URI
   - For Expo, use: `https://auth.expo.io/@your-expo-username/your-app-slug`

3. **"Access blocked" error**
   - Check OAuth consent screen configuration
   - Ensure all required scopes are added

4. **Firebase authentication fails**
   - Verify Firebase project is correctly configured
   - Check that Google Sign-In is enabled in Firebase Console

### Debug Steps:
1. Check browser console for OAuth errors
2. Verify client ID and redirect URI
3. Test with different Google accounts
4. Check Firebase Authentication logs

## Step 6: Security Best Practices

1. **Never commit client IDs to public repositories**
2. **Use environment variables for production**
3. **Implement proper error handling**
4. **Validate user data on the server side**
5. **Use HTTPS for all OAuth redirects**

## Environment Variables

For production, use environment variables:

```bash
# .env.local
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id-here
```

Then update `config/google.ts`:

```typescript
export const GOOGLE_CONFIG = {
  CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'fallback-client-id',
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'fallback-web-client-id',
  REDIRECT_URI: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI || 'fallback-redirect-uri',
};
```

## Support

If you encounter issues:
1. Check the [Expo AuthSession documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
2. Review [Firebase Auth documentation](https://firebase.google.com/docs/auth)
3. Check [Google OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2)
