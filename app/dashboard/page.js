'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useTheme } from '../layout';
import confetti from 'canvas-confetti';

export default function MobileResponsiveDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0);
  const [phoneProfile, setPhoneProfile] = useState('');
  
  const [wager, setWager] = useState(10);
  const [isAutoBet, setIsAutoBet] = useState(false);
  const [isAutoCashout, setIsAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.0);

  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('idle'); 
  const [hasBet, setHasBet] = useState(false);
  const [history, setHistory] = useState([1.45, 2.80, 1.12, 18.40, 1.05]);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [depAmt, setDepAmt] = useState(100);

  // Live Fake Bets Matrix
  const [fakeBets, setFakeBets] = useState([]);
  
  const canvasRef = useRef(null);
  const targetCrashPoint = useRef(1.0);
  const animationId = useRef(null);

  // High Fidelity Realistic Jet Vector Silhouette Path Setup
  const drawRealisticJet = (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#e11d48';
    ctx.shadowColor = '#e11d48';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(20, 0);          // Nose
    ctx.lineTo(-5, -8);         // Left Wingtip connection
    ctx.lineTo(-20, -18);       // Left Wingtip edge
    ctx.lineTo(-12, -4);        // Inner fusilage frame edge
    ctx.lineTo(-18, 0);         // Tail engine core point
    ctx.lineTo(-12, 4);
    ctx.lineTo(-20, 18);        // Right Wingtip edge
    ctx.lineTo(-5, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (!curr) { router.push('/'); }
      else {
        setUser(curr);
        const d = await getDoc(doc(db, "users", curr.uid));
        if (d.exists()) {
          setBalance(d.data().walletBalance);
          setPhoneProfile(d.data().mpesaPhone);
        }
      }
    });
    // Build real-time active betting log layout mock profiles
    const usersList = ['Wanjiku_M', 'Kip_Fx', 'Achieng_O', 'Juma_Dev', 'Mutua_X', 'Naliaka_S'];
    setFakeBets(usersList.map(u => ({ user: u, amt: Math.floor(Math.random()*500)+20, mult: (Math.random()*4+1).toFixed(2), won: Math.random()>0.5 })));
    
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) prepRoundCycle();
    return () => cancelAnimationFrame(animationId.current);
  }, [user]);

  const prepRoundCycle = async () => {
    setGameStatus('idle');
    setMultiplier(1.0);
    try {
      const res = await fetch('/api/game/provably?nonce=' + Math.floor(Math.random()*1000));
      const d = await res.json();
      targetCrashPoint.current = d.crashPoint;
    } catch { targetCrashPoint.current = 2.15; }

    setTimeout(() => { startEngineRun(); }, 4000);
  };

  const startEngineRun = () => {
    if (isAutoBet && !hasBet && balance >= wager) {
      deductBalance(wager);
      setHasBet(true);
    }
    setGameStatus('running');
    const start = performance.now();

    function cycle(now) {
      let t = (now - start) / 1000;
      let currentMult = parseFloat(Math.pow(Math.E, 0.065 * t).toFixed(2));

      if (currentMult >= targetCrashPoint.current) {
        setGameStatus('crashed');
        setMultiplier(targetCrashPoint.current);
        setHasBet(false);
        setHistory(p => [targetCrashPoint.current, ...p.slice(0, 8)]);
        setTimeout(() => { prepRoundCycle(); }, 4000);
        return;
      }

      setMultiplier(currentMult);
      if (hasBet && isAutoCashout && currentMult >= parseFloat(autoCashoutValue)) {
        triggerCashout(currentMult);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width; const H = canvas.height;
        ctx.clearRect(0,0,W,H);
        
        let cx = 50 + (W - 120) * Math.min(t / 12, 1);
        let cy = (H - 50) - (H - 120) * (Math.min(currentMult - 1, 8) / 8);

        // Vector tracking trail path draw mapping
        ctx.beginPath(); ctx.moveTo(50, H - 50);
        ctx.quadraticCurveTo((50+cx)/1.7, H - 50, cx, cy);
        ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 4; ctx.stroke();

        drawRealisticJet(ctx, cx, cy);
      }
      animationId.current = requestAnimationFrame(cycle);
    }
    animationId.current = requestAnimationFrame(cycle);
  };

  const deductBalance = async (amt) => {
    const next = balance - amt; setBalance(next);
    await updateDoc(doc(db, "users", user.uid), { walletBalance: next });
  };

  const triggerCashout = async (m) => {
    let win = wager * m; const next = balance + win;
    setBalance(next); setHasBet(false);
    await updateDoc(doc(db, "users", user.uid), { walletBalance: next });
    confetti({ particleCount: 80, spread: 50 });
  };

  const executeDepositPush = async () => {
    setLoadingDeposit(true);
    try {
      const res = await fetch('/api/payhero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depAmt, phone: phoneProfile, username: user.uid })
      });
      const d = await res.json();
      if (d.success) {
        const next = balance + parseFloat(depAmt); setBalance(next);
        await updateDoc(doc(db, "users", user.uid), { walletBalance: next });
        alert(d.fallback ? "Primary network route busy. Fallback M-Pesa Daraja STK Push triggered successfully!" : "Deposit captured via primary channel.");
      } else { alert(d.message); }
    } catch (e) { alert(e.message); }
    finally { setLoadingDeposit(false); }
  };

  const cardStyle = {
    background: theme === 'dark' ? 'rgba(30, 30, 40, 0.45)' : 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(16px)',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
    borderRadius: '12px', padding: '16px'
  };

  return (
    <div style={{ padding: '12px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Dynamic Ribbon Banner Row */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 0', marginBottom: '12px' }}>
        {history.map((h, i) => (
          <span key={i} style={{ background: h > 2 ? '#9333ea' : '#2563eb', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
            {h.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Main Responsive Grid Layout Engine */}
      <div style={{ display: 'flex', flexDirection: window.innerWidth < 900 ? 'column' : 'row', gap: '16px' }}>
        
        {/* Cockpit Simulation Arena Column */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative', background: '#09090d', borderRadius: '12px', height: '320px', border: '1px solid #1e1e26' }}>
            <canvas ref={canvasRef} width={650} height={320} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              {gameStatus === 'crashed' ? (
                <h1 style={{ color: '#e11d48', fontSize: '3rem', margin: 0, fontWeight: '900' }}>FLEW AWAY</h1>
              ) : (
                <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: 0, color: '#fff' }}>{multiplier.toFixed(2)}x</h1>
              )}
            </div>
          </div>

          {/* Interactive Multi-Wager Deck Controls Container */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <button onClick={() => setIsAutoBet(!isAutoBet)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: isAutoBet ? '#e11d48' : '#3f3f46', color: '#fff', fontWeight: '700', fontSize: '12px' }}>
                AUTO BET: {isAutoBet ? 'ON' : 'OFF'}
              </button>
              <button onClick={() => setIsAutoCashout(!isAutoCashout)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: isAutoCashout ? '#22c55e' : '#3f3f46', color: '#fff', fontWeight: '700', fontSize: '12px' }}>
                AUTO CASHOUT
              </button>
            </div>

            {isAutoCashout && (
              <input type="number" step="0.1" value={autoCashoutValue} onChange={(e) => setAutoCashoutValue(e.target.value)} style={{ width: '95%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #3f3f46', background: 'transparent', color: '#fff' }} />
            )}

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="number" value={wager} onChange={(e) => setWager(parseInt(e.target.value))} style={{ flex: 1, padding: '12px', borderRadius: '6px', background: 'transparent', border: '1px solid #3f3f46', color: '#fff', fontSize: '18px', fontWeight: '700' }} />
              <button onClick={() => {
                if (gameStatus === 'idle' && !hasBet) { deductBalance(wager); setHasBet(true); }
                else if (gameStatus === 'running' && hasBet) { triggerCashout(multiplier); }
              }} style={{ flex: 1.5, padding: '14px', borderRadius: '6px', border: 'none', color: '#fff', fontWeight: '800', background: hasBet ? '#d97706' : '#22c55e', cursor: 'pointer' }}>
                {gameStatus === 'idle' ? 'PLACE WAGER' : hasBet ? `CASH OUT ${(wager * multiplier).toFixed(2)}` : 'WAITING NEXT FLIGHT'}
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Financial Cashier Column Sidebar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <label style={{ fontSize: '11px', color: '#71717a' }}>WALLET ACCOUNT PROFILE Balance</label>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#22c55e', margin: '4px 0 12px 0' }}>KES {balance.toFixed(2)}</div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <label style={{ fontSize: '11px', color: '#71717a' }}>FAST CASH TOP-UP (MPESA)</label>
              <input type="number" value={depAmt} onChange={(e) => setDepAmt(parseInt(e.target.value))} style={{ width: '93%', padding: '10px', margin: '6px 0 10px 0', borderRadius: '6px', border: '1px solid #3f3f46', background: 'transparent', color: '#fff' }} />
              <button onClick={executeDepositPush} disabled={loadingDeposit} style={{ width: '100%', padding: '12px', background: '#e11d48', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                {loadingDeposit ? 'SYNCHRONIZING RE-ROUTE...' : 'DEPOSIT CASH INSTANTLY'}
              </button>
            </div>
          </div>

          {/* Mini Real-Time Activity Component Feed */}
          <div style={{ ...cardStyle, flex: 1, minHeight: '200px' }}>
            <label style={{ fontSize: '11px', color: '#71717a' }}>LIVE PLATFORM BETS</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {fakeBets.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px', background: 'rgba(0,0,0,0.15)', borderRadius: '4px' }}>
                  <span>@{b.user}</span>
                  <span style={{ color: b.won ? '#22c55e' : '#a1a1aa', fontWeight: '700' }}>{b.won ? `${b.mult}x` : `KES ${b.amt}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
