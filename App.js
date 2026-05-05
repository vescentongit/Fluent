import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { TransactionProvider } from './src/context/TransactionContext';
import { LessonContext, LessonProvider } from './src/context/LessonContext';

export default function App() {
  return (
    <LessonProvider>
      <TransactionProvider>
        <NavigationContainer>
          <AppNavigator /> 
        </NavigationContainer>
      </TransactionProvider>
    </LessonProvider>
    
  );
}