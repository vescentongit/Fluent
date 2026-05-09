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
  // Ambil data global
  const { userName, setUserName, userImage, setUserImage, userEmail } = useContext(UserContext); 
  
  // State sementara (berubah di global kalau di-save)
  const [tempImage, setTempImage] = useState(userImage);
  const [tempName, setTempName] = useState(userName);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri); // Simpan sementara
    }
  };

  const handleSave = () => {
    setUserName(tempName); // Simpan nama ke global
    setUserImage(tempImage); // Simpan foto ke global
    Alert.alert(
      t('common.success', 'Success'),
      t('profile.updateSuccess', 'Profile updated successfully!'),
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#000000" size={26} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{t('profile.editProfile', 'Edit Profile')}</Text>
            <Text style={styles.headerSubtitle}>{t('profile.personalize', 'Personalize your profile')}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarCircle} onPress={pickImage} activeOpacity={0.7}>
            {tempImage ? (
              <Image source={{ uri: tempImage }} style={styles.avatarImg} />
            ) : (
              <Camera color="#023E8A" size={32} strokeWidth={2} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.editPictureText}>{t('profile.editPicture', 'Edit Picture')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>{t('profile.nameLabel', 'Name')}</Text>
            <TextInput
              style={styles.inputField}
              value={tempName}
              onChangeText={setTempName}
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <View style={[styles.inputBox, styles.inputBoxDisabled]}>
            <Text style={styles.inputLabel}>{t('profile.emailLabel', 'Email')}</Text>
            <TextInput
              style={styles.inputField}
              value={userEmail}
              editable={false}
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('common.save', 'Save Changes')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* NAVBAR */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home color="#8CA8D1" size={24} />
          <Text style={styles.navText}>{t('nav.home', 'Home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Wallet')}>
          <Wallet color="#8CA8D1" size={24} />
          <Text style={styles.navText}>{t('nav.wallet', 'Wallet')}</Text>
        </TouchableOpacity>
        <View style={styles.fabWrapper}>
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Chatbot')}>
            <Image source={require('../assets/robot_navbar.png')} style={styles.fabIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Learn')}>
          <BookOpen color="#8CA8D1" size={24} />
          <Text style={styles.navText}>{t('nav.learn', 'Learn')}</Text>
        </TouchableOpacity>

        {/* INI BAGIAN NAVBAR PROFILE YANG BERUBAH */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Image 
            source={userImage ? { uri: userImage } : require('../assets/user_profile.png')} 
            style={styles.navProfileImg} 
          />
          <Text style={styles.navText}>{t('nav.profile', 'Profile')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerSafeArea: { backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? 50 : 20 },
  headerContent: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 24, marginTop: 16, marginBottom: 40 },
  backButton: { marginRight: 16, marginTop: 4 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#000000', marginBottom: 4, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: '#718096' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  avatarSection: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, borderColor: '#023E8A', justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  editPictureText: { color: '#023E8A', fontSize: 15, fontWeight: '700' },
  formContainer: { width: '100%' },
  inputBox: { borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20, backgroundColor: '#FFFFFF' },
  inputBoxDisabled: { backgroundColor: '#E2E8F0', borderWidth: 0 },
  inputLabel: { fontSize: 13, color: '#718096', marginBottom: 4, fontWeight: '500' },
  inputField: { fontSize: 20, fontWeight: '600', color: '#000000', padding: 0 },
  saveButton: { backgroundColor: '#023E8A', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 10, shadowColor: '#023E8A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: '#023E8A', borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: '#FFFFFF', fontSize: 11, marginTop: 4, fontWeight: '600' },
  navProfileImg: { width: 24, height: 24, borderRadius: 12, opacity: 0.8 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -44, borderWidth: 6, borderColor: '#023E8A' },
  fabIcon: { width: 44, height: 44 }
});

export default EditProfileScreen;