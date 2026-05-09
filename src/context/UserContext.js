import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '../utils/storage';

export const UserContext = createContext();

const EXCHANGE_RATES = {
  IDR: { rate: 1, symbol: 'Rp', prefix: true, decimals: 0 },
  USD: { rate: 0.0000645, symbol: '$', prefix: true, decimals: 2 },
  MYR: { rate: 0.000303, symbol: 'RM', prefix: true, decimals: 2 },
  SGD: { rate: 0.000086, symbol: 'S$', prefix: true, decimals: 2 },
  THB: { rate: 0.00232, symbol: '฿', prefix: true, decimals: 2 },
  PHP: { rate: 0.0037, symbol: '₱', prefix: true, decimals: 2 },
  VND: { rate: 1.61, symbol: '₫', prefix: false, decimals: 0 },
};

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('Budi');
  const [userEmail, setUserEmail] = useState('budi@demo.com');
  const [userImage, setUserImage] = useState(null);
  const [currency, setCurrencyState] = useState('IDR');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [financialGoal, setFinancialGoalState] = useState({ title: '', nominal: '', duration: '' });
  const [xp, setXp] = useState(6767);
  const [subscriptionPlan, setSubscriptionPlanState] = useState('basic');
  const [usage, setUsage] = useState({
    aiPrompts: 0,
    transactions: 0,
    lastDate: new Date().toISOString().split('T')[0]
  });

// Tambah setelah state yang sudah ada:
  const [incomeSources, setIncomeSources] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [assetTypes, setAssetTypes] = useState([]);
  const [totalAssetValue, setTotalAssetValue] = useState(0);
  const [debts, setDebts] = useState([]);
  const [organizedScore, setOrganizedScore] = useState(0);
  const [riskToleranceScore, setRiskToleranceScore] = useState(0);

  // Financial Goals — sudah ada (financialGoal)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem('user_currency');
        if (savedCurrency && EXCHANGE_RATES[savedCurrency]) {
          setCurrencyState(savedCurrency);
        }
        
        // ← Tambah load financialGoal
        const savedGoal = await AsyncStorage.getItem('user_financial_goal');
        if (savedGoal) {
          setFinancialGoalState(JSON.parse(savedGoal));
        }
        
        // ... rest of existing code
      } catch (e) {
        console.log('Failed to load settings', e);
      }
    };
    loadSettings();
  }, []);

  const localToIDR = (amount) => {
    const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES['IDR'];
    return Math.round(amount / config.rate);
  };

  const setCurrency = async (newCurrency) => {
    if (EXCHANGE_RATES[newCurrency]) {
      setCurrencyState(newCurrency);
      try {
        await AsyncStorage.setItem('user_currency', newCurrency);
      } catch (e) {
        console.log('Failed to save currency', e);
      }
    }
  };

  const setSubscriptionPlan = async (plan) => {
    setSubscriptionPlanState(plan);
    try {
      await AsyncStorage.setItem('subscription_plan', plan);
    } catch (e) {
      console.log('Failed to save subscription plan', e);
    }
  };

  const checkAiLimit = () => {
    if ((subscriptionPlan || 'basic').toLowerCase() !== 'basic') return true;
    return usage.aiPrompts < 5;
  };

  const incrementAi = () => {
    if ((subscriptionPlan || 'basic').toLowerCase() !== 'basic') return true;
    if (usage.aiPrompts >= 5) return false;
    const newUsage = { ...usage, aiPrompts: usage.aiPrompts + 1 };
    setUsage(newUsage);
    AsyncStorage.setItem('user_usage', JSON.stringify(newUsage));
    return true;
  };

  const checkTransactionLimit = () => {
    if ((subscriptionPlan || 'basic').toLowerCase() !== 'basic') return true;
    return usage.transactions < 3;
  };

  const incrementTransaction = () => {
    if ((subscriptionPlan || 'basic').toLowerCase() !== 'basic') return true;
    if (usage.transactions >= 3) return false;
    const newUsage = { ...usage, transactions: usage.transactions + 1 };
    setUsage(newUsage);
    AsyncStorage.setItem('user_usage', JSON.stringify(newUsage));
    return true;
  };

  const setFinancialGoal = async (goal) => {
    setFinancialGoalState(goal);
    try {
      await AsyncStorage.setItem('user_financial_goal', JSON.stringify(goal));
    } catch (e) {
      console.log('Could not save goal:', e);
    }
  };

  const checkGoalLimit = (currentCount) => {
    if ((subscriptionPlan || 'basic').toLowerCase() !== 'basic') return true;
    return currentCount < 2;
  };

  const calculateLevel = (currentXp) => {
    if (currentXp >= 15000) return 5;
    if (currentXp >= 7000) return 4;
    if (currentXp >= 3000) return 3;
    if (currentXp >= 1000) return 2;
    return 1;
  };

  const level = calculateLevel(xp);
  const setLevel = () => { };

  const getXpForNextLevel = () => {
    const levels = [0, 1000, 3000, 7000, 15000];
    return levels[Math.min(level, levels.length - 1)] || levels[levels.length - 1];
  };

  const getXpProgress = () => {
    const target = getXpForNextLevel();
    const previousTarget = level > 1 ? [0, 1000, 3000, 7000, 15000][level - 1] : 0;
    const progress = target > previousTarget ? ((xp - previousTarget) / (target - previousTarget)) * 100 : 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getCurrencySymbol = (curr) => {
    return EXCHANGE_RATES[curr]?.symbol || 'Rp';
  };

  const currencySymbol = getCurrencySymbol(currency);

  const formatCurrency = (amountInIdr, showSymbol = true) => {
    const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES['IDR'];
    const convertedAmount = amountInIdr * config.rate;

    // Format number with commas and decimals
    const parts = convertedAmount.toFixed(config.decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedNumber = parts.join('.');

    if (!showSymbol) return formattedNumber;

    if (config.prefix) {
      return `${config.symbol} ${formattedNumber}`;
    } else {
      return `${formattedNumber} ${config.symbol}`;
    }
  };

  const formatCurrencyM = (amountInIdr) => {
    const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES['IDR'];
    const convertedAmount = amountInIdr * config.rate;

    if (Math.abs(convertedAmount) >= 1000000) {
      let formatted = (Math.abs(convertedAmount) / 1000000).toFixed(currency === 'IDR' || currency === 'VND' ? 1 : 2);
      if (formatted.endsWith('.0')) formatted = formatted.slice(0, -2);
      else if (formatted.endsWith('.00')) formatted = formatted.slice(0, -3);

      const sign = convertedAmount < 0 ? '-' : '';
      return `${sign}${config.prefix ? config.symbol + ' ' : ''}${formatted} M${!config.prefix ? ' ' + config.symbol : ''}`;
    } else {
      return formatCurrency(amountInIdr, true);
    }
  };

  return (
    <UserContext.Provider value={{
      userName, setUserName,
      userEmail, setUserEmail,
      userImage, setUserImage,
      currency, setCurrency,
      currencySymbol,
      formatCurrency,
      formatCurrencyM,
      availableCurrencies: Object.keys(EXCHANGE_RATES),
      subscriptionPlan,
      setSubscriptionPlan,
      usage,
      checkAiLimit,
      incrementAi,
      checkTransactionLimit,
      incrementTransaction,
      checkGoalLimit,
      phoneNumber, setPhoneNumber,
      financialGoal, setFinancialGoal,
      xp, setXp,
      level, setLevel,  // ← tambahkan
      getXpForNextLevel,
      getXpProgress,
      incomeSources, setIncomeSources,
      monthlyIncome, setMonthlyIncome,
      monthlyExpense, setMonthlyExpense,
      assetTypes, setAssetTypes,
      totalAssetValue, setTotalAssetValue,
      debts, setDebts,
      organizedScore, setOrganizedScore,
      riskToleranceScore, setRiskToleranceScore,
      localToIDR,
    }}>
      {children}
    </UserContext.Provider>
  );
};