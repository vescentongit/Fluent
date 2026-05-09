import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Dimensions, SafeAreaView
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

const IncomeSourceScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedSources, setSelectedSources] = useState([]);
  const { colors } = useContext(ThemeContext);
  const { setIncomeSources } = useContext(UserContext);
  const options = [
    t('onboarding.income.fullTime', 'Full-time employee'),
    t('onboarding.income.freelancer', 'Freelancer'),
    t('onboarding.income.partTime', 'Part-Time'),
    t('onboarding.income.allowance', 'Allowance / Student'),
    t('onboarding.income.notWorking', 'Not Working')
  ];

  const toggleSource = (option) => {
    const notWorkingStr = t('onboarding.income.notWorking', 'Not Working');
    if (option === notWorkingStr) {
      if (selectedSources.includes(notWorkingStr)) {
        setSelectedSources([]);
      } else {
        setSelectedSources([notWorkingStr]);
      }
      return;
    }
    let currentSelections = selectedSources.filter(item => item !== notWorkingStr);

    if (currentSelections.includes(option)) {
      setSelectedSources(currentSelections.filter(item => item !== option));
    } else {
      setSelectedSources([...currentSelections, option]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Svg
          height="240"
          width={width}
          viewBox={`0 0 ${width} 240`}
          style={styles.svg}
        >
          <Path
            fill={colors.border}
            d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`}
            transform="translate(0, 8)"
          />

          <Path
            fill={colors.cardAlt}
            d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`}
            transform="translate(0, 4)"
          />

          <Path
            fill={colors.primary}
            d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`}
          />
        </Svg>

        <View style={styles.assetPlaceholder}>
          <Image
            source={require('../assets/income.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.questionText}>{t('onboarding.income.question1', 'How do you primarily earn your')} <Text style={styles.emphasis}>{t('onboarding.income.emphasis', 'income')}</Text>?</Text>

          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  selectedSources.includes(option) && styles.selectedCard
                ]}
                onPress={() => toggleSource(option)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  selectedSources.includes(option) && styles.selectedText
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.progressSection}>
            <View style={styles.progressWrapper}><View style={[styles.progressBar, { width: '16.75%' }]} /></View>
            <Text style={styles.progressText}>{t('onboarding.progress.1of6', '1 out of 6')}</Text>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, selectedSources.length === 0 && styles.disabledButton]}
            onPress={() => {
              if (selectedSources.length > 0) {
                setIncomeSources(selectedSources); // ← simpan
                navigation.navigate('MonthlyIncome');
              }
            }}
            disabled={selectedSources.length === 0}
          >
            <Text style={styles.continueText}>{t('common.continue', 'Continue')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  emphasis: {
    color: '#0077B6'
  },
  progressSection: { flexDirection: 'column' },
  progressText: { fontSize: 12, color: '#4A5568', fontWeight: '600' },
  headerContainer: {
    height: 220,
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  assetPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginTop: -20,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 20
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#023E8A',
    marginTop: -15,
    marginBottom: 30,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#023E8A',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#0047AB',
    backgroundColor: '#E0F2FE'
  },
  optionText: {
    fontSize: 16,
    color: '#023E8A',
    textAlign: 'center',
    fontWeight: '600'
  },
  selectedText: {
    color: '#0047AB',
    fontWeight: 'bold'
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 30
  },
  progressWrapper: {
    height: 8,
    width: 100,
    backgroundColor: '#b4dff7',
    borderRadius: 4
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#023E8A',
    borderRadius: 4
  },
  continueButton: {
    backgroundColor: '#023E8A',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 15
  },
  disabledButton: {
    backgroundColor: '#CBD5E0',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  logo: {
    width: 150,
    height: 150,
    top: 5,
  },
});

export default IncomeSourceScreen;