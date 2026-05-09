import React, { useContext, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform
} from 'react-native';
import { ArrowLeft, Calendar, Clock, Video, Star, ChevronRight } from 'lucide-react-native';
import { ThemeContext } from '../context/ThemeContext';

const AdvisorBookingScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const advisors = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      title: 'Certified Financial Planner',
      rating: 4.9,
      reviews: 127,
      specialty: 'Investment Strategy',
      available: 'Today, 2:00 PM',
    },
    {
      id: '2',
      name: 'David Chen',
      title: 'Wealth Management Advisor',
      rating: 4.8,
      reviews: 89,
      specialty: 'Retirement Planning',
      available: 'Tomorrow, 10:00 AM',
    },
    {
      id: '3',
      name: 'Amara Okafor',
      title: 'Personal Finance Coach',
      rating: 5.0,
      reviews: 56,
      specialty: 'Debt Reduction',
      available: 'Fri, 3:30 PM',
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color={colors.text} size={26} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Book a Session</Text>
            <Text style={styles.headerSubtitle}>1-on-1 with a financial advisor</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Video color={colors.primary} size={24} style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Video Consultation</Text>
            <Text style={styles.infoDesc}>45-minute private session via secure video call</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Advisors</Text>

        {advisors.map((advisor) => (
          <TouchableOpacity key={advisor.id} style={styles.advisorCard}>
            <View style={styles.advisorHeader}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{advisor.name.charAt(0)}</Text>
              </View>
              <View style={styles.advisorInfo}>
                <Text style={styles.advisorName}>{advisor.name}</Text>
                <Text style={styles.advisorTitle}>{advisor.title}</Text>
                <View style={styles.ratingRow}>
                  <Star color="#F6AD55" size={14} fill="#F6AD55" />
                  <Text style={styles.ratingText}>{advisor.rating}</Text>
                  <Text style={styles.reviewsText}>({advisor.reviews} reviews)</Text>
                </View>
              </View>
              <ChevronRight color={colors.textMuted} size={20} />
            </View>

            <View style={styles.advisorMetaRow}>
              <View style={styles.metaItem}>
                <Star color={colors.primary} size={14} />
                <Text style={styles.metaText}>{advisor.specialty}</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar color={colors.primary} size={14} />
                <Text style={styles.metaText}>{advisor.available}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.bookBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.bookBtnText}>Book Session</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerSafeArea: { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? 50 : 20 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 24, marginTop: 16, marginBottom: 20 },
  backButton: { marginRight: 16, marginTop: 4 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: colors.text, marginBottom: 4, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: colors.textMuted },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: { marginRight: 16 },
  infoTextContainer: { flex: 1 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  infoDesc: { fontSize: 13, color: colors.textMuted },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  advisorCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  advisorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarInitial: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  advisorInfo: { flex: 1 },
  advisorName: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  advisorTitle: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: 'bold', color: colors.text },
  reviewsText: { fontSize: 12, color: colors.textMuted },
  advisorMetaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  bookBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});

export default AdvisorBookingScreen;
