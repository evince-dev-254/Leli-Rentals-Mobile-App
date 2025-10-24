import { Platform, Dimensions, PixelRatio } from 'react-native';
import { getDeviceSize, isTablet, isSmallDevice, isLargeDevice } from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Device configuration
export const DEVICE_CONFIG = {
  // Screen dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  
  // Device type
  isTablet: isTablet(),
  isSmallDevice: isSmallDevice(),
  isLargeDevice: isLargeDevice(),
  deviceSize: getDeviceSize(),
  
  // Platform
  platform: Platform.OS,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
  
  // Pixel density
  pixelRatio: PixelRatio.get(),
  
  // Safe areas
  safeAreaInsets: {
    top: Platform.OS === 'ios' ? 44 : 24,
    bottom: Platform.OS === 'ios' ? 34 : 16,
    left: 0,
    right: 0,
  },
  
  // Navigation
  navigation: {
    headerHeight: Platform.OS === 'ios' ? 44 : 56,
    tabBarHeight: Platform.OS === 'ios' ? 83 : 60,
  },
  
  // Typography
  typography: {
    baseFontSize: getDeviceSize() === 'small' ? 14 : 16,
    scaleFactor: PixelRatio.getFontScale(),
  },
  
  // Spacing
  spacing: {
    xs: getDeviceSize() === 'small' ? 4 : 8,
    sm: getDeviceSize() === 'small' ? 8 : 12,
    md: getDeviceSize() === 'small' ? 12 : 16,
    lg: getDeviceSize() === 'small' ? 16 : 20,
    xl: getDeviceSize() === 'small' ? 20 : 24,
    xxl: getDeviceSize() === 'small' ? 24 : 32,
  },
  
  // Grid system
  grid: {
    columns: getDeviceSize() === 'small' ? 1 : getDeviceSize() === 'tablet' ? 3 : 2,
    gutter: getDeviceSize() === 'small' ? 8 : 16,
  },
  
  // Touch targets
  touchTargets: {
    minSize: Platform.OS === 'ios' ? 44 : 48,
    padding: getDeviceSize() === 'small' ? 8 : 12,
  },
  
  // Animations
  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: 'ease-in-out',
  },
  
  // Performance
  performance: {
    imageQuality: getDeviceSize() === 'small' ? 0.7 : 0.8,
    lazyLoading: true,
    virtualization: isTablet(),
  },
};

// Device-specific feature flags
export const FEATURE_FLAGS = {
  // Enable features based on device capabilities
  hapticFeedback: Platform.OS === 'ios',
  biometricAuth: Platform.OS === 'ios' || Platform.OS === 'android',
  pushNotifications: true,
  backgroundRefresh: Platform.OS === 'ios',
  deepLinking: true,
  
  // UI features
  blurEffects: Platform.OS === 'ios',
  materialDesign: Platform.OS === 'android',
  adaptiveIcons: Platform.OS === 'android',
  
  // Performance features
  nativeAnimations: true,
  gestureHandling: true,
  keyboardAvoidance: Platform.OS === 'ios',
};

// Accessibility configuration
export const ACCESSIBILITY_CONFIG = {
  // Font scaling
  allowFontScaling: true,
  maxFontScale: 2.0,
  minFontScale: 0.8,
  
  // Touch accessibility
  minTouchTarget: 44,
  touchFeedback: true,
  
  // Screen reader
  screenReaderSupport: true,
  semanticLabels: true,
  
  // High contrast
  highContrastSupport: Platform.OS === 'ios',
  
  // Reduced motion
  respectReducedMotion: true,
};

// Orientation configuration
export const ORIENTATION_CONFIG = {
  supportedOrientations: ['portrait', 'landscape'],
  defaultOrientation: 'portrait',
  
  // Layout adjustments for orientation
  landscape: {
    gridColumns: isTablet() ? 4 : 3,
    headerHeight: 60,
    tabBarHeight: 60,
  },
  
  portrait: {
    gridColumns: getDeviceSize() === 'small' ? 1 : getDeviceSize() === 'tablet' ? 3 : 2,
    headerHeight: Platform.OS === 'ios' ? 44 : 56,
    tabBarHeight: Platform.OS === 'ios' ? 83 : 60,
  },
};

export default DEVICE_CONFIG;
