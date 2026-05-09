import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Modal, TextInput
} from 'react-native';
import { ArrowLeft, Edit, Trash2, Check, X, CalendarDays, MessageCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserContext } from '../context/UserContext';

const formatCurrencyM = (value) => `Rp ${value} M`;

const GoalsScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const [goals, setGoals] = useState([
    { id: '1', title: 'New Car', daysLeft: 215, current: 156, target: 300, percentage: 52 },
    { id: '2', title: 'Vacation to Sarawak', daysLeft: 57, current: 20, target: 25, percentage: 80 },
    { id: '3', title: 'New PC Setup', daysLeft: 85, current: 31, target: 45, percentage: 69 },
    { id: '4', title: 'Emergency Fund', daysLeft: 0, current: 50, target: 50, percentage: 100 },
  ]);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [editTitle, setEditTitle] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [reduceAmount, setReduceAmount] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const activeTargets = goals.length;
  const averageProgress = activeTargets > 0
    ? Math.round(goals.reduce((acc, goal) => acc + goal.percentage, 0) / activeTargets)
    : 0;

  const openEditModal = (goal) => {
    if (goal.percentage === 100) return;
    setSelectedGoal(goal);
    setEditTitle(goal.title);
    setAddAmount('');
    setReduceAmount('');
    setEditModalVisible(true);
  };

  const handleUpdateTitle = () => {
    setGoals(prev => prev.map(g => (g.id === selectedGoal.id ? { ...g, title: editTitle } : g)));
    setEditModalVisible(false);
  };

  const updateSavings = (diff) => {
    setGoals(prev => prev.map(g => {
      if (g.id === selectedGoal.id) {
        const newCurrent = Math.max(0, Math.min(g.current + diff, g.target));
        const newPercentage = Math.round((newCurrent / g.target) * 100);
        const updated = { ...g, current: newCurrent, percentage: newPercentage };
        setSelectedGoal(updated);
        return updated;
      }
      return g;
    }));
  };

  const handleDelete = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newDate;
    setShowDatePicker(Platform.OS === 'ios');
    setNewDate(currentDate);
  };

  const handleAddNewGoal = () => {
    if (!newTitle || !newTarget) return;
    const daysDiff = Math.ceil((newDate - new Date()) / (1000 * 60 * 60 * 24));
    const newGoal = {
      id: Date.now().toString(),
      title: newTitle,
      daysLeft: daysDiff > 0 ? daysDiff : 0,
      current: 0,
      target: parseFloat(newTarget),
      percentage: 0
    };
    setGoals(prev => [...prev, newGoal]);
    setNewTitle('');
    setNewTarget('');
    setAddModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#000000" size={26} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{t('goals.title', 'Goals & Targets')}</Text>
            <Text style={styles.headerSubtitle}>{t('goals.subtitle', 'Track your financial goals')}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t('goals.activeTarget', 'Active Target')}</Text>
            <Text style={styles.statValue}>{activeTargets}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t('goals.averageProgress', 'Average Progress')}</Text>
            <Text style={styles.statValue}>{averageProgress}%</Text>
          </View>
        </View>

        {goals.map((goal) => {
          const isCompleted = goal.percentage === 100;
          const remaining = Math.max(goal.target - goal.current, 0);

          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeaderRow}>
                <View>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDaysLeft}>
                    {isCompleted ? t('goals.completedStatus', 'Goal Reached') : `${goal.daysLeft} ${t('goals.daysLeft', 'days left')}`}
                  </Text>
                </View>
                <View style={styles.goalActions}>
                  {!isCompleted && (
                    <TouchableOpacity onPress={() => openEditModal(goal)} style={styles.iconBtn}>
                      <Edit color="#FFFFFF" size={22} strokeWidth={2} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleDelete(goal.id)} style={styles.iconBtn}>
                    <Trash2 color="#FFFFFF" size={22} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.amountRow}>
                <Text style={styles.amountText}>{formatCurrencyM(goal.current)}</Text>
                <Text style={styles.amountText}>{formatCurrencyM(goal.target)}</Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[
                  styles.progressBarFill,
                  { width: `${goal.percentage}%` },
                  isCompleted && { backgroundColor: '#22C55E' }
                ]} />
              </View>

              {isCompleted ? (
                <Text style={[styles.amountToGo, { color: '#22C55E', fontWeight: 'bold' }]}>
                  {t('goals.doneText', "You've done it!")}
                </Text>
              ) : (
                <Text style={styles.amountToGo}>{formatCurrencyM(remaining)} {t('goals.toGo', 'to go')}</Text>
              )}

              <View style={styles.badgeContainer}>
                <View style={[styles.badge, isCompleted && styles.badgeSuccess]}>
                  <Text style={styles.badgeText}>{goal.percentage}% {t('goals.complete', 'complete')}</Text>
                </View>
                <TouchableOpacity
                  style={styles.adviceBtn}
                  onPress={() => navigation.navigate('Chatbot', {
                    goalAdvice: {
                      title: goal.title,
                      currentAmount: `${goal.current} M`,
                      targetAmount: `${goal.target} M`,
                      duration: `${goal.daysLeft} days left`,
                    }
                  })}
                >
                  <MessageCircle color="#FFFFFF" size={14} />
                  <Text style={styles.adviceBtnText}>Fluent's Advice</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <Text style={styles.addButtonText}>+ {t('goals.addNew', 'Add New Goals')}</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={isEditModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.blueModalCard}>
            {selectedGoal && (
              <>
                <View style={styles.modalHeaderRow}>
                  <TextInput
                    style={styles.modalTitleInput}
                    value={editTitle}
                    onChangeText={setEditTitle}
                    placeholderTextColor="#A0AEC0"
                  />
                  <TouchableOpacity onPress={handleUpdateTitle} style={styles.modalIconBtn}>
                    <Check color="#FFFFFF" size={28} strokeWidth={2.5} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalIconBtn}>
                    <X color="#A0AEC0" size={28} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDaysLeft}>{selectedGoal.daysLeft} {t('goals.daysLeft', 'days left')}</Text>

                <View style={styles.modalAmountRow}>
                  <Text style={styles.modalAmountText}>{formatCurrencyM(selectedGoal.current)}</Text>
                  <Text style={[styles.modalAmountText, { color: '#FFFFFF' }]}>{formatCurrencyM(selectedGoal.target)}</Text>
                </View>

                <View style={styles.modalProgressTrack}>
                  <View style={[styles.modalProgressFill, { width: `${selectedGoal.percentage}%` }]} />
                </View>

                <Text style={styles.modalToGoText}>
                  {formatCurrencyM(Math.max(selectedGoal.target - selectedGoal.current, 0))} {t('goals.toGo', 'to go')}
                </Text>

                <View style={styles.modalActionRow}>
                  <TextInput
                    style={styles.modalActionInput}
                    placeholder={t('goals.addSavings', 'Add Savings')}
                    placeholderTextColor="#A0AEC0"
                    keyboardType="numeric"
                    value={addAmount}
                    onChangeText={setAddAmount}
                  />
                  <TouchableOpacity style={styles.modalEnterBtn} onPress={() => updateSavings(parseFloat(addAmount) || 0)}>
                    <Text style={styles.modalEnterBtnText}>{t('goals.enter', 'Enter')}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalActionRow}>
                  <TextInput
                    style={styles.modalActionInput}
                    placeholder={t('goals.reduceSavings', 'Reduce Savings')}
                    placeholderTextColor="#A0AEC0"
                    keyboardType="numeric"
                    value={reduceAmount}
                    onChangeText={setReduceAmount}
                  />
                  <TouchableOpacity style={styles.modalEnterBtn} onPress={() => updateSavings(-(parseFloat(reduceAmount) || 0))}>
                    <Text style={styles.modalEnterBtnText}>{t('goals.enter', 'Enter')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={isAddModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.blueModalCard}>
            <TextInput
              style={styles.modalAddTitleInput}
              placeholder={t('goals.enterTargetTitle', 'Enter Target Title')}
              placeholderTextColor="#A0AEC0"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>{t('goals.targetNominal', 'TARGET NOMINAL (M)')}</Text>
              <TextInput
                style={styles.modalAddInput}
                placeholder="0"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
                value={newTarget}
                onChangeText={setNewTarget}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>{t('goals.targetDate', 'TARGET DATE')}</Text>
              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {newDate.toLocaleDateString('en-GB')}
                </Text>
                <CalendarDays color="#A0AEC0" size={24} />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={newDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.addModalActions}>
              <TouchableOpacity onPress={handleAddNewGoal}>
                <Check color="#FFFFFF" size={36} strokeWidth={3} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAddModalVisible(false)} style={{ marginLeft: 24 }}>
                <X color="#A0AEC0" size={36} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerSafeArea: { backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? 50 : 20 },
  headerContent: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 24, marginTop: 16, marginBottom: 20 },
  backButton: { marginRight: 16, marginTop: 4 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#000000', marginBottom: 4, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: '#718096' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#052C5C', borderRadius: 16, padding: 20 },
  statLabel: { fontSize: 14, fontWeight: '600', color: '#E0E7FF', marginBottom: 8 },
  statValue: { fontSize: 48, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: -1 },
  goalCard: { backgroundColor: '#052C5C', borderRadius: 16, padding: 20, marginBottom: 16 },
  goalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  goalTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  goalDaysLeft: { fontSize: 13, color: '#A0AEC0', fontWeight: '500' },
  goalActions: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 2 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  amountText: { fontSize: 13, color: '#A0AEC0', fontWeight: '600' },
  progressBarTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#48CAE4', borderRadius: 4 },
  amountToGo: { fontSize: 12, color: '#A0AEC0', textAlign: 'right', marginBottom: 16, fontWeight: '500' },
  badgeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: '#48CAE4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeSuccess: { backgroundColor: '#22C55E' },
  badgeText: { color: '#000000', fontSize: 12, fontWeight: '700' },
  addButton: { backgroundColor: '#052C5C', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  adviceBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  adviceBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  addButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  blueModalCard: { width: '100%', backgroundColor: '#03045E', borderRadius: 20, padding: 24, elevation: 10 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  modalTitleInput: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, fontWeight: '700', color: '#1A202C' },
  modalIconBtn: { marginLeft: 12 },
  modalDaysLeft: { color: '#8CA8D1', fontSize: 13, marginBottom: 20, fontWeight: '500' },
  modalAmountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalAmountText: { color: '#8CA8D1', fontSize: 13, fontWeight: '600' },
  modalProgressTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  modalProgressFill: { height: '100%', backgroundColor: '#0284C7' },
  modalToGoText: { color: '#8CA8D1', fontSize: 12, textAlign: 'right', marginBottom: 24, fontWeight: '500' },
  modalActionRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  modalActionInput: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1A202C', fontWeight: '600' },
  modalEnterBtn: { backgroundColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 20, justifyContent: 'center' },
  modalEnterBtnText: { color: '#1A202C', fontSize: 14, fontWeight: '800' },

  modalAddTitleInput: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 55, fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 24 },
  modalInputGroup: { marginBottom: 20 },
  modalInputLabel: { color: '#8CA8D1', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  modalAddInput: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 55, fontSize: 16, color: '#1A202C', fontWeight: '600' },
  datePickerBtn: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, height: 55, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: 16, color: '#1A202C', fontWeight: '600' },
  addModalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }
});

export default GoalsScreen;