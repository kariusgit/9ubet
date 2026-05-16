'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Standard platform zero-delay default dark theme load
    localStorage.setItem('jetpesa-theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className="dark" style={{
        backgroundColor: '#050508', // Production absolute zero hex background
        color: '#f4f4f5',
        minHeight: '100vh',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'background-color 0.3s ease, color 0.3s ease',
        overflowX: 'hidden'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <meta name="title" content="JetPesa | Fly High & Cash Out Instantly | Africa\'s No.1 Instant Multiplier Crash Game" />
       <meta name="description" content="Experience real-time multiplier crash gaming. Predict the crash point and win up to 100x your stake instantly with automated M-Pesa funding. Place your stakes, track the flight velocity, and cash out instantly via Safaricom M-Pesa." />
       <meta name="keywords" content="JetPesa, Aviator game Kenya, Crash game M-Pesa, Betting , Instant win KES" />
      </head>
      <body style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
