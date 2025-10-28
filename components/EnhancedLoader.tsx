import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

interface EnhancedLoaderProps {
  size?: number;
  color?: string;
  style?: any;
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'bounce';
  text?: string;
  showText?: boolean;
}

export default function EnhancedLoader({ 
  size = 60, 
  color = '#d97706', 
  style,
  variant = 'spinner',
  text = 'Loading...',
  showText = true
}: EnhancedLoaderProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const waveValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const dotValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const startAnimations = () => {
      // Spinner animation
      const spin = () => {
        spinValue.setValue(0);
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => spin());
      };

      // Pulse animation
      const pulse = () => {
        pulseValue.setValue(1);
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.3,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };

      // Wave animation
      const wave = () => {
        waveValue.setValue(0);
        Animated.timing(waveValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }).start(() => wave());
      };

      // Bounce animation
      const bounce = () => {
        bounceValue.setValue(0);
        Animated.sequence([
          Animated.timing(bounceValue, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.bounce),
            useNativeDriver: true,
          }),
          Animated.timing(bounceValue, {
            toValue: 0,
            duration: 600,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start(() => bounce());
      };

      // Dots animation
      const animateDots = () => {
        const createDotAnimation = (dotValue: Animated.Value, delay: number) => {
          return Animated.loop(
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(dotValue, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(dotValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
              }),
            ])
          );
        };

        Animated.parallel([
          createDotAnimation(dotValues[0], 0),
          createDotAnimation(dotValues[1], 100),
          createDotAnimation(dotValues[2], 200),
          createDotAnimation(dotValues[3], 300),
          createDotAnimation(dotValues[4], 400),
        ]).start();
      };

      // Start appropriate animation based on variant
      switch (variant) {
        case 'spinner':
          spin();
          break;
        case 'pulse':
          pulse();
          break;
        case 'wave':
          wave();
          break;
        case 'bounce':
          bounce();
          break;
        case 'dots':
          animateDots();
          break;
        default:
          spin();
      }
    };

    startAnimations();
  }, [variant, spinValue, pulseValue, waveValue, bounceValue, dotValues]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = pulseValue;
  const bounceScale = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const waveTranslateY = waveValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const renderSpinner = () => (
    <View style={[styles.spinnerContainer, { width: size, height: size }]}>
      {/* Outer rotating ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderColor: color + '15',
            borderTopColor: color,
            borderRightColor: color + '80',
            transform: [{ rotate }],
          },
        ]}
      />
      
      {/* Middle ring - counter rotation */}
      <Animated.View
        style={[
          styles.middleRing,
          {
            width: size * 0.75,
            height: size * 0.75,
            borderColor: color + '10',
            borderBottomColor: color + '60',
            borderLeftColor: color + '40',
            transform: [{ rotate: spinValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['360deg', '0deg'],
            })}],
          },
        ]}
      />
      
      {/* Inner ring - same direction as outer */}
      <Animated.View
        style={[
          styles.innerRing,
          {
            width: size * 0.5,
            height: size * 0.5,
            borderColor: color + '05',
            borderTopColor: color + '90',
            borderRightColor: color + '30',
            transform: [{ rotate }],
          },
        ]}
      />
      
      {/* Center tech dot */}
      <View style={[styles.centerTechDot, { backgroundColor: color }]}>
        <View style={[styles.innerTechDot, { backgroundColor: color + '40' }]} />
      </View>
    </View>
  );

  const renderPulse = () => (
    <Animated.View
      style={[
        styles.pulseContainer,
        {
          width: size,
          height: size,
          backgroundColor: color + '20',
          transform: [{ scale }],
        },
      ]}
    >
      <View style={[styles.pulseInner, { backgroundColor: color }]} />
    </Animated.View>
  );

  const renderWave = () => (
    <View style={styles.waveContainer}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveBar,
            {
              width: 4,
              height: size * 0.6,
              backgroundColor: color,
              opacity: waveValue.interpolate({
                inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                outputRange: [0.3, 1, 0.3, 1, 0.3, 0.3],
              }),
              transform: [
                {
                  translateY: waveValue.interpolate({
                    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    outputRange: [0, -10, 0, -10, 0, 0],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );

  const renderBounce = () => (
    <Animated.View
      style={[
        styles.bounceContainer,
        {
          width: size,
          height: size,
          transform: [{ scale: bounceScale }],
        },
      ]}
    >
      <Ionicons name="refresh" size={size * 0.6} color={color} />
    </Animated.View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {dotValues.map((dotValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: size * 0.1,
              height: size * 0.1,
              backgroundColor: color,
              opacity: dotValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
              transform: [
                {
                  scale: dotValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'wave':
        return renderWave();
      case 'bounce':
        return renderBounce();
      case 'dots':
        return renderDots();
      default:
        return renderSpinner();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderLoader()}
      {showText && text && (
        <Text style={[styles.loadingText, { color: color }]}>
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 50,
  },
  middleRing: {
    position: 'absolute',
    borderWidth: 2.5,
    borderRadius: 50,
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 50,
  },
  centerTechDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerTechDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pulseContainer: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  waveBar: {
    borderRadius: 2,
  },
  bounceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    borderRadius: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
