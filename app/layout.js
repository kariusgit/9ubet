import { ThemeProvider } from './ThemeProvider';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jetpesa.com'),
  title: {
    default: 'JetPesa | Fly High & Cash Out Instantly',
    template: '%s | JetPesa',
  },
  description:
    'Experience real-time multiplier crash gaming with instant M-Pesa payouts. Join thousands of players in Kenya\'s premier Aviator-style betting platform.',
  keywords: [
    'JetPesa',
    'Aviator game Kenya',
    'crash game',
    'M-Pesa betting',
    'online betting Kenya',
    'multiplier game',
    'instant payout',
    'mobile betting',
    'real-time gaming',
    'KES betting',
  ],
  authors: [{ name: 'JetPesa Team' }],
  creator: 'JetPesa',
  publisher: 'JetPesa',
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JetPesa',
  },
  category: 'games',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://jetpesa.com',
    siteName: 'JetPesa',
    title: 'JetPesa | Fly High & Cash Out Instantly',
    description:
      'Experience real-time multiplier crash gaming with instant M-Pesa payouts.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JetPesa - Premium Aviator-Style Betting Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JetPesa | Fly High & Cash Out Instantly',
    description:
      'Experience real-time multiplier crash gaming with instant M-Pesa payouts.',
    images: ['/og-image.jpg'],
    creator: '@jetpesa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#22c55e',
      },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'msapplication-TileColor': '#020617',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={plusJakartaSans.variable}
      suppressHydrationWarning
    >
      <head>
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={plusJakartaSans.className}
        style={{
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          minHeight: '100vh',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
