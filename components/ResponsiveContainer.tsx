import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  getDeviceSize, 
  isTablet, 
  getSpacing, 
  getResponsiveWidth,
  getResponsiveHeight 
} from '@/utils/responsive';
import { DEVICE_CONFIG } from '@/config/device';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: any;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  safeArea?: boolean;
  padding?: number;
  backgroundColor?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  scrollable = false,
  keyboardAvoiding = false,
  safeArea = true,
  padding,
  backgroundColor = '#FFFFFF',
}) => {
  const deviceSize = getDeviceSize();
  const isTabletDevice = isTablet();
  
  const containerStyle = {
    flex: 1,
    backgroundColor,
    paddingHorizontal: padding !== undefined ? getSpacing(padding) : getSpacing(20),
    paddingVertical: getSpacing(16),
    ...style,
  };

  const content = (
    <View style={containerStyle}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {content}
      </ScrollView>
    );
  }

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  if (safeArea) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
};

export default ResponsiveContainer;
