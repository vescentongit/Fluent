import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const lightColors = {
  background: '#FFFFFF',
  backgroundAlt: '#F8FAFC',
  text: '#1A202C',
  textMuted: '#718096',
  primary: '#2B58CE',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  border: '#EDF2F7',
  navBg: '#023E8A',
  navIcon: '#8CA8D1',
  navIconActive: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  success: '#38A169',
  danger: '#E53E3E',
  warning: '#DD6B20',
  headerWave1: 'rgba(0, 0, 0, 0.15)',
  headerWave2: 'rgba(0, 0, 0, 0.08)',
  headerWave3: '#03045E',
};

export const darkColors = {
  background: '#0F172A',
  backgroundAlt: '#1E293B',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  primary: '#3B82F6',
  card: '#1E293B',
  cardAlt: '#334155',
  border: '#334155',
  navBg: '#020617',
  navIcon: '#64748B',
  navIconActive: '#F8FAFC',
  white: '#FFFFFF',
  black: '#000000',
  success: '#34D399',
  danger: '#F87171',
  warning: '#FBBF24',
  headerWave1: 'rgba(255, 255, 255, 0.05)',
  headerWave2: 'rgba(255, 255, 255, 0.02)',
  headerWave3: '#020617',
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
