import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getGridColumns, getSpacing, getDeviceSize } from '@/utils/responsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  spacing?: number;
  style?: any;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  spacing = 16,
  style,
}) => {
  const columns = getGridColumns();
  const deviceSize = getDeviceSize();
  const responsiveSpacing = getSpacing(spacing);
  
  const gridStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
    marginHorizontal: -responsiveSpacing / 2,
    ...style,
  };

  const itemStyle = {
    width: `${(100 / columns) - 1}%`,
    marginBottom: responsiveSpacing,
    paddingHorizontal: responsiveSpacing / 2,
  };

  return (
    <View style={gridStyle}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={itemStyle}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default ResponsiveGrid;
