import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const WaveHeader = () => {
  return (
    <View style={styles.svgContainer}>
      <Svg
        height="280" 
        width={width}
        viewBox={`0 0 ${width} 280`}
      >
        <Path
          fill="#03045E" 
          d={`M0 0 L${width} 0 L${width} 220 C${width * 0.8} 280 ${width * 0.2} 180 0 240 Z`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    position: 'absolute',
    top: 0,
    width: width,
  },
});

export default WaveHeader;