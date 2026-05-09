import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const lightColors = {
  background: '#FFFFFF',
  backgroundAlt: '#7AA0CC',
  text: '#052C5C',
  textMuted: '#1A5CA0',
  primary: '#104892',
  secondary: '#0A3A7A',
  card: '#FFFFFF',
  cardAlt: '#5A8CC8',
  border: '#3A78B8',
  navBg: '#052C5C',
  navIcon: '#4A80C0',
  navIconActive: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  success: '#104892',
  danger: '#104892',
  error: '#104892',
  warning: '#0A3A7A',
  headerWave1: '#3A78B8',
  headerWave2: '#5A8CC8',
  headerWave3: '#052C5C',
};

export const darkColors = {
  background: '#031326',
  backgroundAlt: '#0C3A75',
  text: '#FFFFFF',
  textMuted: '#5A8CC8',
  primary: '#4880C0',
  secondary: '#5A8CC8',
  card: '#0C3A75',
  cardAlt: '#1560B0',
  border: '#1560B0',
  navBg: '#020D1A',
  navIcon: '#4880C0',
  navIconActive: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  success: '#4880C0',
  danger: '#4880C0',
  error: '#4880C0',
  warning: '#5A8CC8',
  headerWave1: '#0C3A75',
  headerWave2: '#1560B0',
  headerWave3: '#020D1A',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
