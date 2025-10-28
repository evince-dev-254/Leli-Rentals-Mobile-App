import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface AnimatedLoaderProps {
  size?: number;
  color?: string;
  style?: any;
  showPulse?: boolean;
  showDots?: boolean;
}

export default function AnimatedLoader({ 
  size = 60, 
  color = '#d97706', 
  style,
  showPulse = true,
  showDots = true
}: AnimatedLoaderProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const dot1Value = useRef(new Animated.Value(0)).current;
  const dot2Value = useRef(new Animated.Value(0)).current;
  const dot3Value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main rotation animation
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };

    // Pulse animation
    const pulse = () => {
      pulseValue.setValue(1);
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    // Dots animation
    const animateDots = () => {
      const createDotAnimation = (dotValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dotValue, {
              toValue: 1,
              duration: 400,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(dotValue, {
              toValue: 0,
              duration: 400,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        );
      };

      Animated.parallel([
        createDotAnimation(dot1Value, 0),
        createDotAnimation(dot2Value, 200),
        createDotAnimation(dot3Value, 400),
      ]).start();
    };

    spin();
    if (showPulse) pulse();
    if (showDots) animateDots();
  }, [spinValue, pulseValue, dot1Value, dot2Value, dot3Value, showPulse, showDots]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = pulseValue;

  const dot1Opacity = dot1Value.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const dot2Opacity = dot2Value.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const dot3Opacity = dot3Value.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Main loader with gradient effect */}
      <Animated.View
        style={[
          styles.loaderContainer,
          {
            width: size,
            height: size,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Outer ring */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              width: size,
              height: size,
              borderColor: color + '30',
              borderTopColor: color,
              transform: [{ rotate }],
            },
          ]}
        />
        
        {/* Inner ring */}
        <Animated.View
          style={[
            styles.innerRing,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderColor: color + '20',
              borderRightColor: color + '80',
              transform: [{ rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['360deg', '0deg'],
              })}],
            },
          ]}
        />
        
        {/* Center dot */}
        <View style={[styles.centerDot, { backgroundColor: color }]} />
      </Animated.View>

      {/* Animated dots below */}
      {showDots && (
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity, backgroundColor: color }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Opacity, backgroundColor: color }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity, backgroundColor: color }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 4,
    borderRadius: 50,
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 50,
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
