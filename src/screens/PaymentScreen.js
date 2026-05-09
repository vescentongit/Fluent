import React, { useState, useContext, useMemo } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ScrollView, TextInput, Image, Platform, KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, CreditCard, Lock, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';

const PaymentScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { plan = 'plus', price = 49000 } = route.params || {};
  const { isDarkMode, colors } = useContext(ThemeContext);
  const { formatCurrency, setSubscriptionPlan } = useContext(UserContext);
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'paypal'
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCardNumberChange = (text) => {
    // Format card number: XXXX XXXX XXXX XXXX
    const formatted = text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    if (formatted.length <= 19) setCardNumber(formatted);
  };

  const handleExpiryChange = (text) => {
    // Format expiry: MM/YY
    let formatted = text.replace(/\//g, '');
    if (formatted.length >= 2) {
      formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
    }
    if (formatted.length <= 5) setExpiry(formatted);
  };

  const handlePay = () => {
    // Basic validation
    if (paymentMethod === 'card') {
      if (cardNumber.length < 19 || !cardName || expiry.length < 5 || cvv.length < 3) {
        return alert(t('payment.fillAllFields', 'Please fill all card details correctly.'));
      }
    }

    setIsProcessing(true);

    // Simulate API call to payment gateway
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setSubscriptionPlan(plan);
      
      // Navigate back after success animation
      setTimeout(() => {
        navigation.navigate('Home');
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, styles.centerAll]}>
        <CheckCircle2 color={colors.success} size={100} />
        <Text style={styles.successTitle}>{t('payment.paymentSuccess', 'Payment Successful!')}</Text>
        <Text style={styles.successSubtitle}>
          {t('payment.welcomeTo', 'Welcome to Fluent')} {plan === 'plus' ? 'Plus' : 'Elite'}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color={colors.text} size={26} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('payment.checkout', 'Checkout')}</Text>
          <View style={{ width: 26 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionLabel}>{t('payment.orderSummary', 'Order Summary')}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.planName}>Fluent {plan === 'plus' ? 'Plus' : 'Elite'} {t('payment.monthly', '(Monthly)')}</Text>
            <Text style={styles.planPrice}>{formatCurrency(price)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t('payment.total', 'Total')}</Text>
            <Text style={styles.totalPrice}>{formatCurrency(price)}</Text>
          </View>
        </View>

        {/* Payment Method Selector */}
        <Text style={styles.sectionLabel}>{t('payment.paymentMethod', 'Payment Method')}</Text>
        <View style={styles.methodsRow}>
          <TouchableOpacity 
            style={[styles.methodBtn, paymentMethod === 'card' && styles.methodBtnActive]}
            onPress={() => setPaymentMethod('card')}
          >
            <CreditCard color={paymentMethod === 'card' ? colors.primary : colors.textMuted} size={24} />
            <Text style={[styles.methodText, paymentMethod === 'card' && styles.methodTextActive]}>
              {t('payment.creditCard', 'Credit Card')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.methodBtn, paymentMethod === 'paypal' && styles.methodBtnActive]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', color: paymentMethod === 'paypal' ? '#00457C' : colors.textMuted }}>
              Pay<Text style={{ color: paymentMethod === 'paypal' ? '#0079C1' : colors.textMuted }}>Pal</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Form */}
        {paymentMethod === 'card' && (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('payment.cardName', 'Cardholder Name')}</Text>
              <TextInput 
                style={styles.input} 
                placeholder="John Doe" 
                placeholderTextColor={colors.textMuted}
                value={cardName}
                onChangeText={setCardName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('payment.cardNumber', 'Card Number')}</Text>
              <View style={styles.cardInputWrapper}>
                <CreditCard color={colors.textMuted} size={20} style={styles.inputIcon} />
                <TextInput 
                  style={styles.inputWithIcon} 
                  placeholder="0000 0000 0000 0000" 
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={19}
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>{t('payment.expiry', 'Expiry Date')}</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="MM/YY" 
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={handleExpiryChange}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="123" 
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>
          </View>
        )}

        {/* PayPal Info */}
        {paymentMethod === 'paypal' && (
          <View style={styles.paypalContainer}>
            <Text style={styles.paypalDesc}>
              {t('payment.paypalDesc', 'You will be redirected to PayPal to complete your purchase securely.')}
            </Text>
          </View>
        )}

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Lock color={colors.textMuted} size={14} />
          <Text style={styles.securityText}>{t('payment.secureTransaction', 'Payments are secure and encrypted')}</Text>
        </View>

      </ScrollView>

      {/* Footer Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePay}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.payButtonText}>
              {paymentMethod === 'paypal' ? t('payment.payWithPaypal', 'Pay with PayPal') : `${t('payment.pay', 'Pay')} ${formatCurrency(price)}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerAll: { justifyContent: 'center', alignItems: 'center' },
  headerSafeArea: { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? 50 : 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 24, marginBottom: 12 },
  
  summaryCard: { backgroundColor: colors.card, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: 16, color: colors.text, fontWeight: '500' },
  planPrice: { fontSize: 16, color: colors.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  totalLabel: { fontSize: 16, color: colors.text, fontWeight: 'bold' },
  totalPrice: { fontSize: 20, color: colors.primary, fontWeight: '900' },

  methodsRow: { flexDirection: 'row', gap: 12 },
  methodBtn: { flex: 1, height: 60, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  methodBtnActive: { borderColor: colors.primary, backgroundColor: isDarkMode ? 'rgba(49,130,206,0.1)' : '#EBF4FF', borderWidth: 2 },
  methodText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  methodTextActive: { color: colors.primary },

  formContainer: { marginTop: 24 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginBottom: 8 },
  input: { height: 52, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, color: colors.text },
  cardInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, height: 52 },
  inputIcon: { marginRight: 12 },
  inputWithIcon: { flex: 1, fontSize: 15, color: colors.text, height: '100%' },
  rowInputs: { flexDirection: 'row' },

  paypalContainer: { marginTop: 24, backgroundColor: isDarkMode ? '#1A202C' : '#F7FAFC', padding: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  paypalDesc: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },

  securityBadge: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 32 },
  securityText: { fontSize: 12, color: colors.textMuted },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.card, padding: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: Platform.OS === 'ios' ? 34 : 20 },
  payButton: { backgroundColor: colors.primary, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  payButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  successTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 8 },
  successSubtitle: { fontSize: 16, color: colors.textMuted },
});

export default PaymentScreen;
