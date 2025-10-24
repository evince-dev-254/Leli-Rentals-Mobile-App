# Firebase Authentication Setup

This project has been configured with Firebase Authentication using environment variables for better security and configuration management.

## Firebase Configuration

The Firebase configuration has been set up in `config/firebase.ts` and `config/environment.ts` with the following credentials:

- **API Key**: AIzaSyDzv5FX8AECAsA0a2--XpMD8GK5NOP1Rhg
- **Auth Domain**: leli-rentals-52a08.firebaseapp.com
- **Project ID**: leli-rentals-52a08
- **Storage Bucket**: leli-rentals-52a08.firebasestorage.app
- **Messaging Sender ID**: 220739389697
- **App ID**: 1:220739389697:web:701c8d4141b29d88a13300

## Features Implemented

### Authentication Context (`contexts/AuthContext.tsx`)
- User authentication state management
- Sign in with email/password
- Sign up with email/password
- Password reset functionality
- User logout
- Real-time auth state changes

### Authentication Guard (`components/AuthGuard.tsx`)
- Protects authenticated routes
- Redirects unauthenticated users to login
- Loading state management

### Updated Screens
- **Login Screen**: Now uses Firebase authentication
- **Signup Screen**: Creates Firebase user accounts
- **Forgot Password**: Sends password reset emails via Firebase
- **Profile Screen**: Added logout functionality
- **Tab Layout**: Protected with authentication guard

## Environment Variables

The Firebase configuration is now properly managed through environment variables using the `NEXT_PUBLIC_` prefix format:

### Configuration Files
- `config/firebase.ts` - Firebase initialization with environment variable support
- `env.local.template` - Template file showing the required environment variables
- `app.json` - Expo configuration with Firebase credentials in `extra` section

### Environment Variable Priority
1. **Environment Variables** (NEXT_PUBLIC_* from .env.local file) - Highest priority
2. **Expo Constants** (from app.json extra section) - Medium priority
3. **Fallback values** (hardcoded for development) - Lowest priority

### Setting Up Environment Variables

1. **Create `.env.local` file** in the `rentals` directory
2. **Copy the contents** from `env.local.template` to `.env.local`
3. **The app will automatically** use these environment variables

## Installation

To complete the setup, you need to install the Firebase SDK:

```bash
cd rentals
npm install firebase
```

## Usage

The authentication system is now fully integrated:

1. **Sign Up**: Users can create accounts with email/password
2. **Sign In**: Users can log in with their credentials
3. **Password Reset**: Users can reset their passwords via email
4. **Protected Routes**: Main app tabs are protected and require authentication
5. **Logout**: Users can logout from the profile screen

## Firebase Console

Make sure to enable the following in your Firebase Console:

1. **Authentication** → **Sign-in method** → Enable "Email/Password"
2. **Authentication** → **Users** → View and manage users
3. **Authentication** → **Templates** → Configure email templates for password reset

## Security Notes

- Firebase handles password hashing and security automatically
- User sessions are managed by Firebase
- Authentication state persists across app restarts
- All authentication operations are secure and follow Firebase best practices
