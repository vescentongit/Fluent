import React, { useState, useContext, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image 
} from 'react-native';
import { 
  ArrowLeft, Clock, Target, BookOpen, Trophy, FileText, Award, Star, Play, Home, Wallet, CheckCircle2, Hourglass, ChevronRight, FileQuestion, Lock 
} from 'lucide-react-native';
import { LessonContext } from '../context/LessonContext';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

const CourseOverviewScreen = ({ route, navigation }) => {
  const courseId = route.params?.courseId || 'investingBasics';
  const [activeTab, setActiveTab] = useState('Overview');
  const { lessons, quizzes, progressPercentage } = useContext(LessonContext);
  const { userImage } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

  const bullets = [
    "The 50/30/20 budgeting rule explained",
    "How to track and categorize your expenses",
    "Setting realistic financial goals",
    "Creating a budget that works for you",
    "Adjusting your budget overtime"
  ];

  const benefits = [
    "Take control of your money",
    "Reduce financial stress",
    "Save more effectively",
    "Build better spending habits"
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          
          <View style={styles.courseHeaderInfo}>
            <View style={styles.courseIconBg}>
              <Image source={require('../assets/piggy_bank.png')} style={styles.courseIcon} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.courseTitle}>Budgeting 101</Text>
              <View style={styles.courseMetaRow}>
                <Clock color={colors.textMuted} size={14} />
                <Text style={styles.courseTime}>2.5 hours</Text>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpText}>+ 200 XP</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* PROGRESS BAR 100% DINAMIS SEKARANG! */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressValue}>{progressPercentage}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'Overview' && styles.tabItemActive]} onPress={() => setActiveTab('Overview')}>
            <Target color={activeTab === 'Overview' ? colors.primary : colors.textMuted} size={20} />
            <Text style={[styles.tabText, activeTab === 'Overview' && styles.tabTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'Lessons' && styles.tabItemActive]} onPress={() => setActiveTab('Lessons')}>
            <BookOpen color={activeTab === 'Lessons' ? colors.primary : colors.textMuted} size={20} />
            <Text style={[styles.tabText, activeTab === 'Lessons' && styles.tabTextActive]}>Lessons</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'Quizzes' && styles.tabItemActive]} onPress={() => setActiveTab('Quizzes')}>
            <Trophy color={activeTab === 'Quizzes' ? colors.primary : colors.textMuted} size={20} />
            <Text style={[styles.tabText, activeTab === 'Quizzes' && styles.tabTextActive]}>Quizzes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {activeTab === 'Overview' && (
          <>
            <View style={styles.cardWhite}>
              <View style={styles.cardHeader}><Target color={colors.primary} size={22} /><Text style={styles.cardTitle}>What You'll Learn</Text></View>
              <View style={styles.bulletList}>
                {bullets.map((text, index) => (
                  <View key={index} style={styles.bulletRow}><Text style={styles.bulletDot}>•</Text><Text style={styles.bulletText}>{text}</Text></View>
                ))}
              </View>
            </View>

            <View style={styles.cardWhite}>
              <View style={styles.cardHeader}><FileText color={colors.primary} size={22} /><Text style={styles.cardTitle}>Requirements</Text></View>
              <View style={styles.bulletList}>
                {bullets.map((text, index) => (
                  <View key={index} style={styles.bulletRow}><Text style={styles.bulletDot}>•</Text><Text style={styles.bulletText}>{text}</Text></View>
                ))}
              </View>
            </View>

            <View style={styles.cardGrey}>
              <View style={styles.cardHeader}><Award color={colors.primary} size={22} /><Text style={styles.cardTitle}>Benefits</Text></View>
              <View style={styles.benefitsGrid}>
                {benefits.map((text, index) => (
                  <View key={index} style={styles.benefitItem}><Star color={colors.primary} size={16} fill={colors.primary} style={styles.benefitIcon} /><Text style={styles.benefitText}>{text}</Text></View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={() => setActiveTab('Lessons')}>
              <Play color={colors.white} size={20} fill={colors.white} />
              <Text style={styles.startButtonText}>Start Learning</Text>
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'Lessons' && (
          <View style={styles.lessonsContainer}>
            {lessons.map((lesson) => (
              <TouchableOpacity 
                key={lesson.id} 
                style={lesson.status === 'done' ? styles.lessonCardDone : styles.lessonCardTodo}
                onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id })}
              >
                <View style={styles.lessonIconWrapper}>
                  {lesson.status === 'done' ? <CheckCircle2 color={colors.white} fill={colors.success} size={24} /> : <Hourglass color={colors.warning} size={24} />}
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <View style={styles.lessonMeta}>
                    <View style={styles.lessonTypeBadge}><Text style={styles.lessonTypeText}>{lesson.type}</Text></View>
                    <View style={styles.lessonTimeRow}><Clock color={colors.textMuted} size={12} /><Text style={styles.lessonTimeText}>{lesson.duration}</Text></View>
                  </View>
                </View>
                <ChevronRight color={colors.textMuted} size={20} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB QUIZ DINAMIS */}
        {activeTab === 'Quizzes' && (
          <View style={styles.quizzesContainer}>
            {quizzes.map((quiz) => {
              if (quiz.status === 'locked') {
                return (
                  <View key={quiz.id} style={styles.quizCardLocked}>
                    <View style={styles.quizIconBgLocked}>
                      <FileQuestion color={colors.textMuted} size={24} />
                    </View>
                    <View style={styles.quizInfo}>
                      <Text style={styles.quizTitleLocked}>{quiz.title}</Text>
                      <Text style={styles.quizDescLocked}>{quiz.desc}</Text>
                      <Text style={styles.lockedText}>Finish all lessons to unlock this quiz!</Text>
                    </View>
                    <Lock color={colors.text} size={20} />
                  </View>
                );
              }

              const isDone = quiz.status === 'done';
              return (
                <TouchableOpacity 
                  key={quiz.id}
                  style={isDone ? styles.quizCardDone : styles.quizCardAvailable} 
                  onPress={() => navigation.navigate('Quiz', { quizId: quiz.id })}
                >
                  <View style={isDone ? styles.quizIconBgDone : styles.quizIconBg}>
                    {isDone ? <CheckCircle2 color={colors.success} size={24} /> : <FileQuestion color={colors.primary} size={24} />}
                  </View>
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                    <Text style={styles.quizDesc}>{quiz.desc}</Text>
                    <View style={styles.quizMetaRow}>
                      <Text style={styles.quizQuestionCount}>{quiz.questionsCount} questions</Text>
                      {isDone ? (
                        <Text style={styles.doneText}>Completed</Text>
                      ) : (
                        <View style={styles.xpBadgeSmall}>
                          <Text style={styles.xpTextSmall}>+ {quiz.xpReward} XP</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <ChevronRight color={colors.textMuted} size={20} />
                </TouchableOpacity>
              )
            })}
          </View>
        )}

      </ScrollView>

      {/* NAVBAR */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}><Home color="#8CA8D1" size={24} /><Text style={styles.navText}>Home</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Wallet')}><Wallet color="#8CA8D1" size={24} /><Text style={styles.navText}>Wallet</Text></TouchableOpacity>
        <View style={styles.fabWrapper}><TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Chatbot')}><Image source={require('../assets/robot_navbar.png')} style={styles.fabIcon} resizeMode="contain" /></TouchableOpacity></View>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Learn')}><BookOpen color="#FFFFFF" size={24} /><Text style={styles.navTextActive}>Learn</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}><Image source={userImage ? { uri: userImage } : require('../assets/user_profile.png')} style={styles.navProfileImg} /><Text style={styles.navText}>Profile</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  headerSafeArea: { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? 50 : 10 },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 44, height: 44, backgroundColor: colors.cardAlt, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  courseHeaderInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  courseIconBg: { width: 44, height: 44, backgroundColor: colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  courseIcon: { width: 24, height: 24, tintColor: colors.white },
  courseTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  courseMetaRow: { flexDirection: 'row', alignItems: 'center' },
  courseTime: { fontSize: 12, color: colors.textMuted, marginLeft: 6, marginRight: 10 },
  xpBadge: { backgroundColor: '#FEFCBF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  xpText: { fontSize: 11, fontWeight: 'bold', color: '#DD6B20' },
  progressContainer: { paddingHorizontal: 20, marginBottom: 20 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: colors.textMuted },
  progressValue: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
  progressBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 10 },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent', gap: 6 },
  tabItemActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: colors.primary },
  scrollContent: { padding: 20, paddingBottom: 120 },
  
  cardWhite: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: colors.border },
  cardGrey: { backgroundColor: colors.cardAlt, borderRadius: 20, padding: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  bulletList: { gap: 0 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bulletDot: { fontSize: 16, color: colors.text, marginRight: 8, lineHeight: 22 },
  bulletText: { fontSize: 13, color: colors.text, lineHeight: 20, flex: 1 },
  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  benefitItem: { width: '48%', backgroundColor: colors.card, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  benefitIcon: { marginRight: 8 },
  benefitText: { fontSize: 12, color: colors.text, flex: 1, lineHeight: 16 },
  startButton: { backgroundColor: colors.primary, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, marginTop: 10, marginBottom: 20, gap: 10, elevation: 2, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  startButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  lessonsContainer: { gap: 12 },
  lessonCardDone: { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.1)' : '#F0FDF4', borderColor: colors.success, borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  lessonCardTodo: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  lessonIconWrapper: { marginRight: 16 },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lessonTypeBadge: { backgroundColor: colors.cardAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  lessonTypeText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  lessonTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonTimeText: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },

  quizzesContainer: { gap: 16 },
  quizCardAvailable: { backgroundColor: colors.card, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: colors.border },
  quizCardDone: { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.1)' : '#F0FDF4', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', borderColor: colors.success, borderWidth: 1 },
  quizCardLocked: { backgroundColor: colors.cardAlt, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', opacity: 0.8 },
  quizIconBg: { width: 48, height: 48, backgroundColor: colors.cardAlt, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  quizIconBgDone: { width: 48, height: 48, backgroundColor: isDarkMode ? 'rgba(56,161,105,0.2)' : '#C6F6D5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  quizIconBgLocked: { width: 48, height: 48, backgroundColor: colors.border, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  quizInfo: { flex: 1 },
  quizTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  quizTitleLocked: { fontSize: 16, fontWeight: 'bold', color: colors.textMuted, marginBottom: 4 },
  quizDesc: { fontSize: 12, color: colors.textMuted, marginBottom: 8, lineHeight: 18 },
  quizDescLocked: { fontSize: 12, color: colors.textMuted, marginBottom: 8, lineHeight: 18 },
  quizMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quizQuestionCount: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  xpBadgeSmall: { backgroundColor: '#FEFCBF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  xpTextSmall: { fontSize: 10, fontWeight: 'bold', color: '#DD6B20' },
  doneText: { fontSize: 12, fontWeight: 'bold', color: colors.success },
  lockedText: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 },

  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: colors.navBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: colors.navIcon, fontSize: 11, marginTop: 4, fontWeight: '600' },
  navTextActive: { color: colors.navIconActive, fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navProfileImg: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -44, borderWidth: 6, borderColor: colors.navBg },
  fabIcon: { width: 44, height: 44 }
});

export default CourseOverviewScreen;