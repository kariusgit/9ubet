'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from './layout';

export default function NextGenLanding() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const canvasRef = useRef(null);
  
  // Game simulation simulation parameters
  const [simMult, setSimMult] = useState(1.00);
  const [simStatus, setSimStatus] = useState('flying'); // flying, cashed, crashed
  const [alertFeed, setAlertFeed] = useState('Player @Moraa_P cashed out at 4.50x (+KES 1,125)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let t = 0;

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;

      // Draw Grid Matrix Lines
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
      ctx.lineWidth = 1;
      for(let i=0; i<W; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
      for(let j=0; j<H; j+=40) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(W,j); ctx.stroke(); }

      t += 0.05;
      let currentMult = parseFloat(Math.pow(Math.E, 0.07 * t).toFixed(2));

      if (currentMult > 6.5 && simStatus === 'flying') {
        // Mock a structured random workflow outcome
        if (Math.random() > 0.5) {
          setSimStatus('cashed');
          setAlertFeed('🎯 AUTO-CASHOUT TRIGGERED AT ' + currentMult + 'x!');
        } else {
          setSimStatus('crashed');
          setAlertFeed('💥 FLEW AWAY AT ' + currentMult + 'x. Retrying loop...');
        }
      }

      if (t > 12) {
        t = 0;
        setSimStatus('flying');
      }

      setSimMult(currentMult);

      // Map realistic coordinates
      let x = 40 + (W - 100) * (t / 12);
      let y = (H - 40) - (H - 100) * (Math.min(currentMult - 1, 6) / 6);

      // Render Flight Trail
      if (simStatus === 'flying') {
        ctx.beginPath();
        ctx.moveTo(40, H - 40);
        ctx.quadraticCurveTo((40 + x)/1.7, H - 40, x, y);
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 4;
        ctx.stroke();

        // High realism vector rendering for the jet
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(15, 0); ctx.lineTo(-15, -10); ctx.lineTo(-10, 0); ctx.lineTo(-15, 10);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }

      frameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(frameId);
  }, [theme, simStatus]);

  const glassStyle = {
    background: theme === 'dark' ? 'rgba(18, 18, 24, 0.6)' : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(16px)',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
    borderRadius: '16px'
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Dynamic Header Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 5%', borderBottom: theme === 'dark' ? '1px solid #1e1e26' : '1px solid #e2e8f0',
        position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)',
        background: theme === 'dark' ? 'rgba(5,5,8,0.8)' : 'rgba(248,250,252,0.8)'
      }}>
        <div style={{ fontSize: '24px', fontWeight: '900', fontFamily: "'Space Grotesk', sans-serif" }}>
          JET<span style={{ color: '#e11d48' }}>PESA</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Mode Switcher Buttons */}
          <select 
            value={theme} 
            onChange={(e) => toggleTheme(e.target.value)}
            style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e11d48', borderRadius: '6px', color: '#e11d48', fontWeight: '700' }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>

          <button onClick={() => router.push('/auth?mode=login')} style={{ background: 'transparent', border: 'none', color: theme === 'dark' ? '#fff' : '#000', fontWeight: '600', cursor: 'pointer' }}>LOGIN</button>
          <button onClick={() => router.push('/auth?mode=signup')} style={{ background: '#e11d48', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>REGISTER</button>
        </div>
      </nav>

      {/* Main Responsive Grid Arena Layout */}
      <main style={{ display: 'grid', gridTemplateColumns: 'window.innerWidth < 900 ? "1fr" : "1fr 1fr"', gap: '40px', padding: '5%', paddingTop: '60px', maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Ad Callouts Copy Block */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(225,29,72,0.1)', color: '#fb7185', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', width: 'fit-content', marginBottom: '16px' }}>
            🇰🇪 SECURED INTEGRATION WITH DARAJA DIRECT FAILSAFE
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', fontFamily: "'Space Grotesk', sans-serif", lineHeight: '1.1', margin: '0 0 20px 0' }}>
            Predict The Altitude. <br/><span style={{ color: '#e11d48' }}>Cash Out Instant</span> Payouts.
          </h1>
          <p style={{ color: theme === 'dark' ? '#a1a1aa' : '#475569', fontSize: '1.15rem', lineHeight: '1.6', margin: '0 0 32px 0' }}>
            Claim your instant <strong style={{ color: '#e11d48' }}>KES 25 Sign-Up Registration Bonus</strong>. Experience ultra-reliable flight mechanics with zero-delay M-Pesa inputs.
          </p>

          <div style={{ ...glassStyle, padding: '16px', marginBottom: '32px', color: '#e11d48', fontWeight: '700', fontSize: '13px' }}>
            {alertFeed}
          </div>

          <button onClick={() => router.push('/auth?mode=signup')} style={{ width: 'fit-content', padding: '16px 40px', background: 'linear-gradient(135deg,#e11d48 0%,#be123c 100%)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '17px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(225,29,72,0.3)' }}>
            GET STARTED NOW (FREE KES 25)
          </button>
        </div>

        {/* Real-time Interactive Simulator Canvas Container */}
        <div style={{ ...glassStyle, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '320px' }}>
          <div style={{ position: 'relative', background: '#000', borderRadius: '12px', height: '300px', overflow: 'hidden' }}>
            <canvas ref={canvasRef} width={550} height={300} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <h2 style={{ fontSize: '4rem', fontWeight: '900', margin: 0, color: simStatus === 'crashed' ? '#e11d48' : '#fff' }}>
                {simStatus === 'crashed' ? 'FLEW AWAY' : `${simMult.toFixed(2)}x`}
              </h2>
            </div>
          </div>

          {/* Interactive Educational Cards explaining the game cycle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
              <strong style={{ color: '#e11d48' }}>1. AUTOMATED PLACEMENT</strong>
              <p style={{ margin: '4px 0 0 0', color: '#888' }}>Set your stake and let the system track outcomes transparently.</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
              <strong style={{ color: '#22c55e' }}>2. TIMED LOCK CASHOUT</strong>
              <p style={{ margin: '4px 0 0 0', color: '#888' }}>Exit strategically to bank accumulated multipliers straight to your wallet.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
