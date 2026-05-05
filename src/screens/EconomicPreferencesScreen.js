import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Image, ScrollView,
  Dimensions, SafeAreaView 
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

const { width } = Dimensions.get('window');

const EconomicPreferencesScreen = ({ navigation }) => {
  const [organized, setOrganized] = useState(0);
  const [riskTolerance, setRiskTolerance] = useState(0);
  
  const [selectedGoals, setSelectedGoals] = useState([]);

  const goals = [
    "Investment Growth", "Debt Free", "Retire Early", 
    "Education", "Children's Future", "Other"
  ];

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(item => item !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
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
            <SvgLinearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#48CAE4" stopOpacity="1" />
              <Stop offset="50%" stopColor="#76D7EB" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Path fill="rgba(0, 0, 0, 0.04)" d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} transform="translate(0, 8)" />
          <Path fill="rgba(0, 0, 0, 0.08)" d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} transform="translate(0, 4)" />
          <Path fill="url(#headerGrad)" d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} />
        </Svg>
        
        <View style={styles.assetPlaceholder}>
          <Image source={require('../assets/income.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.questionText}>
              Choose your{'\n'}
              <Text style={styles.emphasis}>economic preference.</Text>
            </Text>

            <View style={styles.cardContainer}>
              
              <View style={styles.sliderSection}>
                <Text style={styles.sliderLabel}>How organized are you in managing money?</Text>
                <View style={styles.valueBubbleBlue}>
                  <Text style={styles.valueTextWhite}>{organized}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={organized}
                  onValueChange={setOrganized}
                  minimumTrackTintColor="#285CCB"
                  maximumTrackTintColor="#AEC6EB" 
                  thumbTintColor="#1A4A9F"
                />
              </View>

              <View style={styles.sliderSection}>
                <Text style={styles.sliderLabel}>How big is your risk tolerance?</Text>
                <View style={styles.valueBubbleRed}>
                  <Text style={styles.valueTextWhite}>{riskTolerance}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  minimumTrackTintColor="#C92A2A" 
                  maximumTrackTintColor="#EBB3B3" 
                  thumbTintColor="#9E0000" 
                />
              </View>

              <View style={styles.goalsSection}>
                <Text style={styles.sliderLabel}>What are your financial goals?</Text>
                <Text style={styles.subLabel}>(Select all that apply)</Text>
                
                <View style={styles.chipsContainer}>
                  {goals.map((goal) => (
                    <TouchableOpacity 
                      key={goal}
                      style={[
                        styles.chip, 
                        selectedGoals.includes(goal) && styles.selectedChip
                      ]}
                      onPress={() => toggleGoal(goal)}
                    >
                      <Text style={[
                        styles.chipText, 
                        selectedGoals.includes(goal) && styles.selectedChipText
                      ]}>{goal}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.progressSection}>
            <View style={styles.progressWrapper}>
              <LinearGradient
                colors={['#447ADF', '#285CCB', '#04ADAD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: '100%' }]}
              />
            </View>
            <Text style={styles.progressTextComplete}>Complete!</Text>
          </View>

          <TouchableOpacity 
            style={styles.buttonWrapper}
            onPress={() => {
              console.log("Onboarding Selesai! Data:", { organized, riskTolerance, selectedGoals });
              navigation.navigate('Loading2', { target: 'Home' }); 
            }}
            disabled={selectedGoals.length === 0}
          >
            {selectedGoals.length === 0 ? (
              <View style={styles.disabledButton}>
                <Text style={styles.continueText}>Finalize</Text>
              </View>
            ) : (
              <LinearGradient
                colors={['#447ADF', '#285CCB', '#04ADAD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.continueText}>Finalize</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { height: 210, position: 'relative' },
  svg: { position: 'absolute', top: 0 },
  assetPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10, marginTop: -20 },
  logo: { width: 150, height: 150, top: 5, },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  content: { paddingHorizontal: 24, marginTop: 10 },
  
  questionText: { fontSize: 24, fontWeight: 'bold', color: '#023E8A', marginBottom: 20, lineHeight: 32 },
  emphasis: { color: '#023E8A' },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 20 },
  
  cardContainer: {
    backgroundColor: '#FAFCFF',
    borderWidth: 1.5,
    borderColor: '#023E8A',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  sliderSection: { marginBottom: 24 },
  sliderLabel: { fontSize: 14, fontWeight: 'bold', color: '#023E8A', marginBottom: 10 },
  slider: { width: '100%', height: 40, marginTop: -10 },
  
  valueBubbleBlue: {
    backgroundColor: '#AEC6EB',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 5,
    marginLeft: 10, 
  },
  valueBubbleRed: {
    backgroundColor: '#EBB3B3',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 5,
    marginLeft: 10,
  },
  valueTextWhite: { color: '#1A202C', fontSize: 10, fontWeight: 'bold' },

  goalsSection: { marginTop: 10 },
  subLabel: { fontSize: 11, color: '#023E8A', marginBottom: 12 },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: '#023E8A',
    borderRadius: 20, 
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  selectedChip: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0047AB',
  },
  chipText: { fontSize: 12, fontWeight: 'bold', color: '#023E8A' },
  selectedChipText: { color: '#0047AB' },

  bottomContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 30, paddingTop: 30 },
  progressSection: { flexDirection: 'column' },
  progressWrapper: { height: 6, width: 100, backgroundColor: '#E2E8F0', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 },
  progressTextComplete: { fontSize: 13, color: '#023E8A', fontWeight: 'bold' },
  
  buttonWrapper: {
    borderRadius: 24,
    overflow: 'hidden', 
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 14, 
    paddingHorizontal: 35, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { 
    backgroundColor: '#CBD5E0',
    paddingVertical: 14, 
    paddingHorizontal: 35, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});

export default EconomicPreferencesScreen;