import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  Platform, TextInput, Image, KeyboardAvoidingView, Alert
} from 'react-native';
import { ArrowLeft, Camera, Home, Wallet, BookOpen } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext';

const EditProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    userName, setUserName,
    userImage, setUserImage,
    userEmail,
    incomeSources, setIncomeSources,
    monthlyIncome, setMonthlyIncome,
    monthlyExpense, setMonthlyExpense,
    assetTypes,
    totalAssetValue, setTotalAssetValue,
    debts,
    organizedScore, setOrganizedScore,
    riskToleranceScore, setRiskToleranceScore,
    financialGoal, setFinancialGoal,
    currencySymbol,
  } = useContext(UserContext);

  const [tempImage, setTempImage] = useState(userImage);
  const [tempName, setTempName] = useState(userName);
  const [tempMonthlyIncome, setTempMonthlyIncome] = useState(monthlyIncome?.toString() || '0');
  const [tempMonthlyExpense, setTempMonthlyExpense] = useState(monthlyExpense?.toString() || '0');
  const [tempAssetValue, setTempAssetValue] = useState(totalAssetValue?.toString() || '0');
  const [tempGoalName, setTempGoalName] = useState(financialGoal?.title || '');
  const [tempGoalNominal, setTempGoalNominal] = useState(financialGoal?.nominal || '');
  const [tempGoalDuration, setTempGoalDuration] = useState(financialGoal?.duration || '');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) setTempImage(result.assets[0].uri);
  };

  const handleSave = () => {
    setUserName(tempName);
    setUserImage(tempImage);
    setMonthlyIncome(parseInt(tempMonthlyIncome.replace(/\./g, ''), 10) || 0);
    setMonthlyExpense(parseInt(tempMonthlyExpense.replace(/\./g, ''), 10) || 0);
    setTotalAssetValue(parseInt(tempAssetValue.replace(/\./g, ''), 10) || 0);
    setFinancialGoal({ title: tempGoalName, nominal: tempGoalNominal, duration: tempGoalDuration });
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const Section = ({ title }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#000000" size={26} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <Text style={styles.headerSubtitle}>Personalize your profile</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarCircle} onPress={pickImage}>
            {tempImage
              ? <Image source={{ uri: tempImage }} style={styles.avatarImg} />
              : <Camera color="#023E8A" size={32} strokeWidth={2} />
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.editPictureText}>Edit Picture</Text>
          </TouchableOpacity>
        </View>

        {/* BASIC INFO */}
        <Section title="👤 Basic Information" />
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput style={styles.inputField} value={tempName} onChangeText={setTempName} />
        </View>
        <View style={[styles.inputBox, styles.inputBoxDisabled]}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput style={styles.inputField} value={userEmail} editable={false} />
        </View>

        {/* INCOME */}
        <Section title="💰 Income" />
        <View style={[styles.inputBox, styles.inputBoxDisabled]}>
          <Text style={styles.inputLabel}>Income Sources</Text>
          <Text style={styles.tagText}>
            {incomeSources?.length > 0 ? incomeSources.join(', ') : 'Not set'}
          </Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Monthly Income ({currencySymbol})</Text>
          <TextInput
            style={styles.inputField}
            value={tempMonthlyIncome}
            onChangeText={setTempMonthlyIncome}
            keyboardType="numeric"
          />
        </View>

        {/* EXPENSE */}
        <Section title="💸 Expenses" />
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Monthly Expense ({currencySymbol})</Text>
          <TextInput
            style={styles.inputField}
            value={tempMonthlyExpense}
            onChangeText={setTempMonthlyExpense}
            keyboardType="numeric"
          />
        </View>

        {/* ASSETS */}
        <Section title="🏠 Assets" />
        <View style={[styles.inputBox, styles.inputBoxDisabled]}>
          <Text style={styles.inputLabel}>Asset Types</Text>
          <Text style={styles.tagText}>
            {assetTypes?.length > 0 ? assetTypes.join(', ') : 'Not set'}
          </Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Total Asset Value ({currencySymbol})</Text>
          <TextInput
            style={styles.inputField}
            value={tempAssetValue}
            onChangeText={setTempAssetValue}
            keyboardType="numeric"
          />
        </View>

        {/* DEBT */}
        <Section title="💳 Debts" />
        {debts?.length > 0 ? debts.map((debt, i) => (
          <View key={i} style={[styles.inputBox, styles.inputBoxDisabled]}>
            <Text style={styles.inputLabel}>{debt.name || `Debt ${i + 1}`}</Text>
            <Text style={styles.tagText}>
              {currencySymbol} {debt.nominal} • Due: {debt.dueDateText} • {debt.interest}% interest
            </Text>
          </View>
        )) : (
          <View style={[styles.inputBox, styles.inputBoxDisabled]}>
            <Text style={styles.tagText}>No debts recorded</Text>
          </View>
        )}

        {/* ECONOMIC PREFERENCES */}
        <Section title="📊 Economic Preferences" />
        <View style={[styles.inputBox, styles.inputBoxDisabled]}>
          <Text style={styles.inputLabel}>Financial Organization Score</Text>
          <Text style={styles.tagText}>{organizedScore ?? 0} / 10</Text>
        </View>
        <View style={[styles.inputBox, styles.inputBoxDisabled]}>
          <Text style={styles.inputLabel}>Risk Tolerance Score</Text>
          <Text style={styles.tagText}>{riskToleranceScore ?? 0} / 10</Text>
        </View>

        {/* FINANCIAL GOALS */}
        <Section title="🎯 Financial Goal" />
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Goal Name</Text>
          <TextInput style={styles.inputField} value={tempGoalName} onChangeText={setTempGoalName} />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Target Nominal ({currencySymbol})</Text>
          <TextInput
            style={styles.inputField}
            value={tempGoalNominal}
            onChangeText={setTempGoalNominal}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Duration (Years)</Text>
          <TextInput
            style={styles.inputField}
            value={tempGoalDuration}
            onChangeText={setTempGoalDuration}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home color="#8CA8D1" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Wallet')}>
          <Wallet color="#8CA8D1" size={24} />
          <Text style={styles.navText}>Wallet</Text>
        </TouchableOpacity>
        <View style={styles.fabWrapper}>
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Chatbot')}>
            <Image source={require('../assets/robot_navbar.png')} style={styles.fabIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Learn')}>
          <BookOpen color="#8CA8D1" size={24} />
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={userImage ? { uri: userImage } : require('../assets/user_profile.png')}
            style={styles.navProfileImg}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerSafeArea: { backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? 50 : 20 },
  headerContent: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 24, marginTop: 16, marginBottom: 20 },
  backButton: { marginRight: 16, marginTop: 4 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#000000', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#718096' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, flexGrow: 1},
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, borderColor: '#023E8A', justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  editPictureText: { color: '#023E8A', fontSize: 15, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#023E8A', marginTop: 20, marginBottom: 12 },
  inputBox: { borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, backgroundColor: '#FFFFFF' },
  inputBoxDisabled: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  inputLabel: { fontSize: 13, color: '#718096', marginBottom: 4, fontWeight: '500' },
  inputField: { fontSize: 18, fontWeight: '600', color: '#000000', padding: 0 },
  tagText: { fontSize: 15, color: '#4A5568', fontWeight: '500' },
  saveButton: { backgroundColor: '#023E8A', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 16 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: '#023E8A', borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20, elevation: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: '#FFFFFF', fontSize: 11, marginTop: 4, fontWeight: '600' },
  navProfileImg: { width: 24, height: 24, borderRadius: 12, opacity: 0.8 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -44, borderWidth: 6, borderColor: '#023E8A' },
  fabIcon: { width: 44, height: 44 },
});

export default EditProfileScreen;