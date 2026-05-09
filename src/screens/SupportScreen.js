import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image, Linking } from 'react-native';
import { ArrowLeft, Home, Wallet, BookOpen } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const SupportScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#000000" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{t('support.title', 'Help & Support')}</Text>
            <Text style={styles.headerSubtitle}>{t('support.subtitle', 'Contact & Legal Information')}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>{t('support.contactUs', 'CONTACT US')}</Text>
          <Text style={styles.bodyText}>
            {t('support.contactDesc', 'If you have any questions or issues regarding our services, please feel free to reach out to our team at any time.')}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:support@fluent.id')}>
            <Text style={styles.linkText}>support@fluent.id</Text>
          </TouchableOpacity>
          <Text style={styles.bodyText}>+62 812-3456-7890</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>{t('support.legal', 'PRIVACY POLICY & TERMS')}</Text>
          
          <Text style={styles.subHeading}>{t('support.termsTitle', 'Terms of Service')}</Text>
          <Text style={styles.bodyText}>
            {t('support.termsContent', 'By using Fluent, you agree to comply with our terms. We provide AI-driven financial guidance to help you manage your money across ASEAN. Users are responsible for maintaining the confidentiality of their account information.')}
          </Text>

          <Text style={styles.subHeading}>{t('support.privacyTitle', 'Privacy Policy')}</Text>
          <Text style={styles.bodyText}>
            {t('support.privacyContent', 'We value your privacy. Fluent collects financial data and personal information strictly to provide personalized financial simulations and resilience scores. Your data is encrypted and will never be shared with third parties without your explicit consent.')}
          </Text>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>Fluent v1.0.4 (Beta)</Text>
          <Text style={styles.copyrightText}>© 2026 Fluent ASEAN. blukutuk77. All rights reserved.</Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  headerSafeArea: {
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096'
  },
  scrollContent: {
    paddingBottom: 120
  },
  textSection: {
    paddingHorizontal: 24,
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#718096',
    marginBottom: 16,
    letterSpacing: 0.5
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginTop: 12,
    marginBottom: 8
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4A5568',
    marginBottom: 12
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0047AB',
    marginBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginHorizontal: 24,
    marginTop: 20
  },
  footerInfo: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 24
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A0AEC0',
    marginBottom: 4
  },
  copyrightText: {
    fontSize: 11,
    color: '#CBD5E0',
    textAlign: 'center'
  },
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 75,
    backgroundColor: '#023E8A',
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
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -44,
    borderWidth: 6,
    borderColor: '#023E8A'
  },
  fabIcon: {
    width: 44,
    height: 44
  }
});

export default SupportScreen;