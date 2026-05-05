import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image 
} from 'react-native';
import { 
  ArrowLeft, Clock, Target, BookOpen, Trophy, FileText, Award, Star, Play, Home, Wallet, CheckCircle2, Hourglass, ChevronRight, FileQuestion, Lock 
} from 'lucide-react-native';
import { LessonContext } from '../context/LessonContext';

const CourseOverviewScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const { lessons, quizzes, progressPercentage } = useContext(LessonContext);

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
            <ArrowLeft color="#2B58CE" size={24} />
          </TouchableOpacity>
          
          <View style={styles.courseHeaderInfo}>
            <View style={styles.courseIconBg}>
              <Image source={require('../assets/piggy_bank.png')} style={styles.courseIcon} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.courseTitle}>Budgeting 101</Text>
              <View style={styles.courseMetaRow}>
                <Clock color="#A0AEC0" size={14} />
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
            <Target color={activeTab === 'Overview' ? '#2B58CE' : '#A0AEC0'} size={20} />
            <Text style={[styles.tabText, activeTab === 'Overview' && styles.tabTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'Lessons' && styles.tabItemActive]} onPress={() => setActiveTab('Lessons')}>
            <BookOpen color={activeTab === 'Lessons' ? '#2B58CE' : '#A0AEC0'} size={20} />
            <Text style={[styles.tabText, activeTab === 'Lessons' && styles.tabTextActive]}>Lessons</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'Quizzes' && styles.tabItemActive]} onPress={() => setActiveTab('Quizzes')}>
            <Trophy color={activeTab === 'Quizzes' ? '#2B58CE' : '#A0AEC0'} size={20} />
            <Text style={[styles.tabText, activeTab === 'Quizzes' && styles.tabTextActive]}>Quizzes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {activeTab === 'Overview' && (
          <>
            <View style={styles.cardWhite}>
              <View style={styles.cardHeader}><Target color="#2B58CE" size={22} /><Text style={styles.cardTitle}>What You'll Learn</Text></View>
              <View style={styles.bulletList}>
                {bullets.map((text, index) => (
                  <View key={index} style={styles.bulletRow}><Text style={styles.bulletDot}>•</Text><Text style={styles.bulletText}>{text}</Text></View>
                ))}
              </View>
            </View>

            <View style={styles.cardWhite}>
              <View style={styles.cardHeader}><FileText color="#2B58CE" size={22} /><Text style={styles.cardTitle}>Requirements</Text></View>
              <View style={styles.bulletList}>
                {bullets.map((text, index) => (
                  <View key={index} style={styles.bulletRow}><Text style={styles.bulletDot}>•</Text><Text style={styles.bulletText}>{text}</Text></View>
                ))}
              </View>
            </View>

            <View style={styles.cardGrey}>
              <View style={styles.cardHeader}><Award color="#2B58CE" size={22} /><Text style={styles.cardTitle}>Benefits</Text></View>
              <View style={styles.benefitsGrid}>
                {benefits.map((text, index) => (
                  <View key={index} style={styles.benefitItem}><Star color="#2B58CE" size={16} fill="#2B58CE" style={styles.benefitIcon} /><Text style={styles.benefitText}>{text}</Text></View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={() => setActiveTab('Lessons')}>
              <Play color="#FFFFFF" size={20} fill="#FFFFFF" />
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
                  {lesson.status === 'done' ? <CheckCircle2 color="#FFFFFF" fill="#38A169" size={24} /> : <Hourglass color="#DD6B20" size={24} />}
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <View style={styles.lessonMeta}>
                    <View style={styles.lessonTypeBadge}><Text style={styles.lessonTypeText}>{lesson.type}</Text></View>
                    <View style={styles.lessonTimeRow}><Clock color="#A0AEC0" size={12} /><Text style={styles.lessonTimeText}>{lesson.duration}</Text></View>
                  </View>
                </View>
                <ChevronRight color="#A0AEC0" size={20} />
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
                      <FileQuestion color="#718096" size={24} />
                    </View>
                    <View style={styles.quizInfo}>
                      <Text style={styles.quizTitleLocked}>{quiz.title}</Text>
                      <Text style={styles.quizDescLocked}>{quiz.desc}</Text>
                      <Text style={styles.lockedText}>Finish all lessons to unlock this quiz!</Text>
                    </View>
                    <Lock color="#1A202C" size={20} />
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
                    {isDone ? <CheckCircle2 color="#38A169" size={24} /> : <FileQuestion color="#2B58CE" size={24} />}
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
                  <ChevronRight color="#A0AEC0" size={20} />
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
        <TouchableOpacity style={styles.navItem}><Image source={require('../assets/user_profile.png')} style={styles.navProfileImg} /><Text style={styles.navText}>Profile</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerSafeArea: { backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? 50 : 10 },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 44, height: 44, backgroundColor: '#F1F5F9', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  courseHeaderInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  courseIconBg: { width: 44, height: 44, backgroundColor: '#2B58CE', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  courseIcon: { width: 24, height: 24, tintColor: '#FFFFFF' },
  courseTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
  courseMetaRow: { flexDirection: 'row', alignItems: 'center' },
  courseTime: { fontSize: 12, color: '#718096', marginLeft: 6, marginRight: 10 },
  xpBadge: { backgroundColor: '#FEFCBF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  xpText: { fontSize: 11, fontWeight: 'bold', color: '#DD6B20' },
  progressContainer: { paddingHorizontal: 20, marginBottom: 20 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: '#718096' },
  progressValue: { fontSize: 13, fontWeight: 'bold', color: '#2B58CE' },
  progressBarBg: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#447ADF', borderRadius: 4 },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EDF2F7', paddingHorizontal: 10 },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent', gap: 6 },
  tabItemActive: { borderBottomColor: '#2B58CE' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#A0AEC0' },
  tabTextActive: { color: '#2B58CE' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  
  cardWhite: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: '#EDF2F7' },
  cardGrey: { backgroundColor: '#F1F5F9', borderRadius: 20, padding: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
  bulletList: { gap: 0 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bulletDot: { fontSize: 16, color: '#1A202C', marginRight: 8, lineHeight: 22 },
  bulletText: { fontSize: 13, color: '#1A202C', lineHeight: 20, flex: 1 },
  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  benefitItem: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  benefitIcon: { marginRight: 8 },
  benefitText: { fontSize: 12, color: '#1A202C', flex: 1, lineHeight: 16 },
  startButton: { backgroundColor: '#2B58CE', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, marginTop: 10, marginBottom: 20, gap: 10, elevation: 2, shadowColor: '#2B58CE', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  startButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  lessonsContainer: { gap: 12 },
  lessonCardDone: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  lessonCardTodo: { backgroundColor: '#FFFFFF', borderColor: '#EDF2F7', borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  lessonIconWrapper: { marginRight: 16 },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A202C', marginBottom: 8 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lessonTypeBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  lessonTypeText: { fontSize: 11, fontWeight: '700', color: '#4A5568' },
  lessonTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonTimeText: { fontSize: 11, color: '#718096', fontWeight: '500' },

  quizzesContainer: { gap: 16 },
  quizCardAvailable: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: '#EDF2F7' },
  quizCardDone: { backgroundColor: '#F0FDF4', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', borderColor: '#BBF7D0', borderWidth: 1 },
  quizCardLocked: { backgroundColor: '#E2E8F0', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', opacity: 0.8 },
  quizIconBg: { width: 48, height: 48, backgroundColor: '#EBF4FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  quizIconBgDone: { width: 48, height: 48, backgroundColor: '#C6F6D5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  quizIconBgLocked: { width: 48, height: 48, backgroundColor: '#CBD5E0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  quizInfo: { flex: 1 },
  quizTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
  quizTitleLocked: { fontSize: 16, fontWeight: 'bold', color: '#4A5568', marginBottom: 4 },
  quizDesc: { fontSize: 12, color: '#4A5568', marginBottom: 8, lineHeight: 18 },
  quizDescLocked: { fontSize: 12, color: '#718096', marginBottom: 8, lineHeight: 18 },
  quizMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quizQuestionCount: { fontSize: 12, color: '#718096', fontWeight: '500' },
  xpBadgeSmall: { backgroundColor: '#FEFCBF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  xpTextSmall: { fontSize: 10, fontWeight: 'bold', color: '#DD6B20' },
  doneText: { fontSize: 12, fontWeight: 'bold', color: '#38A169' },
  lockedText: { fontSize: 12, color: '#718096', fontStyle: 'italic', marginTop: 2 },

  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: '#023E8A', borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: '#8CA8D1', fontSize: 11, marginTop: 4, fontWeight: '600' },
  navTextActive: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navProfileImg: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -44, borderWidth: 6, borderColor: '#023E8A' },
  fabIcon: { width: 44, height: 44 }
});

export default CourseOverviewScreen;