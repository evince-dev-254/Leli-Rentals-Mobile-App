import React from 'react';
import { Image } from 'expo-image';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { PrimaryBrand, WhiteBackground, PrimaryText, SecondaryText } from '@/constants/Colors';

interface ThemeAwareLogoProps {
  size?: number;
  style?: any;
  showText?: boolean;
  variant?: 'default' | 'compact' | 'full';
}

const ThemeAwareLogo: React.FC<ThemeAwareLogoProps> = ({ 
  size = 120, 
  style, 
  showText = false,
  variant = 'default'
}) => {
  const colorScheme = useColorScheme();
  
  // Use black logo for light theme, white logo for dark theme
  const logoSource = colorScheme === 'dark' 
    ? require('@/assets/images/default-monochrome-white.svg')
    : require('@/assets/images/default-monochrome-black.png');

  const logoSize = variant === 'compact' ? size * 0.6 : size;
  const textSize = variant === 'compact' ? size * 0.3 : size * 0.4;

  if (variant === 'full' && showText) {
    return (
      <View style={[styles.fullLogoContainer, { width: size * 1.5, height: size }]}>
        <Image
          source={logoSource}
          style={[{ width: logoSize, height: logoSize }, styles.logoImage]}
          contentFit="contain"
        />
        <View style={styles.textContainer}>
          <Text style={[styles.brandName, { fontSize: textSize, color: colorScheme === 'dark' ? WhiteBackground : PrimaryText }]}>
            Leli Rentals
          </Text>
          <Text style={[styles.tagline, { fontSize: textSize * 0.4, color: colorScheme === 'dark' ? SecondaryText : SecondaryText }]}>
            Your Rental Marketplace
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.logoContainer, style]}>
      <Image
        source={logoSource}
        style={[{ width: logoSize, height: logoSize }]}
        contentFit="contain"
      />
      {showText && variant !== 'full' && (
        <Text style={[styles.brandName, { fontSize: textSize, color: colorScheme === 'dark' ? WhiteBackground : PrimaryText }]}>
          Leli Rentals
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  brandName: {
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  tagline: {
    fontWeight: '400',
    opacity: 0.8,
  },
});

export default ThemeAwareLogo;
