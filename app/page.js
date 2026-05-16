'use client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Premium Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 6%', background: 'rgba(5, 5, 7, 0.75)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #18181b', position: 'fixed', width: '88%', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '1px' }}>
          JET<span style={{ color: '#e11d48' }}>PESA</span>
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#fff',
            border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)', transition: '0.2s'
          }}>
          ENTER LOBBY
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px',
        alignItems: 'center', padding: '0 8%', paddingTop: '120px',
        background: 'radial-gradient(circle at 75% 30%, rgba(225, 29, 72, 0.1), transparent 50%)'
      }}>
        <div>
          <div style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#fb7185', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '20px' }}>
            ⚡ POWERED BY PAYHERO M-PESA GATEWAY
          </div>
          <h1 style={{ fontSize: '3.8rem', fontWeight: '800', lineHeight: '1.1', margin: '0 0 20px 0', fontFamily: "'Space Grotesk', sans-serif" }}>
            The Elite <span style={{ color: '#e11d48' }}>Provably Fair</span> Crash Simulator.
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', lineHeight: '1.6', margin: '0 0 35px 0' }}>
            Test your Aviator strategy with real programmatic infrastructure. Real M-Pesa STK push mechanics paired with standard SHA-256 seed verification protocols.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '18px 40px', fontSize: '1.1rem', fontWeight: '700', color: '#fff',
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', border: 'none',
              borderRadius: '10px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.4)'
            }}>
            START SIMULATION NOW
          </button>
        </div>

        {/* Visual Showcase */}
        <div style={{
          background: '#09090b', border: '1px solid #1e1e24', borderRadius: '24px',
          height: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justify-content: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative'
        }}>
          <div style={{ fontSize: '4.5rem', color: '#e11d48', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif" }}>
            84.20x
          </div>
          <div style={{ color: '#4ade80', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', marginTop: '10px' }}>
            <span>🛡️</span> 100% CRYPTOGRAPHICALLY SECURE
          </div>
        </div>
      </section>
    </div>
  );
}
