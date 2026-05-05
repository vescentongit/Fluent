import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const BottomWave = () => {
  return (
    <View style={styles.svgContainer} pointerEvents="none">
      <Svg
        height="200" 
        width={width}
        viewBox={`0 0 ${width} 200`}
      >
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#48CAE4" stopOpacity="1" />
            <Stop offset="50%" stopColor="#76D7EB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          fill="url(#grad)"
          d={`M0 80 C${width * 0.25} 20 ${width * 0.75} 140 ${width} 80 L${width} 200 L0 200 Z`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default BottomWave;