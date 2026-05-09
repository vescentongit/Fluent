import React, { useState, useContext, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image, Dimensions, Modal 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { 
  Home, Wallet, BookOpen, Edit2, ChevronLeft, ChevronRight, 
  AlertTriangle, Lightbulb, TrendingUp, Target, Settings, Undo2, Calendar 
} from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import SubscriptionModal from '../components/SubscriptionModal';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const getBadgesData = (t) => [
  {
    id: 1,
    title: t('badges.lv1Title', "Level 1 Badge"),
    name: t('badges.lv1Name', "Financial Trailblazer"),
    desc: t('badges.lv1Desc', "The first step toward a bright future! You've taken the leap to begin your financial journey. This proves your commitment to learning, tracking your expenses, and taking charge of your money."),
    statusText: t('badges.lv1Status', "Unlocked Sunday, August 17, 2025"),
    isLocked: false,
    listImage: require('../assets/badge_lv1.png'),
    modalImage: require('../assets/m_badge_lv1.png')
  },
  {
    id: 2,
    title: t('badges.lv2Title', "Level 2 Badge"),
    name: t('badges.lv2Name', "Savvy Manager"),
    desc: t('badges.lv2Desc', "A solid foundation is taking shape! You've mastered the art of basic budgeting and can easily spot the difference between needs and wants. Keep up these smart money habits!"),
    statusText: t('badges.lv2Status', "Unlocked Thursday, October 19, 2025"),
    isLocked: false,
    listImage: require('../assets/badge_lv2.png'),
    modalImage: require('../assets/m_badge_lv2.png')
  },
  {
    id: 3,
    title: t('badges.30DaysTitle', "30 Days Streak Badge"),
    name: t('badges.30DaysName', "Consistency Champion"),
    desc: t('badges.30DaysDesc', "Incredible! For 30 consecutive days, you've shown up for your finances without fail. A powerful new habit has officially taken root in your life. Keep this momentum going!"),
    statusText: t('badges.30DaysStatus', "Unlocked Sunday, December 21, 2025"),
    isLocked: false,
    listImage: require('../assets/badge_30.png'),
    modalImage: require('../assets/m_badge_30.png')
  },
  {
    id: 4,
    title: t('badges.lv3Title', "Level 3 Badge"),
    name: t('badges.lv3Name', "Strategic Planner"),
    desc: t('badges.lv3Desc', "You are now fully in the driver's seat of your finances. You understand the power of an emergency fund and have started strategizing to protect your future from financial surprises."),
    statusText: t('badges.lv3Status', "Unlocked Monday, February 2, 2026"),
    isLocked: false,
    listImage: require('../assets/badge_lv3.png'),
    modalImage: require('../assets/m_badge_lv3.png')
  },
  {
    id: 5,
    title: t('badges.lv4Title', "Level 4 Badge"),
    name: t('badges.lv4Name', "Wealth Architect"),
    desc: t('badges.lv4Desc', "Reach level 4 to unlock this badge!"),
    statusText: "",
    isLocked: true,
    listImage: require('../assets/wealth_locked.png'),
    modalImage: require('../assets/m_wealth.png') 
  },
  {
    id: 6,
    title: t('badges.100DaysTitle', "100 Days Streak Badge"),
    name: t('badges.100DaysName', "Discipline Centurion"),
    desc: t('badges.100DaysDesc', "Log your expenses for 100 consecutive days to unlock!"),
    statusText: "",
    isLocked: true,
    listImage: require('../assets/disc_locked.png'),
    modalImage: require('../assets/m_disc.png') 
  },
  {
    id: 7,
    title: t('badges.lv5Title', "Level 5 Badge"),
    name: t('badges.lv5Name', "Financial Maestro"),
    desc: t('badges.lv5Desc', "Reach level 5 to unlock this badge!"),
    statusText: "",
    isLocked: true,
    listImage: require('../assets/maestro_locked.png'),
    modalImage: require('../assets/m_maestro.png') 
  }
];

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const { userName, userImage, level, xp, getXpForNextLevel, getXpProgress, formatCurrency, subscriptionPlan } = useContext(UserContext);
  const { colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const badges = useMemo(() => getBadgesData(t), [t]);

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
        <Text style={styles.headerTitle}>{t('profile.title', 'Profile')}</Text>
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
                <Text style={styles.levelBadgeText}>LV. {level}</Text>
              </View>
            </View>
          </View>

          {cardIndex === 0 ? (
            <View style={[styles.switchableCard, { backgroundColor: colors.primary }]}>
              <TouchableOpacity onPress={() => setCardIndex(1)}>
                <ChevronLeft color="#FFFFFF" size={24} style={styles.cardArrow} />
              </TouchableOpacity>
              <View style={styles.cardCenter}>
                <View style={styles.cardTextRow}>
                  <Text style={styles.cardTextMain}>{(xp ?? 0).toLocaleString()} XP</Text>
                  <Text style={styles.cardTextMain}>{level < 4 ? `${(getXpForNextLevel() ?? 0).toLocaleString()} XP (LV ${level + 1})` : t('profile.maxLevel', 'Max Level')}</Text>
                </View>
                <View style={styles.cardBarBg}>
                  <View style={[styles.cardBarFill, { width: `${getXpProgress()}%` }]} />
                </View>
                <Text style={styles.cardSubtextLeft}>{level < 4 ? `${((getXpForNextLevel() ?? 0) - (xp ?? 0)).toLocaleString()} ${t('profile.xpToNextLevel', 'XP to next level')}` : t('profile.maxLevelReached', 'Max level reached!')}</Text>
              </View>
              <TouchableOpacity onPress={() => setCardIndex(1)}>
                <ChevronRight color="#FFFFFF" size={24} style={styles.cardArrow} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.switchableCard, { backgroundColor: colors.primary }]}>
              <TouchableOpacity onPress={() => setCardIndex(0)}>
                <ChevronLeft color="#FFFFFF" size={24} style={styles.cardArrow} />
              </TouchableOpacity>
              <View style={styles.cardCenter}>
                <Text style={styles.cardTextLabel}>{t('profile.resilienceScore', 'Resilience Score')}</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreValueMain}>67</Text>
                  <Text style={styles.scoreValueSub}>/100</Text>
                </View>
                <View style={styles.cardBarBg}>
                  <View style={[styles.cardBarFill, { width: '67%' }]} />
                </View>
                <View style={styles.cardTextRow}>
                  <Text style={styles.scoreSubtextLeft}>{t('profile.goodStanding', 'Good Standing!')}</Text>
                  <Text style={styles.scoreSubtextRight}>6.7 {t('profile.months', 'months')}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setCardIndex(0)}>
                <ChevronRight color="#FFFFFF" size={24} style={styles.cardArrow} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.snapshotRow}>
            <View style={[styles.snapshotCardMain, { backgroundColor: colors.primary }]}>
              <Text style={styles.snapshotLabel}>{t('profile.totalBalance', 'Total\nBalance')}</Text>
              <Text style={styles.snapshotValue}>{formatCurrency(67676767)}</Text>
            </View>
            <View style={[styles.snapshotCardMain, { backgroundColor: colors.primary }]}>
              <Text style={styles.snapshotLabel}>{t('profile.monthlySpending', 'Monthly\nSpending')}</Text>
              <Text style={styles.snapshotValue}>{formatCurrency(6767676)}</Text>
            </View>
            <View style={[styles.snapshotCardSmall, { backgroundColor: colors.secondary }]}>
              <Text style={styles.snapshotLabel}>{t('profile.debtRatio', 'Debt Ratio')}</Text>
              <Text style={styles.snapshotValueLarge}>19%</Text>
            </View>
          </View>

          <View style={[styles.insightsCard, { backgroundColor: colors.primary }]}>
            <View style={styles.insightRow}>
              <AlertTriangle color="#FFFFFF" size={18} style={styles.insightIcon} />
              <Text style={styles.insightText}>{t('profile.insight1', 'Dining spending increased 21% this week')}</Text>
            </View>
            <View style={styles.insightRow}>
              <Lightbulb color="#FFFFFF" size={18} style={styles.insightIcon} />
              <Text style={styles.insightText}>{t('profile.insight2', 'Paying')} {formatCurrency(500000)} {t('profile.insight2b', 'more toward debt could reduce payoff by 3 months')}</Text>
            </View>
            <View style={styles.insightRow}>
              <TrendingUp color="#FFFFFF" size={18} style={styles.insightIcon} />
              <Text style={styles.insightText}>{t('profile.insight3', 'Savings rate improved by 6%')}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => {
            if (subscriptionPlan !== 'elite') {
              setSubModalVisible(true);
            } else {
              navigation.navigate('AdvisorBooking');
            }
          }}>
            <View style={[styles.ctaCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <View style={styles.ctaIconBg}>
                <Calendar color={colors.primary} size={24} />
              </View>
              <View style={styles.ctaTextContainer}>
                <Text style={[styles.ctaTitle, { color: colors.text }]}>{t('profile.bookSession', 'Book a 1-on-1 Session')}</Text>
                <Text style={[styles.ctaSubtitle, { color: colors.textMuted }]}>{t('profile.getAdvice', 'Get personalized advice from a financial advisor')}</Text>
              </View>
              <ChevronRight color={colors.primary} size={20} />
            </View>
          </TouchableOpacity>

          <View style={[styles.streakCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.streakLabel}>{t('profile.currentStreak', 'Current Streak')}</Text>
            <View style={styles.streakRow}>
              <Image source={require('../assets/streak_fire.png')} style={styles.streakIcon} />
              <Text style={styles.streakValue}>67 {t('profile.days', 'Days')}</Text>
            </View>
          </View>

          <View style={[styles.badgesBox, { backgroundColor: colors.secondary }]}>
            <Text style={styles.badgesBoxTitle}>{t('profile.badges', 'Badges')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
              {badges.map((badge) => (
                <TouchableOpacity key={badge.id} style={styles.badgeItem} onPress={() => setSelectedBadge(badge)}>
                  <Image source={badge.listImage} style={styles.badgeImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
            <View style={[styles.actionButton, { backgroundColor: colors.primary }]}>
              <Target color="#FFFFFF" size={24} style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>{t('profile.goalsTargets', 'Goals & Targets')}</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <View style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
              <Settings color="#FFFFFF" size={24} style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>{t('profile.appSettings', 'App Settings')}</Text>
              <ChevronRight color="#FFFFFF" size={20} />
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <Modal visible={!!selectedBadge} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {selectedBadge && (
            <View style={[styles.modalCard, { backgroundColor: colors.primary }]}>
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
            </View>
          )}
        </View>
      </Modal>

      <SubscriptionModal visible={subModalVisible} onClose={() => setSubModalVisible(false)} />

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
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navProfileImgActiveWrapper}>
            <Image source={userImage ? { uri: userImage } : require('../assets/user_profile.png')} style={styles.navProfileImgActive} />
          </View>
          <Text style={styles.navTextActive}>{t('nav.profile', 'Profile')}</Text>
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
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  ctaIconBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(16,72,146,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ctaTextContainer: { flex: 1 },
  ctaTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  ctaSubtitle: { fontSize: 13, lineHeight: 18 },
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