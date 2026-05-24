'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const metadata = {
  title: {
    default: 'JetPesa | Fly High & Cash Out Instantly',
    template: '%s | JetPesa',
  },

  description:
    'Experience real-time multiplier crash gaming with instant M-Pesa payouts.',

  keywords: [
    'JetPesa',
    'Aviator game Kenya',
    'Crash game M-Pesa',
    'Betting',
    'Instant win KES',
  ],

  applicationName: 'JetPesa',

  openGraph: {
    title: 'JetPesa | Fly High & Cash Out Instantly',
    description:
      'Africa’s premium instant multiplier crash game with M-Pesa.',
    siteName: 'JetPesa',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'JetPesa',
    description:
      'Instant multiplier crash gaming with M-Pesa integration.',
  },
};

export function ThemeProvider({ children }) {
  const [theme] = useState('dark');

  useEffect(() => {
    localStorage.setItem('jetpesa-theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div
        className="dark"
        style={{
          backgroundColor: '#050508',
          color: '#f4f4f5',
          minHeight: '100vh',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: 'background-color 0.3s ease, color 0.3s ease',
          overflowX: 'hidden',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
