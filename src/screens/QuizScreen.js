import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { CheckCircle2, ArrowLeft, Trophy, X } from 'lucide-react-native';
import { LessonContext } from '../context/LessonContext';
import { ThemeContext } from '../context/ThemeContext';
import { quizQuestions } from '../data/quizQuestions';

const QuizScreen = ({ route, navigation }) => {
  const { courseId = 'budgeting101', quizId = 1 } = route.params || {};
  const { courses, markQuizDone } = useContext(LessonContext);
  const course = courses[courseId] || courses['investingBasics'];
  const { isDarkMode, colors } = useContext(ThemeContext);
  const courseColor = course.themeColor || colors.primary;
  const styles = useMemo(() => createStyles(colors, isDarkMode, courseColor), [colors, isDarkMode, courseColor]);

  const [answers, setAnswers] = useState({});
  const [showError, setShowError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  const selectedQuiz = quizQuestions[courseId]?.[quizId] || quizQuestions.budgeting101[1];
  const questions = selectedQuiz.questions;

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const handleSelect = (qId, optionIndex) => {
    setAnswers({ ...answers, [qId]: optionIndex });
    setShowError(false);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      setShowError(true);
      return;
    }

    const results = calculateScore();
    setQuizResults(results);
    setShowResultsModal(true);
  };

  const handleConfirmResults = () => {
    markQuizDone(courseId, quizId);
    setShowResultsModal(false);
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color={courseColor} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedQuiz.title}</Text>
        <Text style={styles.headerDesc}>{selectedQuiz.desc}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{questions.length} questions</Text>
          <View style={styles.xpBadge}><Text style={styles.xpText}>+ {(course.quizzes.find(q => q.id === quizId)?.xpReward) || 50} XP</Text></View>
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

      <Modal visible={showResultsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.iconCircle}>
              <Trophy color={quizResults?.percentage >= 80 ? colors.success : colors.warning} size={40} />
            </View>
            <Text style={styles.modalTitle}>Quiz Results!</Text>
            <Text style={styles.modalDesc}>
              You scored {quizResults?.correct} out of {quizResults?.total} ({quizResults?.percentage}%)
            </Text>
            {quizResults?.percentage >= 80 ? (
              <Text style={styles.successText}>Great job! You passed the quiz! 🎉</Text>
            ) : (
              <Text style={styles.failText}>You need 80% or higher to pass. Keep learning and try again!</Text>
            )}
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: quizResults?.percentage >= 80 ? courseColor : colors.border }]}
              onPress={() => {
                if (quizResults?.percentage >= 80) {
                  handleConfirmResults();
                } else {
                  setShowResultsModal(false);
                }
              }}
            >
              <Text style={[styles.modalBtnText, { color: quizResults?.percentage >= 80 ? colors.white : colors.textMuted }]}>
                {quizResults?.percentage >= 80 ? 'Claim XP & Continue' : 'Try Again'}
              </Text>
            </TouchableOpacity>
            {quizResults?.percentage < 80 && (
              <TouchableOpacity
                style={[styles.retryBtn, { borderColor: courseColor }]}
                onPress={() => {
                  setShowResultsModal(false);
                  setAnswers({});
                }}
              >
                <Text style={[styles.retryBtnText, { color: courseColor }]}>Review & Retake</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.iconCircle}>
              <Trophy color="#DD6B20" size={40} />
            </View>
            <Text style={styles.modalTitle}>Congratulations! 🎉</Text>
            <Text style={styles.modalDesc}>You completed the quiz and earned + {(course.quizzes.find(q => q.id === quizId)?.xpReward) || 50} XP!</Text>
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

const createStyles = (colors, isDarkMode, courseColor) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  headerArea: { backgroundColor: isDarkMode ? `${courseColor}33` : `${courseColor}1A`, padding: 20, paddingTop: 50, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 20 },
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
  optionCardSelected: { borderColor: courseColor, borderWidth: 2, backgroundColor: isDarkMode ? `${courseColor}26` : `${courseColor}12` },
  radioCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.border, marginRight: 12 },
  radioCircleSelected: { backgroundColor: courseColor },
  optionText: { fontSize: 14, color: colors.textMuted, flex: 1 },
  optionTextSelected: { color: colors.text, fontWeight: 'bold' },

  errorText: { color: colors.error, fontSize: 14, textAlign: 'center', marginBottom: 10, fontWeight: '600' },
  submitBtn: { backgroundColor: courseColor, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, marginTop: 10, gap: 10 },
  submitBtnText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.card, padding: 24, borderRadius: 24, width: '80%', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  iconCircle: { width: 80, height: 80, backgroundColor: isDarkMode ? 'rgba(221,107,32,0.2)' : '#FEFCBF', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' },
  modalDesc: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  successText: { fontSize: 14, color: colors.success, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  failText: { fontSize: 14, color: colors.warning, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  modalBtn: { backgroundColor: courseColor, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center', marginBottom: 8 },
  modalBtnText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  retryBtn: { borderWidth: 2, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center' },
  retryBtnText: { fontSize: 14, fontWeight: '600' }
});

export default QuizScreen;