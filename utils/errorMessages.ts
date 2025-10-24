// Firebase error code to user-friendly message mapping
export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    // Authentication errors
    case 'auth/user-not-found':
      return "We couldn't find an account with this email address. Please check your email or sign up for a new account.";
    
    case 'auth/wrong-password':
      return "The password you entered is incorrect. Please try again or use 'Forgot Password' to reset it.";
    
    case 'auth/invalid-email':
      return "Please enter a valid email address.";
    
    case 'auth/user-disabled':
      return "This account has been disabled. Please contact support for assistance.";
    
    case 'auth/too-many-requests':
      return "Too many failed attempts. Please wait a moment before trying again.";
    
    case 'auth/email-already-in-use':
      return "An account with this email already exists. Please try signing in instead.";
    
    case 'auth/weak-password':
      return "Please choose a stronger password with at least 6 characters.";
    
    case 'auth/invalid-credential':
      return "The email or password you entered is incorrect. Please check your details and try again.";
    
    case 'auth/network-request-failed':
      return "Please check your internet connection and try again.";
    
    case 'auth/operation-not-allowed':
      return "This sign-in method is not enabled. Please contact support.";
    
    // Default fallback
    default:
      return "Something went wrong. Please try again in a moment.";
  }
};

// Get a calm, friendly error message for any error
export const getCalmErrorMessage = (error: any): string => {
  if (error?.code) {
    return getFirebaseErrorMessage(error.code);
  }
  
  if (error?.message) {
    // If it's already a user-friendly message, return it
    if (error.message.includes('Please') || error.message.includes('Try')) {
      return error.message;
    }
  }
  
  return "We're having trouble connecting. Please try again in a moment.";
};
