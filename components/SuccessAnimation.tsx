import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface SuccessAnimationProps {
  onComplete?: () => void;
  message?: string;
}

export default function SuccessAnimation({ 
  onComplete, 
  message = 'Success!' 
}: SuccessAnimationProps) {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the circle scaling up
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Then animate the checkmark appearing
      Animated.timing(checkmarkOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Call onComplete after animation
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      });
    });
  }, [scaleValue, checkmarkOpacity, onComplete]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.checkmark,
            {
              opacity: checkmarkOpacity,
            },
          ]}
        >
          ✓
        </Animated.Text>
      </Animated.View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkmark: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});
