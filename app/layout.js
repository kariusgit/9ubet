export const metadata = {
  title: 'JetPesa Premium | Professional Flight Aviator Elite',
  description: 'Cryptographic Provably Fair Next-Gen Gaming Engine Marketplace.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#050507',
        color: '#f4f4f5',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflowX: 'hidden'
      }}>
        {children}
      </body>
    </html>
  );
}
