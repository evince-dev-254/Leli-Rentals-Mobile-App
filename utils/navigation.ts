import { router } from 'expo-router';

export const safeGoBack = (fallbackRoute: '/onboarding' = '/onboarding') => {
  try {
    // Try to go back, but if there's no previous screen, navigate to fallback
    router.back();
  } catch (error) {
    // If going back fails, navigate to the fallback route
    router.push(fallbackRoute);
  }
};

export const navigateToOnboarding = () => {
  router.push('/onboarding');
};

export const navigateToLogin = () => {
  router.push('/login');
};

export const navigateToSignup = () => {
  router.push('/signup');
};

export const navigateToMainApp = () => {
  router.replace('/(tabs)');
};
