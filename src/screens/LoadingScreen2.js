import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, Easing, Image } from 'react-native';

const LoadingScreen2 = ({ route, navigation }) => {
  const targetScreen = route.params?.target || 'IncomeSource';

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1, 
        duration: 2000, 
        easing: Easing.inOut(Easing.cubic), 
        
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      navigation.replace(targetScreen); 
    }, 20000);

    return () => clearTimeout(timer);
  }, [navigation, targetScreen, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../assets/loading22.png')} 
        style={[
          styles.logo,
          { transform: [{ rotate: spin }] } 
        ]}
        resizeMode="contain"
      />
      <Image 
              source={require('../assets/loading23.png')} 
              style={styles.logo2}
              resizeMode="contain"
            />
      <ActivityIndicator size="small" color="#0088CC" style={styles.spinner} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logo: { 
    width: 150, 
    height: 150, 
    marginBottom: -90
  },
  logo2: { 
    width: 300, 
    height: 300, 
    marginBottom: -80
  },
  brandName: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#0088CC', 
    marginBottom: 15 
  },
  brandDot: { 
    color: '#00BFFF' 
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  spinner: {
    marginRight: 8,
  },
  loadingText: { 
    fontSize: 16, 
    color: '#4A5568',
    fontWeight: '500'
  },
});

export default LoadingScreen2;