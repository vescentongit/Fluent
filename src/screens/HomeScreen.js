import React, { useState, useContext, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  Bell, TrendingUp, TrendingDown, ShieldCheck, Zap,
  ArrowUp, ArrowDown, Target, Lightbulb, Home, Wallet as WalletIcon, BookOpen, Star, Info, Calendar, ChevronRight
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { TransactionContext } from '../context/TransactionContext';
import { getResilienceScore } from '../services/api';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [scoreData, setScoreData] = useState({ 
    score: 0, 
    risk_level: 'N/A', 
    warning_message: '' 
  });
  const [showNotif, setShowNotif] = useState(false);
  const navigation = useNavigation();

  const { transactions } = useContext(TransactionContext);
  const { 
  userName, 
  userImage, 
  currencySymbol, 
  financialGoal, 
  xp = 0, 
  level = 1, 
  getXpForNextLevel = () => 1000, 
  getXpProgress = () => 0    // ← fallback kalau tidak ada di context
} = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const formatSummary = (num) => {
    if (num >= 1000000) {
      let formatted = (num / 1000000).toFixed(1);
      if (formatted.endsWith('.0')) formatted = formatted.slice(0, -2);
      return formatted + 'M';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatGoalAmount = (valStr) => {
    if (!valStr) return '300 M';
    const num = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) return '0';
    if (num >= 1000000) {
      let formatted = (num / 1000000).toFixed(1);
      if (formatted.endsWith('.0')) formatted = formatted.slice(0, -2);
      return formatted + ' M';
    } else if (num >= 10000) {
      let formatted = (num / 1000).toFixed(1);
      if (formatted.endsWith('.0')) formatted = formatted.slice(0, -2);
      return formatted + ' K';
    }
    return num.toString();
  };

  const formatBalance = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const totalIncomeNum = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + (parseInt(curr.amount.replace(/[^0-9]/g, ''), 10) || 0), 0);
  }, [transactions]);

  const totalExpenseNum = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + (parseInt(curr.amount.replace(/[^0-9]/g, ''), 10) || 0), 0);
  }, [transactions]);

  const baseBalance = 67476767;
  const currentBalance = baseBalance + totalIncomeNum - totalExpenseNum;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getResilienceScore(); // ← hapus 'user-123'
        if (data && data.score !== undefined) setScoreData(data);
      } catch (e) {
        console.error('Failed to load score:', e);
      }
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeaderContainer} pointerEvents="box-none">
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

        <SafeAreaView pointerEvents="box-none">
          <View style={styles.headerRow} pointerEvents="auto">
            <View>
              <Text style={styles.username}>{userName}</Text>
              <Text style={styles.greeting}>Good Morning 👋</Text>
            </View>
            <View style={styles.headerActions}>
              <View style={styles.levelBadge}>
                <Star color="#F6AD55" size={14} fill="#F6AD55" />
                <Text style={styles.levelText}>Lvl {level}</Text>
              </View>

              <TouchableOpacity
                style={styles.notificationBtn}
                onPress={() => setShowNotif(!showNotif)}
              >
                <Bell color="#050B24" size={20} />
                <View style={styles.badgeDot} />
              </TouchableOpacity>
            </View>
          </View>

          {showNotif && (
            <View style={styles.notifDropdown}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>Notifications</Text>
                <TouchableOpacity onPress={() => setShowNotif(false)}>
                  <Text style={styles.notifClose}>Mark all read</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.notifItem}>
                <View style={[styles.notifIconBg, { backgroundColor: isDarkMode ? 'rgba(229,62,62,0.2)' : '#FFF5F5' }]}>
                  <TrendingDown color={colors.danger} size={16} />
                </View>
                <View style={styles.notifTextCont}>
                  <Text style={styles.notifHeading}>Expense Recorded</Text>
                  <Text style={styles.notifDesc}>{currencySymbol} 65.000 at Starbucks</Text>
                  <Text style={styles.notifTime}>2 mins ago</Text>
                </View>
              </View>

              <View style={styles.notifDivider} />

              <View style={styles.notifItem}>
                <View style={[styles.notifIconBg, { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.2)' : '#EBF4FF' }]}>
                  <Info color={colors.primary} size={16} />
                </View>
                <View style={styles.notifTextCont}>
                  <Text style={styles.notifHeading}>System Update</Text>
                  <Text style={styles.notifDesc}>Fluent AI is now smarter!</Text>
                  <Text style={styles.notifTime}>1 hour ago</Text>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{currencySymbol} {formatBalance(currentBalance)}</Text>

          <View style={styles.balanceStatsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconWrapper}>
                <TrendingUp color="#FFFFFF" size={16} />
              </View>
              <View>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={styles.statValue}>{currencySymbol} {formatSummary(totalIncomeNum)}</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconWrapper}>
                <TrendingDown color="#FFFFFF" size={16} />
              </View>
              <View>
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={styles.statValue}>{currencySymbol} {formatSummary(totalExpenseNum)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.goalsContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.goalsTitle}>Your Goals</Text>

          <View style={styles.goalCard}>
            <Text style={styles.goalCardTitle}>{financialGoal?.title || 'New Car'}</Text>
            <View style={styles.goalAmountRow}>
              <Text style={styles.goalAmountLeft}>{currencySymbol} 156 M</Text>
              <Text style={styles.goalAmountRight}>{currencySymbol} {formatGoalAmount(financialGoal?.nominal)}</Text>
            </View>
            <View style={styles.goalProgressBg}>
              <View style={[styles.goalProgressFill, { width: '52%', backgroundColor: colors.secondary }]}>
                <Text style={styles.goalProgressTextWhite}>52% complete</Text>
              </View>
            </View>
            <Text style={styles.goalTimeLeft}>{financialGoal?.duration ? `${financialGoal.duration} years left` : '3 years left'}</Text>
          </View>

          <View style={styles.goalButtonsRow}>
            <TouchableOpacity style={styles.viewMoreBtn} onPress={() => navigation.navigate('Goals')}>
              <Text style={styles.viewMoreText}>View All Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.viewMoreBtn} 
              onPress={() => navigation.navigate('Chatbot', {
                goalAdvice: {
                  title: financialGoal?.title || 'New Car',
                  currentAmount: '156 M',
                  targetAmount: formatGoalAmount(financialGoal?.nominal) || '300 M',
                  duration: financialGoal?.duration ? `${financialGoal.duration} years left` : '3 years left',
                }
              })}
            >
              <Text style={styles.viewMoreText}>Fluent's Advice</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dualStatsRow}>
          <View style={styles.smallCard}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>Resilience Score</Text>
              <ShieldCheck color={colors.success} size={16} />
            </View>
            <Text style={styles.smallCardValue}>{scoreData.score}<Text style={styles.smallCardSub}>/100</Text></Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, 
                { width: '${scoreData.score}%', 
                backgroundColor: scoreData.score >= 50 ? colors.success : colors.danger }]} />
            </View>
            <Text style={[
              styles.smallCardStatusGreen,
              {color: scoreData.score >= 50 ? colors.success : colors.danger

              }]}>{scoreData.risk_level} {scoreData.score >= 50 ? '✓' : '⚠️'}
              </Text>
          </View>

          <View style={styles.smallCard}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>XP Progress</Text>
              <Zap color={colors.warning} size={16} fill={colors.warning} />
            </View>
            <Text style={styles.smallCardValue}>{(xp ?? 0).toLocaleString()}<Text style={styles.smallCardSub}>xp</Text></Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${getXpProgress()}%`, backgroundColor: colors.warning }]} />
            </View>
            <Text style={styles.smallCardStatusOrange}>
              {level < 4 ? `${((getXpForNextLevel() ?? 0) - (xp ?? 0)).toLocaleString()} xp to level ${level + 1}` : 'Max level reached!'}
            </Text>
          </View>
        </View>

        <View style={styles.aiInsightCard}>
          <View style={styles.aiInsightHeader}>
            <Image source={require('../assets/robot_navbar.png')} style={styles.aiInsightIcon} resizeMode="contain" />
            <Text style={styles.aiInsightTitle}>AI Insight</Text>
          </View>
          <Text style={styles.aiInsightText}>
            Your coffee spending this week <Text style={styles.aiInsightHighlight}>rose 15%</Text>. Try bringing lunch from home to save more!
          </Text>
        </View>

        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitleBlack}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Wallet')}>
              <View style={[styles.actionIconBg, { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.25)' : '#F0FFF4' }]}>
                <ArrowUp color={isDarkMode ? '#68D391' : '#38A169'} size={20} />
              </View>
              <Text style={[styles.actionText, { color: isDarkMode ? '#68D391' : '#38A169' }]}>Income</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Wallet')}>
              <View style={[styles.actionIconBg, { backgroundColor: isDarkMode ? 'rgba(229,62,62,0.25)' : '#FFF5F5' }]}>
                <ArrowDown color={isDarkMode ? '#FC8181' : '#E53E3E'} size={20} />
              </View>
              <Text style={[styles.actionText, { color: isDarkMode ? '#FC8181' : '#E53E3E' }]}>Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Goals')}>
              <View style={[styles.actionIconBg, { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.25)' : '#EBF4FF' }]}>
                <Target color={isDarkMode ? '#63B3ED' : '#3182CE'} size={20} />
              </View>
              <Text style={[styles.actionText, { color: isDarkMode ? '#63B3ED' : '#3182CE' }]}>Set Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Chatbot')}>
              <View style={[styles.actionIconBg, { backgroundColor: isDarkMode ? 'rgba(128,90,213,0.25)' : '#FAF5FF' }]}>
                <Lightbulb color={isDarkMode ? '#B794F4' : '#805AD5'} size={20} />
              </View>
              <Text style={[styles.actionText, { color: isDarkMode ? '#B794F4' : '#805AD5' }]}>AI Advice</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('AdvisorBooking')}>
          <View style={[styles.ctaCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <View style={styles.ctaIconBg}>
              <Calendar color={colors.primary} size={24} />
            </View>
            <View style={styles.ctaTextContainer}>
              <Text style={[styles.ctaTitle, { color: colors.text }]}>Book a 1-on-1 Session</Text>
              <Text style={[styles.ctaSubtitle, { color: colors.textMuted }]}>Get personalized advice from a financial advisor</Text>
            </View>
            <ChevronRight color={colors.primary} size={20} />
          </View>
        </TouchableOpacity>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitleBlack}>Weekly Spending</Text>
            <View style={styles.thisWeekBadge}>
              <Text style={styles.thisWeekText}>This week</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            {[40, 60, 30, 15, 80, 45, 55].map((val, index) => (
              <View key={index} style={styles.barColumn}>
                <View
                  style={[styles.barFill, { height: `${val}%`, backgroundColor: colors.primary }]}
                />
                <Text style={styles.barLabel}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem}>
          <Home color="#FFFFFF" size={24} />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Wallet')}>
          <WalletIcon color="#8CA8D1" size={24} />
          <Text style={styles.navText}>Wallet</Text>
        </TouchableOpacity>

        <View style={styles.fabWrapper}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <Image
              source={require('../assets/robot_navbar.png')}
              style={styles.fabIcon}
              resizeMode="contain"
            />
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
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  fixedHeaderContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: 260 },
  headerWave: { position: 'absolute', top: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10 },
  username: { fontSize: 24, fontWeight: 'bold', color: colors.white, marginTop: 20 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEFCBF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
  levelText: { fontSize: 12, fontWeight: 'bold', color: '#744210' },
  notificationBtn: { backgroundColor: colors.card, padding: 8, borderRadius: 20 },
  badgeDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: colors.danger, borderRadius: 4 },
  notifDropdown: { position: 'absolute', top: Platform.OS === 'android' ? 95 : 65, right: 20, width: 280, backgroundColor: colors.card, borderRadius: 16, padding: 15, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, zIndex: 20 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  notifTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  notifClose: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  notifItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  notifIconBg: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notifTextCont: { flex: 1 },
  notifHeading: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  notifDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  notifTime: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
  notifDivider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 140, paddingBottom: 120 },
  balanceCard: { borderRadius: 24, padding: 24, marginTop: 50, marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 5 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 25 },
  balanceStatsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statIconWrapper: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 10 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 15 },
  dualStatsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  smallCard: { flex: 1, backgroundColor: colors.card, borderRadius: 20, padding: 16 },
  smallCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  smallCardTitle: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  smallCardValue: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
  smallCardSub: { fontSize: 14, color: colors.textMuted, fontWeight: 'normal' },
  progressBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 8 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  smallCardStatusGreen: { fontSize: 11, color: colors.success, fontWeight: '600' },
  smallCardStatusOrange: { fontSize: 11, color: colors.warning, fontWeight: '600' },
  quickActionsCard: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitleBlack: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 15 },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem: { alignItems: 'center' },
  actionIconBg: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: 'bold' },
  chartCard: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 20 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  thisWeekBadge: { backgroundColor: colors.backgroundAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  thisWeekText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  chartArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barColumn: { alignItems: 'center', width: 30, height: '100%', justifyContent: 'flex-end' },
  barFill: { width: 20, borderRadius: 6, marginBottom: 8 },
  barLabel: { fontSize: 11, color: colors.textMuted },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: colors.navBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navTextActive: { color: colors.navIconActive, fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navText: { color: colors.navIcon, fontSize: 11, marginTop: 4, fontWeight: '600' },
  navProfileImg: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fab: {
    width: 88, height: 88, borderRadius: 64,
    backgroundColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
    position: 'absolute', top: -44,
    borderWidth: 6, borderColor: colors.navBg,
  },
  fabIcon: { width: 44, height: 44 },
  goalsContainer: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalsTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  goalCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  goalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  goalAmountLeft: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  goalAmountRight: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  goalProgressBg: {
    height: 12,
    backgroundColor: '#718096',
    borderRadius: 6,
    marginBottom: 4,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 6,
    justifyContent: 'center',
    paddingLeft: 6,
  },
  goalProgressTextWhite: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  goalTimeLeft: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'right',
    marginTop: 2,
  },
  goalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },
  viewMoreBtn: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  aiInsightCard: {
    backgroundColor: '#F0F5FA',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiInsightIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#002e8aff',
  },
  aiInsightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002E8A',
  },
  aiInsightText: {
    fontSize: 13,
    color: '#1A202C',
    lineHeight: 20,
  },
  aiInsightHighlight: {
    color: '#E53E3E',
    fontWeight: 'bold',
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
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
});

export default HomeScreen;