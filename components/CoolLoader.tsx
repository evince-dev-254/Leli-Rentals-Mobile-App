import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface CoolLoaderProps {
  size?: number;
  color?: string;
  style?: any;
}

const CoolLoader: React.FC<CoolLoaderProps> = ({ 
  size = 40, 
  color = '#d97706',
  style 
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    // Pulsing scale animation
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    // Opacity breathing animation
    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    scaleAnimation.start();
    opacityAnimation.start();

    return () => {
      spinAnimation.stop();
      scaleAnimation.stop();
      opacityAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.loader,
          {
            width: size,
            height: size,
            transform: [
              { rotate: spin },
              { scale: scaleValue }
            ],
            opacity: opacityValue,
          },
        ]}
      >
        {/* Outer ring */}
        <View
          style={[
            styles.ring,
            styles.outerRing,
            {
              width: size,
              height: size,
              borderColor: color,
            },
          ]}
        />
        
        {/* Inner ring */}
        <View
          style={[
            styles.ring,
            styles.innerRing,
            {
              width: size * 0.6,
              height: size * 0.6,
              borderColor: color,
            },
          ]}
        />
        
        {/* Center dot */}
        <View
          style={[
            styles.centerDot,
            {
              width: size * 0.2,
              height: size * 0.2,
              backgroundColor: color,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 3,
  },
  outerRing: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  innerRing: {
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  centerDot: {
    borderRadius: 50,
  },
});

export default CoolLoader;
