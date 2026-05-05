// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerificationScreen from '../screens/VerificationScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import IncomeSourceScreen from '../screens/IncomeSourceScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import AssetsScreen from '../screens/AssetsScreen';
import LoadingScreen from '../screens/LoadingScreen';
import DebtScreen from '../screens/DebtScreen';
import EconomicPreferencesScreen from '../screens/EconomicPreferencesScreen';
import HomeScreen from '../screens/HomeScreen';
import { Home } from 'lucide-react-native';
import LoadingScreen2 from '../screens/LoadingScreen2';
import ChatbotScreen from '../screens/ChatbotScreen';
import WalletScreen from '../screens/WalletScreen';
import LearnScreen from '../screens/LearnScreen';
import CourseOverviewScreen from '../screens/CourseOverviewScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import QuizScreen from '../screens/QuizScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      
      <Stack.Screen name="IncomeSource" component={IncomeSourceScreen} />
      <Stack.Screen name="Expense" component={ExpenseScreen} />
      <Stack.Screen name="Assets" component={AssetsScreen} />
      <Stack.Screen name="Debt" component={DebtScreen} />
      <Stack.Screen name="EconomicPreferences" component={EconomicPreferencesScreen} />
      <Stack.Screen name="Loading2" component={LoadingScreen2} />

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Learn" component={LearnScreen} />

      <Stack.Screen name="CourseOverview" component={CourseOverviewScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
    </Stack.Navigator>
  );
}