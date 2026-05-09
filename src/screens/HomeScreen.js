import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, Dimensions, Modal, TextInput
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  Bell, TrendingUp, TrendingDown, ShieldCheck, Zap,
  ArrowUp, ArrowDown, Target, Lightbulb, Home, Wallet as WalletIcon, BookOpen, Star, Info, Calendar, ChevronRight,
  Trash2, X, Plus, Edit2, CreditCard, ShoppingBag, Landmark, Shield, Home as HomeIcon, Plane, Crown
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '../utils/storage';
import { TransactionContext } from '../context/TransactionContext';
import { getResilienceScore } from '../services/api';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import SubscriptionModal from '../components/SubscriptionModal';
import { useTranslation } from 'react-i18next';

const GOALS_STORAGE_KEY = '@fluent_goals';
const NOTIFICATIONS_READ_KEY = '@fluent_notifications_read';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { t } = useTranslation();
  const [scoreData, setScoreData] = useState({
    score: 0,
    risk_level: 'N/A',
    warning_message: ''
  });
  const [showNotif, setShowNotif] = useState(false);
  const [readNotifs, setReadNotifs] = useState([]);
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
    getXpProgress = () => 0,    // ← fallback kalau tidak ada di context
    formatCurrency,
    formatCurrencyM,
    subscriptionPlan,
    monthlyIncome = 0,        // ← tambah
    monthlyExpense = 0,       // ← tambah
    totalAssetValue = 0,      // ← tambah
    debts: onboardingDebts = [], // ← tambah
  } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [highestTargetGoal, setHighestTargetGoal] = useState(null);

  const ASSETS_KEY = '@fluent_assets';
  const DEBTS_KEY = '@fluent_debts';

  const [isBalanceModalVisible, setBalanceModalVisible] = useState(false);
  const [isSubModalVisible, setSubModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('debt');
  const [isEditMode, setIsEditMode] = useState(false);
  const [assets, setAssets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const saveAssets = async (newAssets) => {
    setAssets(newAssets);
    try {
      await AsyncStorage.setItem(ASSETS_KEY, JSON.stringify(newAssets));
    } catch (error) {
      console.error('Error saving assets:', error);
    }
  };

  const formatGoalAmount = (amount) => {
    if (!amount || amount === 0) return `${currencySymbol} 0 M`;
    return formatCurrencyM(amount);
  };

  const saveDebts = async (newDebts) => {
    setDebts(newDebts);
    try {
      await AsyncStorage.setItem(DEBTS_KEY, JSON.stringify(newDebts));
    } catch (error) {
      console.error('Error saving debts:', error);
    }
  };

  // Notification IDs
  const NOTIF_IDS = ['expense', 'system'];

  // Mark all notifications as read (without closing dropdown)
  const markAllAsRead = async () => {
    setReadNotifs(NOTIF_IDS);
    // Persist read status to storage
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(NOTIF_IDS));
    } catch (error) {
      console.error('Error saving read notifications:', error);
    }
  };

  // Load read notifications from storage
  const loadReadNotifs = async () => {
    try {
      const storedReadNotifs = await AsyncStorage.getItem(NOTIFICATIONS_READ_KEY);
      if (storedReadNotifs !== null) {
        setReadNotifs(JSON.parse(storedReadNotifs));
      }
    } catch (error) {
      console.error('Error loading read notifications:', error);
    }
  };

  const hasUnreadNotifs = NOTIF_IDS.some(id => !readNotifs.includes(id));

  useFocusEffect(
    useCallback(() => {
      loadHighestTargetGoal();
      loadReadNotifs();
      const loadAssetsDebts = async () => {
        try {
          const storedAssets = await AsyncStorage.getItem(ASSETS_KEY);
          const storedDebts = await AsyncStorage.getItem(DEBTS_KEY);

          if (storedAssets) {
            setAssets(JSON.parse(storedAssets));
          } else if (totalAssetValue > 0) {
            // ← Pre-populate dari onboarding
            const onboardingAsset = [{
              id: 'onboarding_asset',
              title: 'Total Savings & Assets',
              amount: totalAssetValue,
              type: 'savings',
              subtitle: 'From your profile setup'
            }];
            setAssets(onboardingAsset);
            await AsyncStorage.setItem(ASSETS_KEY, JSON.stringify(onboardingAsset));
          }

          if (storedDebts) {
            setDebts(JSON.parse(storedDebts));
          } else if (onboardingDebts.length > 0) {
            // ← Pre-populate dari onboarding debts
            const mappedDebts = onboardingDebts
              .filter(d => d.name && d.nominal)
              .map(d => ({
                id: d.id,
                title: d.name || 'Debt',
                amount: parseInt((d.nominal || '0').replace(/\./g, ''), 10) || 0,
                type: 'loan',
                subtitle: `Due: ${d.dueDateText} • ${d.interest || 0}% interest`
              }));
            if (mappedDebts.length > 0) {
              setDebts(mappedDebts);
              await AsyncStorage.setItem(DEBTS_KEY, JSON.stringify(mappedDebts));
            }
          }
        } catch (error) {
          console.error('Error loading assets/debts:', error);
        }
      };
      loadAssetsDebts();
    }, [])
  );

  const loadHighestTargetGoal = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
      if (storedGoals !== null) {
        const parsedGoals = JSON.parse(storedGoals);
        const activeGoals = parsedGoals.filter(goal => goal.percentage < 100);
        if (activeGoals.length > 0) {
          const sortedGoals = activeGoals.sort((a, b) => b.target - a.target);
          setHighestTargetGoal(sortedGoals[0]);
        } else {
          setHighestTargetGoal(null);
        }
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  // const formatGoalAmount = (valStr) => {
  //   if (!valStr) return formatCurrencyM(300000000);
  //   const num = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
  //   if (isNaN(num)) return formatCurrency(0);
  //   return formatCurrencyM(num);
  // };

  const totalIncomeNum = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + (typeof curr.amount === 'number' ? curr.amount : 0), 0);
  }, [transactions]);

  const totalExpenseNum = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + (typeof curr.amount === 'number' ? curr.amount : 0), 0);
  }, [transactions]);

  const totalAssetsNum = useMemo(() => assets.reduce((acc, curr) => acc + curr.amount, 0), [assets]);
  const totalDebtsNum = useMemo(() => debts.reduce((acc, curr) => acc + curr.amount, 0), [debts]);

  const currentBalance = totalAssetsNum - totalDebtsNum + monthlyIncome - monthlyExpense;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getResilienceScore();

        // ← tambah null check
        if (!data) return;

        if (data.detail) {
          navigation.replace('Login');
          return;
        }

        if (data.score !== undefined) setScoreData(data);
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
              <Text style={styles.greeting}>{t('home.goodMorning', 'Good Morning 👋')}</Text>
            </View>
            <View style={styles.headerActions}>
              <View style={styles.levelBadge}>
                <Star color="#F6AD55" size={14} fill="#F6AD55" />
                <Text style={styles.levelText}>{t('home.lvl', 'Lvl')} {level}</Text>
              </View>

              <TouchableOpacity
                style={styles.notificationBtn}
                onPress={() => setShowNotif(!showNotif)}
              >
                <Bell color="#050B24" size={20} />
                {hasUnreadNotifs && <View style={styles.badgeDot} />}
              </TouchableOpacity>
            </View>
          </View>

          {showNotif && (
            <View style={styles.notifDropdown}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>{t('home.notifications', 'Notifications')}</Text>
                <TouchableOpacity onPress={markAllAsRead}>
                  <Text style={styles.notifClose}>{t('home.markAllRead', 'Mark all read')}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.notifItem, readNotifs.includes('expense') && styles.notifItemRead]}>
                <View style={[styles.notifIconBg, { backgroundColor: isDarkMode ? 'rgba(229,62,62,0.2)' : '#FFF5F5', opacity: readNotifs.includes('expense') ? 0.5 : 1 }]}>
                  <TrendingDown color={colors.danger} size={16} />
                </View>
                <View style={styles.notifTextCont}>
                  <Text style={[styles.notifHeading, readNotifs.includes('expense') && styles.notifTextRead]}>{t('home.expenseRecorded', 'Expense Recorded')}</Text>
                  <Text style={[styles.notifDesc, readNotifs.includes('expense') && styles.notifTextRead]}>{formatCurrency(65000)} {t('home.atStarbucks', 'at Starbucks')}</Text>
                  <Text style={[styles.notifTime, readNotifs.includes('expense') && styles.notifTextRead]}>{t('home.minsAgo', '2 mins ago')}</Text>
                </View>
              </View>

              <View style={styles.notifDivider} />

              <View style={[styles.notifItem, readNotifs.includes('system') && styles.notifItemRead]}>
                <View style={[styles.notifIconBg, { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.2)' : '#EBF4FF', opacity: readNotifs.includes('system') ? 0.5 : 1 }]}>
                  <Info color={colors.primary} size={16} />
                </View>
                <View style={styles.notifTextCont}>
                  <Text style={[styles.notifHeading, readNotifs.includes('system') && styles.notifTextRead]}>{t('home.systemUpdate', 'System Update')}</Text>
                  <Text style={[styles.notifDesc, readNotifs.includes('system') && styles.notifTextRead]}>{t('home.aiSmarter', 'Fluent AI is now smarter!')}</Text>
                  <Text style={[styles.notifTime, readNotifs.includes('system') && styles.notifTextRead]}>{t('home.hourAgo', '1 hour ago')}</Text>
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
        <TouchableOpacity style={[styles.balanceCard, { backgroundColor: colors.primary }]} onPress={() => setBalanceModalVisible(true)} activeOpacity={0.8}>
          <Text style={styles.balanceLabel}>{t('home.totalBalance', 'Total Balance')}</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(currentBalance)}</Text>

          <View style={styles.balanceStatsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconWrapper}>
                <TrendingUp color="#FFFFFF" size={16} />
              </View>
              <View>
                <Text style={styles.statLabel}>{t('home.income', 'Income')}</Text>
                <Text style={styles.statValue}>{formatCurrencyM(monthlyIncome)}</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconWrapper}>
                <TrendingDown color="#FFFFFF" size={16} />
              </View>
              <View>
                <Text style={styles.statLabel}>{t('home.expenses', 'Expenses')}</Text>
                <Text style={styles.statValue}>{formatCurrencyM(monthlyExpense)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={[styles.goalsContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.goalsTitle}>{t('home.yourGoals', 'Your Goals')}</Text>

          {highestTargetGoal ? (
            <View style={styles.goalCard}>
              <Text style={styles.goalCardTitle}>{highestTargetGoal.title}</Text>
              <View style={styles.goalAmountRow}>
                <Text style={styles.goalAmountLeft}>{formatGoalAmount(highestTargetGoal.current * 1000000)}</Text>
                <Text style={styles.goalAmountRight}>{formatGoalAmount(highestTargetGoal.target * 1000000)}</Text>
              </View>
              <View style={styles.goalProgressBg}>
                <View style={[styles.goalProgressFill, { width: `${highestTargetGoal.percentage}%`, backgroundColor: colors.secondary }]} />
                <Text style={styles.goalProgressTextWhite}>{highestTargetGoal.percentage}% {t('home.complete', 'complete')}</Text>
              </View>
              <Text style={styles.goalTimeLeft}>{highestTargetGoal.daysLeft > 0 ? `${highestTargetGoal.daysLeft} ${t('home.daysLeft', 'days left')}` : t('home.completed', 'Completed!')}</Text>
            </View>
          ) : (
            <View style={styles.goalCard}>
              <Text style={styles.goalCardTitle}>{t('home.noActiveGoals', 'No Active Goals')}</Text>
              <Text style={[styles.goalTimeLeft, { textAlign: 'center', marginTop: 10 }]}>{t('home.tapSetGoal', 'Tap "Set Goal" to create your first financial goal!')}</Text>
            </View>
          )}

          <View style={styles.goalButtonsRow}>
            <TouchableOpacity style={styles.viewMoreBtn} onPress={() => navigation.navigate('Goals')}>
              <Text style={styles.viewMoreText}>{t('home.viewAllGoals', 'View All Goals')}</Text>
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
              <Text style={styles.viewMoreText}>{t('home.fluentsAdvice', "Fluent's Advice")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dualStatsRow}>
          <View style={styles.smallCard}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>{t('home.resilienceScore', 'Resilience Score')}</Text>
              <ShieldCheck color={colors.success} size={16} />
            </View>
            <Text style={styles.smallCardValue}>{scoreData.score}<Text style={styles.smallCardSub}>/100</Text></Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill,
              {
                width: '${scoreData.score}%',
                backgroundColor: scoreData.score >= 50 ? colors.success : colors.danger
              }]} />
            </View>
            <Text style={[
              styles.smallCardStatusGreen,
              {
                color: scoreData.score >= 50 ? colors.success : colors.danger

              }]}>{scoreData.risk_level} {scoreData.score >= 50 ? '✓' : '⚠️'}
            </Text>
          </View>

          <View style={styles.smallCard}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>{t('home.xpProgress', 'XP Progress')}</Text>
              <Zap color={colors.warning} size={16} fill={colors.warning} />
            </View>
            <Text style={styles.smallCardValue}>{(xp ?? 0).toLocaleString()}<Text style={styles.smallCardSub}>xp</Text></Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${getXpProgress()}%`, backgroundColor: colors.warning }]} />
            </View>
            <Text style={styles.smallCardStatusOrange}>
              {level < 4 ? `${((getXpForNextLevel() ?? 0) - (xp ?? 0)).toLocaleString()} ${t('home.toLevel', 'xp to level')} ${level + 1}` : t('home.maxLevel', 'Max level reached!')}
            </Text>
          </View>
        </View>

        <View style={styles.aiInsightCard}>
          <View style={styles.aiInsightHeader}>
            <Image source={require('../assets/robot_navbar.png')} style={styles.aiInsightIcon} resizeMode="contain" />
            <Text style={styles.aiInsightTitle}>{t('home.aiInsight', 'AI Insight')}</Text>
          </View>
          <Text style={styles.aiInsightText}>
            {t('home.coffeeSpending', 'Your coffee spending this week ')}<Text style={styles.aiInsightHighlight}>{t('home.rose15', 'rose 15%')}</Text>{t('home.tryBringingLunch', '. Try bringing lunch from home to save more!')}
          </Text>
        </View>

        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitleBlack}>{t('home.quickActions', 'Quick Actions')}</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Wallet')}>
              <View style={[styles.actionIconBg, { backgroundColor: isDarkMode ? 'rgba(56,161,105,0.25)' : '#F0FFF4' }]}>
                <ArrowUp color={isDarkMode ? '#68D391' : '#38A169'} size={20} />
              </View>
              <Text style={[styles.actionText, { color: isDarkMode ? '#68D391' : '#38A169' }]}>{t('home.income', 'Income')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Wallet')}>
              <View style={[styles.actionIconBg, { backgroundColor: isDarkMode ? 'rgba(229,62,62,0.25)' : '#FFF5F5' }]}>
                <ArrowDown color={isDarkMode ? '#FC8181' : '#E53E3E'} size={20} />
              </View>
              <Text style={[styles.actionText, { color: isDarkMode ? '#FC8181' : '#E53E3E' }]}>{t('home.expenses', 'Expense')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Goals')}>
              <View style={[styles.actionIconBg, { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.25)' : '#EBF4FF' }]}>
                <Target color={isDarkMode ? '#63B3ED' : '#3182CE'} size={20} />
              </View>
              <Text style={[styles.actionText, { color: isDarkMode ? '#63B3ED' : '#3182CE' }]}>{t('home.setGoal', 'Set Goal')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Chatbot')}>
              <View style={[styles.actionIconBg, { backgroundColor: isDarkMode ? 'rgba(128,90,213,0.25)' : '#FAF5FF' }]}>
                <Lightbulb color={isDarkMode ? '#B794F4' : '#805AD5'} size={20} />
              </View>
              <Text style={[styles.actionText, { color: isDarkMode ? '#B794F4' : '#805AD5' }]}>{t('home.aiAdvice', 'AI Advice')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {subscriptionPlan !== 'elite' && (
          <TouchableOpacity onPress={() => setSubModalVisible(true)}>
            <View style={[styles.ctaCard, { backgroundColor: '#D69E2E', borderColor: '#D69E2E', marginBottom: 16 }]}>
              <View style={[styles.ctaIconBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Crown color={colors.white} size={24} />
              </View>
              <View style={styles.ctaTextContainer}>
                <Text style={[styles.ctaTitle, { color: colors.white }]}>{t('home.upgradeElite', 'Upgrade to Fluent Elite')}</Text>
              </View>
              <ChevronRight color={colors.white} size={20} />
            </View>
          </TouchableOpacity>
        )}

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
              <Text style={[styles.ctaTitle, { color: colors.text }]}>{t('home.bookSession', 'Book a 1-on-1 Session')}</Text>
              <Text style={[styles.ctaSubtitle, { color: colors.textMuted }]}>{t('home.getAdvice', 'Get personalized advice from a financial advisor')}</Text>
            </View>
            <ChevronRight color={colors.primary} size={20} />
          </View>
        </TouchableOpacity>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitleBlack}>{t('home.weeklySpending', 'Weekly Spending')}</Text>
            <View style={styles.thisWeekBadge}>
              <Text style={styles.thisWeekText}>{t('home.thisWeek', 'This week')}</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            {[40, 60, 30, 15, 80, 45, 55].map((val, index) => (
              <View key={index} style={styles.barColumn}>
                <View
                  style={[styles.barFill, { height: `${val}%`, backgroundColor: colors.primary }]}
                />
                <Text style={styles.barLabel}>
                  {[
                    t('home.mon', 'Mon'), t('home.tue', 'Tue'), t('home.wed', 'Wed'), t('home.thu', 'Thu'), t('home.fri', 'Fri'), t('home.sat', 'Sat'), t('home.sun', 'Sun')
                  ][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem}>
          <Home color="#FFFFFF" size={24} />
          <Text style={styles.navTextActive}>{t('nav.home', 'Home')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Wallet')}>
          <WalletIcon color="#8CA8D1" size={24} />
          <Text style={styles.navText}>{t('nav.wallet', 'Wallet')}</Text>
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
          <Text style={styles.navText}>{t('nav.learn', 'Learn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={userImage ? { uri: userImage } : require('../assets/user_profile.png')}
            style={styles.navProfileImg}
          />
          <Text style={styles.navText}>{t('nav.profile', 'Profile')}</Text>
        </TouchableOpacity>
      </View>

      {/* DEBTS & ASSETS MODAL */}
      <Modal visible={isBalanceModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlayBottom}>
          <View style={[styles.bottomSheet, { backgroundColor: activeTab === 'debt' ? '#FF3B30' : '#32ADE6' }]}>
            <View style={{ padding: 24, paddingBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#FFF' }}>
                  {activeTab === 'debt' ? t('home.myDebts', 'My Debts') : t('home.myAssets', 'My Assets')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 20 }}>
                    <Edit2 color="#FFF" size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setBalanceModalVisible(false)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 20 }}>
                    <X color="#FFF" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 20 }}>
                {activeTab === 'debt' ? t('home.totalDebtsValue', 'Total Debts Value') : t('home.totalAssetsValue', 'Total Assets Value')}
              </Text>
              <Text style={{ fontSize: 40, fontWeight: '900', color: '#FFF', marginBottom: 24, marginTop: 4 }}>
                {formatCurrencyM(activeTab === 'debt' ? totalDebtsNum : totalAssetsNum)}
              </Text>

              <View style={styles.sheetTabContainer}>
                <TouchableOpacity
                  style={[styles.sheetTabButton, activeTab === 'debt' && styles.sheetTabButtonActive]}
                  onPress={() => setActiveTab('debt')}
                >
                  <Text style={[styles.sheetTabText, activeTab === 'debt' && { color: '#FF3B30' }]}>{t('home.debt', 'Debt')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sheetTabButton, activeTab === 'asset' && styles.sheetTabButtonActive]}
                  onPress={() => setActiveTab('asset')}
                >
                  <Text style={[styles.sheetTabText, activeTab === 'asset' && { color: '#32ADE6' }]}>{t('home.asset', 'Asset')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={{ paddingHorizontal: 24, flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {(activeTab === 'debt' ? debts : assets).map(item => {
                let ItemIcon = WalletIcon;
                let iconBg = 'rgba(0,0,0,0.05)';
                let iconColor = activeTab === 'debt' ? '#FF3B30' : '#32ADE6';
                if (item.type === 'credit') { ItemIcon = CreditCard; iconBg = '#FCE8E8'; iconColor = '#E53E3E'; }
                else if (item.type === 'loan') { ItemIcon = ShoppingBag; iconBg = '#FEF0DB'; iconColor = '#DD6B20'; }
                else if (item.type === 'cash') { ItemIcon = Landmark; iconBg = '#EBF8FF'; iconColor = '#3182CE'; }
                else if (item.type === 'savings') { ItemIcon = Shield; iconBg = '#FEFCBF'; iconColor = '#D69E2E'; }
                else if (item.type === 'investment') { ItemIcon = TrendingUp; iconBg = '#E6FFFA'; iconColor = '#38B2AC'; }
                else if (item.type === 'property') { ItemIcon = HomeIcon; iconBg = '#FAF5FF'; iconColor = '#9F7AEA'; }
                else if (item.title.toLowerCase().includes('vacation')) { ItemIcon = Plane; iconBg = '#FEFCBF'; iconColor = '#D69E2E'; }

                return (
                  <View key={item.id} style={styles.sheetItemCard}>
                    <View style={[styles.sheetItemIconBg, { backgroundColor: iconBg }]}>
                      <ItemIcon color={iconColor} size={24} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ fontSize: 16, fontWeight: '900', color: '#1A202C', marginRight: 8 }}>{item.title}</Text>
                        <View style={{ backgroundColor: iconBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                          <Text style={{ fontSize: 10, color: iconColor, fontWeight: '800' }}>{item.type}</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 18, fontWeight: '900', color: '#1A202C', marginBottom: 4 }}>
                        {formatCurrency(item.amount)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {item.type === 'credit' || item.type === 'loan' ? null : <TrendingUp color="#38B2AC" size={14} style={{ marginRight: 4 }} />}
                        <Text style={{ fontSize: 13, color: activeTab === 'debt' ? '#E53E3E' : '#38B2AC', fontWeight: '700' }}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </View>
                    {isEditMode && (
                      <TouchableOpacity
                        style={{ padding: 12, backgroundColor: '#FFF5F5', borderRadius: 12, marginLeft: 8 }}
                        onPress={() => {
                          if (activeTab === 'debt') saveDebts(debts.filter(d => d.id !== item.id));
                          else saveAssets(assets.filter(a => a.id !== item.id));
                        }}
                      >
                        <Trash2 color="#E53E3E" size={20} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}

              {isEditMode && (
                <View style={[styles.sheetItemCard, { marginTop: 16 }]}>
                  <View style={{ flex: 1, marginRight: 16 }}>
                    <TextInput
                      style={{ borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginBottom: 12, paddingVertical: 8, color: '#1A202C', fontSize: 16, fontWeight: '600' }}
                      placeholder={t('home.newItemName', 'New Item Name')}
                      placeholderTextColor="#A0AEC0"
                      value={newItemTitle}
                      onChangeText={setNewItemTitle}
                    />
                    <TextInput
                      style={{ borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 8, color: '#1A202C', fontSize: 16, fontWeight: '600' }}
                      placeholder={t('home.amount', 'Amount')}
                      placeholderTextColor="#A0AEC0"
                      keyboardType="numeric"
                      value={newItemAmount}
                      onChangeText={setNewItemAmount}
                    />
                  </View>
                  <TouchableOpacity
                    style={{ backgroundColor: activeTab === 'debt' ? '#FF3B30' : '#32ADE6', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                      if (!newItemTitle || !newItemAmount) return;
                      const amountNum = parseInt(newItemAmount, 10);
                      if (isNaN(amountNum)) return;
                      const newItem = {
                        id: Date.now().toString(),
                        title: newItemTitle,
                        amount: amountNum,
                        type: 'custom',
                        subtitle: 'Added manually'
                      };
                      if (activeTab === 'debt') saveDebts([...debts, newItem]);
                      else saveAssets([...assets, newItem]);
                      setNewItemTitle('');
                      setNewItemAmount('');
                    }}
                  >
                    <Plus color="#FFFFFF" size={28} />
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <SubscriptionModal 
        visible={isSubModalVisible} 
        onClose={() => setSubModalVisible(false)} 
      />
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
  notifItemRead: { opacity: 0.5 },
  notifTextRead: { color: colors.textMuted },
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
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabButtonActive: { backgroundColor: colors.card, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabButtonText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  tabButtonTextActive: { color: colors.text },
  
  // Modal Bottom Sheet Styles
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { width: '100%', height: '85%', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  sheetTabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 6, marginBottom: 24 },
  sheetTabButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  sheetTabButtonActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  sheetTabText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  sheetItemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  sheetItemIconBg: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;