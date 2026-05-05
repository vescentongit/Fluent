import React, { useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Home, Wallet, BookOpen, Star, CheckCircle2, Hourglass, PlayCircle, Shield, Lock } from 'lucide-react-native';
import { LessonContext } from '../context/LessonContext';

const { width } = Dimensions.get('window');

const LearnScreen = ({ navigation }) => {
    const { xp, progressPercentage } = useContext(LessonContext);
  return (
    <View style={styles.container}>
      <View style={styles.fixedHeaderContainer} pointerEvents="box-none">
        <Svg height="160" width={width} style={styles.headerWave} pointerEvents="none">
          <Path 
            fill="rgba(0, 0, 0, 0.15)"
            d={`M0 0 L${width} 0 L${width} 120 C${width * 0.7} 150 ${width * 0.3} 100 0 120 Z`} 
            transform="translate(0, 6)"
        />
        <Path 
            fill="rgba(0, 0, 0, 0.08)"
            d={`M0 0 L${width} 0 L${width} 120 C${width * 0.7} 150 ${width * 0.3} 100 0 120 Z`} 
            transform="translate(0, 3)"
        />
        <Path 
            fill="#03045E"
            d={`M0 0 L${width} 0 L${width} 120 C${width * 0.7} 150 ${width * 0.3} 100 0 120 Z`} 
        />
        </Svg>

        <SafeAreaView pointerEvents="box-none">
          <View style={styles.headerRow} pointerEvents="auto">
            <View>
              <Text style={styles.headerTitle}>Learn & Level Up</Text>
              <Text style={styles.headerSubtitle}>Earn XP, unlock badges!</Text>
            </View>
            <View style={styles.xpBadge}>
              <Star color="#F6AD55" size={16} fill="#F6AD55" />
              <Text style={styles.xpText}>{xp.toLocaleString()} XP</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#447ADF', '#04ADAD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakCard}
        >
          <View>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <View style={styles.streakValueRow}>
              <Image source={require('../assets/streak_fire.png')} style={styles.streakIcon} />
              <Text style={styles.streakDays}>67 Days</Text>
            </View>
            <Text style={styles.streakBonus}>Keep it up! +50 XP streak bonus</Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Daily Challenges</Text>
          
          <View style={styles.challengeItemDone}>
            <CheckCircle2 color="#38A169" size={20} />
            <Text style={styles.challengeTextDone}>Finish 1 lesson in any courses</Text>
            <View style={styles.challengeXpDone}><Text style={styles.xpAmountDone}>+ 20 XP</Text></View>
          </View>

          <View style={styles.challengeItemDone}>
            <CheckCircle2 color="#38A169" size={20} />
            <Text style={styles.challengeTextDone}>Get 80% in any quizzes</Text>
            <View style={styles.challengeXpDone}><Text style={styles.xpAmountDone}>+ 30 XP</Text></View>
          </View>

          <View style={styles.challengeItemTodo}>
            <Hourglass color="#DD6B20" size={20} />
            <Text style={styles.challengeTextTodo}>Finish 3 lessons in any courses</Text>
            <View style={styles.challengeXpTodo}><Text style={styles.xpAmountTodo}>+ 50 XP</Text></View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Courses</Text>
          
          <View style={styles.courseCard}>
            <View style={styles.courseTopRow}>
              <View style={styles.courseIconBgBlue}>
                <Image source={require('../assets/piggy_bank.png')} style={styles.courseIcon} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>Budgeting 101</Text>
                <Text style={styles.courseDesc}>Master the 50/30/20 rule and take control of your finances</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>8 lessons</Text>
                  <View style={styles.metaXp}><Text style={styles.metaXpText}>+ 200 XP</Text></View>
                  <View style={styles.metaLvl}><Text style={styles.metaLvlText}>Lvl 1</Text></View>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('CourseOverview')}>
                <PlayCircle color="#447ADF" size={32} />
            </TouchableOpacity>
            </View>
            <View style={styles.progressHeader}>
               <Text style={styles.progressLabel}>Progress</Text>
               <Text style={[styles.progressPercentage, { color: '#447ADF' }]}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBarBg}>
               <View style={[styles.progressBarFill, {width: '80%', backgroundColor: '#447ADF'}]} />
            </View>
          </View>

          <View style={styles.courseCard}>
            <View style={styles.courseTopRow}>
              <View style={styles.courseIconBgGreen}>
                <Image source={require('../assets/investing_graph.png')} style={styles.courseIcon} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>Investing Basics</Text>
                <Text style={styles.courseDesc}>Stocks, bonds, Reksa Dana. Start building wealth today</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>5 lessons</Text>
                  <View style={styles.metaXp}><Text style={styles.metaXpText}>+ 350 XP</Text></View>
                  <View style={[styles.metaLvl, {backgroundColor: '#E6FFFA'}]}><Text style={[styles.metaLvlText, {color: '#04ADAD'}]}>Lvl 2</Text></View>
                </View>
              </View>
              <TouchableOpacity><PlayCircle color="#04ADAD" size={32} /></TouchableOpacity>
            </View>
            <View style={styles.progressHeader}>
               <Text style={styles.progressLabel}>Progress</Text>
               <Text style={[styles.progressPercentage, { color: '#04ADAD' }]}>40%</Text>
            </View>
            <View style={styles.progressBarBg}>
               <View style={[styles.progressBarFill, {width: '40%', backgroundColor: '#04ADAD'}]} />
            </View>
          </View>

          <View style={styles.courseCard}>
            <View style={styles.courseTopRow}>
              <View style={[styles.courseIconBgGreen, {backgroundColor: '#E8F5E9'}]}>
                <Shield color="#2ECC71" size={24} fill="#2ECC71" />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>Emergency Fund Guide</Text>
                <Text style={styles.courseDesc}>Build your financial safety net in 90 days</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>6 lessons</Text>
                  <View style={styles.metaXp}><Text style={styles.metaXpText}>+ 150 XP</Text></View>
                  <View style={[styles.metaLvl, {backgroundColor: '#E8F5E9'}]}><Text style={[styles.metaLvlText, {color: '#2ECC71'}]}>Lvl 1</Text></View>
                </View>
              </View>
              <TouchableOpacity><PlayCircle color="#2ECC71" size={32} /></TouchableOpacity>
            </View>
            <View style={styles.progressHeader}>
               <Text style={styles.progressLabel}>Progress</Text>
               <Text style={[styles.progressPercentage, { color: '#2ECC71' }]}>100%</Text>
            </View>
            <View style={styles.progressBarBg}>
               <View style={[styles.progressBarFill, {width: '100%', backgroundColor: '#2ECC71'}]} />
            </View>
          </View>

          <View style={[styles.courseCard, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={[styles.courseTopRow, { opacity: 0.6 }]}>
              <View style={[styles.courseIconBgBlue, {backgroundColor: '#FEFCBF'}]}>
                <Image source={require('../assets/checkbox.png')} style={[styles.courseIcon, { tintColor: '#DD6B20' }]} />
              </View>
              <View style={styles.courseInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.courseTitle}>Passive Income</Text>
                  <Lock color="#A0AEC0" size={16} />
                </View>
                <Text style={styles.courseDesc}>7 proven strategies to earn while you sleep</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>15 lessons</Text>
                  <View style={styles.metaXp}><Text style={styles.metaXpText}>+ 500 XP</Text></View>
                  <View style={[styles.metaLvl, {backgroundColor: '#FFFBF0'}]}><Text style={[styles.metaLvlText, {color: '#DD6B20'}]}>Lvl 4</Text></View>
                </View>
              </View>
            </View>
            <View style={styles.lockedMessage}>
              <Text style={styles.lockedMessageText}>Reach Level 4 to unlock!</Text>
            </View>
          </View>

        </View>
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
        <TouchableOpacity style={styles.navItem}>
          <BookOpen color="#FFFFFF" size={24} />
          <Text style={styles.navTextActive}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../assets/user_profile.png')} style={styles.navProfileImg} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  fixedHeaderContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: 160 },
  headerWave: { position: 'absolute', top: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 40 : 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: '#D0D6F5', marginTop: 2 },
  xpBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEFCBF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  xpText: { fontSize: 13, fontWeight: 'bold', color: '#744210' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 130, paddingBottom: 120, marginTop: 20 },
  streakCard: { borderRadius: 24, padding: 24, marginBottom: 25 },
  streakLabel: { fontSize: 14, color: '#E2E8F0', marginBottom: 8 },
  streakValueRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakIcon: { width: 40, height: 40, resizeMode: 'contain' },
  streakDays: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF' },
  streakBonus: { fontSize: 13, color: '#FFFFFF', marginTop: 8, fontWeight: '500' },
  sectionContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginBottom: 15 },
  challengeItemDone: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FFF4', padding: 12, borderRadius: 16, marginBottom: 12, gap: 10 },
  challengeTextDone: { flex: 1, fontSize: 13, color: '#718096', textDecorationLine: 'line-through' },
  challengeXpDone: { backgroundColor: '#C6F6D5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  xpAmountDone: { fontSize: 11, fontWeight: 'bold', color: '#2F855A' },
  challengeItemTodo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBF0', padding: 12, borderRadius: 16, marginBottom: 12, gap: 10 },
  challengeTextTodo: { flex: 1, fontSize: 13, color: '#1A202C', fontWeight: '500' },
  challengeXpTodo: { backgroundColor: '#FEEBC8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  xpAmountTodo: { fontSize: 11, fontWeight: 'bold', color: '#C05621' },
  courseCard: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EDF2F7', paddingBottom: 15 },
  courseTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  courseIconBgBlue: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#EBF4FF', justifyContent: 'center', alignItems: 'center' },
  courseIconBgGreen: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#E6FFFA', justifyContent: 'center', alignItems: 'center' },
  courseIcon: { width: 28, height: 28, resizeMode: 'contain' },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
  courseDesc: { fontSize: 12, color: '#718096', marginTop: 2 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  metaText: { fontSize: 11, color: '#A0AEC0' },
  metaXp: { backgroundColor: '#FEEBC8', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  metaXpText: { fontSize: 10, fontWeight: 'bold', color: '#C05621' },
  metaLvl: { backgroundColor: '#EBF4FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  metaLvlText: { fontSize: 10, fontWeight: 'bold', color: '#2B6CB0' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 6 },
  progressLabel: { fontSize: 11, color: '#A0AEC0' },
  progressPercentage: { fontSize: 11, fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  lockedMessage: { backgroundColor: '#F8FAFC', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  lockedMessageText: { fontSize: 12, color: '#718096', fontWeight: '500' },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: '#023E8A', borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: '#8CA8D1', fontSize: 11, marginTop: 4, fontWeight: '600' },
  navTextActive: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navProfileImg: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -44, borderWidth: 6, borderColor: '#023E8A' },
  fabIcon: { width: 44, height: 44 }
});

export default LearnScreen;