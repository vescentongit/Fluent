import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import WaveHeader from '../components/WaveHeader';

const NewPasswordScreen = ({ navigation }) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.mainWrapper}>
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
        <Text style={styles.title}>New Password</Text>
        <Text style={styles.subtitle}>Enter your new password to access your account.</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passInputContainer}>
            <TextInput style={styles.passInput} placeholder="••••••••" secureTextEntry={!showPass} />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff color="#1A202C" size={20} /> : <Eye color="#1A202C" size={20} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passInputContainer}>
            <TextInput style={styles.passInput} placeholder="••••••••" secureTextEntry={!showPass} />
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  subtitle: { fontSize: 14, color: '#718096', marginBottom: 30 },
  formCard: { backgroundColor: '#F4F7FA', borderRadius: 16, padding: 24, elevation: 3 },
  label: { fontSize: 13, color: '#A0AEC0', fontWeight: '600', marginBottom: 5 },
  passInputContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CBD5E0', marginBottom: 25, alignItems: 'center' },
  passInput: { flex: 1, paddingVertical: 8, fontSize: 16 },
  submitButton: { backgroundColor: '#0047AB', borderRadius: 24, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default NewPasswordScreen;