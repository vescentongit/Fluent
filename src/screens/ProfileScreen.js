import React, { useState, useContext, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image, Dimensions, Modal 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { 
  Home, Wallet, BookOpen, Edit2, ChevronLeft, ChevronRight, 
  AlertTriangle, Lightbulb, TrendingUp, Target, Settings, Undo2 
} from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const BADGES_DATA = [
  {
    id: 1,
    title: "Level 1 Badge",
    name: "Financial Trailblazer",
    desc: "The first step toward a bright future! You've taken the leap to begin your financial journey. This proves your commitment to learning, tracking your expenses, and taking charge of your money.",
    statusText: "Unlocked Sunday, August 17, 2025",
    isLocked: false,
    listImage: require('../assets/badge_lv1.png'),
    modalImage: require('../assets/m_badge_lv1.png')
  },
  {
    id: 2,
    title: "Level 2 Badge",
    name: "Savvy Manager",
    desc: "A solid foundation is taking shape! You've mastered the art of basic budgeting and can easily spot the difference between needs and wants. Keep up these smart money habits!",
    statusText: "Unlocked Thursday, October 19, 2025",
    isLocked: false,
    listImage: require('../assets/badge_lv2.png'),
    modalImage: require('../assets/m_badge_lv2.png')
  },
  {
    id: 3,
    title: "30 Days Streak Badge",
    name: "Consistency Champion",
    desc: "Incredible! For 30 consecutive days, you've shown up for your finances without fail. A powerful new habit has officially taken root in your life. Keep this momentum going!",
    statusText: "Unlocked Sunday, December 21, 2025",
    isLocked: false,
    listImage: require('../assets/badge_30.png'),
    modalImage: require('../assets/m_badge_30.png')
  },
  {
    id: 4,
    title: "Level 3 Badge",
    name: "Strategic Planner",
    desc: "You are now fully in the driver's seat of your finances. You understand the power of an emergency fund and have started strategizing to protect your future from financial surprises.",
    statusText: "Unlocked Monday, February 2, 2026",
    isLocked: false,
    listImage: require('../assets/badge_lv3.png'),
    modalImage: require('../assets/m_badge_lv3.png')
  },
  {
    id: 5,
    title: "Level 4 Badge",
    name: "Wealth Architect",
    desc: "Reach level 4 to unlock this badge!",
    statusText: "",
    isLocked: true,
    listImage: require('../assets/wealth_locked.png'),
    modalImage: require('../assets/m_wealth.png') 
  },
  {
    id: 6,
    title: "100 Days Streak Badge",
    name: "Discipline Centurion",
    desc: "Log your expenses for 100 consecutive days to unlock!",
    statusText: "",
    isLocked: true,
    listImage: require('../assets/disc_locked.png'),
    modalImage: require('../assets/m_disc.png') 
  },
  {
    id: 7,
    title: "Level 5 Badge",
    name: "Financial Maestro",
    desc: "Reach level 5 to unlock this badge!",
    statusText: "",
    isLocked: true,
    listImage: require('../assets/maestro_locked.png'),
    modalImage: require('../assets/m_maestro.png') 
  }
];

const ProfileScreen = ({ navigation }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const { userName, userImage } = useContext(UserContext);
  const { colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.fixedWaveBackground}>
        <Svg height="260" width={width} style={styles.headerWave} pointerEvents="none">
            <Path 
            fill={colors.headerWave1}
            d={`M0 0 L${width} 0 L${width} 160 C${width * 0.7} 190 ${width * 0.3} 140 0 160 Z`} 
            transform="translate(0, 6)"
            />
            <Path 
            fill={colors.headerWave2}
            d={`M0 0 L${width} 0 L${width} 160 C${width * 0.7} 190 ${width * 0.3} 140 0 160 Z`} 
            transform="translate(0, 3)"
            />
            <Path 
            fill={colors.headerWave3}
            d={`M0 0 L${width} 0 L${width} 160 C${width * 0.7} 190 ${width * 0.3} 140 0 160 Z`} 
            />
        </Svg>
      </View>

      <SafeAreaView style={styles.fixedHeaderSafeArea} pointerEvents="none">
        <Text style={styles.headerTitle}>Profile</Text>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.transparentSpacer} />
        
        <View style={styles.solidContentWrapper}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={userImage ? { uri: userImage } : require('../assets/user_profile.png')} style={styles.avatarImage} />
              <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Edit')}>
                <Edit2 color="#FFFFFF" size={14} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{userName}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>LV. 3</Text>
              </View>
            </View>
          </View>

          {cardIndex === 0 ? (
            <LinearGradient colors={['#447ADF', '#04ADAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.switchableCard}>
              <TouchableOpacity onPress={() => setCardIndex(1)}>
                <ChevronLeft color="#FFFFFF" size={24} style={styles.cardArrow} />
              </TouchableOpacity>
              <View style={styles.cardCenter}>
                <View style={styles.cardTextRow}>
                  <Text style={styles.cardTextMain}>6,767 XP</Text>
                  <Text style={styles.cardTextMain}>10,000 XP (LV 4)</Text>
                </View>
                <View style={styles.cardBarBg}>
                  <View style={[styles.cardBarFill, { width: '67%' }]} />
                </View>
                <Text style={styles.cardSubtextLeft}>3,233 XP to next level</Text>
              </View>
              <TouchableOpacity onPress={() => setCardIndex(1)}>
                <ChevronRight color="#FFFFFF" size={24} style={styles.cardArrow} />
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <LinearGradient colors={['#447ADF', '#04ADAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.switchableCard}>
              <TouchableOpacity onPress={() => setCardIndex(0)}>
                <ChevronLeft color="#FFFFFF" size={24} style={styles.cardArrow} />
              </TouchableOpacity>
              <View style={styles.cardCenter}>
                <Text style={styles.cardTextLabel}>Resilience Score</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreValueMain}>67</Text>
                  <Text style={styles.scoreValueSub}>/100</Text>
                </View>
                <View style={styles.cardBarBg}>
                  <View style={[styles.cardBarFill, { width: '67%' }]} />
                </View>
                <View style={styles.cardTextRow}>
                  <Text style={styles.scoreSubtextLeft}>Good Standing!</Text>
                  <Text style={styles.scoreSubtextRight}>6.7 months</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setCardIndex(0)}>
                <ChevronRight color="#FFFFFF" size={24} style={styles.cardArrow} />
              </TouchableOpacity>
            </LinearGradient>
          )}

          <View style={styles.snapshotRow}>
            <LinearGradient colors={['#447ADF', '#2B58CE']} style={styles.snapshotCardMain}>
              <Text style={styles.snapshotLabel}>Total{'\n'}Balance</Text>
              <Text style={styles.snapshotValue}>Rp 67,676,767</Text>
            </LinearGradient>
            <LinearGradient colors={['#447ADF', '#2B58CE']} style={styles.snapshotCardMain}>
              <Text style={styles.snapshotLabel}>Monthly{'\n'}Spending</Text>
              <Text style={styles.snapshotValue}>Rp 6,767,676</Text>
            </LinearGradient>
            <LinearGradient colors={['#04ADAD', '#038888']} style={styles.snapshotCardSmall}>
              <Text style={styles.snapshotLabel}>Debt Ratio</Text>
              <Text style={styles.snapshotValueLarge}>19%</Text>
            </LinearGradient>
          </View>

          <LinearGradient colors={['#04ADAD', '#2B58CE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.insightsCard}>
            <View style={styles.insightRow}>
              <AlertTriangle color="#FFFFFF" size={18} style={styles.insightIcon} />
              <Text style={styles.insightText}>Dining spending increased 21% this week</Text>
            </View>
            <View style={styles.insightRow}>
              <Lightbulb color="#FFFFFF" size={18} style={styles.insightIcon} />
              <Text style={styles.insightText}>Paying Rp500k more toward debt could reduce payoff by 3 months</Text>
            </View>
            <View style={styles.insightRow}>
              <TrendingUp color="#FFFFFF" size={18} style={styles.insightIcon} />
              <Text style={styles.insightText}>Savings rate improved by 6%</Text>
            </View>
          </LinearGradient>

          <LinearGradient colors={['#447ADF', '#04ADAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.streakCard}>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <View style={styles.streakRow}>
              <Image source={require('../assets/streak_fire.png')} style={styles.streakIcon} />
              <Text style={styles.streakValue}>67 Days</Text>
            </View>
          </LinearGradient>

          <LinearGradient colors={['#82622d', '#cbad28', '#eec53f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.badgesBox}>
            <Text style={styles.badgesBoxTitle}>Badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
              {BADGES_DATA.map((badge) => (
                <TouchableOpacity key={badge.id} style={styles.badgeItem} onPress={() => setSelectedBadge(badge)}>
                  <Image source={badge.listImage} style={styles.badgeImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>

          <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
            <LinearGradient colors={['#1b1e27', '#04ADAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionButton}>
              <Target color="#FFFFFF" size={24} style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Goals & Targets</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <LinearGradient colors={['#565657', '#767676']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionButton}>
              <Settings color="#FFFFFF" size={24} style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>App Settings</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <Modal visible={!!selectedBadge} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {selectedBadge && (
            <LinearGradient colors={['#447ADF', '#04ADAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalCard}>
              <TouchableOpacity style={styles.modalBackBtn} onPress={() => setSelectedBadge(null)}>
                <Undo2 color="#FFFFFF" size={28} />
              </TouchableOpacity>
              <Image source={selectedBadge.modalImage} style={styles.modalBigBadge} />
              <Text style={styles.modalTitleText}>{selectedBadge.title}</Text>
              <Text style={styles.modalNameText}>{selectedBadge.name}</Text>
              <Text style={styles.modalDescText}>{selectedBadge.desc}</Text>
              {selectedBadge.statusText ? (
                <Text style={styles.modalStatusText}>{selectedBadge.statusText}</Text>
              ) : null}
            </LinearGradient>
          )}
        </View>
      </Modal>

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
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navProfileImgActiveWrapper}>
            <Image source={userImage ? { uri: userImage } : require('../assets/user_profile.png')} style={styles.navProfileImgActive} />
          </View>
          <Text style={styles.navTextActive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  fixedWaveBackground: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 },
  fixedHeaderSafeArea: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, alignItems: 'center', paddingTop: Platform.OS === 'android' ? 50 : 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  scrollView: { flex: 1, zIndex: 3 },
  transparentSpacer: { height: 180 },
  solidContentWrapper: { flex: 1, backgroundColor: colors.background, overflow: 'visible', paddingHorizontal: 20, paddingBottom: 140, minHeight: Dimensions.get('window').height },
  profileSection: { alignItems: 'center', marginTop: -70, marginBottom: 24 },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.card, padding: 4, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  avatarImage: { width: '100%', height: '100%', borderRadius: 60 },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#757575', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.card, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 },
  userName: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  levelBadge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  levelBadgeText: { fontSize: 13, fontWeight: 'bold', color: colors.white },
  switchableCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, padding: 20, marginBottom: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  cardArrow: { opacity: 0.9 },
  cardCenter: { flex: 1, paddingHorizontal: 16 },
  cardTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardTextMain: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  cardBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, marginBottom: 8 },
  cardBarFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 3 },
  cardSubtextLeft: { color: '#FFFFFF', fontSize: 12, opacity: 0.9 },
  cardTextLabel: { color: '#FFFFFF', fontSize: 13, opacity: 0.9, marginBottom: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  scoreValueMain: { color: '#FFFFFF', fontSize: 34, fontWeight: 'bold' },
  scoreValueSub: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', opacity: 0.8 },
  scoreSubtextLeft: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  scoreSubtextRight: { color: '#FFFFFF', fontSize: 12, opacity: 0.9 },
  snapshotRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  snapshotCardMain: { flex: 2, borderRadius: 20, padding: 16, justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  snapshotCardSmall: { flex: 1.6, borderRadius: 20, padding: 16, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  snapshotLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginBottom: 12, lineHeight: 18 },
  snapshotValue: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  snapshotValueLarge: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  insightsCard: { borderRadius: 24, padding: 20, marginBottom: 24, gap: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start' },
  insightIcon: { marginRight: 12, marginTop: 2 },
  insightText: { color: '#FFFFFF', fontSize: 14, flex: 1, lineHeight: 20, fontWeight: '600' },
  streakCard: { borderRadius: 24, padding: 24, marginBottom: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  streakLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  streakIcon: { width: 56, height: 56, resizeMode: 'contain' },
  streakValue: { color: '#FFFFFF', fontSize: 40, fontWeight: 'bold' },
  badgesBox: { borderRadius: 24, paddingVertical: 20, paddingLeft: 20, marginBottom: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  badgesBoxTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  badgesScroll: { gap: 16, paddingRight: 20 },
  badgeItem: { alignItems: 'center', width: 80, marginRight: 4 },
  badgeImage: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 8 },
  badgeNameWhite: { fontSize: 11, color: '#FFFFFF', textAlign: 'center', fontWeight: '600', lineHeight: 16 },
  badgeNameLocked: { fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontWeight: '600', lineHeight: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  actionIcon: { marginRight: 16 },
  actionButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', flex: 1 },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: colors.navBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navTextActive: { color: colors.navIconActive, fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navText: { color: colors.navIcon, fontSize: 11, marginTop: 4, fontWeight: '600' },
  navProfileImg: { width: 24, height: 24, borderRadius: 12, opacity: 0.6 },
  navProfileImgActiveWrapper: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  navProfileImgActive: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -44, borderWidth: 6, borderColor: colors.navBg },
  fabIcon: { width: 44, height: 44 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', borderRadius: 24, padding: 24, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
  modalBackBtn: { position: 'absolute', top: 20, left: 20, zIndex: 10 },
  modalBigBadge: { width: 140, height: 140, resizeMode: 'contain', marginTop: 20, marginBottom: 16 },
  modalTitleText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  modalNameText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalDescText: { color: '#FFFFFF', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  modalStatusText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 8 }
});

export default ProfileScreen;