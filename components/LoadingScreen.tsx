import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnhancedLoader from './EnhancedLoader';
import { Background, WhiteBackground } from '@/constants/Colors';

interface LoadingScreenProps {
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'bounce';
  color?: string;
  size?: number;
  isDark?: boolean;
}

export default function LoadingScreen({ 
  text = 'Loading...',
  variant = 'spinner',
  color = '#d97706',
  size = 80,
  isDark = false
}: LoadingScreenProps) {
  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.content}>
        <EnhancedLoader 
          size={size}
          color={color}
          variant={variant}
          text={text}
          showText={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
