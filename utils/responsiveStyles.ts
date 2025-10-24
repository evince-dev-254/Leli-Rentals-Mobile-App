import { StyleSheet, Platform } from 'react-native';
import { 
  getFontSize, 
  getSpacing, 
  getResponsiveWidth, 
  getResponsiveHeight,
  getDeviceSize,
  isTablet,
  responsive
} from './responsive';

// Responsive style creators
export const createResponsiveStyles = (baseStyles: any) => {
  const deviceSize = getDeviceSize();
  const isTabletDevice = isTablet();
  
  return StyleSheet.create({
    ...baseStyles,
    // Override with responsive values
    container: {
      ...baseStyles.container,
      paddingHorizontal: getSpacing(baseStyles.container?.paddingHorizontal || 20),
      paddingVertical: getSpacing(baseStyles.container?.paddingVertical || 16),
    },
    text: {
      ...baseStyles.text,
      fontSize: getFontSize(baseStyles.text?.fontSize || 16),
      lineHeight: getFontSize((baseStyles.text?.fontSize || 16) * 1.4),
    },
    title: {
      ...baseStyles.title,
      fontSize: getFontSize(baseStyles.title?.fontSize || 24),
      lineHeight: getFontSize((baseStyles.title?.fontSize || 24) * 1.2),
    },
    button: {
      ...baseStyles.button,
      paddingHorizontal: getSpacing(baseStyles.button?.paddingHorizontal || 16),
      paddingVertical: getSpacing(baseStyles.button?.paddingVertical || 12),
      borderRadius: getSpacing(baseStyles.button?.borderRadius || 8),
    },
    input: {
      ...baseStyles.input,
      paddingHorizontal: getSpacing(baseStyles.input?.paddingHorizontal || 12),
      paddingVertical: getSpacing(baseStyles.input?.paddingVertical || 12),
      fontSize: getFontSize(baseStyles.input?.fontSize || 16),
      borderRadius: getSpacing(baseStyles.input?.borderRadius || 8),
    },
    card: {
      ...baseStyles.card,
      padding: getSpacing(baseStyles.card?.padding || 16),
      margin: getSpacing(baseStyles.card?.margin || 8),
      borderRadius: getSpacing(baseStyles.card?.borderRadius || 12),
    },
  });
};

// Common responsive styles
export const responsiveStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    paddingHorizontal: getSpacing(20),
  },
  
  // Safe area container
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  
  // Text styles
  h1: {
    fontSize: getFontSize(32),
    fontWeight: 'bold',
    lineHeight: getFontSize(40),
  },
  
  h2: {
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    lineHeight: getFontSize(30),
  },
  
  h3: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    lineHeight: getFontSize(26),
  },
  
  body: {
    fontSize: getFontSize(16),
    lineHeight: getFontSize(22),
  },
  
  caption: {
    fontSize: getFontSize(14),
    lineHeight: getFontSize(18),
  },
  
  small: {
    fontSize: getFontSize(12),
    lineHeight: getFontSize(16),
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: getSpacing(24),
    paddingVertical: getSpacing(16),
    borderRadius: getSpacing(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingHorizontal: getSpacing(24),
    paddingVertical: getSpacing(16),
    borderRadius: getSpacing(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: getSpacing(12),
    paddingHorizontal: getSpacing(16),
    paddingVertical: getSpacing(14),
    fontSize: getFontSize(16),
    backgroundColor: '#FFFFFF',
  },
  
  // Card styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(16),
    padding: getSpacing(20),
    marginVertical: getSpacing(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Grid styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  gridItem: {
    width: responsive({
      small: '100%',
      medium: '48%',
      large: '48%',
      tablet: '31%',
      xlarge: '31%',
    }) as any,
    marginBottom: getSpacing(16),
  },
  
  // List styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getSpacing(16),
    paddingHorizontal: getSpacing(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getSpacing(20),
  },
  
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(20),
    padding: getSpacing(24),
    width: '100%',
    maxWidth: getResponsiveWidth(90),
    maxHeight: getResponsiveHeight(80),
  },
  
  // Tab styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingBottom: getSpacing(Platform.OS === 'ios' ? 34 : 16),
    paddingTop: getSpacing(8),
  },
  
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: getSpacing(8),
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  
  // Status bar styles
  statusBar: {
    height: Platform.OS === 'ios' ? 44 : 24,
    backgroundColor: '#FFFFFF',
  },
});

export default responsiveStyles;
