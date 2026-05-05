import React, { createContext, useState } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      title: 'Elthizy Restaurant',
      time: 'Today, 16:00',
      amount: '-Rp 120.000',
      type: 'expense',
      icon: require('../assets/mdi_chicken-leg.png'),
    },
    {
      id: '2',
      title: 'Monthly Salary',
      time: 'Today, 09:00',
      amount: '+Rp 6.000.000',
      type: 'income',
      icon: require('../assets/Frame 66.png'),
    },
    {
      id: '3',
      title: 'Gojek',
      time: 'Today, 07:00',
      amount: '-Rp 50.000',
      type: 'expense',
      icon: require('../assets/Icon Gojek.png'),
    },
    {
      id: '4',
      title: 'Subscribe Bigmo',
      time: 'Yesterday, 23:00',
      amount: '-Rp 2.000.000',
      type: 'expense',
      icon: require('../assets/Icon Subscribe.png'),
    },
    {
      id: '5',
      title: 'Kopi Kenangan',
      time: 'Yesterday, 20:00',
      amount: '-Rp 28.000',
      type: 'expense',
      icon: require('../assets/Icon Kopi kenangan.png'),
    },
    {
      id: '6',
      title: 'Shopee Purchase',
      time: 'Today, 17:00',
      amount: '-Rp 472.000',
      type: 'expense',
      icon: require('../assets/Icon Shopee.png'),
    },
    {
      id: '7',
      title: 'Mix Parlay',
      time: 'Mar 12, 06:00',
      amount: '+Rp 900.000',
      type: 'income',
      icon: require('../assets/Mix parlay income.png'),
    },
    {
      id: '8',
      title: 'Mix Parlay',
      time: 'Mar 10, 11:00',
      amount: '-Rp 30.000',
      type: 'expense',
      icon: require('../assets/Mix parlay expense.png'),
    },
    {
      id: '9',
      title: 'Monthly Rent',
      time: 'Mar 3, 21:00',
      amount: '-Rp 4.000.000',
      type: 'expense',
      icon: require('../assets/home-rent.png'),
    }
  ]);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};