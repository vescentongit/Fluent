import 'react-native-gesture-handler';
import './src/i18n';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { TransactionProvider } from './src/context/TransactionContext';
import { LessonContext, LessonProvider } from './src/context/LessonContext';
import { UserProvider } from './src/context/UserContext';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LessonProvider>
          <TransactionProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <NavigationContainer>
                <AppNavigator /> 
              </NavigationContainer>
            </GestureHandlerRootView>
          </TransactionProvider>
        </LessonProvider>
      </UserProvider>
    </ThemeProvider>
  );
}