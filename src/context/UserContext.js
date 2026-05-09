// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('Shaquille');
  const [userImage, setUserImage] = useState(null);
  const [currency, setCurrency] = useState('IDR');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [financialGoal, setFinancialGoal] = useState({ title: 'New Car', nominal: '300000000', duration: '3' });
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const getXpForNextLevel = () => {
    const levels = [0, 100, 300, 600, 1000];
    return levels[Math.min(level, levels.length - 1)];
  };

  const getXpProgress = () => {
    const target = getXpForNextLevel();
    return target > 0 ? Math.min((xp / target) * 100, 100) : 100;
  };


  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'MYR': return 'RM';
      case 'BND': return 'B$';
      case 'KHR': return '៛';
      case 'THB': return '฿';
      case 'VND': return '₫';
      case 'SGD': return 'S$';
      case 'PHP': return '₱';
      case 'MMK': return 'K';
      case 'LAK': return '₭';
      case 'IDR':
      default: return 'Rp';
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <UserContext.Provider value={{
      userName, setUserName,
      userImage, setUserImage,
      currency, setCurrency,  
      currencySymbol,
      phoneNumber, setPhoneNumber,
      financialGoal, setFinancialGoal,
      xp, setXp,           // ← tambahan
      level, setLevel,     // ← tambahan
      getXpForNextLevel,   // ← tambahan
      getXpProgress,       // ← tambahan
    }}>
      {children}
    </UserContext.Provider>
  );
};