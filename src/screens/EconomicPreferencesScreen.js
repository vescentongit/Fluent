import React, { useState, useContext } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, ScrollView,
  Dimensions, SafeAreaView
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { ChevronLeft } from 'lucide-react-native';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const EconomicPreferencesScreen = ({ navigation }) => {
  const [organized, setOrganized] = useState(0);
  const [riskTolerance, setRiskTolerance] = useState(0);
  const { colors } = useContext(ThemeContext);



  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#FFFFFF" size={32} />
        </TouchableOpacity>
        <Svg height="240" width={width} viewBox={`0 0 ${width} 240`} style={styles.svg}>
          <Path fill={colors.border} d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} transform="translate(0, 8)" />
          <Path fill={colors.cardAlt} d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} transform="translate(0, 4)" />
          <Path fill={colors.primary} d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} />
        </Svg>
        <View style={styles.assetPlaceholder}>
          <Image source={require('../assets/income.png')} style={styles.logo} resizeMode="contain" />
          <View style={styles.headerLine} />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.questionText}>
              Choose your{'\n'}economic preference.
            </Text>

            <View style={styles.cardContainer}>

              <View style={styles.sliderSection}>
                <Text style={styles.sliderLabel}>How organized are you in managing money?</Text>

                <View style={[styles.tooltipContainer, { left: `${(organized / 10) * 88}%` }]}>
                  <View style={[styles.tooltipBubble, { backgroundColor: '#8CB8DA' }]}>
                    <Text style={styles.tooltipText}>{organized}</Text>
                  </View>
                  <View style={[styles.tooltipTriangle, { borderTopColor: '#8CB8DA' }]} />
                </View>

                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={organized}
                  onValueChange={setOrganized}
                  minimumTrackTintColor="#0072B1"
                  maximumTrackTintColor="#8CB8DA"
                  thumbTintColor="#0072B1"
                />
              </View>

              <View style={styles.sliderSection}>
                <Text style={styles.sliderLabel}>How big is your risk tolerance?</Text>

                <View style={[styles.tooltipContainer, { left: `${(riskTolerance / 10) * 88}%` }]}>
                  <View style={[styles.tooltipBubble, { backgroundColor: '#E19595' }]}>
                    <Text style={styles.tooltipText}>{riskTolerance}</Text>
                  </View>
                  <View style={[styles.tooltipTriangle, { borderTopColor: '#E19595' }]} />
                </View>

                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  minimumTrackTintColor="#B30000"
                  maximumTrackTintColor="#E19595"
                  thumbTintColor="#B30000"
                />
              </View>



            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.progressSection}>
            <View style={styles.progressWrapper}>
              <View style={[styles.progressBar, { width: '83%', backgroundColor: '#023E8A' }]} />
            </View>
            <Text style={styles.progressText}>5 out of 6</Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              navigation.navigate('FinancialGoals');
            }}
          >
            <Text style={styles.continueText}>Continue</Text>
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
  headerLine: { width: '80%', height: 2, backgroundColor: '#FFFFFF', marginTop: 15, borderRadius: 2 },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  content: { paddingHorizontal: 24, marginTop: 10 },

  questionText: { fontSize: 24, fontWeight: 'bold', color: '#003A82', marginBottom: 20, lineHeight: 32 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 20 },

  cardContainer: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1.5,
    borderColor: '#003A82',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  sliderSection: { marginBottom: 30 },
  sliderLabel: { fontSize: 14, fontWeight: 'bold', color: '#003A82', marginBottom: 15 },
  slider: { width: '100%', height: 20, marginTop: 0 },

  tooltipContainer: {
    position: 'relative',
    width: 24,
    alignItems: 'center',
    marginBottom: -5,
  },
  tooltipBubble: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tooltipText: {
    color: '#003A82',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tooltipTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },

  bottomContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 30, paddingTop: 30 },
  progressSection: { flexDirection: 'column' },
  progressText: { fontSize: 12, color: '#003A82', fontWeight: '600' },
  progressWrapper: { height: 6, width: 100, backgroundColor: '#b4dff7', borderRadius: 3, marginBottom: 8 },
  progressBar: { height: '100%', backgroundColor: '#0072B1', borderRadius: 3 },

  continueButton: { backgroundColor: '#003A82', paddingVertical: 14, paddingHorizontal: 35, borderRadius: 20 },
  continueText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});

export default EconomicPreferencesScreen;