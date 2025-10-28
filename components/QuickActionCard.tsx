import {
    Border,
    DarkCard,
    DarkText,
    NatureDarkBorder,
    NatureDarkCard,
    NatureDarkText,
    PrimaryText,
    WhiteBackground
} from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionCardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
  isDark?: boolean;
  theme?: string;
  animatedValue?: any;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  icon,
  color,
  onPress,
  isDark = false,
  theme = 'light',
  animatedValue,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isDark && styles.darkCard,
        theme === 'nature' && styles.natureCard
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="#ffffff" />
      </View>
      <Text style={[
        styles.title,
        isDark && styles.darkText,
        theme === 'nature' && { color: NatureDarkText }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: WhiteBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Border,
    minHeight: 151.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  natureCard: {
    backgroundColor: NatureDarkCard,
    borderColor: NatureDarkBorder,
    backdropFilter: 'blur(10px)',
  },
  darkCard: {
    backgroundColor: DarkCard,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: PrimaryText,
    marginBottom: 4,
    textAlign: 'center',
  },
  darkText: {
    color: DarkText,
  },
});

export default QuickActionCard;
