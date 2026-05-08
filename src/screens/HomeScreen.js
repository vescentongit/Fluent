import React, { useState, useContext, useMemo, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { 
  Bell, TrendingUp, TrendingDown, ShieldCheck, Zap, 
  ArrowUp, ArrowDown, Target, Lightbulb, Home, Wallet as WalletIcon, BookOpen, Star, Info
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native'; 
import { TransactionContext } from '../context/TransactionContext';
import { getResilienceScore } from '../services/api';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [score, setScore] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const navigation = useNavigation(); 
  
  const { transactions } = useContext(TransactionContext);

  const formatSummary = (num) => {
    if (num >= 1000000) {
      let formatted = (num / 1000000).toFixed(1);
      if (formatted.endsWith('.0')) formatted = formatted.slice(0, -2);
      return formatted + 'M';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
    const data = await getResilienceScore('user-123');
    setScore(data.score); 
  };
  loadData();
}, []);

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeaderContainer} pointerEvents="box-none">
        <Svg height="260" width={width} style={styles.headerWave} pointerEvents="none">
          <Path 
            fill="rgba(0, 0, 0, 0.15)"
            d={`M0 0 L${width} 0 L${width} 160 C${width * 0.7} 190 ${width * 0.3} 140 0 160 Z`} 
            transform="translate(0, 6)"
          />
          <Path 
            fill="rgba(0, 0, 0, 0.08)"
            d={`M0 0 L${width} 0 L${width} 160 C${width * 0.7} 190 ${width * 0.3} 140 0 160 Z`} 
            transform="translate(0, 3)"
          />
          <Path 
            fill="#03045E"
            d={`M0 0 L${width} 0 L${width} 160 C${width * 0.7} 190 ${width * 0.3} 140 0 160 Z`} 
          />
        </Svg>

        <SafeAreaView pointerEvents="box-none">
          <View style={styles.headerRow} pointerEvents="auto">
            <View>
              <Text style={styles.username}>Shaquille</Text>
              <Text style={styles.greeting}>Good Morning 👋</Text>
            </View>
            <View style={styles.headerActions}>
              <View style={styles.levelBadge}>
                <Star color="#F6AD55" size={14} fill="#F6AD55" />
                <Text style={styles.levelText}>Lvl 3</Text>
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
                <View style={[styles.notifIconBg, { backgroundColor: '#FFF5F5' }]}>
                  <TrendingDown color="#E53E3E" size={16} />
                </View>
                <View style={styles.notifTextCont}>
                  <Text style={styles.notifHeading}>Expense Recorded</Text>
                  <Text style={styles.notifDesc}>Rp 65.000 at Starbucks</Text>
                  <Text style={styles.notifTime}>2 mins ago</Text>
                </View>
              </View>

              <View style={styles.notifDivider} />

              <View style={styles.notifItem}>
                <View style={[styles.notifIconBg, { backgroundColor: '#EBF4FF' }]}>
                  <Info color="#3182CE" size={16} />
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
        <LinearGradient
          colors={['#2B58CE', '#4CA1D3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>Rp {formatBalance(currentBalance)}</Text>
          
          <View style={styles.balanceStatsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconWrapper}>
                <TrendingUp color="#FFFFFF" size={16} />
              </View>
              <View>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={styles.statValue}>Rp {formatSummary(totalIncomeNum)}</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconWrapper}>
                <TrendingDown color="#FFFFFF" size={16} />
              </View>
              <View>
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={styles.statValue}>Rp {formatSummary(totalExpenseNum)}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.dualStatsRow}>
          <View style={styles.smallCard}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>Resilience Score</Text>
              <ShieldCheck color="#38A169" size={16} />
            </View>
            <Text style={styles.smallCardValue}>{score}<Text style={styles.smallCardSub}>/100</Text></Text>
            <View style={styles.progressBarBg}>
              <LinearGradient colors={['#38A169', '#2B58CE']} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.progressBarFill, {width: '67%'}]} />
            </View>
            <Text style={styles.smallCardStatusGreen}>Good standing ✓</Text>
          </View>

          <View style={styles.smallCard}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>XP Progress</Text>
              <Zap color="#DD6B20" size={16} fill="#DD6B20" />
            </View>
            <Text style={styles.smallCardValue}>6,767<Text style={styles.smallCardSub}>xp</Text></Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, {width: '60%', backgroundColor: '#DD6B20'}]} />
            </View>
            <Text style={styles.smallCardStatusOrange}>3,233 xp to level 4</Text>
          </View>
        </View>

        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitleBlack}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIconBg, { backgroundColor: '#F0FFF4' }]}>
                <ArrowUp color="#38A169" size={20} />
              </View>
              <Text style={[styles.actionText, { color: '#38A169' }]}>Income</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIconBg, { backgroundColor: '#FFF5F5' }]}>
                <ArrowDown color="#E53E3E" size={20} />
              </View>
              <Text style={[styles.actionText, { color: '#E53E3E' }]}>Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIconBg, { backgroundColor: '#EBF4FF' }]}>
                <Target color="#3182CE" size={20} />
              </View>
              <Text style={[styles.actionText, { color: '#3182CE' }]}>Set Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIconBg, { backgroundColor: '#FAF5FF' }]}>
                <Lightbulb color="#805AD5" size={20} />
              </View>
              <Text style={[styles.actionText, { color: '#805AD5' }]}>AI Advice</Text>
            </TouchableOpacity>
          </View>
        </View>

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
                <LinearGradient
                  colors={['#2B58CE', '#48CAE4']}
                  style={[styles.barFill, { height: `${val}%` }]}
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

        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/user_profile.png')} 
            style={styles.navProfileImg} 
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' }, 
  fixedHeaderContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: 260 },
  headerWave: { position: 'absolute', top: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10 },
  username: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginTop: 20 },
  greeting: { fontSize: 14, color: '#A0AEC0', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEFCBF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
  levelText: { fontSize: 12, fontWeight: 'bold', color: '#744210' },
  notificationBtn: { backgroundColor: '#FFFFFF', padding: 8, borderRadius: 20 },
  badgeDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: '#E53E3E', borderRadius: 4 },
  notifDropdown: { position: 'absolute', top: Platform.OS === 'android' ? 95 : 65, right: 20, width: 280, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, zIndex: 20 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  notifTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
  notifClose: { fontSize: 12, color: '#3182CE', fontWeight: '600' },
  notifItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  notifIconBg: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notifTextCont: { flex: 1 },
  notifHeading: { fontSize: 14, fontWeight: 'bold', color: '#1A202C' },
  notifDesc: { fontSize: 12, color: '#4A5568', marginTop: 2 },
  notifTime: { fontSize: 10, color: '#A0AEC0', marginTop: 4 },
  notifDivider: { height: 1, backgroundColor: '#EDF2F7', marginVertical: 4 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 140, paddingBottom: 120 }, 
  balanceCard: { borderRadius: 24, padding: 24, marginTop: 50, marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  balanceLabel: { fontSize: 14, color: '#E2E8F0', marginBottom: 5 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 25 },
  balanceStatsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statIconWrapper: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 10 },
  statLabel: { fontSize: 12, color: '#E2E8F0' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 15 },
  dualStatsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  smallCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16 },
  smallCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  smallCardTitle: { fontSize: 12, color: '#718096', fontWeight: '600' },
  smallCardValue: { fontSize: 28, fontWeight: 'bold', color: '#1A202C', marginBottom: 10 },
  smallCardSub: { fontSize: 14, color: '#718096', fontWeight: 'normal' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginBottom: 8 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  smallCardStatusGreen: { fontSize: 11, color: '#38A169', fontWeight: '600' },
  smallCardStatusOrange: { fontSize: 11, color: '#DD6B20', fontWeight: '600' },
  quickActionsCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitleBlack: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 15 },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem: { alignItems: 'center' },
  actionIconBg: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: 'bold' },
  chartCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  thisWeekBadge: { backgroundColor: '#F7FAFC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  thisWeekText: { fontSize: 11, color: '#718096', fontWeight: '600' },
  chartArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barColumn: { alignItems: 'center', width: 30, height: '100%', justifyContent: 'flex-end' },
  barFill: { width: 20, borderRadius: 6, marginBottom: 8 },
  barLabel: { fontSize: 11, color: '#A0AEC0' },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: '#023E8A', borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20, elevation: 10, shadowColor: '#000', shadowOffset: {width: 0, height: -4}, shadowOpacity: 0.1, shadowRadius: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navTextActive: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navText: { color: '#8CA8D1', fontSize: 11, marginTop: 4, fontWeight: '600' },
  navProfileImg: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20},
  fab: { 
    width: 88, height: 88, borderRadius: 64, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', alignItems: 'center',
    position: 'absolute', top: -44, 
    borderWidth: 6, borderColor: '#023E8A', 
  },
  fabIcon: { width: 44, height: 44 }
});

export default HomeScreen;