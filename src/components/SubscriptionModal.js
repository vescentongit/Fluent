import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform, Alert, Dimensions } from 'react-native';
import { X, CheckCircle2, Zap, Crown, Shield } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const PLUS_PRICE = 49000;
const ELITE_PRICE = 199000;

const SubscriptionModal = ({ visible, onClose }) => {
  const { subscriptionPlan, setSubscriptionPlan, formatCurrency } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

  const navigation = useNavigation();

  const handleUpgrade = (plan) => {
    if (subscriptionPlan === plan) return;
    onClose();
    navigation.navigate('Payment', {
      plan,
      price: plan === 'plus' ? PLUS_PRICE : ELITE_PRICE
    });
  };

  const renderFeature = (text, included) => (
    <View style={styles.featureRow}>
      {included ? (
        <CheckCircle2 color={colors.success} size={18} style={{ marginRight: 8 }} />
      ) : (
        <X color={colors.textMuted} size={18} style={{ marginRight: 8 }} />
      )}
      <Text style={[styles.featureText, !included && styles.featureTextDisabled]}>{text}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={colors.text} size={24} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>{t('subscription.choosePlan', 'Choose Your Plan')}</Text>
            <Text style={styles.subtitle}>{t('subscription.unlockPotential', 'Unlock your full financial potential.')}</Text>

            {/* BASIC PLAN */}
            <View style={[styles.card, subscriptionPlan === 'basic' && styles.cardActiveBasic]}>
              {subscriptionPlan === 'basic' && (
                <View style={styles.currentBadgeBasic}><Text style={styles.currentBadgeText}>{t('subscription.currentPlan', 'CURRENT PLAN').toUpperCase()}</Text></View>
              )}
              <View style={styles.cardHeader}>
                <Shield color={colors.textMuted} size={28} />
                <View style={styles.cardHeaderTexts}>
                  <Text style={styles.planName}>{t('subscription.basic', 'Basic')}</Text>
                  <Text style={styles.planPrice}>{t('subscription.free', 'Free')}</Text>
                </View>
              </View>
              <Text style={styles.planDesc}>{t('subscription.basicDesc', 'Experience the basics. Limited access to features.')}</Text>
              
              <View style={styles.featuresContainer}>
                {renderFeature(t('subscription.max5Prompts', 'Max 5 AI prompts / day'), true)}
                {renderFeature(t('subscription.max2Goals', 'Max 2 Active Goals'), true)}
                {renderFeature(t('subscription.max3Transactions', 'Max 3 transactions / day'), true)}
                {renderFeature(t('subscription.fullLessons', 'Full access to lessons'), true)}
                {renderFeature(t('subscription.unlimitedTracking', 'Unlimited tracking & goals'), false)}
                {renderFeature(t('subscription.advisorSession1', '1-on-1 Advisor Session'), false)}
              </View>
              
              <TouchableOpacity 
                style={[styles.actionButton, subscriptionPlan === 'basic' ? styles.actionButtonDisabled : styles.actionButtonOutline]}
                disabled={subscriptionPlan === 'basic'}
                onPress={() => setSubscriptionPlan('basic')}
              >
                <Text style={[styles.actionButtonTextOutline, subscriptionPlan === 'basic' && styles.actionButtonTextDisabled]}>
                  {subscriptionPlan === 'basic' ? t('subscription.currentPlan', 'Current Plan') : t('subscription.downgrade', 'Downgrade')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* FLUENT PLUS */}
            <View style={[styles.card, styles.cardPlus, subscriptionPlan === 'plus' && styles.cardActivePlus]}>
              {subscriptionPlan !== 'plus' && (
                <View style={styles.popularBadge}><Text style={styles.popularBadgeText}>{t('subscription.mostPopular', 'MOST POPULAR')}</Text></View>
              )}
              {subscriptionPlan === 'plus' && (
                <View style={styles.currentBadgePlus}><Text style={styles.currentBadgeText}>{t('subscription.currentPlan', 'CURRENT PLAN').toUpperCase()}</Text></View>
              )}
              
              <View style={styles.cardHeader}>
                <View style={styles.iconBgPlus}><Zap color={colors.primary} size={28} /></View>
                <View style={styles.cardHeaderTexts}>
                  <Text style={[styles.planName, { color: colors.primary }]}>{t('subscription.fluentPlus', 'Fluent Plus')}</Text>
                  <Text style={styles.planPrice}>{formatCurrency(PLUS_PRICE)}<Text style={styles.planPriceUnit}>{t('subscription.perMo', ' /mo')}</Text></Text>
                </View>
              </View>
              <Text style={styles.planDesc}>{t('subscription.plusDesc', 'Everything you need to master your finances.')}</Text>
              
              <View style={styles.featuresContainer}>
                {renderFeature(t('subscription.unlimitedAI', 'Unlimited AI conversations'), true)}
                {renderFeature(t('subscription.unlimitedGoals', 'Unlimited Active Goals'), true)}
                {renderFeature(t('subscription.unlimitedTransactions', 'Unlimited transaction tracking'), true)}
                {renderFeature(t('subscription.fullLessons', 'Full access to lessons'), true)}
                {renderFeature(t('subscription.advisorSession1', '1-on-1 Advisor Session'), false)}
              </View>
              
              <TouchableOpacity 
                style={[styles.actionButton, subscriptionPlan === 'plus' ? styles.actionButtonDisabled : styles.actionButtonPrimary]}
                disabled={subscriptionPlan === 'plus'}
                onPress={() => handleUpgrade('plus')}
              >
                <Text style={[styles.actionButtonText, subscriptionPlan === 'plus' && styles.actionButtonTextDisabled]}>
                  {subscriptionPlan === 'plus' ? t('subscription.currentPlan', 'Current Plan') : t('subscription.upgradePlus', 'Upgrade to Plus')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* FLUENT ELITE */}
            <View style={[styles.card, styles.cardElite, subscriptionPlan === 'elite' && styles.cardActiveElite]}>
              <View style={styles.eliteBg}>
                <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor={isDarkMode ? '#4C1D95' : '#E9D8FD'} stopOpacity="0.5" />
                      <Stop offset="1" stopColor={isDarkMode ? '#2D3748' : '#FAF5FF'} stopOpacity="0.1" />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" fill="url(#grad)" />
                </Svg>
              </View>
              
              {subscriptionPlan === 'elite' && (
                <View style={styles.currentBadgeElite}><Text style={styles.currentBadgeText}>{t('subscription.currentPlan', 'CURRENT PLAN').toUpperCase()}</Text></View>
              )}
              
              <View style={styles.cardHeader}>
                <View style={styles.iconBgElite}><Crown color="#D69E2E" size={28} /></View>
                <View style={styles.cardHeaderTexts}>
                  <Text style={[styles.planName, { color: '#D69E2E' }]}>{t('subscription.fluentElite', 'Fluent Elite')}</Text>
                  <Text style={styles.planPrice}>{formatCurrency(ELITE_PRICE)}<Text style={styles.planPriceUnit}>{t('subscription.perMo', ' /mo')}</Text></Text>
                </View>
              </View>
              <Text style={styles.planDesc}>{t('subscription.eliteDesc', 'High-ticket access with real professional guidance.')}</Text>
              
              <View style={styles.featuresContainer}>
                {renderFeature(t('subscription.allPlusFeatures', 'All Fluent Plus features'), true)}
                {renderFeature(t('subscription.advisorSession2', '2x CFP Advisor Session / month'), true)}
                {renderFeature(t('subscription.priorityAI', 'Priority AI responses'), true)}
              </View>
              
              <TouchableOpacity 
                style={[styles.actionButton, subscriptionPlan === 'elite' ? styles.actionButtonDisabled : styles.actionButtonElite]}
                disabled={subscriptionPlan === 'elite'}
                onPress={() => handleUpgrade('elite')}
              >
                <Text style={[styles.actionButtonText, subscriptionPlan === 'elite' && styles.actionButtonTextDisabled, subscriptionPlan !== 'elite' && { color: '#000000' }]}>
                  {subscriptionPlan === 'elite' ? t('subscription.currentPlan', 'Current Plan') : t('subscription.upgradeElite', 'Upgrade to Elite')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{height: 40}} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '90%', paddingTop: 20 },
  closeButton: { position: 'absolute', top: 20, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardAlt, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 30 },
  
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 24, marginBottom: 20, borderWidth: 2, borderColor: 'transparent', position: 'relative', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  cardPlus: { borderColor: isDarkMode ? 'rgba(66,153,225,0.3)' : 'rgba(66,153,225,0.1)', backgroundColor: isDarkMode ? 'rgba(49,130,206,0.05)' : '#F7FAFC' },
  cardElite: { borderColor: isDarkMode ? 'rgba(159,122,234,0.3)' : 'rgba(159,122,234,0.1)', backgroundColor: isDarkMode ? 'rgba(128,90,213,0.05)' : '#FAF5FF' },
  
  cardActiveBasic: { borderColor: colors.border },
  cardActivePlus: { borderColor: colors.primary },
  cardActiveElite: { borderColor: '#D69E2E' },
  
  eliteBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  
  popularBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderBottomLeftRadius: 12 },
  popularBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  
  currentBadgeBasic: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.border, paddingHorizontal: 12, paddingVertical: 6, borderBottomLeftRadius: 12 },
  currentBadgePlus: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderBottomLeftRadius: 12 },
  currentBadgeElite: { position: 'absolute', top: 0, right: 0, backgroundColor: '#D69E2E', paddingHorizontal: 12, paddingVertical: 6, borderBottomLeftRadius: 12 },
  currentBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, zIndex: 1 },
  iconBgPlus: { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.2)' : '#EBF4FF', padding: 10, borderRadius: 12 },
  iconBgElite: { backgroundColor: isDarkMode ? 'rgba(214,158,46,0.2)' : '#FEFCBF', padding: 10, borderRadius: 12 },
  cardHeaderTexts: { marginLeft: 16 },
  
  planName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  planPrice: { fontSize: 24, fontWeight: '900', color: colors.text, marginTop: 4 },
  planPriceUnit: { fontSize: 14, fontWeight: 'normal', color: colors.textMuted },
  planDesc: { fontSize: 14, color: colors.textMuted, marginBottom: 20, lineHeight: 20, zIndex: 1 },
  
  featuresContainer: { marginBottom: 24, gap: 12, zIndex: 1 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureText: { fontSize: 14, color: colors.text, flex: 1 },
  featureTextDisabled: { color: colors.textMuted, textDecorationLine: 'line-through' },
  
  actionButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  actionButtonPrimary: { backgroundColor: colors.primary },
  actionButtonElite: { backgroundColor: '#F6E05E' },
  actionButtonOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  actionButtonDisabled: { backgroundColor: colors.cardAlt },
  
  actionButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  actionButtonTextOutline: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  actionButtonTextDisabled: { color: colors.textMuted },
});

export default SubscriptionModal;
