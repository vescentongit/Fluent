import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import WaveHeader from '../components/WaveHeader';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView 
      style={styles.mainWrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="darrel@std.stei.itb.ac.id"
            placeholderTextColor="#A0AEC0"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => navigation.navigate('Verification')}
          >
            <Text style={styles.submitButtonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { 
    flex: 1, 
    backgroundColor: '#FAFCFF' 
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
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
  contentContainer: {
    marginTop: 100,
    flex: 1,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#023E8A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 30,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#F4F7FA',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: { 
    fontSize: 13, 
    color: '#A0AEC0', 
    fontWeight: '600', 
    marginBottom: 5 
  },
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#CBD5E0', 
    fontSize: 16, 
    paddingVertical: 8, 
    marginBottom: 30,
    color: '#1A202C'
  },
  submitButton: { 
    backgroundColor: '#0047AB', 
    borderRadius: 24, 
    paddingVertical: 14, 
    alignItems: 'center' 
  },
  submitButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default ForgotPasswordScreen;