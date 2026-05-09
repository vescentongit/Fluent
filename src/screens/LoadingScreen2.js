import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, Easing, Image } from 'react-native';

const LoadingScreen2 = ({ route, navigation }) => {
  const targetScreen = route.params?.target || 'IncomeSource';

  const motionPhase = useRef(new Animated.Value(0)).current;
  const driftPhase = useRef(new Animated.Value(0)).current;
  const microPhase = useRef(new Animated.Value(0)).current;
  const breathePhase = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const motionLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(motionPhase, {
          toValue: 0.18,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(motionPhase, {
          toValue: 0.38,
          duration: 850,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(motionPhase, {
          toValue: 0.62,
          duration: 1050,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(motionPhase, {
          toValue: 0.84,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(motionPhase, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(motionPhase, {
          toValue: 0,
          duration: 1,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(driftPhase, {
          toValue: 1,
          duration: 4600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(driftPhase, {
          toValue: 0,
          duration: 4800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const microLoop = Animated.loop(
      Animated.timing(microPhase, {
        toValue: 1,
        duration: 1700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathePhase, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathePhase, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    motionLoop.start();
    driftLoop.start();
    microLoop.start();
    breatheLoop.start();

    const timer = setTimeout(() => {
      navigation.replace(targetScreen); 
    }, 20000);

    return () => {
      clearTimeout(timer);
      motionLoop.stop();
      driftLoop.stop();
      microLoop.stop();
      breatheLoop.stop();
    };
  }, [navigation, targetScreen, motionPhase, driftPhase, microPhase, breathePhase]);

  const waveY = motionPhase.interpolate({
    // detail keyframes untuk transisi lembut di tiap fase
    inputRange: [0, 0.08, 0.18, 0.28, 0.38, 0.5, 0.62, 0.72, 0.84, 0.92, 1],
    outputRange: [0, 0, 0, -5, -12, -12, -12, -7, 0, 0, 0],
  });

  const driftX = driftPhase.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-11, 13, -11],
  });

  const microY = microPhase.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -0.8, 0, 0.8, 0],
  });

  const waveX = Animated.add(driftX, motionPhase.interpolate({
    inputRange: [0, 0.08, 0.18, 0.28, 0.38, 0.5, 0.62, 0.72, 0.84, 0.92, 1],
    outputRange: [-3, -3, -3, 1.2, 3.5, 3.5, 3.5, 0.8, -3, -3, -3],
  }));

  const finalY = Animated.add(waveY, microY);

  const waveTilt = motionPhase.interpolate({
    inputRange: [0, 0.08, 0.18, 0.28, 0.38, 0.5, 0.62, 0.72, 0.84, 0.92, 1],
    outputRange: ['-1deg', '-1deg', '-1deg', '1deg', '3deg', '3deg', '3deg', '1deg', '-1deg', '-1deg', '-1deg'],
  });

  const breatheScale = breathePhase.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.995, 1.02, 0.995],
  });

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../assets/loading22.png')} 
        style={[
          styles.logo,
          { transform: [{ translateX: waveX }, { translateY: finalY }, { rotate: waveTilt }, { scale: breatheScale }] }
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