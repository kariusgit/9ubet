import { ThemeProvider } from './ThemeProvider';

export const metadata = {
  title: {
    default: 'JetPesa | Fly High & Cash Out Instantly',
    template: '%s | JetPesa',
  },
  description:
    'Experience real-time multiplier crash gaming with instant M-Pesa payouts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
