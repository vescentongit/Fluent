import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, SafeAreaView, Image, Keyboard
} from 'react-native';
import { Mic, Send, Home, Wallet, BookOpen } from 'lucide-react-native';
import AsyncStorage from '../utils/storage';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { streamChat } from '../services/api';
import SubscriptionModal from '../components/SubscriptionModal';
import { useTranslation } from 'react-i18next';

const ChatbotScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef();
  const { userImage, checkAiLimit, incrementAi, subscriptionPlan, usage } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);
  const [subModalVisible, setSubModalVisible] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: t('chatbot.greeting', "Hello! 👋 I'm Fluent AI, your personal financial assistant. I've analyzed your recent financial activity and prepared some personalized insights just for you. What would you like to explore today?")
    }
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem('@fluent_chatbot_messages');
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load chat history', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('@fluent_chatbot_messages', JSON.stringify(messages)).catch(e =>
        console.error('Failed to save chat history', e)
      );
    }
  }, [messages, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const goalAdvice = route.params?.goalAdvice;
      if (goalAdvice) {
        const prompt = `I want advice on how to achieve my goal: ${goalAdvice.title}. I currently have ${goalAdvice.currentAmount} saved for my target and my target is ${goalAdvice.targetAmount}. I have ${goalAdvice.duration} remaining. Can you help me with a plan?`;
        sendMessage(prompt);
        navigation.setParams({ goalAdvice: undefined });
      }
    }
  }, [route.params?.goalAdvice, isLoaded]);

  const quickPrompts = [
    t('chatbot.quickPrompt1', "Evaluate my spending\nthis month"),
    t('chatbot.quickPrompt2', "Help me use the\n50/30/20 rule"),
    t('chatbot.quickPrompt3', "How do I start investing\nas a beginner?"),
    t('chatbot.quickPrompt4', "What's the difference between\nregular saving and investing?"),
    t('chatbot.quickPrompt5', "Tips to pay off Paylater\nso it doesn't pile up")
  ];

  useEffect(() => {
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    const keyboardDidShowListener = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const sendMessage = async (text) => {
    if (!checkAiLimit()) {
      setSubModalVisible(true);
      return;
    }
    
    const cleanText = (text || '').replace(/\n/g, ' ').trim();
    if (!cleanText || isStreaming) return;

    incrementAi();

    // Tambah pesan user
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: cleanText
    }]);
    setInputText('');
    setIsStreaming(true);

    // Tambah placeholder bot
    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: botMsgId,
      sender: 'bot',
      text: '...'
    }]);

    // Scroll ke bawah
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    await streamChat(
      cleanText,
      'en',
      (partialText) => {
        // Update bot message real-time saat stream masuk
        setMessages(prev => prev.map(m =>
          m.id === botMsgId ? { ...m, text: partialText } : m
        ));
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },
      () => {
        setIsStreaming(false);
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerGradient, { backgroundColor: colors.primary }]}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <Image
                source={require('../assets/robot_profile.png')}
                style={styles.robotProfileIcon}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>{t('chatbot.title', "Fluent's Financial Assistant")}</Text>
              <Text style={styles.headerSubtitle}>{t('chatbot.subtitle', "• Helping you get fluent in money")}</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.chatScrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === 'user' ? styles.messageRowUser : styles.messageRowBot
              ]}
            >
              {msg.sender === 'bot' && (
                <Image
                  source={require('../assets/robot_profile.png')}
                  style={styles.chatAvatar}
                />
              )}

              {msg.sender === 'user' ? (
                <View style={[styles.bubbleUser, { backgroundColor: colors.primary }]}>
                  <Text style={styles.messageTextUser}>{msg.text}</Text>
                </View>
              ) : (
                <View style={[styles.bubbleBot, { backgroundColor: isDarkMode ? colors.card : '#FFFFFF' }]}>
                  <Text style={[styles.messageTextBot, { color: isDarkMode ? colors.text : '#1A202C' }]}>{msg.text}</Text>
                </View>
              )}

              {msg.sender === 'user' && (
                <Image
                  source={userImage ? { uri: userImage } : require('../assets/user_profile.png')}
                  style={styles.chatAvatar}
                />
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomArea}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsCont}
          >
            {quickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.promptChip, { backgroundColor: isDarkMode ? colors.cardAlt : '#E2E8F0' }]}
                onPress={() => sendMessage(prompt)}
              >
                <Text style={[styles.promptText, { color: isDarkMode ? colors.primary : '#204bb8' }]}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {subscriptionPlan === 'basic' && (
            <Text style={{ textAlign: 'center', fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
              {t('chatbot.promptsToday', 'Prompts today: ')} {usage.aiPrompts} / 5
            </Text>
          )}

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? colors.card : '#FFFFFF' }]}>
              <TextInput
                style={[styles.input, { color: isDarkMode ? colors.text : '#1A202C' }]}
                placeholder={t('chatbot.inputPlaceholder', "Ask your AI assistant anything...")}
                placeholderTextColor={isDarkMode ? colors.textMuted : "#A0AEC0"}
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendBtn, isStreaming && { opacity: 0.4 }]}
                onPress={() => sendMessage(inputText)}
                disabled={isStreaming}
              >
                <Send color={isDarkMode ? colors.primary : "#718096"} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {!isKeyboardVisible && <View style={{ height: 75 }} />}
      </KeyboardAvoidingView>

      {!isKeyboardVisible && (
        <View style={styles.bottomNavbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Home color="#8CA8D1" size={24} />
            <Text style={styles.navText}>{t('nav.home', 'Home')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Wallet')}
          >
            <Wallet color="#8CA8D1" size={24} />
            <Text style={styles.navText}>{t('nav.wallet', 'Wallet')}</Text>
          </TouchableOpacity>

          <View style={styles.fabWrapper}>
            <View style={[styles.fabGradient, { backgroundColor: colors.primary }]}>
              <TouchableOpacity style={styles.fabInner}>
                <Image
                  source={require('../assets/aihover.png')}
                  style={styles.fabIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
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
      )}

      <SubscriptionModal 
        visible={subModalVisible}
        onClose={() => setSubModalVisible(false)}
      />
    </View>
  );
};

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  headerGradient: { paddingBottom: 25, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, zIndex: 10 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 20 },
  headerIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  robotProfileIcon: { width: 34, height: 34 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.white },
  headerSubtitle: { fontSize: 13, color: '#65D591', fontWeight: 'bold', marginTop: 2 },
  keyboardAvoiding: { flex: 1 },
  chatScrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  messageRowBot: { justifyContent: 'flex-start' },
  messageRowUser: { justifyContent: 'flex-end' },
  chatAvatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 8 },
  bubbleBot: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderTopLeftRadius: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  bubbleUser: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderTopRightRadius: 4 },
  messageTextBot: { fontSize: 14, lineHeight: 22 },
  messageTextUser: { fontSize: 14, lineHeight: 22, color: colors.white },
  bottomArea: { backgroundColor: colors.backgroundAlt, paddingBottom: 10 },
  quickPromptsCont: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  promptChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
  },
  promptText: { fontSize: 13, textAlign: 'center' },
  inputContainer: { paddingHorizontal: 16, paddingBottom: 15 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    backgroundColor: isDarkMode ? colors.card : '#FFFFFF',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
  },
  input: { flex: 1, height: 50, fontSize: 14 },
  micBtn: { padding: 8 },
  sendBtn: { padding: 8, marginLeft: 4 },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: colors.navBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: colors.navIcon, fontSize: 11, marginTop: 4, fontWeight: '500' },
  navProfileImg: { width: 26, height: 26, borderRadius: 13 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fabGradient: { width: 85, height: 85, borderRadius: 44, position: 'absolute', top: -44, padding: 2, justifyContent: 'center', alignItems: 'center' },
  fabInner: { width: '100%', height: '100%', borderRadius: 44, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  fabIcon: { width: 50, height: 50 }
});

export default ChatbotScreen;