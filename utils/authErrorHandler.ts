import { router } from 'expo-router';

export interface AuthError {
  code: string;
  message: string;
  longMessage?: string;
}

export interface AuthState {
  isSignedIn: boolean;
  user: any;
  accountType: string | null;
  isLoaded: boolean;
}

export interface ErrorNotification {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
  action?: {
    label: string;
    onPress: () => void;
  };
}

export class AuthErrorHandler {
  private static instance: AuthErrorHandler;
  private retryCount = 0;
  private maxRetries = 3;

  static getInstance(): AuthErrorHandler {
    if (!AuthErrorHandler.instance) {
      AuthErrorHandler.instance = new AuthErrorHandler();
    }
    return AuthErrorHandler.instance;
  }

  /**
   * Handle authentication errors with automatic recovery
   */
  handleAuthError(error: any, currentState: AuthState): void {
    console.log('AuthErrorHandler: Handling error:', error);
    console.log('AuthErrorHandler: Current state:', currentState);

    if (error?.clerkError) {
      const errorCode = error.errors?.[0]?.code;
      const errorMessage = error.errors?.[0]?.message;

      switch (errorCode) {
        case 'session_exists':
          this.handleSessionExists(currentState);
          break;
        case 'form_identifier_not_found':
          this.handleUserNotFound();
          break;
        case 'form_password_incorrect':
          this.handleIncorrectPassword();
          break;
        case 'oauth_provider_error':
          this.handleOAuthError();
          break;
        default:
          this.handleGenericError(errorMessage);
      }
    } else {
      this.handleGenericError(error?.message || 'Unknown error');
    }
  }

  /**
   * Handle session exists error - redirect to appropriate screen
   */
  private handleSessionExists(currentState: AuthState): void {
    console.log('AuthErrorHandler: Session exists, redirecting appropriately');
    console.log('AuthErrorHandler: Current state:', currentState);
    
    if (currentState.isSignedIn && currentState.user) {
      // User is signed in, go to dashboard
      if (currentState.accountType) {
        if (currentState.accountType === 'owner') {
          console.log('AuthErrorHandler: Redirecting to owner tabs');
          router.replace('/(owner)');
        } else if (currentState.accountType === 'renter') {
          console.log('AuthErrorHandler: Redirecting to home');
          router.replace('/(owner)');
        } else {
          console.log('AuthErrorHandler: Unknown account type, redirecting to account type selection');
          router.replace('/account-type');
        }
      } else {
        console.log('AuthErrorHandler: No account type, redirecting to account type selection');
        router.replace('/account-type');
      }
    } else {
      // Session exists but state not updated, force refresh
      console.log('AuthErrorHandler: Session exists but state not updated, forcing refresh');
      this.forceAuthRefresh();
    }
  }

  /**
   * Handle user not found error
   */
  private handleUserNotFound(): void {
    console.log('AuthErrorHandler: User not found, redirecting to signup');
    // Show user-friendly message before redirecting
    setTimeout(() => {
      router.replace('/(auth)/signup');
    }, 1000);
  }

  /**
   * Handle incorrect password error
   */
  private handleIncorrectPassword(): void {
    console.log('AuthErrorHandler: Incorrect password, staying on login');
    // Stay on login screen, let user retry
    // The UI will show the error message from Clerk
  }

  /**
   * Handle OAuth errors
   */
  private handleOAuthError(): void {
    console.log('AuthErrorHandler: OAuth error, redirecting to login');
    router.replace('/(auth)/login');
  }

  /**
   * Handle generic errors
   */
  private handleGenericError(message: string): void {
    console.log('AuthErrorHandler: Generic error:', message);
    // For now, redirect to login as fallback
    router.replace('/(auth)/login');
  }

  /**
   * Force authentication state refresh
   */
  private forceAuthRefresh(): void {
    console.log('AuthErrorHandler: Forcing auth refresh');
    // Add a small delay and redirect to tabs to let auth state settle
    setTimeout(() => {
      console.log('AuthErrorHandler: Redirecting to tabs after refresh');
          router.replace('/(renter)');
    }, 1500);
  }

  /**
   * Handle post-authentication routing
   */
  handlePostAuthRouting(authState: AuthState): void {
    console.log('AuthErrorHandler: Handling post-auth routing');
    console.log('AuthErrorHandler: Auth state:', authState);
    
    if (!authState.isLoaded) {
      console.log('AuthErrorHandler: Auth not loaded yet, waiting...');
      return;
    }

    if (authState.isSignedIn && authState.user) {
      console.log('AuthErrorHandler: User authenticated, checking account type');
      
      if (authState.accountType) {
        // User has account type, go to appropriate dashboard
        if (authState.accountType === 'owner') {
          console.log('AuthErrorHandler: Owner user, redirecting to owner tabs');
          router.replace('/(owner)');
        } else if (authState.accountType === 'renter') {
          console.log('AuthErrorHandler: Renter user, redirecting to home');
          router.replace('/(owner)');
        } else {
          console.log('AuthErrorHandler: Unknown account type, redirecting to account type selection');
          router.replace('/account-type');
        }
      } else {
        // User needs to select account type (new users or users without account type)
        console.log('AuthErrorHandler: No account type, redirecting to account type selection');
        router.replace('/account-type');
      }
    } else {
      console.log('AuthErrorHandler: User not authenticated, redirecting to login');
      router.replace('/(auth)/login');
    }
  }

  /**
   * Reset retry count
   */
  resetRetryCount(): void {
    this.retryCount = 0;
  }

  /**
   * Check if we should retry
   */
  shouldRetry(): boolean {
    return this.retryCount < this.maxRetries;
  }

  /**
   * Increment retry count
   */
  incrementRetry(): void {
    this.retryCount++;
  }

  /**
   * Generate user-friendly error notification
   */
  generateErrorNotification(error: any): ErrorNotification {
    if (error?.clerkError) {
      const errorCode = error.errors?.[0]?.code;
      const errorMessage = error.errors?.[0]?.message;

      switch (errorCode) {
        case 'form_identifier_exists':
          return {
            title: 'Email Already Exists',
            message: 'This email address is already registered. Please try signing in instead or use a different email address.',
            type: 'warning',
            action: {
              label: 'Go to Login',
              onPress: () => router.push('/(auth)/login')
            }
          };

        case 'form_identifier_not_found':
          return {
            title: 'Account Not Found',
            message: 'No account found with this email address. Please check your email or sign up for a new account.',
            type: 'warning',
            action: {
              label: 'Sign Up',
              onPress: () => router.push('/(auth)/signup')
            }
          };

        case 'form_password_incorrect':
          return {
            title: 'Incorrect Password',
            message: 'The password you entered is incorrect. Please try again or reset your password.',
            type: 'error'
          };

        case 'form_password_pwned':
          return {
            title: 'Password Not Secure',
            message: 'This password has been found in data breaches. Please choose a stronger, unique password.',
            type: 'error'
          };

        case 'form_password_validation_failed':
          return {
            title: 'Password Requirements',
            message: 'Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.',
            type: 'warning'
          };

        case 'form_identifier_invalid':
          return {
            title: 'Invalid Email',
            message: 'Please enter a valid email address.',
            type: 'warning'
          };

        case 'too_many_requests':
          return {
            title: 'Too Many Attempts',
            message: 'You have made too many attempts. Please wait a few minutes before trying again.',
            type: 'warning'
          };

        case 'session_exists':
          return {
            title: 'Already Signed In',
            message: 'You are already signed in. Redirecting to your account...',
            type: 'success',
            action: {
              label: 'Continue',
              onPress: () => router.replace('/(tabs)')
            }
          };

        case 'form_code_incorrect':
          return {
            title: 'Invalid Code',
            message: 'The verification code you entered is incorrect. Please check and try again.',
            type: 'error'
          };

        case 'form_code_expired':
          return {
            title: 'Code Expired',
            message: 'The verification code has expired. Please request a new one.',
            type: 'warning'
          };

        case 'oauth_provider_error':
          return {
            title: 'OAuth Error',
            message: 'There was an issue with the social login. Please try again or use email/password.',
            type: 'error'
          };

        default:
          return {
            title: 'Authentication Error',
            message: errorMessage || 'An unexpected error occurred. Please try again.',
            type: 'error'
          };
      }
    }

    // Network or other errors
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
        type: 'error'
      };
    }

    // Generic error
    return {
      title: 'Error',
      message: error?.message || 'An unexpected error occurred. Please try again.',
      type: 'error'
    };
  }
}

export const authErrorHandler = AuthErrorHandler.getInstance();
