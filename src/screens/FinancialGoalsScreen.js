import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView,
  Dimensions, SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronLeft } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const FinancialGoalsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [goalName, setGoalName] = useState('');
  const [nominal, setNominal] = useState('');
  const [duration, setDuration] = useState('');
  
  const { currencySymbol, setFinancialGoal } = useContext(UserContext);
  const { colors } = useContext(ThemeContext);

  const handleNominalChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setNominal(formattedValue);
  };

  const handleDurationChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setDuration(numericValue);
  };

  const isValid = goalName.trim() !== '' && nominal !== '' && duration !== '';

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
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={styles.questionText}>
                {t('onboarding.goals.question1', 'Define your\n')}
                <Text style={styles.emphasis}>{t('onboarding.goals.emphasis', 'financial goal.')}</Text>
              </Text>

              <View style={styles.cardContainer}>
                
                <Text style={styles.inputLabel}>{t('onboarding.goals.goalName', 'Goal Name')}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('onboarding.goals.namePlaceholder', 'E.g., Buy a New Car')}
                    placeholderTextColor="#A0AEC0"
                    value={goalName}
                    onChangeText={setGoalName}
                  />
                </View>

                <Text style={styles.inputLabel}>{t('onboarding.goals.targetNominal', 'Target Nominal')}</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.currencyPrefix}>{currencySymbol} </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="150.000.000"
                    placeholderTextColor="#A0AEC0"
                    keyboardType="numeric"
                    value={nominal}
                    onChangeText={handleNominalChange}
                  />
                </View>

                <Text style={styles.inputLabel}>{t('onboarding.goals.timeToAchieve', 'Time to Achieve (Years)')}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('onboarding.goals.durationPlaceholder', 'E.g., 3')}
                    placeholderTextColor="#A0AEC0"
                    keyboardType="numeric"
                    value={duration}
                    onChangeText={handleDurationChange}
                  />
                  <Text style={styles.durationSuffix}>{t('onboarding.goals.years', 'Years')}</Text>
                </View>
                
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomContainer}>
            <View style={styles.progressSection}>
              <View style={styles.progressWrapper}>
                <View style={[styles.progressBar, { width: '100%', backgroundColor: colors.primary }]} />
              </View>
              <Text style={styles.progressTextComplete}>{t('onboarding.progress.complete', 'Complete!')}</Text>
            </View>

            <TouchableOpacity 
              style={styles.buttonWrapper}
              onPress={() => {
                setFinancialGoal({ title: goalName, nominal, duration });
                navigation.navigate('Loading2', { target: 'Home' }); 
              }}
              disabled={!isValid}
            >
              {!isValid ? (
                <View style={styles.disabledButton}>
                  <Text style={styles.continueText}>{t('onboarding.goals.finalize', 'Finalize')}</Text>
                </View>
              ) : (
                <View style={[styles.gradientButton, { backgroundColor: colors.primary }]}>
                  <Text style={styles.continueText}>{t('onboarding.goals.finalize', 'Finalize')}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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

  inputLabel: { fontSize: 14, fontWeight: 'bold', color: '#023E8A', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', 
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, 
    borderWidth: 1, borderColor: '#AEC6EB', marginBottom: 20,
  },
  currencyPrefix: { fontSize: 16, fontWeight: 'bold', color: '#028A1B', marginRight: 8 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#023E8A' },
  durationSuffix: { fontSize: 14, fontWeight: 'bold', color: '#4A5568', marginLeft: 8 },

  bottomContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 10, backgroundColor: '#FFFFFF' },
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

export default FinancialGoalsScreen;
