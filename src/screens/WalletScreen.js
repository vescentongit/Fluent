import React, { useState, useMemo, useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image, Dimensions, TextInput, Modal, PanResponder
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { 
  Home, Wallet as WalletIcon, BookOpen, Plus, Search, TrendingUp, TrendingDown 
} from 'lucide-react-native';
import { TransactionContext } from '../context/TransactionContext';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const WalletScreen = ({ navigation }) => {
  const availableIcons = [
    require('../assets/mdi_chicken-leg.png'),
    require('../assets/Frame 66.png'),
    require('../assets/Icon Gojek.png'),
    require('../assets/Icon Subscribe.png'),
    require('../assets/Icon Kopi kenangan.png'),
    require('../assets/Icon Shopee.png'),
    require('../assets/Mix parlay income.png'),
    require('../assets/Mix parlay expense.png'),
    require('../assets/home-rent.png')
  ];

  const { transactions, setTransactions } = useContext(TransactionContext);
  const { userImage, currencySymbol } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [modalVisible, setModalVisible] = useState(false);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.dy > 15 && gestureState.vy > 0.1;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 50) {
        setModalVisible(false);
      }
    }
  }), []);
  const [transactionType, setTransactionType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(availableIcons[0]);
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesTab = activeTab === 'All' || t.type.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [transactions, activeTab, searchQuery]);

  const formatSummary = (num) => {
    if (num >= 1000000) {
      let formatted = (num / 1000000).toFixed(1);
      if (formatted.endsWith('.0')) formatted = formatted.slice(0, -2);
      return formatted + 'M';
    }
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

  const totalIncome = `+${currencySymbol} ${formatSummary(totalIncomeNum)}`;
  const totalExpense = `-${currencySymbol} ${formatSummary(totalExpenseNum)}`;

  const handleSaveTransaction = () => {
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
    if (!title.trim() || numAmount === 0 || !selectedIcon) return;

    const formattedAmount = `${transactionType === 'income' ? '+' : '-'}${currencySymbol} ${numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

    const newTx = {
      id: Date.now().toString(),
      title: title,
      time: 'Just now',
      amount: formattedAmount,
      type: transactionType,
      icon: selectedIcon
    };

    setTransactions([newTx, ...transactions]);
    setModalVisible(false);
    setTitle('');
    setAmount('');
    setSelectedIcon(availableIcons[0]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeaderContainer} pointerEvents="box-none">
        <Svg height="180" width={width} style={styles.headerWave} pointerEvents="none">
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
              <Text style={styles.headerTitle}>Wallet</Text>
              <Text style={styles.headerSubtitle}>Transactions</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Plus color="#03045E" size={24} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: isDarkMode ? 'rgba(46,204,113,0.15)' : '#E8F5E9' }]}>
            <View style={styles.summaryLabelRow}>
              <TrendingUp color="#2ECC71" size={16} />
              <Text style={[styles.summaryLabel, { color: '#2ECC71' }]}>Income</Text>
            </View>
            <Text style={styles.summaryAmountDark}>{totalIncome}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: isDarkMode ? 'rgba(255,77,77,0.15)' : '#FCE4EC' }]}>
            <View style={styles.summaryLabelRow}>
              <TrendingDown color="#FF4D4D" size={16} />
              <Text style={[styles.summaryLabel, { color: '#FF4D4D' }]}>Expenses</Text>
            </View>
            <Text style={styles.summaryAmountDark}>{totalExpense}</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#A0AEC0" size={20} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search transactions...."
            placeholderTextColor="#A0AEC0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.tabWrapper} onPress={() => setActiveTab('All')}>
            {activeTab === 'All' ? (
              <View style={[styles.activeTabGradient, { backgroundColor: colors.primary }]}>
                <Text style={styles.activeTabText}>All</Text>
              </View>
            ) : (
              <View style={styles.inactiveTab}><Text style={styles.inactiveTabText}>All</Text></View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabWrapper} onPress={() => setActiveTab('Income')}>
            {activeTab === 'Income' ? (
              <View style={[styles.activeTabGradient, { backgroundColor: colors.primary }]}>
                <Text style={styles.activeTabText}>Income</Text>
              </View>
            ) : (
              <View style={styles.inactiveTab}><Text style={styles.inactiveTabText}>Income</Text></View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabWrapper} onPress={() => setActiveTab('Expense')}>
            {activeTab === 'Expense' ? (
              <View style={[styles.activeTabGradient, { backgroundColor: colors.primary }]}>
                <Text style={styles.activeTabText}>Expense</Text>
              </View>
            ) : (
              <View style={styles.inactiveTab}><Text style={styles.inactiveTabText}>Expense</Text></View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {filteredTransactions.map((item) => (
            <View key={item.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <Image source={item.icon} style={styles.transactionIcon} resizeMode="contain" />
                <View>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionTime}>{item.time}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount, 
                { color: item.type === 'income' ? '#2ECC71' : '#FF1E1E' }
              ]}>
                {item.amount.replace('Rp', currencySymbol)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} {...panResponder.panHandlers}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Transaction</Text>

            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleButton, transactionType === 'expense' && styles.toggleButtonActive]}
                onPress={() => setTransactionType('expense')}
              >
                <Text style={[styles.toggleText, transactionType === 'expense' && styles.toggleTextExpenseActive]}>
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, transactionType === 'income' && styles.toggleButtonActive]}
                onPress={() => setTransactionType('income')}
              >
                <Text style={[styles.toggleText, transactionType === 'income' && styles.toggleTextIncomeActive]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Title</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.textInputStyle}
                value={title}
                onChangeText={setTitle}
                placeholder="E.g. Lunch/Salary"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <Text style={styles.inputLabel}>Amount</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.textInputStyle}
                value={amount}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setAmount(numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."));
                }}
                keyboardType="numeric"
                placeholder={`${currencySymbol} 0`}
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <Text style={styles.inputLabel}>Choose Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
              {availableIcons.map((ico, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => setSelectedIcon(ico)} 
                  style={[styles.iconOption, selectedIcon === ico && styles.iconOptionSelected]}
                >
                  <Image source={ico} style={styles.iconOptionImage} resizeMode="contain" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { backgroundColor: transactionType === 'income' ? '#47DD62' : '#D9534F' }
              ]}
              onPress={handleSaveTransaction}
            >
              <Text style={styles.saveButtonText}>
                Save {transactionType === 'income' ? 'Income' : 'Expense'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNavbar}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Home')}
        >
          <Home color="#8CA8D1" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <WalletIcon color="#FFFFFF" size={24} />
          <Text style={styles.navTextActive}>Wallet</Text>
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
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  fixedHeaderContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: 180 },
  headerWave: { position: 'absolute', top: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 40 : 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontWeight: '400' },
  addButton: { width: 44, height: 44, backgroundColor: colors.card, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 140, paddingBottom: 120 }, 
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 15 },
  summaryCard: { flex: 1, borderRadius: 20, padding: 16, marginHorizontal: 4 },
  summaryLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  summaryLabel: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  summaryAmountDark: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: colors.text },
  tabsContainer: { flexDirection: 'row', backgroundColor: colors.cardAlt, borderRadius: 12, padding: 4, marginBottom: 20 },
  tabWrapper: { flex: 1 },
  activeTabGradient: { borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  activeTabText: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
  inactiveTab: { borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  inactiveTabText: { color: colors.textMuted, fontWeight: 'bold', fontSize: 14 },
  transactionsList: { gap: 12 },
  transactionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border },
  transactionLeft: { flexDirection: 'row', alignItems: 'center' },
  transactionIcon: { width: 48, height: 48, marginRight: 12 },
  transactionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  transactionTime: { fontSize: 12, color: colors.textMuted },
  transactionAmount: { fontSize: 15, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12 },
  modalHandle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 24 },
  toggleContainer: { flexDirection: 'row', backgroundColor: colors.cardAlt, borderRadius: 16, padding: 4, marginBottom: 20 },
  toggleButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  toggleButtonActive: { backgroundColor: colors.card, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  toggleText: { fontSize: 16, fontWeight: '600', color: colors.textMuted },
  toggleTextExpenseActive: { color: '#D9534F' },
  toggleTextIncomeActive: { color: '#47DD62' },
  inputLabel: { fontSize: 14, color: colors.textMuted, marginBottom: 8, fontWeight: '600' },
  inputBoxContainer: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 },
  textInputStyle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  iconScroll: { flexDirection: 'row', marginBottom: 30 },
  iconOption: { width: 60, height: 60, borderRadius: 16, borderWidth: 2, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: 12, backgroundColor: colors.backgroundAlt },
  iconOptionSelected: { borderColor: colors.primary, backgroundColor: colors.cardAlt },
  iconOptionImage: { width: 40, height: 40 },
  saveButton: { borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: colors.navBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20, elevation: 10, shadowColor: '#000', shadowOffset: {width: 0, height: -4}, shadowOpacity: 0.1, shadowRadius: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navTextActive: { color: colors.navIconActive, fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  navText: { color: colors.navIcon, fontSize: 11, marginTop: 4, fontWeight: '600' },
  navProfileImg: { width: 24, height: 24, borderRadius: 12 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20},
  fab: { 
    width: 88, height: 88, borderRadius: 64, 
    backgroundColor: colors.white, 
    justifyContent: 'center', alignItems: 'center',
    position: 'absolute', top: -44, 
    borderWidth: 6, borderColor: colors.navBg, 
  },
  fabIcon: { width: 44, height: 44 }
});

export default WalletScreen;