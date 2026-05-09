import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('Shaquille');
  const [userImage, setUserImage] = useState(null); 
  const [goals, setGoals] = useState([
    { id: '1', title: 'New Car', daysLeft: 215, current: 156, target: 300, percentage: 52 },
    { id: '2', title: 'Vacation to Sarawak', daysLeft: 57, current: 20, target: 25, percentage: 80 },
    { id: '3', title: 'New PC Setup', daysLeft: 85, current: 31, target: 45, percentage: 69 },
    { id: '4', title: 'Emergency Fund', daysLeft: 0, current: 50, target: 50, percentage: 100 },
  ]);

  const [xp, setXp] = useState(6767);
  const [level, setLevel] = useState(3);
  const [badges, setBadges] = useState([
    { id: 'beginner', name: 'Beginner', description: 'Started your financial journey', unlocked: true },
    { id: 'learner', name: 'Learner', description: 'Completed first course', unlocked: true },
    { id: 'dedicated', name: 'Dedicated', description: 'Reached Level 3', unlocked: true },
    { id: 'expert', name: 'Expert', description: 'Reached Level 4', unlocked: false },
  ]);

  // Calculate level based on XP
  useEffect(() => {
    const calculateLevel = (xpAmount) => {
      if (xpAmount >= 7000) return 4;
      if (xpAmount >= 4000) return 3;
      if (xpAmount >= 1500) return 2;
      return 1;
    };

    const newLevel = calculateLevel(xp);
    if (newLevel !== level) {
      setLevel(newLevel);
      
      // Unlock badges based on level
      setBadges(prev => prev.map(badge => {
        if (badge.id === 'expert' && newLevel >= 4) {
          return { ...badge, unlocked: true };
        }
        return badge;
      }));
    }
  }, [xp, level]);

  const getXpForNextLevel = () => {
    switch(level) {
      case 1: return 1500;
      case 2: return 4000;
      case 3: return 7000;
      case 4: return 10000;
      default: return 1500;
    }
  };

  const getXpProgress = () => {
    const prevLevelThreshold = level === 1 ? 0 : 
                             level === 2 ? 1500 : 
                             level === 3 ? 4000 : 7000;
    const nextLevelThreshold = getXpForNextLevel();
    const progress = ((xp - prevLevelThreshold) / (nextLevelThreshold - prevLevelThreshold)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <UserContext.Provider value={{ 
      userName, 
      setUserName, 
      userImage, 
      setUserImage, 
      goals, 
      setGoals,
      xp,
      setXp,
      level,
      badges,
      getXpForNextLevel,
      getXpProgress
    }}>
      {children}
    </UserContext.Provider>
  );
};