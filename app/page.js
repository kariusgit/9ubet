'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'JetPesa | Africa\'s No.1 Instant Multiplier Crash Game',
  description: 'Experience real-time multiplier crash gaming. Place your stakes, track the flight velocity, and cash out instantly via Safaricom M-Pesa.',
  keywords: ['JetPesa', 'Aviator game Kenya', 'Crash game M-Pesa', 'Betting simulator', 'Instant win KES'],
  openGraph: {
    title: 'JetPesa | Fly High & Cash Out Instantly',
    description: 'Predict the crash point and win up to 100x your stake instantly with automated M-Pesa funding.',
    siteName: 'JetPesa',
    locale: 'en_KE',
    type: 'website',
  },
};

export default function JetPesaLandingPage() {
  const router = useRouter();

  // Simulated Live Demo Engine Matrix
  const [demoMultiplier, setDemoMultiplier] = useState(1.0);
  const [demoStatus, setDemoStatus] = useState('running'); // running, crashed, loading
  const [demoProgress, setDemoProgress] = useState(100);
  const [demoBets, setDemoBets] = useState([]);
  const [totalPoolUsers, setTotalPoolUsers] = useState(3452);
  
  const canvasRef = useRef(null);
  const animationId = useRef(null);

  // Background Demo Loop simulating continuous wins
  useEffect(() => {
    let startTime = Date.now();
    const cycleDuration = 16000; // 16 second round loops

    function runDemoLoop() {
      const elapsed = (Date.now() - startTime) % cycleDuration;

      // Phase 1: Waiting/Loading (3 Seconds)
      if (elapsed < 3000) {
        if (demoStatus !== 'loading') {
          setDemoStatus('loading');
          setDemoMultiplier(1.0);
          generateDemoBets();
        }
        setDemoProgress(((3000 - elapsed) / 3000) * 100);
      } 
      // Phase 2: Flight Simulation Active (10 Seconds Max)
      else if (elapsed < 13000) {
        setDemoStatus('running');
        const flightSeconds = (elapsed - 3000) / 1000;
        const currentMult = parseFloat(Math.pow(Math.E, 0.09 * flightSeconds).toFixed(2));
        
        // Predetermined simulated crash point for the homepage demo loop
        if (currentMult >= 2.45) {
          setDemoStatus('crashed');
          setDemoMultiplier(2.45);
        } else {
          setDemoMultiplier(currentMult);
          // Simulate dynamic live cashouts dropping off as multiplier rises
          setDemoBets(prev => prev.map(b => {
            if (!b.cashedOut && Math.random() > 0.92 && currentMult > b.autoTarget) {
              return { ...b, cashedOut: true, finalMult: currentMult, winAmount: Math.floor(b.stake * currentMult) };
            }
            return b;
          }));
        }
      } 
      // Phase 3: Post Crash View Window (3 Seconds)
      else {
        setDemoStatus('crashed');
      }

      drawDemoRadar(elapsed);
      animationId.current = requestAnimationFrame(runDemoLoop);
    }

    function generateDemoBets() {
      const initialAvatars = ['🦈', '🦁', '🦅', '🐆', '🦊', '🦏'];
      const prefixes = ['071***', '072***', '079***', '070***', '011***'];
      setTotalPoolUsers(Math.floor(Math.random() * 800 + 3100));

      setDemoBets(Array.from({ length: 6 }, (_, i) => ({
        user: initialAvatars[i % initialAvatars.length] + prefixes[i % prefixes.length] + Math.floor(Math.random() * 89 + 10),
        stake: [200, 500, 1000, 1500, 2500, 5000][i],
        autoTarget: parseFloat((1.2 + i * 0.2).toFixed(2)),
        cashedOut: false,
        winAmount: 0,
        finalMult: 1.0
      })));
    }

    animationId.current = requestAnimationFrame(runDemoLoop);
    return () => cancelAnimationFrame(animationId.current);
  }, [demoStatus]);

  // Vector Canvas drawing engine for the mini landing display
  const drawDemoRadar = (elapsed) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width; const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Subtle technical grid matrix
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
    for (let j = 0; j < H; j += 30) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }

    if (elapsed >= 3000 && demoStatus === 'running') {
      const airTime = (elapsed - 3000) / 1000;
      let cx = 40 + (W - 100) * Math.min(airTime / 7, 1);
      let cy = (H - 40) - (H - 100) * (Math.min(demoMultiplier - 1, 1.5) / 1.5);

      // Neon Vector line curve trail
      ctx.beginPath(); ctx.moveTo(40, H - 40);
      ctx.quadraticCurveTo((40 + cx) / 2, H - 30, cx, cy);
      ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 4;
      ctx.stroke();

      // Jet Glow fill
      ctx.lineTo(cx, H - 40); ctx.lineTo(40, H - 40); ctx.closePath();
      const grad = ctx.createLinearGradient(40, cy, 40, H - 40);
      grad.addColorStop(0, 'rgba(225, 29, 72, 0.15)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.fill();

      // Miniature Geometric Jet representation
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(cx + 15, cy); ctx.lineTo(cx - 10, cy - 6); ctx.lineTo(cx - 10, cy + 6); ctx.closePath(); ctx.fill();
    }
  };

  return (
    <div style={{ background: '#07080e', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      
      {/* Structural HUD Top Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'rgba(12,14,24,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>JETPESA</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/auth?tab=login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>Login</Link>
          <Link href="/auth?tab=signup" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff', textDecoration: 'none', padding: '10px 24px', borderRadius: '30px', fontSize: '13px', fontWeight: '800', boxShadow: '0 8px 20px rgba(34,197,94,0.2)' }}>Join Now</Link>
        </div>
      </nav>

      {/* CORE HERO SECTION HOUSING DYNAMIC DEMO ENGINE */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '60px auto', padding: '0 20px', alignItems: 'center', flex: 1 }}>
        
        {/* Copy / Value Proposition Block */}
        <div>
          <span style={{ color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>🚀 AFRICA\'S NO. 1 INSTANT MULTIPLIER CRASH GAME</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: '1.1', margin: '20px 0', letterSpacing: '-1.5px' }}>
            Watch the Jet Fly.<br />Scale Your Balance.<br />Cash Out Before it Crashes.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', maxWidth: '480px', marginBottom: '35px' }}>
            Experience real-time financial tracking algorithms. Place your stakes, track the explosive velocity multiplier arc, and watch profits lock up in seconds. Fast payouts via Safaricom M-Pesa instantly.
          </p>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/auth?tab=signup" style={{ padding: '16px 40px', background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#fff', fontWeight: '900', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', boxShadow: '0 10px 25px rgba(225,29,72,0.3)' }}>START EARNING INSTANTLY</Link>
          </div>

          {/* Value Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '30px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fff' }}>⚡ KES 49 Minimum</h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Start small, test your strategies, risk-free.</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#22c55e' }}>🔒 Instant STK Push</h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Direct automated wallet funding within seconds.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Game Dashboard Simulator Box */}
        <div style={{ background: '#0e111a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '20px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Header HUD Bar simulation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8' }}>LIVE NOW: ({totalPoolUsers} pilots online)</span>
            </div>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>FLY THE ROCKET!</span>
          </div>

          {/* Interactive Core Flight Monitor Frame */}
          <div style={{ height: '24px', background: '#020306', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
            
            {demoStatus === 'loading' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(4,5,9,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 5 }}>
                <div style={{ width: '50%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ height: '100%', background: '#22c55e', width: `${demoProgress}%`, transition: 'width 0.1s linear' }} />
                </div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', marginTop: '6px' }}>NEXT FLIGHT PREPARING...</span>
              </div>
            )}

            <canvas ref={canvasRef} width={480} height={220} style={{ width: '100%', height: '100%', display: 'block' }} />

            {demoStatus !== 'loading' && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                {demoStatus === 'crashed' ? (
                  <span style={{ color: '#e11d48', fontSize: '2.5rem', fontWeight: '900' }}>FLEW AWAY @ {demoMultiplier.toFixed(2)}x</span>
                ) : (
                  <span style={{ color: '#fff', fontSize: '4rem', fontWeight: '900', textShadow: '0 0 20px rgba(255,255,255,0.15)' }}>{demoMultiplier.toFixed(2)}x</span>
                )}
              </div>
            )}
          </div>

          {/* Live Dynamic Automated Tracking Bets Ledger */}
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', trackingLetter: '0.5px' }}>LIVE ROUND ALLOCATIONS</span>
            <div style={{ maxHeight: '160px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {demoBets.map((b, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: b.cashedOut ? 'rgba(34,197,94,0.06)' : 'rgba(0,0,0,0.2)', borderRadius: '8px', border: b.cashedOut ? '1px solid rgba(34,197,94,0.15)' : '1px solid transparent', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8', fontWeight: '700' }}>{b.user}</span>
                  <span style={{ fontWeight: '800', color: '#fff' }}>{b.stake} KES</span>
                  {b.cashedOut ? (
                    <span style={{ color: '#22c55e', fontWeight: '900', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      CASH OUT @ {b.finalMult.toFixed(2)}x (+{b.winAmount} KES)
                    </span>
                  ) : (
                    <span style={{ color: demoStatus === 'crashed' ? '#e11d48' : '#475569', fontWeight: '800' }}>
                      {demoStatus === 'crashed' ? 'Lost' : 'In Flight'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {styleAdjustmentBlock}
    </div>
  );
}

const styleAdjustmentBlock = (
  <style>{`
    @media (max-width: 992px) {
      main, section { grid-template-columns: 1fr !important; text-align: center; margin-top: 20px !important; }
      p { margin: 0 auto 30px auto !important; }
      div { justify-content: center; }
    }
  `}</style>
);
