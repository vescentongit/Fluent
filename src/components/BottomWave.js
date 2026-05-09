import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemeContext } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const BottomWave = () => {
  const { colors } = useContext(ThemeContext);
  
  return (
    <View style={styles.svgContainer} pointerEvents="none">
      <Svg
        height="200" 
        width={width}
        viewBox={`0 0 ${width} 200`}
      >
        <Path
          fill={colors.cardAlt}
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