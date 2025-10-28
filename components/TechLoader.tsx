import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface TechLoaderProps {
  size?: number;
  color?: string;
  style?: any;
  variant?: 'circular' | 'orbital' | 'pulse' | 'wave';
  text?: string;
  showText?: boolean;
}

export default function TechLoader({ 
  size = 60, 
  color = '#34D399', 
  style,
  variant = 'circular',
  text = 'Loading...',
  showText = true
}: TechLoaderProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const waveValue = useRef(new Animated.Value(0)).current;
  const orbitalValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimations = () => {
      // Main rotation animation
      const spin = () => {
        spinValue.setValue(0);
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => spin());
      };

      // Pulse animation
      const pulse = () => {
        pulseValue.setValue(1);
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.4,
            duration: 1000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
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
          duration: 1500,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }).start(() => wave());
      };

      // Orbital animation
      const orbital = () => {
        orbitalValue.setValue(0);
        Animated.timing(orbitalValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => orbital());
      };

      // Start appropriate animation based on variant
      switch (variant) {
        case 'circular':
          spin();
          break;
        case 'pulse':
          pulse();
          break;
        case 'wave':
          wave();
          break;
        case 'orbital':
          orbital();
          break;
        default:
          spin();
      }
    };

    startAnimations();
  }, [variant, spinValue, pulseValue, waveValue, orbitalValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = pulseValue;

  const renderCircular = () => (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderColor: color + '20',
            borderTopColor: color,
            transform: [{ rotate }],
          },
        ]}
      />
      
      {/* Inner ring - counter rotation */}
      <Animated.View
        style={[
          styles.innerRing,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderColor: color + '15',
            borderBottomColor: color + '70',
            transform: [{ rotate: spinValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['360deg', '0deg'],
            })}],
          },
        ]}
      />
      
      {/* Center tech core */}
      <View style={[styles.techCore, { backgroundColor: color }]}>
        <View style={[styles.techCoreInner, { backgroundColor: color + '40' }]} />
      </View>
    </View>
  );

  const renderOrbital = () => (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Central core */}
      <View style={[styles.centralCore, { backgroundColor: color }]} />
      
      {/* Orbiting elements - simplified */}
      {[0, 1, 2, 3].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.orbitalElement,
            {
              width: size * 0.2,
              height: size * 0.2,
              backgroundColor: color,
              transform: [
                {
                  translateX: orbitalValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      Math.cos((index * 90) * Math.PI / 180) * (size * 0.3),
                      Math.cos((index * 90 + 360) * Math.PI / 180) * (size * 0.3)
                    ],
                  }),
                },
                {
                  translateY: orbitalValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      Math.sin((index * 90) * Math.PI / 180) * (size * 0.3),
                      Math.sin((index * 90 + 360) * Math.PI / 180) * (size * 0.3)
                    ],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
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
      <View style={[styles.pulseCore, { backgroundColor: color }]} />
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderColor: color,
            transform: [{ scale }],
          },
        ]}
      />
    </Animated.View>
  );

  const renderWave = () => (
    <View style={styles.waveContainer}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveBar,
            {
              width: 4,
              height: size * 0.6,
              backgroundColor: color,
              opacity: waveValue.interpolate({
                inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                outputRange: [0.3, 1, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
              }),
              transform: [
                {
                  scaleY: waveValue.interpolate({
                    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                    outputRange: [0.5, 1.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
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
      case 'circular':
        return renderCircular();
      case 'orbital':
        return renderOrbital();
      case 'pulse':
        return renderPulse();
      case 'wave':
        return renderWave();
      default:
        return renderCircular();
    }
  };

  return (
    <View style={[styles.wrapper, style]}>
      {renderLoader()}
      {showText && text && (
        <View style={styles.textContainer}>
          <View style={[styles.loadingDots]}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    backgroundColor: color,
                    opacity: waveValue.interpolate({
                      inputRange: [0, 0.33, 0.66, 1],
                      outputRange: [0.3, 1, 0.3, 0.3],
                    }),
                    transform: [
                      {
                        scale: waveValue.interpolate({
                          inputRange: [0, 0.33, 0.66, 1],
                          outputRange: [0.8, 1.2, 0.8, 0.8],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
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
  techCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techCoreInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  techCoreDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  centralCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  orbitalElement: {
    position: 'absolute',
    borderRadius: 50,
  },
  pulseContainer: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCore: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 50,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  waveBar: {
    borderRadius: 2,
  },
  textContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
