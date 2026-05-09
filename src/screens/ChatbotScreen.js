import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, SafeAreaView, Image, Keyboard
} from 'react-native';
import { Mic, Send, Home, Wallet, BookOpen } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

const ChatbotScreen = ({ navigation, route }) => {
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef();
  const { userImage } = useContext(UserContext);
  const { isDarkMode, colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

  useEffect(() => {
    const goalAdvice = route.params?.goalAdvice;
    if (goalAdvice) {
      const prompt = `I want advice on how to achieve my goal: ${goalAdvice.title}. I currently have ${goalAdvice.currentAmount} saved for my target and my target is ${goalAdvice.targetAmount}. I have ${goalAdvice.duration} remaining. Can you help me with a plan?`;
      sendMessage(prompt);
      navigation.setParams({ goalAdvice: undefined });
    }
  }, [route.params?.goalAdvice]);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! 👋 I'm Fluent AI, your personal financial assistant. I've analyzed your recent financial activity and prepared some personalized insights just for you. What would you like to explore today?"
    }
  ]);

  const quickPrompts = [
    "Evaluate my spending\nthis month",
    "Help me use the\n50/30/20 rule",
    "How do I start investing\nas a beginner?",
    "What's the difference between\nregular saving and investing?",
    "Tips to pay off Paylater\nso it doesn't pile up"
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

  const sendMessage = (text) => {
    const cleanText = text.replace(/\n/g, ' ');
    if (!cleanText.trim()) return;

    const newUserMsg = { id: Date.now().toString(), sender: 'user', text: cleanText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');

    setTimeout(() => {
      let botReply = "I'm here to help you achieve your financial resilience!";
      
      if (cleanText.includes("Evaluate my spending")) {
        botReply = "Let's break it down together! This month, your biggest expense is in the Food & Beverage category (45%).\nWow, that's quite high! 🍔 If we cut back a little on your coffee and dining out budget, you could save around Rp400,000 this month. Would you like me to help you set up an automatic daily allowance so it's more controlled?";
      } else if (cleanText.includes("50/30/20")) {
        botReply = "You got it! The 50/30/20 rule is a super easy way to manage your salary:\n50% Needs: Daily groceries, bills, transportation.\n30% Wants: Hangouts, skincare shopping, and Netflix subscriptions.\n20% Savings/Investments: Emergency fund, investments, and charity.\nWhat's your net income this month? Let me help you calculate the exact amounts for these three categories! 🧮";
      } else if (cleanText.includes("investing as a beginner")) {
        botReply = "Let's start with something low-risk! 📈\nI highly recommend Money Market Mutual Funds. It's like entrusting your money to a professional manager to put into bank deposits. The risk is very low, it's easy to withdraw at any time, and you can start with just Rp10,000! How about it, want me to show you a simulation if you save Rp50,000 a week?";
      } else if (cleanText.includes("saving and investing")) {
        botReply = "Great question! 💡\nSaving is about keeping your money safe (usually for the short term or emergencies). Unfortunately, the value of your money can be eroded by inflation (rising prices of goods).\nInvesting is putting your money to work so it grows faster to beat inflation (for long-term goals like retirement or buying a house).\nThe bottom line: Saving keeps your money safe, investing makes your money grow! 🌱";
      } else if (cleanText.includes("Paylater")) {
        botReply = "Don't panic, let's sort this out together! 💆‍♀️ There are two main tricks:\nStop using Paylater or any new credit cards for now.\nUse the Snowball Method: Focus on paying off the debt with the smallest balance first so you get a quick win and feel motivated, while continuing to pay the minimum installments for the others.\nWant me to help detail a payment schedule based on your current balances?";
      }

      const botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
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
              <Text style={styles.headerTitle}>Fluent's Financial Assistant</Text>
              <Text style={styles.headerSubtitle}>• Helping you get fluent in money</Text>
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

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? colors.card : '#FFFFFF' }]}>
              <TextInput
                style={[styles.input, { color: isDarkMode ? colors.text : '#1A202C' }]}
                placeholder="Ask your AI assistant anything..."
                placeholderTextColor={isDarkMode ? colors.textMuted : "#A0AEC0"}
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity style={styles.micBtn}>
                <Mic color={isDarkMode ? colors.textMuted : "#718096"} size={20} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendBtn}
                onPress={() => sendMessage(inputText)}
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
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Wallet')}
          >
            <Wallet color="#8CA8D1" size={24} />
            <Text style={styles.navText}>Wallet</Text>
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
      )}
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
  promptChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  promptText: { fontSize: 13, textAlign: 'center' },
  inputContainer: { paddingHorizontal: 16, paddingBottom: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 30, paddingLeft: 20, paddingRight: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  input: { flex: 1, height: 50, fontSize: 14 },
  micBtn: { padding: 8 },
  sendBtn: { padding: 8, marginLeft: 4 },
  bottomNavbar: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: colors.navBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, zIndex: 20, elevation: 10, shadowColor: '#000', shadowOffset: {width: 0, height: -4}, shadowOpacity: 0.1, shadowRadius: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { color: colors.navIcon, fontSize: 11, marginTop: 4, fontWeight: '500' },
  navProfileImg: { width: 26, height: 26, borderRadius: 13 },
  fabWrapper: { flex: 1, alignItems: 'center', marginBottom: 20 },
  fabGradient: { width: 85, height: 85, borderRadius: 44, position: 'absolute', top: -44, padding: 2, justifyContent: 'center', alignItems: 'center' },
  fabInner: { width: '100%', height: '100%', borderRadius: 44, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  fabIcon: { width: 50, height: 50 }
});

export default ChatbotScreen;