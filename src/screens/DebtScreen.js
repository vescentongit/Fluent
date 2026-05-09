import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView,
  Dimensions, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronLeft, Plus, Trash2, Edit2, CreditCard, Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const DebtScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext);
  const { currencySymbol, setDebts: saveDebts } = useContext(UserContext);
  const [debts, setDebts] = useState([
    { id: Date.now().toString(), name: '', nominal: '', dueDate: new Date(), dueDateText: t('onboarding.debt.selectDate', 'Select Date'), interest: '' }
  ]);

  const [showPicker, setShowPicker] = useState(false);
  const [activeDebtId, setActiveDebtId] = useState(null);

  const addDebt = () => {
    const newDebt = {
      id: Date.now().toString(),
      name: '',
      nominal: '',
      dueDate: new Date(),
      dueDateText: t('onboarding.debt.selectDate', 'Select Date'),
      interest: ''
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const updateDebt = (id, field, value) => {
    let finalValue = value;
    if (field === 'nominal') {
      const numericValue = value.replace(/[^0-9]/g, '');
      finalValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    setDebts(debts.map(debt =>
      debt.id === id ? { ...debt, [field]: finalValue } : debt
    ));
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);

    if (selectedDate && activeDebtId) {
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const dateString = selectedDate.toLocaleDateString('en-GB', options);

      setDebts(debts.map(debt =>
        debt.id === activeDebtId
          ? { ...debt, dueDate: selectedDate, dueDateText: dateString }
          : debt
      ));
    }
  };

  const openDatePicker = (id) => {
    setActiveDebtId(id);
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Svg height="240" width={width} viewBox={`0 0 ${width} 240`} style={styles.svg}>
          <Path fill={colors.border} d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} transform="translate(0, 8)" />
          <Path fill={colors.cardAlt} d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} transform="translate(0, 4)" />
          <Path fill={colors.primary} d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`} />
        </Svg>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#FFFFFF" size={32} />
        </TouchableOpacity>

        <View style={styles.assetPlaceholder}>
          <Image source={require('../assets/expense.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.questionText}>{t('onboarding.debt.question1', 'List your current outstanding')} <Text style={styles.emphasis}>{t('onboarding.debt.emphasis', 'debts')}</Text>.</Text>

              {debts.map((debt) => (
                <View key={debt.id} style={styles.debtCard}>
                  <View style={styles.debtHeader}>
                    <CreditCard color="#023E8A" size={20} style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.debtNameInput}
                      placeholder={t('onboarding.debt.namePlaceholder', 'Debt Name : KPR, KTA...')}
                      value={debt.name}
                      onChangeText={(text) => updateDebt(debt.id, 'name', text)}
                    />
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.debtDetailsRow}>
                    <View style={styles.detailColumn}>
                      <Text style={styles.detailLabel}>{t('onboarding.debt.nominal', 'Nominal')} ({currencySymbol})</Text>
                      <TextInput
                        style={styles.detailInput}
                        placeholder={`${currencySymbol} 0`}
                        keyboardType="numeric"
                        value={debt.nominal}
                        onChangeText={(text) => updateDebt(debt.id, 'nominal', text)}
                      />
                    </View>

                    <View style={styles.detailColumn}>
                      <Text style={styles.detailLabel}>{t('onboarding.debt.dueDate', 'Due Date')}</Text>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => openDatePicker(debt.id)}
                      >
                        <Text style={[styles.detailInputText, debt.dueDateText === t('onboarding.debt.selectDate', 'Select Date') && { color: '#CBD5E0' }]}>
                          {debt.dueDateText}
                        </Text>
                        <CalendarIcon color="#023E8A" size={14} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.detailColumnSmall}>
                      <Text style={styles.detailLabel1}>{t('onboarding.debt.interest', 'Interest (%)')}</Text>
                      <TextInput
                        style={styles.detailInput}
                        placeholder="0"
                        keyboardType="numeric"
                        value={debt.interest}
                        onChangeText={(text) => updateDebt(debt.id, 'interest', text)}
                      />
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => removeDebt(debt.id)}>
                      <Trash2 color="#E53E3E" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.addDebtButton} onPress={addDebt}>
                <Plus color="#023E8A" size={20} style={{ marginRight: 8 }} />
                <Text style={styles.addDebtText}>{t('onboarding.debt.addDebt', 'Add Debt')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {showPicker && (
            <DateTimePicker
              value={debts.find(d => d.id === activeDebtId)?.dueDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          <View style={styles.bottomContainer}>
            <View style={styles.progressSection}>
              <View style={styles.progressWrapper}><View style={[styles.progressBar, { width: '66%' }]} /></View>
              <Text style={styles.progressText}>{t('onboarding.progress.4of6', '4 out of 6')}</Text>
            </View>
            <TouchableOpacity style={styles.continueButton} onPress={() => {
                                                              saveDebts(debts); // ← simpan
                                                              navigation.navigate('EconomicPreferences');
                                                            }}>
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
  emphasis: { color: '#eb2929' },
  headerContainer: { height: 210, position: 'relative' },
  svg: { position: 'absolute', top: 0 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 20 },
  assetPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10, marginTop: -20 },
  logo: { width: 150, height: 150, top: 5, },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  content: { paddingHorizontal: 24, marginTop: 10 },
  questionText: { fontSize: 24, fontWeight: 'bold', color: '#023E8A', marginBottom: 20, lineHeight: 32 },
  debtCard: { backgroundColor: '#FAFCFF', borderWidth: 1.5, borderColor: '#023E8A', borderRadius: 16, padding: 16, marginBottom: 20 },
  debtHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  debtNameInput: { flex: 1, fontSize: 16, fontWeight: '600', color: '#023E8A', padding: 0 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 12 },
  debtDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  detailColumn: { flex: 2 },
  detailColumnSmall: { flex: 1, marginTop: 3 },
  detailLabel: { fontSize: 11, color: '#023E8A', fontWeight: 'bold', marginBottom: 6 },
  detailLabel1: { fontSize: 9, color: '#023E8A', fontWeight: 'bold', marginBottom: 6 },
  detailInput: { borderWidth: 1, borderColor: '#023E8A', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, fontSize: 13, color: '#1A202C', backgroundColor: '#FFFFFF', fontWeight: 'bold' },

  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#023E8A',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  detailInputText: { fontSize: 11, fontWeight: 'bold', color: '#1A202C' },

  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  addDebtButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#023E8A', borderRadius: 24, paddingVertical: 12, backgroundColor: '#F8FAFC', marginBottom: 20 },
  addDebtText: { fontSize: 16, fontWeight: 'bold', color: '#023E8A' },
  bottomContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 10, backgroundColor: '#FFFFFF' },
  progressSection: { flexDirection: 'column' },
  progressWrapper: { height: 6, width: 100, backgroundColor: '#b4dff7', borderRadius: 3, marginBottom: 8 },
  progressBar: { height: '100%', backgroundColor: '#023E8A', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#4A5568', fontWeight: '600' },
  continueButton: { backgroundColor: '#023E8A', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  continueText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});

export default DebtScreen;