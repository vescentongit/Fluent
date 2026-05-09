import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Modal, Switch, Image } from 'react-native';
import { ArrowLeft, ChevronRight, Bell, Moon, Globe, DollarSign, CircleHelp, Check, Home, Wallet, BookOpen, Crown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import SubscriptionModal from '../components/SubscriptionModal';

const SettingToggleRow = ({ icon: Icon, name, value, onValueChange, styles, colors }) => (
  <View style={styles.settingRow}>
    <Icon color={colors.text} size={24} strokeWidth={2} />
    <Text style={styles.settingName}>{name}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.border}
    />
  </View>
);

const SettingNavRow = ({ icon: Icon, name, value, onPress, styles, colors }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
    <Icon color={colors.text} size={24} strokeWidth={2} />
    <Text style={styles.settingName}>{name}</Text>
    {value && <Text style={styles.settingValue}>{value}</Text>}
    <ChevronRight color={colors.textMuted} size={20} />
  </TouchableOpacity>
);

const AppSettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  const { isDarkMode, toggleDarkMode, colors } = useContext(ThemeContext);
  const { currency, currencySymbol, setCurrency, availableCurrencies, subscriptionPlan } = useContext(UserContext);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const ASEAN_LANGUAGES = ['en', 'id', 'ms', 'tl', 'vi', 'th', 'my', 'km', 'lo'];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLangModalVisible(false);
  };

  const handleCurrencyChange = (currCode) => {
    setCurrency(currCode);
    setCurrencyModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{t('settings.appSettings', 'App Settings')}</Text>
            <Text style={styles.headerSubtitle}>{t('settings.customize', 'Customize your experience')}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>{t('settings.preferences', 'PREFERENCES')}</Text>
        
        <View style={styles.sectionGroup}>
          <SettingToggleRow 
            icon={Bell} 
            name={t('settings.notifications', 'Notifications')} 
            value={notifications} 
            onValueChange={setNotifications} 
            styles={styles} colors={colors}
          />
          <SettingToggleRow 
            icon={Moon} 
            name={t('settings.darkMode', 'Dark Mode')} 
            value={isDarkMode} 
            onValueChange={toggleDarkMode} 
            styles={styles} colors={colors}
          />
          <SettingNavRow 
            icon={Globe} 
            name={t('settings.language', 'Language')} 
            value={t(`languages.${i18n.language}`, 'English')} 
            onPress={() => setLangModalVisible(true)} 
            styles={styles} colors={colors}
          />
          <SettingNavRow 
            icon={DollarSign} 
            name={t('settings.currency', 'Currency')} 
            value={currency} 
            onPress={() => setCurrencyModalVisible(true)} 
            styles={styles} colors={colors}
          />
          <SettingNavRow 
            icon={Crown} 
            name={t('settings.subscriptionPlan', 'Subscription Plan')} 
            value={subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)} 
            onPress={() => setSubscriptionModalVisible(true)} 
            styles={styles} colors={colors}
          />
        </View>

        <Text style={styles.sectionTitle}>{t('settings.support', 'SUPPORT')}</Text>
        
        <View style={styles.sectionGroup}>
          <SettingNavRow 
            icon={CircleHelp} 
            name={t('settings.helpSupport', 'Help & Support')} 
            onPress={() => navigation.navigate('Support')} 
            styles={styles} colors={colors}
          />
        </View>

      </ScrollView>

      <Modal visible={langModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('settings.selectLanguage', 'Select Language')}</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.langScrollView}>
              {ASEAN_LANGUAGES.map((langCode) => (
                <TouchableOpacity 
                  key={langCode} 
                  style={styles.langOption} 
                  onPress={() => changeLanguage(langCode)}
                >
                  <Text style={[styles.langText, i18n.language === langCode && styles.langTextActive]}>
                    {t(`languages.${langCode}`, langCode.toUpperCase())}
                  </Text>
                  {i18n.language === langCode && <Check color={colors.primary} size={20} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLangModalVisible(false)}>
              <Text style={styles.closeBtnText}>{t('common.cancel', 'Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={currencyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('settings.selectCurrency', 'Select Currency')}</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.langScrollView}>
              {availableCurrencies && availableCurrencies.map((currCode) => (
                <TouchableOpacity 
                  key={currCode} 
                  style={styles.langOption} 
                  onPress={() => handleCurrencyChange(currCode)}
                >
                  <Text style={[styles.langText, currency === currCode && styles.langTextActive]}>
                    {currCode}
                  </Text>
                  {currency === currCode && <Check color={colors.primary} size={20} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCurrencyModalVisible(false)}>
              <Text style={styles.closeBtnText}>{t('common.cancel', 'Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SubscriptionModal 
        visible={subscriptionModalVisible}
        onClose={() => setSubscriptionModalVisible(false)}
      />

    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  headerSafeArea: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 50 : 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 20
  },
  backButton: {
    marginRight: 16,
    marginTop: 4
  },
  headerTextContainer: {
    flex: 1
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textMuted
  },
  scrollContent: {
    paddingBottom: 120
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 0.5
  },
  sectionGroup: {
    paddingHorizontal: 24
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.background
  },
  settingName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 16
  },
  settingValue: {
    fontSize: 14,
    color: colors.textMuted,
    marginRight: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10
  },
  langScrollView: {
    maxHeight: 350
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  langText: {
    fontSize: 16,
    color: colors.text
  },
  langTextActive: {
    fontWeight: 'bold',
    color: colors.primary
  },
  closeBtn: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: colors.cardAlt,
    borderRadius: 12
  },
  closeBtnText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16
  },
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 75,
    backgroundColor: colors.navBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navText: {
    color: colors.navIconActive,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600'
  },
  navProfileImg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.8
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20
  },
  fab: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -44,
    borderWidth: 6,
    borderColor: colors.navBg
  },
  fabIcon: {
    width: 44,
    height: 44
  }
});

export default AppSettingsScreen;