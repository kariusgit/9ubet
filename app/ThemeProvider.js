'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme] = useState('dark');

  useEffect(() => {
    localStorage.setItem('jetpesa-theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className="dark">{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
