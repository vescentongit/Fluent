import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert, Modal, ScrollView
} from 'react-native';
import { Eye, EyeOff, Globe, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import WaveHeader from '../components/WaveHeader';
import { login } from '../services/api';

const ASEAN_LANGUAGES = ['en', 'id', 'ms', 'tl', 'vi', 'th', 'my', 'km', 'lo'];

const LoginScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [langModalVisible, setLangModalVisible] = useState(false);
  
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLangModalVisible(false);
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error', 'Error'), t('auth.emailPasswordRequired', 'Email and password are required.'));
      return;
    }

    setIsLoading(true);
    try {
      const data = await login(email, password);

      if (data.access_token) {
        navigation.navigate('Home');  // ← langsung ke Home setelah login
      } else {
        Alert.alert(t('auth.loginFailed', 'Login Failed'), t('auth.invalidCredentials', 'Invalid email or password.'));
      }
    } catch (e) {
      console.error('Login error:', e.message, e);
      Alert.alert(t('common.error', 'Error'), `${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <WaveHeader />

      <View style={styles.headerContent}>
        <View style={styles.topRightControls}>
          <TouchableOpacity 
            style={styles.langButton}
            onPress={() => setLangModalVisible(true)}
          >
            <Globe color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/logo2.png')}
          style={[styles.logo, { tintColor: '#FFFFFF' }]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.greetingText}>{t('auth.welcomeBack', 'Welcome Back!')}</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="budi@demo.com"
            placeholderTextColor="#A0AEC0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>{t('auth.password', 'Password')}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#A0AEC0"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff color="#1A202C" size={20} /> : <Eye color="#1A202C" size={20} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={styles.loginButtonText}>{t('auth.loginBtn', 'Login')}</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>{t('auth.forgotPassword', 'Forgot your password?')}</Text>
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text style={styles.footerText}>{t('auth.noAccount', "Don't have an account?")} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpText}>{t('auth.registerNow', 'Sign up here!')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal visible={langModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('settings.selectLanguage', 'Select Language')}</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.langScrollView}>
              {ASEAN_LANGUAGES.map((lang) => (
                <TouchableOpacity 
                  key={lang} 
                  style={styles.langOption} 
                  onPress={() => changeLanguage(lang)}
                >
                  <Text style={[styles.langText, i18n.language === lang && styles.langTextActive]}>
                    {lang.toUpperCase()}
                  </Text>
                  {i18n.language === lang && <Check color="#0047AB" size={20} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLangModalVisible(false)}>
              <Text style={styles.closeBtnText}>{t('common.cancel', 'Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

// styles sama persis seperti sebelumnya — tidak perlu diubah
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFCFF' },
  headerContent: { height: 250, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  logo: { width: 100, height: 100 },
  contentContainer: { flex: 1, paddingHorizontal: 24, marginTop: -30 },
  greetingText: { fontSize: 28, fontWeight: 'bold', color: '#003366', marginBottom: 20, marginTop: 40 },
  formCard: { backgroundColor: '#F4F7FA', borderRadius: 16, padding: 24, elevation: 2 },
  label: { fontSize: 14, color: '#A0AEC0', fontWeight: '600', marginBottom: 8 },
  input: { borderBottomWidth: 1, borderBottomColor: '#CBD5E0', fontSize: 16, color: '#1A202C', paddingVertical: 8, marginBottom: 24, fontWeight: '500' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CBD5E0', marginBottom: 32 },
  passwordInput: { flex: 1, fontSize: 16, color: '#1A202C', paddingVertical: 8, fontWeight: '500' },
  loginButton: { backgroundColor: '#0047AB', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { alignItems: 'center', marginTop: 40 },
  forgotPassword: { color: '#A0AEC0', fontWeight: '600', marginBottom: 12 },
  signUpContainer: { flexDirection: 'row' },
  footerText: { color: '#1A202C', fontWeight: 'bold' },
  signUpText: { color: '#0244c9', fontWeight: 'bold' },
  topRightControls: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  langButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginBottom: 10 },
  langScrollView: { maxHeight: 350 },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  langText: { fontSize: 16, color: '#1A202C' },
  langTextActive: { fontWeight: 'bold', color: '#0047AB' },
  closeBtn: { marginTop: 20, alignItems: 'center', paddingVertical: 14, backgroundColor: '#F7FAFC', borderRadius: 12 },
  closeBtnText: { color: '#1A202C', fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;