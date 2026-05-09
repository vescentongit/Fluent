    import React, { useState, useContext } from 'react';
    import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Dimensions, SafeAreaView,
    KeyboardAvoidingView, Platform, ScrollView, Image
    } from 'react-native';
    import Svg, { Path } from 'react-native-svg';
    import { ChevronLeft } from 'lucide-react-native';
    import { UserContext } from '../context/UserContext';
    import { ThemeContext } from '../context/ThemeContext';
    import { useTranslation } from 'react-i18next';
    import { updateUserProfile } from '../services/api';

    const { width } = Dimensions.get('window');

    const MonthlyIncomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [nominal, setNominal] = useState('');
    const { currencySymbol, setMonthlyIncome, localToIDR } = useContext(UserContext);
    const { colors } = useContext(ThemeContext);

    const handleNominalChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        setNominal(formatted);
    };

    const handleContinue = async () => {
        const income = parseInt(nominal.replace(/\./g, ''), 10) || 0;
        setMonthlyIncome(localToIDR(income));
        setMonthlyIncome(income);

        try {
        await updateUserProfile({ monthly_income: income });
        } catch (e) {
        console.log('Could not update income on backend:', e);
        }

        navigation.navigate('Expense');
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
            <View style={styles.iconPlaceholder}>
            <Image 
            source={require('../assets/expense.png')} 
            style={styles.logo} 
            resizeMode="contain"
            />
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
                    {t('onboarding.monthlyIncome.question1', 'What is your')}{' '}
                    <Text style={styles.emphasis}>{t('onboarding.monthlyIncome.emphasis', 'monthly income')}</Text>?
                </Text>

                <Text style={styles.subText}>
                    {t('onboarding.monthlyIncome.subText', 'This helps us calculate your Financial Resilience Score accurately.')}
                </Text>

                <Text style={styles.labelText}>{t('onboarding.monthlyIncome.labelText', 'Monthly Income')}</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.currencyPrefix}>{currencySymbol} </Text>
                    <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#A0AEC0"
                    keyboardType="numeric"
                    value={nominal}
                    onChangeText={handleNominalChange}
                    autoFocus={true}
                    />
                </View>

                <Text style={styles.hintText}>
                    {t('onboarding.monthlyIncome.hintText', 'Include salary, freelance, or any regular income sources.')}
                </Text>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <View style={styles.progressSection}>
                <View style={styles.progressWrapper}>
                    <View style={[styles.progressBar, { width: '16%' }]} />
                </View>
                <Text style={styles.progressText}>{t('onboarding.progress.1of6', '1 out of 6')}</Text>
                </View>
                <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
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
    iconPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    iconEmoji: { fontSize: 80, marginTop: 20 },
    safeArea: { flex: 1, justifyContent: 'space-between' },
    scrollContent: { flexGrow: 1, paddingBottom: 20 },
    content: { paddingHorizontal: 24, marginTop: 10 },
    questionText: { fontSize: 22, fontWeight: 'bold', color: '#023E8A', marginBottom: 12, marginTop: 12 },
    subText: { fontSize: 14, color: '#718096', marginBottom: 28, lineHeight: 20 },
    labelText: { fontSize: 18, fontWeight: 'bold', color: '#023E8A', marginBottom: 12 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
        borderWidth: 1.5, borderColor: '#023E8A', marginBottom: 16,
    },
    currencyPrefix: { fontSize: 18, fontWeight: 'bold', color: '#028A1B', marginRight: 8 },
    input: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#023E8A' },
    hintText: { fontSize: 13, color: '#A0AEC0', fontStyle: 'italic' },
    bottomContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 30 : 20,
        paddingTop: 10, backgroundColor: '#FFFFFF'
    },
    progressSection: { flexDirection: 'column' },
    progressWrapper: { height: 8, width: 100, backgroundColor: '#b4dff7', borderRadius: 4 },
    progressBar: { height: '100%', backgroundColor: '#023E8A', borderRadius: 4 },
    progressText: { fontSize: 12, color: '#4A5568', fontWeight: '600' },
    continueButton: { backgroundColor: '#023E8A', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
    continueText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
    backButton: { position: 'absolute', top: 60, left: 20, zIndex: 20 },
    logo: { width: 150, height: 150, top: 5 },
    });

    export default MonthlyIncomeScreen;