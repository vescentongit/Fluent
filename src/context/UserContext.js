import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('Shaquille');
  const [userImage, setUserImage] = useState(null); 
  const [currency, setCurrency] = useState('IDR');
  const [phoneNumber, setPhoneNumber] = useState('');

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
      phoneNumber, setPhoneNumber 
    }}>
      {children}
    </UserContext.Provider>
  );
};