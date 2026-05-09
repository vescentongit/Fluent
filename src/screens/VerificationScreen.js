import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import WaveHeader from '../components/WaveHeader';

const VerificationScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.mainWrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <WaveHeader />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ChevronLeft color="#FFFFFF" size={32} />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Image 
            source={require('../assets/logo2.png')} 
            style={styles.logo} 
            resizeMode="contain" 
        />
        </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t('auth.verification', 'Verification')}</Text>
        <Text style={styles.subtitle}>{t('auth.sentCode', 'Enter your verification code that we sent to your email.')}</Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              ref={(ref) => (inputs.current[index] = ref)}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={() => navigation.navigate('NewPassword')}
        >
          <Text style={styles.verifyButtonText}>{t('auth.verify', 'Verify')}</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>{t('auth.didNotReceive', "Didn't receive the code?")} </Text>
          <TouchableOpacity><Text style={styles.resendLink}>{t('auth.resendCode', 'Resend')}</Text></TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#FAFCFF' },
  headerContent: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 50,
  },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  contentContainer: { flex: 1, paddingHorizontal: 24, marginTop: 100 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#023E8A', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#718096', marginBottom: 40 },
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  codeInput: { 
    width: 60, height: 60, backgroundColor: '#F4F7FA', borderRadius: 12, 
    textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#0047AB',
    elevation: 2, shadowOpacity: 0.1, shadowRadius: 4
  },
  verifyButton: { backgroundColor: '#0047AB', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  verifyButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  resendText: { color: '#718096' },
  resendLink: { color: '#0047AB', fontWeight: 'bold' }
});

export default VerificationScreen;