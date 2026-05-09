import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView,
  Dimensions, SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ChevronLeft } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

const ExpenseScreen = ({ navigation }) => {
  const [expense, setExpense] = useState('');
  const { currencySymbol } = useContext(UserContext);

  const handleExpenseChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setExpense(formattedValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#FFFFFF" size={32} />
        </TouchableOpacity>
        <Svg
          height="240" 
          width={width}
          viewBox={`0 0 ${width} 240`}
          style={styles.svg}
        >
          <Defs>
            <LinearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#48CAE4" stopOpacity="1" />
              <Stop offset="50%" stopColor="#76D7EB" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <Path
            fill="rgba(0, 0, 0, 0.04)"
            d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`}
            transform="translate(0, 8)"
          />
          
          <Path
            fill="rgba(0, 0, 0, 0.08)"
            d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`}
            transform="translate(0, 4)"
          />

          <Path
            fill="url(#headerGrad)"
            d={`M0 0 L${width} 0 L${width} 180 C${width * 0.7} 220 ${width * 0.3} 140 0 180 Z`}
          />
        </Svg>
        
        <View style={styles.assetPlaceholder}>
          <Image 
            source={require('../assets/expense.png')}
            style={styles.logo} 
            resizeMode="contain" 
          />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={styles.questionText}>
                How much is your monthly <Text style={styles.emphasis}>expenses</Text>?
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>{currencySymbol} </Text>
                <TextInput
                  style={styles.input}
                  placeholder="2.500.000"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={expense}
                  onChangeText={handleExpenseChange}
                  autoFocus={true} 
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomContainer}>
            <View style={styles.progressSection}>
              <View style={styles.progressWrapper}><View style={[styles.progressBar, { width: '40%' }]} /></View>
              <Text style={styles.progressText}>2 out of 5</Text>
            </View>

            <TouchableOpacity 
              style={[styles.continueButton, !expense && styles.disabledButton]}
              onPress={() => expense && navigation.navigate('Assets')}
              disabled={!expense}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  emphasis: {
    color:'#0077B6'
  },
  headerContainer: {
    height: 220,
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  assetPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginTop: -20, 
  },
  progressSection: { flexDirection: 'column' },
  progressText: { fontSize: 12, color: '#4A5568', fontWeight: '600' },
  logo: {
    top: 5,
    width: 150,
    height: 150,
  },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 20 },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: { 
    paddingHorizontal: 24, 
    marginTop: 20 
  },
  questionText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#023E8A', 
    marginTop: 0,
    marginBottom: 30,
    lineHeight: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 16,
    paddingVertical: 14, 
    borderRadius: 16, 
    borderWidth: 1.5, 
    borderColor: '#023E8A',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#028A1B',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#023E8A', 
  },
  bottomContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 24, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  progressWrapper: { 
    height: 8, 
    width: 100, 
    backgroundColor: '#b4dff7', 
    borderRadius: 4 
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: '#023E8A', 
    borderRadius: 4 
  },
  continueButton: { 
    backgroundColor: '#023E8A', 
    paddingVertical: 14, 
    paddingHorizontal: 35, 
    borderRadius: 15 
  },
  disabledButton: {
    backgroundColor: '#CBD5E0',
  },
  continueText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default ExpenseScreen;