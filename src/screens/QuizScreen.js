import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { CheckCircle2, ArrowLeft, Trophy } from 'lucide-react-native';
import { LessonContext } from '../context/LessonContext';
import { ThemeContext } from '../context/ThemeContext';

const QuizScreen = ({ route, navigation }) => {
  const { quizId = 1 } = route.params || {};
  const { markQuizDone } = useContext(LessonContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);
  
  const [answers, setAnswers] = useState({});
  const [showError, setShowError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const questions = [
    {
      id: 1,
      question: "1. What does the 50/30/20 rule recommend for 'Needs'?",
      options: ["20% of income", "30% of income", "50% of income", "60% of income"]
    },
    {
      id: 2,
      question: "2. Which of these is considered a 'Need' in budgeting?",
      options: ["Netflix subscription", "Dining at restaurant", "Rent payment", "New smartphone"]
    },
    {
      id: 3,
      question: "3. How long should you track expenses before creating a budget?",
      options: ["1 week", "30 days", "6 months", "1 year"]
    },
    {
      id: 4,
      question: "4. What should you do when you get a raise?",
      options: ["Spend it all on lifestyle upgrades", "Save 100% of the increase", "Split it between savings and quality life improvement", "Ignore it in your budget"]
    },
    {
      id: 5,
      question: "5. Which budgeting mistake is most common?",
      options: ["Being too restrictive", "Saving too much money", "Tracking expenses too carefully", "Reviewing budget too often"]
    }
  ];

  const handleSelect = (qId, optionIndex) => {
    setAnswers({ ...answers, [qId]: optionIndex });
    setShowError(false); 
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      setShowError(true);
      return;
    }
    markQuizDone(quizId);
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budgeting Basics Quiz</Text>
        <Text style={styles.headerDesc}>Test your understanding of fundamental budgeting concepts!</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>5 questions</Text>
          <View style={styles.xpBadge}><Text style={styles.xpText}>+ 50 XP</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {questions.map((q) => (
          <View key={q.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{q.question}</Text>
            {q.options.map((opt, idx) => {
              const isSelected = answers[q.id] === idx;
              return (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleSelect(q.id, idx)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]} />
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        ))}

        {showError && (
          <Text style={styles.errorText}>Please answer all questions before submitting!</Text>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <CheckCircle2 color={colors.white} size={20} />
          <Text style={styles.submitBtnText}>Submit Quiz</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.iconCircle}>
              <Trophy color="#DD6B20" size={40} />
            </View>
            <Text style={styles.modalTitle}>Congratulations! 🎉</Text>
            <Text style={styles.modalDesc}>You completed the quiz and earned +50 XP!</Text>
            <TouchableOpacity 
              style={styles.modalBtn} 
              onPress={() => {
                setShowSuccessModal(false);
                navigation.goBack(); 
              }}
            >
              <Text style={styles.modalBtnText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  headerArea: { backgroundColor: isDarkMode ? 'rgba(49,130,206,0.2)' : '#EBF4FF', padding: 20, paddingTop: 50, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 20 },
  backBtn: { marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
  headerDesc: { fontSize: 13, color: colors.textMuted, marginBottom: 12, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaText: { fontSize: 13, color: colors.textMuted },
  xpBadge: { backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEFCBF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  xpText: { fontSize: 11, fontWeight: 'bold', color: colors.warning },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  questionContainer: { marginBottom: 30 },
  questionText: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 16, lineHeight: 22 },
  
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, marginBottom: 10 },
  optionCardSelected: { borderColor: colors.primary, borderWidth: 2, backgroundColor: isDarkMode ? 'rgba(49,130,206,0.1)' : '#F8FAFC' },
  radioCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.border, marginRight: 12 },
  radioCircleSelected: { backgroundColor: colors.primary },
  optionText: { fontSize: 14, color: colors.textMuted, flex: 1 },
  optionTextSelected: { color: colors.text, fontWeight: 'bold' },

  errorText: { color: colors.error, fontSize: 14, textAlign: 'center', marginBottom: 10, fontWeight: '600' },
  submitBtn: { backgroundColor: colors.primary, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, marginTop: 10, gap: 10 },
  submitBtnText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.card, padding: 24, borderRadius: 24, width: '80%', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  iconCircle: { width: 80, height: 80, backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEFCBF', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' },
  modalDesc: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  modalBtn: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center' },
  modalBtnText: { color: colors.white, fontSize: 16, fontWeight: 'bold' }
});

export default QuizScreen;