import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('Shaquille');
  const [userImage, setUserImage] = useState(null); 

  return (
    <UserContext.Provider value={{ userName, setUserName, userImage, setUserImage }}>
      {children}
    </UserContext.Provider>
  );
};