import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView,
  Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronLeft } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const AssetsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [nominal, setNominal] = useState('');
  const { currencySymbol } = useContext(UserContext);
  const { colors } = useContext(ThemeContext);

  const [selectedAssets, setSelectedAssets] = useState([]);

  const [customAssets, setCustomAssets] = useState([]);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [otherAssetInput, setOtherAssetInput] = useState('');

  const defaultOptions = [
    t('assets.property', 'Property'), t('assets.vehicle', 'Vehicle'), t('assets.crypto', 'Crypto'),
    t('assets.gold', 'Gold'), t('assets.stocks', 'Stocks/ETF')
  ];

  const options = [...defaultOptions, ...customAssets];
  const otherStr = t('assets.other', 'Other');
  if (customAssets.length < 3) {
    options.push(otherStr);
  }

  const handleNominalChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setNominal(formattedValue);
  };

  const toggleAsset = (option) => {
    if (option === otherStr) {
      setShowOtherModal(true);
      return;
    }
    if (selectedAssets.includes(option)) {
      setSelectedAssets(selectedAssets.filter(item => item !== option));
    } else {
      setSelectedAssets([...selectedAssets, option]);
    }
  };

  const handleAddOtherAsset = () => {
    const trimmed = otherAssetInput.trim();
    if (trimmed && customAssets.length < 3 && !customAssets.includes(trimmed) && !defaultOptions.includes(trimmed)) {
      setCustomAssets([...customAssets, trimmed]);
      setSelectedAssets([...selectedAssets, trimmed]);
    }
    setShowOtherModal(false);
    setOtherAssetInput('');
  };

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
          <Image source={require('../assets/assets.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showOtherModal}
        onRequestClose={() => setShowOtherModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('onboarding.assets.addCustom', 'Add Custom Asset')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="E.g., Business, Art"
              placeholderTextColor="#A0AEC0"
              value={otherAssetInput}
              onChangeText={setOtherAssetInput}
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => { setShowOtherModal(false); setOtherAssetInput(''); }}>
                <Text style={styles.modalCancelText}>{t('common.cancel', 'Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAdd} onPress={handleAddOtherAsset}>
                <Text style={styles.modalAddText}>{t('common.add', 'Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                {t('assets.question1', 'What')} <Text style={styles.emphasis}>{t('assets.emphasis', 'assets')}</Text> {t('assets.question2', 'do you currently own?')}
              </Text>

              <Text style={styles.questionText1}>{t('assets.totalValue', 'Total Asset Value')}</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>{currencySymbol} </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={nominal}
                  onChangeText={handleNominalChange}
                />
              </View>

              <Text style={styles.questionText1}>{t('assets.types', 'Asset Types')}</Text>
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
              <View style={styles.progressWrapper}><View style={[styles.progressBar, { width: '50%' }]} /></View>
              <Text style={styles.progressText}>{t('onboarding.progress.3of6', '3 out of 6')}</Text>
            </View>
            <TouchableOpacity
              style={[styles.continueButton, (!nominal || selectedAssets.length === 0) && styles.disabledButton]}
              onPress={() => nominal && selectedAssets.length > 0 && navigation.navigate('Debt')}
              disabled={!nominal || selectedAssets.length === 0}
            >
              <Text style={styles.continueText}>{t('common.continue', 'Continue')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  questionText: { fontSize: 22, fontWeight: 'bold', color: '#023E8A', marginBottom: 20, marginTop: 12 },
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
  bottomContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 10, backgroundColor: '#FFFFFF' },
  progressWrapper: { height: 8, width: 100, backgroundColor: '#b4dff7', borderRadius: 4 },
  progressBar: { height: '100%', backgroundColor: '#023E8A', borderRadius: 4 },
  continueButton: { backgroundColor: '#023E8A', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  disabledButton: { backgroundColor: '#CBD5E0' },
  continueText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#023E8A', marginBottom: 16 },
  modalInput: { borderWidth: 1.5, borderColor: '#023E8A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#023E8A', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#F8FAFC' },
  modalCancelText: { color: '#4A5568', fontWeight: 'bold', fontSize: 16 },
  modalAdd: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#023E8A' },
  modalAddText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});

export default AssetsScreen;