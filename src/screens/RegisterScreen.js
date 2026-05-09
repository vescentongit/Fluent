import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import BottomWave from '../components/BottomWave';
import { UserContext } from '../context/UserContext';

const RegisterScreen = ({ navigation }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [phone, setPhone] = useState('');
  const { setCurrency, setPhoneNumber } = useContext(UserContext);

  const handleRegister = () => {
    let newCurrency = 'IDR';
    if (phone.startsWith('+60')) {
      newCurrency = 'MYR';
    } else if (phone.startsWith('+62')) {
      newCurrency = 'IDR';
    } else if (phone.startsWith('+673')) {
      newCurrency = 'BND';
    } else if (phone.startsWith('+855')) {
      newCurrency = 'KHR';
    } else if (phone.startsWith('+66')) {
      newCurrency = 'THB';
    } else if (phone.startsWith('+84')) {
      newCurrency = 'VND';
    } else if (phone.startsWith('+65')) {
      newCurrency = 'SGD';
    } else if (phone.startsWith('+63')) {
      newCurrency = "PHP";
    } else if (phone.startsWith('+95')) {
      newCurrency = "MMK";
    } else if (phone.startsWith('+856')) {
      newCurrency = "LAK";
    }
    setPhoneNumber(phone);
    setCurrency(newCurrency);
    navigation.navigate('Loading');
  };

  return (
    <View style={styles.mainWrapper}>
      <BottomWave />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft color="#0047AB" size={30} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image source={require('../assets/logo2.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Create Account</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} placeholder="Shaquille" placeholderTextColor="#A0AEC0" />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="nathan@std.stei.itb.ac.id" placeholderTextColor="#A0AEC0" keyboardType="email-address" />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+62811990125"
              placeholderTextColor="#A0AEC0"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passInputContainer}>
              <TextInput style={styles.passInput} placeholder="••••••••" secureTextEntry={!showPass} />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff color="#1A202C" size={20} /> : <Eye color="#1A202C" size={20} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passInputContainer}>
              <TextInput style={styles.passInput} placeholder="••••••••" secureTextEntry={!showConfirmPass} />
              <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                {showConfirmPass ? <EyeOff color="#1A202C" size={20} /> : <Eye color="#1A202C" size={20} />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.loginLink}>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.socialText}>Or continue with</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.iconCircle}>
                <Image source={require('../assets/google_icon.png')} style={styles.socialLogo} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <Image source={require('../assets/apple_icon.png')} style={styles.socialLogo} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <Image source={require('../assets/fb_icon.png')} style={styles.socialLogo} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollContainer: {
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  backButton: { marginTop: 50, marginLeft: 20 },
  header: { alignItems: 'center', marginTop: 10 },
  logo: { width: 70, height: 70 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#023E8A', marginTop: 10 },
  socialLogo: { width: 24, height: 24, resizeMode: 'contain' },
  formCard: {
    marginHorizontal: 24, marginTop: 30, backgroundColor: '#F4F7FA',
    borderRadius: 20, padding: 20, elevation: 3
  },
  label: { fontSize: 13, color: '#A0AEC0', fontWeight: '600', marginBottom: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: '#CBD5E0', marginBottom: 20, paddingVertical: 5, fontSize: 15 },
  passInputContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CBD5E0', marginBottom: 20, alignItems: 'center' },
  passInput: { flex: 1, paddingVertical: 5, fontSize: 15 },
  registerButton: { backgroundColor: '#0047AB', borderRadius: 25, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  registerText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  loginText: { fontWeight: 'bold', color: '#0047AB' },
  socialSection: { alignItems: 'center', marginTop: 30 },
  socialText: { color: '#718096', marginBottom: 15 },
  socialIcons: { flexDirection: 'row', gap: 20 },
  iconCircle: {
    width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  }
});

export default RegisterScreen;