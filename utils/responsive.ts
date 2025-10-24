import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Device type detection
export const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  }
  
  return adjustedWidth >= 1920 && adjustedHeight >= 1080;
};

export const isSmallDevice = () => SCREEN_WIDTH < 375;
export const isLargeDevice = () => SCREEN_WIDTH > 414;
export const isXLargeDevice = () => SCREEN_WIDTH > 768;

// Screen size categories
export const getDeviceSize = () => {
  if (isTablet()) return 'tablet';
  if (isXLargeDevice()) return 'xlarge';
  if (isLargeDevice()) return 'large';
  if (isSmallDevice()) return 'small';
  return 'medium';
};

// Responsive dimensions
export const getResponsiveWidth = (percentage: number) => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const getResponsiveHeight = (percentage: number) => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

// Font scaling
export const getFontScale = () => {
  const deviceSize = getDeviceSize();
  const baseScale = PixelRatio.getFontScale();
  
  switch (deviceSize) {
    case 'small':
      return Math.max(0.8, baseScale);
    case 'tablet':
      return Math.max(1.2, baseScale);
    case 'xlarge':
      return Math.max(1.4, baseScale);
    default:
      return Math.max(1.0, baseScale);
  }
};

// Responsive font sizes
export const getFontSize = (size: number) => {
  const scale = getFontScale();
  const deviceSize = getDeviceSize();
  
  let multiplier = 1;
  switch (deviceSize) {
    case 'small':
      multiplier = 0.9;
      break;
    case 'tablet':
      multiplier = 1.2;
      break;
    case 'xlarge':
      multiplier = 1.4;
      break;
  }
  
  return Math.round(size * scale * multiplier);
};

// Responsive spacing
export const getSpacing = (baseSpacing: number) => {
  const deviceSize = getDeviceSize();
  
  switch (deviceSize) {
    case 'small':
      return baseSpacing * 0.8;
    case 'tablet':
      return baseSpacing * 1.3;
    case 'xlarge':
      return baseSpacing * 1.5;
    default:
      return baseSpacing;
  }
};

// Grid system
export const getGridColumns = () => {
  const deviceSize = getDeviceSize();
  
  switch (deviceSize) {
    case 'small':
      return 1;
    case 'medium':
    case 'large':
      return 2;
    case 'tablet':
    case 'xlarge':
      return 3;
    default:
      return 2;
  }
};

// Safe area helpers
export const getSafeAreaInsets = () => {
  const deviceSize = getDeviceSize();
  
  return {
    top: deviceSize === 'small' ? 20 : 44,
    bottom: deviceSize === 'small' ? 20 : 34,
    left: 0,
    right: 0,
  };
};

// Orientation helpers
export const isLandscape = () => SCREEN_WIDTH > SCREEN_HEIGHT;
export const isPortrait = () => SCREEN_HEIGHT > SCREEN_WIDTH;

// Platform-specific adjustments
export const getPlatformAdjustments = () => {
  return {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
    statusBarHeight: Platform.OS === 'ios' ? 44 : 24,
  };
};

// Breakpoints
export const BREAKPOINTS = {
  small: 375,
  medium: 414,
  large: 768,
  xlarge: 1024,
  tablet: 1024,
} as const;

// Responsive value function
export const responsive = <T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  xlarge?: T;
}): T => {
  const deviceSize = getDeviceSize();
  return values[deviceSize] || values.medium || values.small || Object.values(values)[0];
};

export default {
  isTablet,
  isSmallDevice,
  isLargeDevice,
  isXLargeDevice,
  getDeviceSize,
  getResponsiveWidth,
  getResponsiveHeight,
  getFontScale,
  getFontSize,
  getSpacing,
  getGridColumns,
  getSafeAreaInsets,
  isLandscape,
  isPortrait,
  getPlatformAdjustments,
  responsive,
  BREAKPOINTS,
};
