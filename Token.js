import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('Tokens');
        if (storedToken !== null) {
          setToken(JSON.parse(storedToken).accessToken);
        }
      } catch (error) {
        console.error('Failed to fetch the token from storage', error);
      }
    };

    fetchToken();
  }, []);

  const setNewToken = async (newToken) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Failed to store tokens', error);
    }
  };

  return (
    <TokenContext.Provider value={{token, setNewToken}}>
      {children}
    </TokenContext.Provider>
  );
};


export const useToken = () => useContext(TokenContext).token;
export const useSetToken = () => useContext(TokenContext).setNewToken;