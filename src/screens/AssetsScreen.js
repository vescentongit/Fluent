import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView,
  Dimensions, SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AssetsScreen = ({ navigation }) => {
  const [nominal, setNominal] = useState('');
  
  const [selectedAssets, setSelectedAssets] = useState([]);

  const options = [
    "Property", "Vehicle", "Crypto", 
    "Gold", "Stocks/ETF", "Other"
  ];

  const handleNominalChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setNominal(numericValue);
  };

  const toggleAsset = (option) => {
    if (selectedAssets.includes(option)) {
      setSelectedAssets(selectedAssets.filter(item => item !== option));
    } else {
      setSelectedAssets([...selectedAssets, option]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#FFFFFF" size={32} />
        </TouchableOpacity>
        <Svg height="240" width={width} viewBox={`0 0 ${width} 240`} style={styles.svg}>
          <Defs>
            <LinearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#48CAE4" stopOpacity="1" />
              <Stop offset="50%" stopColor="#76D7EB" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path fill="rgba(0, 0, 0, 0.04)" d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} transform="translate(0, 8)" />
          <Path fill="rgba(0, 0, 0, 0.08)" d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} transform="translate(0, 4)" />
          <Path fill="url(#headerGrad)" d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} />
        </Svg>
        <View style={styles.assetPlaceholder}>
          <Image source={require('../assets/assets.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={styles.questionText}>
                What <Text style={styles.emphasis}>assets</Text> do you currently own?
              </Text>

              <Text style={styles.questionText1}>Total Asset Value</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>Rp.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={nominal}
                  onChangeText={handleNominalChange}
                />
              </View>

              <Text style={styles.questionText1}>Asset Types</Text>
              <View style={styles.gridContainer}>
                {options.map((option) => (
                  <TouchableOpacity 
                    key={option}
                    style={[
                      styles.gridBox, 
                      selectedAssets.includes(option) && styles.selectedBox
                    ]}
                    onPress={() => toggleAsset(option)}
                  >
                    <Text style={[
                      styles.boxText, 
                      selectedAssets.includes(option) && styles.selectedBoxText
                    ]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomContainer}>
            <View style={styles.progressSection}>
                <View style={styles.progressWrapper}><View style={[styles.progressBar, { width: '60%' }]} /></View>
                <Text style={styles.progressText}>3 out of 5</Text>
            </View>
            <TouchableOpacity 
              style={[styles.continueButton, (!nominal || selectedAssets.length === 0) && styles.disabledButton]}
              onPress={() => nominal && selectedAssets.length > 0 && navigation.navigate('Debt')}
              disabled={!nominal || selectedAssets.length === 0}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  emphasis: { color: '#0077B6' },
  headerContainer: { height: 210, position: 'relative' },
  svg: { position: 'absolute', top: 0 },
  assetPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10, marginTop: -20 },
  logo: { width: 150, height: 150, top: 5, },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  progressSection: { flexDirection: 'column' },
  progressText: { fontSize: 12, color: '#4A5568', fontWeight: '600' },
  scrollContent: {
    flexGrow: 1, 
    paddingBottom: 20, 
  },
  content: { 
    paddingHorizontal: 24, 
    marginTop: 10 
  },
  questionText: { fontSize: 22, fontWeight: 'bold', color: '#023E8A', marginBottom: 20, marginTop: 12},
  questionText1: { fontSize: 18, fontWeight: 'bold', color: '#023E8A', marginBottom: 20, marginTop: 20 },
  inputLabel: { fontSize: 14, color: '#4A5568', fontWeight: '600', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', 
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, 
    borderWidth: 1.5, borderColor: '#023E8A', marginBottom: 20,
  },
  currencyPrefix: { fontSize: 18, fontWeight: 'bold', color: '#028A1B', marginRight: 8 },
  input: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#023E8A' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridBox: {
    width: (width - 48 - 20) / 3,
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0047AB',
    alignItems: 'center',
  },
  selectedBox: { borderColor: '#0047AB', backgroundColor: '#E0F2FE' },
  boxText: { fontSize: 14, color: '#0047AB', fontWeight: 'bold' },
  selectedBoxText: { color: '#0047AB', fontWeight: 'bold' },
  bottomContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 30 },
  progressWrapper: { height: 8, width: 100, backgroundColor: '#b4dff7', borderRadius: 4 },
  progressBar: { height: '100%', backgroundColor: '#023E8A', borderRadius: 4 },
  continueButton: { backgroundColor: '#023E8A', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  disabledButton: { backgroundColor: '#CBD5E0' },
  continueText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 20 },
});

export default AssetsScreen;