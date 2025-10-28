import { Alert } from 'react-native';

export interface NotificationOptions {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
}

export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Show a notification alert
   */
  showNotification(options: NotificationOptions): void {
    const { title, message, type, action } = options;

    // Create buttons array
    const buttons: any[] = [];

    if (action) {
      buttons.push({
        text: action.label,
        onPress: action.onPress,
        style: type === 'error' ? 'destructive' : 'default'
      });
    }

    buttons.push({
      text: 'OK',
      style: type === 'success' ? 'default' : 'cancel'
    });

    // Show the alert
    Alert.alert(title, message, buttons, { cancelable: true });
  }

  /**
   * Show error notification
   */
  showError(title: string, message: string, action?: { label: string; onPress: () => void }): void {
    this.showNotification({
      title,
      message,
      type: 'error',
      action
    });
  }

  /**
   * Show warning notification
   */
  showWarning(title: string, message: string, action?: { label: string; onPress: () => void }): void {
    this.showNotification({
      title,
      message,
      type: 'warning',
      action
    });
  }

  /**
   * Show success notification
   */
  showSuccess(title: string, message: string, action?: { label: string; onPress: () => void }): void {
    this.showNotification({
      title,
      message,
      type: 'success',
      action
    });
  }

  /**
   * Show info notification
   */
  showInfo(title: string, message: string, action?: { label: string; onPress: () => void }): void {
    this.showNotification({
      title,
      message,
      type: 'info',
      action
    });
  }

  /**
   * Show network error notification
   */
  showNetworkError(): void {
    this.showError(
      'Network Error',
      'Please check your internet connection and try again.'
    );
  }

  /**
   * Show authentication error notification
   */
  showAuthError(error: any): void {
    if (error?.clerkError) {
      const errorCode = error.errors?.[0]?.code;
      const errorMessage = error.errors?.[0]?.message;

      switch (errorCode) {
        case 'form_identifier_exists':
          this.showWarning(
            'Email Already Exists',
            'This email address is already registered. Please try signing in instead or use a different email address.',
            {
              label: 'Go to Login',
              onPress: () => {
                // This would need to be handled by the calling component
                console.log('Redirect to login');
              }
            }
          );
          break;

        case 'form_identifier_not_found':
          this.showWarning(
            'Account Not Found',
            'No account found with this email address. Please check your email or sign up for a new account.',
            {
              label: 'Sign Up',
              onPress: () => {
                console.log('Redirect to signup');
              }
            }
          );
          break;

        case 'form_password_incorrect':
          this.showError(
            'Incorrect Password',
            'The password you entered is incorrect. Please try again or reset your password.'
          );
          break;

        case 'form_password_pwned':
          this.showError(
            'Password Not Secure',
            'This password has been found in data breaches. Please choose a stronger, unique password.'
          );
          break;

        case 'too_many_requests':
          this.showWarning(
            'Too Many Attempts',
            'You have made too many attempts. Please wait a few minutes before trying again.'
          );
          break;

        default:
          this.showError(
            'Authentication Error',
            errorMessage || 'An unexpected error occurred. Please try again.'
          );
      }
    } else {
      this.showError(
        'Error',
        error?.message || 'An unexpected error occurred. Please try again.'
      );
    }
  }
}

export const notificationService = NotificationService.getInstance();