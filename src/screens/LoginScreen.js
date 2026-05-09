import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import WaveHeader from '../components/WaveHeader';
import { login } from '../services/api';  // ← import API

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await login(email, password);

      if (data.access_token) {
        navigation.navigate('Home');  // ← langsung ke Home setelah login
      } else {
        Alert.alert('Login Gagal', 'Email atau password salah.');
      }
    } catch (e) {
      console.error('Login error:', e.message, e);
      Alert.alert('Error', `${e.message}`);
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
        <Image
          source={require('../assets/logo2.png')}
          style={[styles.logo, { tintColor: '#FFFFFF' }]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.greetingText}>Welcome Back!</Text>

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

          <Text style={styles.label}>Password</Text>
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
              : <Text style={styles.loginButtonText}>Login</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpText}>Sign up here!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
});

export default LoginScreen;