import React, { useContext, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image, Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Home, Wallet, BookOpen, Star, CheckCircle2, Hourglass, PlayCircle, Shield, Lock } from 'lucide-react-native';
import { LessonContext } from '../context/LessonContext';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const LearnScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { xp, progressPercentage, getCourseProgress, courses } = useContext(LessonContext);
  const { userImage, level, xp: userXp } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const totalCompletedLessons = useMemo(() => {
    let count = 0;
    if (courses) {
      Object.values(courses).forEach(course => {
        if (course.lessons) {
          course.lessons.forEach(lesson => {
            if (lesson.status === 'done') count++;
          });
        }
      });
    }
    return count;
  }, [courses]);

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeaderContainer} pointerEvents="box-none">
        <Svg height="160" width={width} style={styles.headerWave} pointerEvents="none">
          <Path
            fill={colors.headerWave1}
            d={`M0 0 L${width} 0 L${width} 120 C${width * 0.7} 150 ${width * 0.3} 100 0 120 Z`}
            transform="translate(0, 6)"
          />
          <Path
            fill={colors.headerWave2}
            d={`M0 0 L${width} 0 L${width} 120 C${width * 0.7} 150 ${width * 0.3} 100 0 120 Z`}
            transform="translate(0, 3)"
          />
          <Path
            fill={colors.headerWave3}
            d={`M0 0 L${width} 0 L${width} 120 C${width * 0.7} 150 ${width * 0.3} 100 0 120 Z`}
          />
        </Svg>

        <SafeAreaView pointerEvents="box-none">
          <View style={styles.headerRow} pointerEvents="auto">
            <View>
              <Text style={styles.headerTitle}>{t('learn.title', 'Learn & Level Up')}</Text>
              <Text style={styles.headerSubtitle}>{t('learn.subtitle', 'Earn XP, unlock badges!')}</Text>
            </View>
            <View style={[styles.xpBadge, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEFCBF' }]}>
              <Star color="#D69E2E" size={16} fill="#D69E2E" />
              <Text style={[styles.xpText, { color: '#D69E2E' }]}>{userXp || 0} XP</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.streakCard, { backgroundColor: colors.primary }]}>
          <View>
            <Text style={styles.streakLabel}>{t('learn.currentStreak', 'Current Streak')}</Text>
            <View style={styles.streakValueRow}>
              <Image source={require('../assets/streak_fire.png')} style={styles.streakIcon} />
              <Text style={styles.streakDays}>67 {t('learn.days', 'Days')}</Text>
            </View>
            <Text style={styles.streakBonus}>{t('learn.streakBonus', 'Keep it up! +50 XP streak bonus')}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('learn.dailyChallenges', 'Daily Challenges')}</Text>

          {totalCompletedLessons >= 1 ? (
            <View style={[styles.challengeItemDone, { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.15)' : '#F0FFF4' }]}>
              <CheckCircle2 color={colors.success} size={20} />
              <Text style={[styles.challengeTextDone, { textDecorationLine: 'line-through' }]}>{t('learn.finish1Lesson', 'Finish 1 lesson in any courses')}</Text>
              <View style={[styles.challengeXpDone, { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.3)' : '#C6F6D5' }]}><Text style={[styles.xpAmountDone, { color: isDarkMode ? '#68D391' : '#2F855A' }]}>+ 20 XP</Text></View>
            </View>
          ) : (
            <View style={[styles.challengeItemTodo, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.15)' : '#FFFBF0' }]}>
              <Hourglass color={colors.warning} size={20} />
              <Text style={styles.challengeTextTodo}>{t('learn.finish1Lesson', 'Finish 1 lesson in any courses')}</Text>
              <View style={[styles.challengeXpTodo, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.3)' : '#FEEBC8' }]}><Text style={[styles.xpAmountTodo, { color: isDarkMode ? '#F6AD55' : '#C05621' }]}>+ 20 XP</Text></View>
            </View>
          )}

          <View style={[styles.challengeItemDone, { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.15)' : '#F0FFF4' }]}>
            <CheckCircle2 color={colors.success} size={20} />
            <Text style={styles.challengeTextDone}>{t('learn.get80Quiz', 'Get 80% in any quizzes')}</Text>
            <View style={[styles.challengeXpDone, { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.3)' : '#C6F6D5' }]}><Text style={[styles.xpAmountDone, { color: isDarkMode ? '#68D391' : '#2F855A' }]}>+ 30 XP</Text></View>
          </View>

          {totalCompletedLessons >= 3 ? (
            <View style={[styles.challengeItemDone, { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.15)' : '#F0FFF4' }]}>
              <CheckCircle2 color={colors.success} size={20} />
              <Text style={[styles.challengeTextDone, { textDecorationLine: 'line-through' }]}>{t('learn.finish3Lessons', 'Finish 3 lessons in any courses')}</Text>
              <View style={[styles.challengeXpDone, { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.3)' : '#C6F6D5' }]}><Text style={[styles.xpAmountDone, { color: isDarkMode ? '#68D391' : '#2F855A' }]}>+ 50 XP</Text></View>
            </View>
          ) : (
            <View style={[styles.challengeItemTodo, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.15)' : '#FFFBF0' }]}>
              <Hourglass color={colors.warning} size={20} />
              <Text style={styles.challengeTextTodo}>{t('learn.finish3Lessons', 'Finish 3 lessons in any courses')}</Text>
              <View style={[styles.challengeXpTodo, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.3)' : '#FEEBC8' }]}><Text style={[styles.xpAmountTodo, { color: isDarkMode ? '#F6AD55' : '#C05621' }]}>+ 50 XP</Text></View>
            </View>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('learn.courses', 'Courses')}</Text>

          <TouchableOpacity
            style={styles.courseCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CourseOverview', { courseId: 'budgeting101' })}
          >
            <View style={styles.courseTopRow}>
              <View style={[styles.courseIconBgBlue, { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.2)' : '#EBF4FF' }]}>
                <Image source={require('../assets/piggy_bank.png')} style={styles.courseIcon} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{t('learn.budgeting101', 'Budgeting 101')}</Text>
                <Text style={styles.courseDesc}>{t('learn.budgetingDesc', 'Master the 50/30/20 rule and take control of your finances')}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>8 {t('learn.lessons', 'lessons')}</Text>
                  <View style={[styles.metaXp, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEEBC8' }]}><Text style={[styles.metaXpText, { color: isDarkMode ? '#F6AD55' : '#C05621' }]}>+ 200 XP</Text></View>
                  <View style={[styles.metaLvl, { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.2)' : '#EBF4FF' }]}><Text style={[styles.metaLvlText, { color: isDarkMode ? '#63B3ED' : '#2B6CB0' }]}>Lvl 1</Text></View>
                </View>
              </View>
              <PlayCircle color={colors.primary} size={32} />
            </View>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{t('learn.progress', 'Progress')}</Text>
              <Text style={[styles.progressPercentage, { color: colors.primary }]}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: colors.primary }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.courseCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CourseOverview', { courseId: 'investingBasics' })}
          >
            <View style={styles.courseTopRow}>
              <View style={[styles.courseIconBgGreen, { backgroundColor: isDarkMode ? 'rgba(4,173,173,0.2)' : '#E6FFFA' }]}>
                <Image source={require('../assets/investing_graph.png')} style={styles.courseIcon} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{t('learn.investingBasics', 'Investing Basics')}</Text>
                <Text style={styles.courseDesc}>{t('learn.investingDesc', 'Stocks, bonds, Reksa Dana. Start building wealth today')}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>5 {t('learn.lessons', 'lessons')}</Text>
                  <View style={[styles.metaXp, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEEBC8' }]}><Text style={[styles.metaXpText, { color: isDarkMode ? '#F6AD55' : '#C05621' }]}>+ 350 XP</Text></View>
                  <View style={[styles.metaLvl, { backgroundColor: isDarkMode ? 'rgba(4,173,173,0.2)' : '#E6FFFA' }]}><Text style={[styles.metaLvlText, { color: isDarkMode ? '#38B2AC' : '#04ADAD' }]}>Lvl 2</Text></View>
                </View>
              </View>
              <PlayCircle color={isDarkMode ? '#38B2AC' : '#04ADAD'} size={32} />
            </View>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{t('learn.progress', 'Progress')}</Text>
              <Text style={[styles.progressPercentage, { color: isDarkMode ? '#38B2AC' : '#04ADAD' }]}>40%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '40%', backgroundColor: isDarkMode ? '#38B2AC' : '#04ADAD' }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.courseCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CourseOverview', { courseId: 'emergencyFundGuide' })}
          >
            <View style={styles.courseTopRow}>
              <View style={[styles.courseIconBgGreen, { backgroundColor: isDarkMode ? 'rgba(46,204,113,0.2)' : '#E8F5E9' }]}>
                <Shield color={colors.success} size={24} fill={colors.success} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{t('learn.emergencyFund', 'Emergency Fund Guide')}</Text>
                <Text style={styles.courseDesc}>{t('learn.emergencyDesc', 'Build your financial safety net in 90 days')}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>6 {t('learn.lessons', 'lessons')}</Text>
                  <View style={[styles.metaXp, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEEBC8' }]}><Text style={[styles.metaXpText, { color: isDarkMode ? '#F6AD55' : '#C05621' }]}>+ 150 XP</Text></View>
                  <View style={[styles.metaLvl, { backgroundColor: isDarkMode ? 'rgba(46,204,113,0.2)' : '#E8F5E9' }]}><Text style={[styles.metaLvlText, { color: isDarkMode ? '#68D391' : '#2ECC71' }]}>Lvl 1</Text></View>
                </View>
              </View>
              <PlayCircle color={colors.success} size={32} />
            </View>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{t('learn.progress', 'Progress')}</Text>
              <Text style={[styles.progressPercentage, { color: colors.success }]}>100%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '100%', backgroundColor: colors.success }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.courseCard, { borderBottomWidth: 0, paddingBottom: 0 }]}
            activeOpacity={level >= 4 ? 0.8 : 1}
            onPress={() => level >= 4 ? navigation.navigate('CourseOverview', { courseId: 'passiveIncome' }) : null}
          >
            <View style={[styles.courseTopRow, level < 4 && { opacity: 0.6 }]}>
              <View style={[styles.courseIconBgBlue, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEFCBF' }]}>
                <Image source={require('../assets/checkbox.png')} style={[styles.courseIcon, { tintColor: colors.warning }]} />
              </View>
              <View style={styles.courseInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.courseTitle}>{t('learn.passiveIncome', 'Passive Income')}</Text>
                  {level < 4 && <Lock color="#A0AEC0" size={16} />}
                </View>
                <Text style={styles.courseDesc}>{t('learn.passiveDesc', '7 proven strategies to earn while you sleep')}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>2 {t('learn.lessons', 'lessons')}</Text>
                  <View style={[styles.metaXp, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEEBC8' }]}><Text style={[styles.metaXpText, { color: isDarkMode ? '#F6AD55' : '#C05621' }]}>+ 500 XP</Text></View>
                  <View style={[styles.metaLvl, { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.1)' : '#FFFBF0' }]}><Text style={[styles.metaLvlText, { color: colors.warning }]}>Lvl 4</Text></View>
                </View>
              </View>
              {level >= 4 && <PlayCircle color={colors.warning} size={32} />}
            </View>
            {level < 4 && (
              <View style={styles.lockedMessage}>
                <Text style={styles.lockedMessageText}>{t('learn.reachLevel4', 'Reach Level 4 to unlock!')}</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>

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
        <TouchableOpacity style={styles.navItem}>
          <BookOpen color="#FFFFFF" size={24} />
          <Text style={styles.navTextActive}>{t('nav.learn', 'Learn')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Image source={userImage ? { uri: userImage } : require('../assets/user_profile.png')} style={styles.navProfileImg} />
          <Text style={styles.navText}>{t('nav.profile', 'Profile')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  fixedHeaderContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: 160 },
  headerWave: { position: 'absolute', top: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 40 : 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.white },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  xpBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEFCBF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  xpText: { fontSize: 13, fontWeight: 'bold', color: '#744210' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 130, paddingBottom: 120, marginTop: 20 },
  streakCard: { borderRadius: 24, padding: 24, marginBottom: 25 },
  streakLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  streakValueRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakIcon: { width: 40, height: 40, resizeMode: 'contain' },
  streakDays: { fontSize: 36, fontWeight: 'bold', color: colors.white },
  streakBonus: { fontSize: 13, color: colors.white, marginTop: 8, fontWeight: '500' },
  sectionContainer: { backgroundColor: colors.card, borderRadius: 24, padding: 20, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 15 },
  challengeItemDone: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 12, gap: 10 },
  challengeTextDone: { flex: 1, fontSize: 13, color: colors.textMuted, textDecorationLine: 'line-through' },
  challengeXpDone: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  xpAmountDone: { fontSize: 11, fontWeight: 'bold' },
  challengeItemTodo: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 12, gap: 10 },
  challengeTextTodo: { flex: 1, fontSize: 13, color: colors.text, fontWeight: '500' },
  challengeXpTodo: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  xpAmountTodo: { fontSize: 11, fontWeight: 'bold' },
  courseCard: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 15 },
  courseTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  courseIconBgBlue: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  courseIconBgGreen: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  courseIcon: { width: 28, height: 28, resizeMode: 'contain' },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  courseDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  metaText: { fontSize: 11, color: colors.textMuted },
  metaXp: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  metaXpText: { fontSize: 10, fontWeight: 'bold' },
  metaLvl: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  metaLvlText: { fontSize: 10, fontWeight: 'bold' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 6 },
  progressLabel: { fontSize: 11, color: colors.textMuted },
  progressPercentage: { fontSize: 11, fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  lockedMessage: { backgroundColor: colors.background, borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  lockedMessageText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: colors.navBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: colors.navIcon, fontSize: 11, marginTop: 4, fontWeight: '600' },
  navTextActive: { color: colors.navIconActive, fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navProfileImg: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -44, borderWidth: 6, borderColor: colors.navBg },
  fabIcon: { width: 44, height: 44 }
});

export default LearnScreen;