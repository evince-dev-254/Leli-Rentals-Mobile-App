// Captivating Alert Colors for Leli Rentals
export const AlertColors = {
  // Success Alerts - Vibrant Green
  success: {
    background: '#10b981',
    text: '#ffffff',
    border: '#059669',
    shadow: '#10b981',
    icon: '#ffffff',
  },
  
  // Error Alerts - Vibrant Red
  error: {
    background: '#ef4444',
    text: '#ffffff',
    border: '#dc2626',
    shadow: '#ef4444',
    icon: '#ffffff',
  },
  
  // Warning Alerts - Vibrant Orange
  warning: {
    background: '#f59e0b',
    text: '#ffffff',
    border: '#d97706',
    shadow: '#f59e0b',
    icon: '#ffffff',
  },
  
  // Info Alerts - Vibrant Blue
  info: {
    background: '#3b82f6',
    text: '#ffffff',
    border: '#2563eb',
    shadow: '#3b82f6',
    icon: '#ffffff',
  },
  
  // Primary Brand - Amber
  primary: {
    background: '#d97706',
    text: '#ffffff',
    border: '#b45309',
    shadow: '#d97706',
    icon: '#ffffff',
  },
  
  // Secondary - Purple
  secondary: {
    background: '#8b5cf6',
    text: '#ffffff',
    border: '#7c3aed',
    shadow: '#8b5cf6',
    icon: '#ffffff',
  },
  
  // Dark Mode Support
  dark: {
    background: '#1f2937',
    text: '#ffffff',
    border: '#374151',
    shadow: '#000000',
    icon: '#ffffff',
  }
};

// Alert Style Generator
export const getAlertStyle = (type: keyof typeof AlertColors) => {
  const colors = AlertColors[type];
  return {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  };
};

// Text Style Generator
export const getAlertTextStyle = (type: keyof typeof AlertColors) => {
  const colors = AlertColors[type];
  return {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center' as const,
  };
};

// Icon Style Generator
export const getAlertIconStyle = (type: keyof typeof AlertColors) => {
  const colors = AlertColors[type];
  return {
    color: colors.icon,
    size: 24,
  };
};
