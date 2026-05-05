import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const LoadingScreen = ({ route, navigation }) => {
  const targetScreen = route.params?.target || 'IncomeSource';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(targetScreen); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, targetScreen]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/loading.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 300, height: 300, marginBottom: 20 },
  brandName: { fontSize: 36, fontWeight: 'bold', color: '#0088CC', marginBottom: 10 },
  brandDot: { color: '#00BFFF' },
  loadingText: { fontSize: 16, color: '#4A5568' },
});

export default LoadingScreen;