import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

interface OrientationState {
  isLandscape: boolean;
  isPortrait: boolean;
  width: number;
  height: number;
}

export const useOrientation = (): OrientationState => {
  const [orientation, setOrientation] = useState<OrientationState>(() => {
    const { width, height } = Dimensions.get('window');
    return {
      isLandscape: width > height,
      isPortrait: height > width,
      width,
      height,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation({
        isLandscape: window.width > window.height,
        isPortrait: window.height > window.width,
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  return orientation;
};

export default useOrientation;
