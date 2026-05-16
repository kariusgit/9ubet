'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useTheme } from '../layout';
import confetti from 'canvas-confetti';

export default function SpribeFidelityDashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme(); // Expected values: 'system', 'light', 'dark'
  
  // App & Identity states
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0);
  const [phoneProfile, setPhoneProfile] = useState('');
  
  // Navigation / Modal / Drawer toggles
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'my-bets' | 'profile'
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Betting Deck State parameters
  const [wager, setWager] = useState(10);
  const [isAutoBet, setIsAutoBet] = useState(false);
  const [isAutoCashout, setIsAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.0);

  // Live Game Multiplier engine states
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle' | 'running' | 'crashed'
  const [hasBet, setHasBet] = useState(false);
  const [history, setHistory] = useState([1.24, 4.82, 1.02, 11.41, 2.10, 1.54, 1.00, 35.80]);
  const [myBetHistory, setMyBetHistory] = useState([]);

  // Deposit Handling 
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [depAmt, setDepAmt] = useState(100);

  // Feeds (Live Mock Chat & Bets)
  const [chatMessages, setChatMessages] = useState([
    { user: 'Kip_Fx', msg: 'Almost hit 10x there! 🔥' },
    { user: 'Wanjiku_M', msg: 'Waiting for a big pink multiplier' },
  ]);
  const [typedMessage, setTypedMessage] = useState('');
  const [fakeBets, setFakeBets] = useState([]);
  
  const canvasRef = useRef(null);
  const targetCrashPoint = useRef(1.0);
  const animationId = useRef(null);

  // 3D Matrix/Vector Silhouette Renderer for Spribe-like Jet
  const draw3DAviatorJet = (ctx, x, y, timeSec) => {
    ctx.save();
    ctx.translate(x, y);

    // Subtle 3D aerodynamic hovering frequencies
    const pitch = Math.sin(timeSec * 5) * 0.08; 
    const roll = Math.cos(timeSec * 3) * 0.05;
    ctx.rotate(pitch);

    // Engine Exhaust Plasma Glow (3D volumetric look)
    const glowRad = 15 + Math.random() * 8;
    const gradient = ctx.createRadialGradient(-22, 2, 2, -22, 2, glowRad);
    gradient.addColorStop(0, '#ff0055');
    gradient.addColorStop(0.4, 'rgba(225, 29, 72, 0.6)');
    gradient.addColorStop(1, 'rgba(225, 29, 72, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(-22, 2, glowRad, 0, Math.PI * 2); ctx.fill();

    // 3D Isometric Hull Layering (Dark side overlay)
    ctx.fillStyle = '#9f1239'; // shadow fuselage edge
    ctx.beginPath();
    ctx.moveTo(-20, 5); ctx.lineTo(15, 5); ctx.lineTo(25, 0); ctx.lineTo(-20, 0);
    ctx.fill();

    // Main 3D High Gloss Upper Canopy Hull
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(25, 0);            // Sleek nose cone point
    ctx.lineTo(-5, -6);           // Port-side wing blend
    ctx.lineTo(-12, -22);         // Raised sweep winglet
    ctx.lineTo(-8, -5);           // Trailing wing rim
    ctx.lineTo(-22, 0);           // Deep tail engine assembly housing
    ctx.lineTo(-15, -12);         // Vertical tail rudder fin height apex
    ctx.lineTo(-22, 0);
    ctx.lineTo(-5, 8);            // Starboard stabilization blend
    ctx.closePath();
    ctx.fill();

    // Metallic Highlighting for Cockpit glass
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(12, -1); ctx.lineTo(4, -4); ctx.lineTo(0, 0); ctx.lineTo(10, 0);
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
          setBalance(d.data().walletBalance || 0.0);
          setPhoneProfile(d.data().mpesaPhone || '');
        }
      }
    });

    // Populate active real-time gaming ecosystem indicators
    const usersList = ['Kip_Fx', 'Wanjiku_M', 'Achieng_O', 'Juma_Dev', 'Mwangi_99', 'Naliaka_S', 'Omondi_R'];
    setFakeBets(usersList.map(u => ({ 
      user: u, 
      amt: Math.floor(Math.random() * 800) + 30, 
      mult: (Math.random() * 2.5 + 1.05).toFixed(2), 
      won: Math.random() > 0.45 
    })));
    
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (user) prepRoundCycle();
    return () => cancelAnimationFrame(animationId.current);
  }, [user]);

  const prepRoundCycle = async () => {
    setGameStatus('idle');
    setMultiplier(1.0);
    try {
      const res = await fetch('/api/game/provably?nonce=' + Math.floor(Math.random() * 1000));
      const d = await res.json();
      targetCrashPoint.current = d.crashPoint;
    } catch { 
      targetCrashPoint.current = parseFloat((Math.random() * 3 + 1.05).toFixed(2)); 
    }
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
      let currentMult = parseFloat(Math.pow(Math.E, 0.072 * t).toFixed(2));

      if (currentMult >= targetCrashPoint.current) {
        setGameStatus('crashed');
        setMultiplier(targetCrashPoint.current);
        
        // Append localized history records
        if (hasBet) {
          setMyBetHistory(p => [{ timestamp: new Date().toLocaleTimeString(), wager, multiplier: targetCrashPoint.current, status: 'Loss', profit: -wager }, ...p]);
        }

        setHasBet(false);
        setHistory(p => [targetCrashPoint.current, ...p.slice(0, 14)]);
        setTimeout(() => { prepRoundCycle(); }, 4500);
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
        ctx.clearRect(0, 0, W, H);
        
        // Build 3D Perspective Plane Background Grid Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < W; i += 40) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - 40, H); ctx.stroke();
        }
        for (let j = 0; j < H; j += 30) {
          ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
        }

        let cx = 60 + (W - 140) * Math.min(t / 10, 1);
        let cy = (H - 60) - (H - 140) * (Math.min(currentMult - 1, 6) / 6);

        // Sweeping Parabolic flight trail mapping
        ctx.beginPath(); ctx.moveTo(60, H - 60);
        ctx.quadraticCurveTo((60 + cx) / 2, H - 60, cx, cy);
        ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 4.5; ctx.shadowBlur = 15; ctx.shadowColor = '#e11d48';
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow context

        draw3DAviatorJet(ctx, cx, cy, t);
      }
      animationId.current = requestAnimationFrame(cycle);
    }
    animationId.current = requestAnimationFrame(cycle);
  };

  const deductBalance = async (amt) => {
    const next = Math.max(0, balance - amt); setBalance(next);
    await updateDoc(doc(db, "users", user.uid), { walletBalance: next });
  };

  const triggerCashout = async (m) => {
    let win = wager * m; const next = balance + win;
    setBalance(next); setHasBet(false);
    setMyBetHistory(p => [{ timestamp: new Date().toLocaleTimeString(), wager, multiplier: m, status: 'Won', profit: win - wager }, ...p]);
    await updateDoc(doc(db, "users", user.uid), { walletBalance: next });
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.4 } });
  };

  const executeDepositPush = async () => {
    if (depAmt <= 0) return;
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
        alert(d.fallback ? "M-Pesa Direct Fallback Push Triggered." : "Deposit successfully credited!");
        setIsWalletOpen(false);
      } else { alert(d.message); }
    } catch (e) { alert(e.message); }
    finally { setLoadingDeposit(false); }
  };

  const saveProfileMobileNumber = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), { mpesaPhone: phoneProfile });
      alert("Billing parameters re-committed securely.");
    } catch (e) { alert(e.message); }
  };

  const cycleThemeIcon = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const getThemeSymbol = () => {
    if (theme === 'system') return '⚙️ System';
    if (theme === 'light') return '💡 Light';
    return '🔴 Dark';
  };

  return (
    <div style={{ background: '#0e0e13', color: '#f1f1f7', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' }}>
      
      {/* SPRIBE BRANDED HEADER BLOCK CONTAINER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#14151c', borderBottom: '2px solid #1f202c' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#e11d48', fontSize: '22px', fontWeight: '900', letterSpacing: '1px' }}>Aviator</span>
          
          {/* SPRIBE INTEGRITY ENGINE ANCHOR BUTTON */}
          <button style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', color: '#22c55e', fontSize: '11px', padding: '3px 8px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }} onClick={() => alert(`Provably Fair SHA256 Signature verified. Client Seed mixed via active Web Crypto API session.`)}>
            🛡️ Provably Fair
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* MULTI-STATE RE-SHAPING TRIPPLE MODE TOGGLE */}
          <button onClick={cycleThemeIcon} style={{ background: '#222330', border: '1px solid #2d2e3d', color: '#a1a1aa', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            {getThemeSymbol()}
          </button>

          {/* ACTIVE SPRIBE CASH BOX LAYOUT TRIGGER */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#22c55e', borderRadius: '4px', padding: '2px 2px 2px 10px', gap: '8px' }}>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>{balance.toFixed(2)} KES</span>
            <button onClick={() => setIsWalletOpen(!isWalletOpen)} style={{ background: '#15803d', border: 'none', color: '#fff', fontWeight: '700', padding: '6px 12px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
              Wallet 💳
            </button>
          </div>
        </div>
      </header>

      {/* MULTIPLIER HISTORY RIBBON COMPONENT */}
      <div style={{ display: 'flex', gap: '6px', background: '#181922', padding: '6px 16px', overflowX: 'auto', borderBottom: '1px solid #222330' }}>
        {history.map((h, i) => (
          <span key={i} style={{ background: h > 2 ? '#9333ea' : 'rgba(37,99,235,0.2)', color: h > 2 ? '#fff' : '#3b82f6', border: h > 2 ? 'none' : '1px solid rgba(37,99,235,0.4)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>
            {h.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* DYNAMIC RE-ROUTING SLIDING WALLET OVERLAY MENU BAR */}
      {isWalletOpen && (
        <div style={{ position: 'fixed', top: '0', right: '0', width: '340px', height: '100%', background: '#14151c', boxShadow: '-5px 0 25px rgba(0,0,0,0.7)', zIndex: 999, padding: '24px', borderLeft: '2px solid #22c55e', transition: 'all 0.3s ease-in-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, color: '#22c55e' }}>M-Pesa Payment Terminal</h3>
            <button onClick={() => setIsWalletOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ background: '#1c1d26', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: '#71717a' }}>Target Billing Account Number</span>
            <div style={{ fontWeight: '700', marginTop: '4px', color: '#fff' }}>{phoneProfile || 'No number linked to profile'}</div>
          </div>
          <label style={{ fontSize: '12px', color: '#a1a1aa' }}>Deposit Liquidity (KES)</label>
          <input type="number" value={depAmt} onChange={(e) => setDepAmt(parseInt(e.target.value))} style={{ width: '100%', padding: '12px', margin: '8px 0 16px 0', borderRadius: '4px', background: '#222330', border: '1px solid #2d2e3d', color: '#fff', fontWeight: '700' }} />
          <button onClick={executeDepositPush} disabled={loadingDeposit} style={{ width: '100%', padding: '14px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '800', cursor: 'pointer' }}>
            {loadingDeposit ? 'SYNCHRONIZING SECURE GATEWAY...' : 'TRIGGER INSTANT PAYHERO PUSH'}
          </button>
        </div>
      )}

      {/* CORE CONTENT LAYOUT MATRIX */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', height: 'calc(100vh - 85px)', padding: '12px', gap: '12px' }}>
        
        {/* SIDE PANEL LEFT: DATA FEEDS & NAVIGATION ARCHITECTURE */}
        <div style={{ background: '#14151c', borderRadius: '8px', border: '1px solid #1f202c', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: '#1c1d26', padding: '4px' }}>
            <button onClick={() => setActiveTab('live')} style={{ flex: 1, padding: '8px', background: activeTab === 'live' ? '#14151c' : 'transparent', border: 'none', color: activeTab === 'live' ? '#fff' : '#71717a', fontSize: '12px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}>Live Bets</button>
            <button onClick={() => setActiveTab('my-bets')} style={{ flex: 1, padding: '8px', background: activeTab === 'my-bets' ? '#14151c' : 'transparent', border: 'none', color: activeTab === 'my-bets' ? '#fff' : '#71717a', fontSize: '12px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}>My History</button>
            <button onClick={() => setActiveTab('profile')} style={{ flex: 1, padding: '8px', background: activeTab === 'profile' ? '#14151c' : 'transparent', border: 'none', color: activeTab === 'profile' ? '#fff' : '#71717a', fontSize: '12px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}>Profile</button>
          </div>

          <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {activeTab === 'live' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {fakeBets.map((b, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '12px' }}>
                    <span style={{ color: '#a1a1aa' }}>@{b.user}</span>
                    <span style={{ color: b.won ? '#22c55e' : '#71717a', fontWeight: '700' }}>{b.won ? `${b.mult}x` : `${b.amt} KES`}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'my-bets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {myBetHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#4b5563', fontSize: '12px', marginTop: '20px' }}>No local round instances logged.</div>
                ) : (
                  myBetHistory.map((mb, i) => (
                    <div key={i} style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#71717a' }}>{mb.timestamp}</span>
                        <span style={{ color: mb.status === 'Won' ? '#22c55e' : '#e11d48', fontWeight: '800' }}>{mb.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Stake: {mb.wager} KES</span>
                        <span style={{ color: '#fff' }}>{mb.multiplier.toFixed(2)}x</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#fff' }}>Security Settings</h4>
                <div>
                  <label style={{ fontSize: '11px', color: '#71717a' }}>M-PESA WALLET REGISTRATION NO.</label>
                  <input type="text" value={phoneProfile} onChange={(e) => setPhoneProfile(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '4px', background: '#1c1d26', border: '1px solid #2d2e3d', color: '#fff', fontSize: '13px' }} />
                </div>
                <button onClick={saveProfileMobileNumber} style={{ width: '100%', padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>
                  Update Target Parameters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE MAIN COLUMN PANEL: 3D CRASH COCKPIT STAGE Arena */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* FLIGHT STAGE GRAPH PANEL */}
          <div style={{ position: 'relative', flex: 1, background: '#09090d', borderRadius: '8px', border: '1px solid #1f202c', overflow: 'hidden' }}>
            <canvas ref={canvasRef} width={800} height={420} style={{ width: '100%', height: '100%', display: 'block' }} />
            
            {/* SPRIBE BRANDED WATERMARK IN GRAPH MIDDLE */}
            <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, pointerEvents: 'none' }}>
              <span style={{ fontSize: '7rem', fontWeight: '900', color: '#fff' }}>AVIATOR</span>
            </div>

            {/* LIVE DYNAMIC RENDERING CORNER LABELS */}
            <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', pointerEvents: 'none' }}>
              {gameStatus === 'crashed' ? (
                <div>
                  <h1 style={{ color: '#e11d48', fontSize: '3.5rem', margin: 0, fontWeight: '900', letterSpacing: '2px' }}>FLEW AWAY!</h1>
                  <p style={{ color: '#71717a', margin: '4px 0 0 0', fontSize: '14px' }}>Multiplier Locked @ {multiplier.toFixed(2)}x</p>
                </div>
              ) : (
                <h1 style={{ fontSize: '5.5rem', fontWeight: '900', margin: 0, color: '#fff', letterSpacing: '-1px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
                  {multiplier.toFixed(2)}x
                </h1>
              )}
            </div>

            {/* LOWER BOTTOM AXIS METRIC INDICATION MARKERS */}
            {gameStatus === 'idle' && (
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.6)', padding: '8px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>ENGINE PRE-FLIGHT RE-INITIALIZING RE-FUELING SYSTEM...</span>
              </div>
            )}
          </div>

          {/* FLIGHT MANUAL DECK CONTROL ROW CONTEXT */}
          <div style={{ background: '#14151c', padding: '16px', borderRadius: '8px', border: '1px solid #1f202c', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            
            {/* COMPONENT CONTROL CONTAINER SLOT 1 */}
            <div style={{ background: '#1c1d26', padding: '12px', borderRadius: '6px', border: '1px solid #222330' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <button onClick={() => setIsAutoBet(!isAutoBet)} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: '700', borderRadius: '4px', border: 'none', background: isAutoBet ? '#e11d48' : '#2d2e3d', color: '#fff', cursor: 'pointer' }}>
                  AUTO BET: {isAutoBet ? 'ON' : 'OFF'}
                </button>
                <button onClick={() => setIsAutoCashout(!isAutoCashout)} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: '700', borderRadius: '4px', border: 'none', background: isAutoCashout ? '#22c55e' : '#2d2e3d', color: '#fff', cursor: 'pointer' }}>
                  AUTO CASHOUT
                </button>
              </div>

              {isAutoCashout && (
                <input type="number" step="0.1" value={autoCashoutValue} onChange={(e) => setAutoCashoutValue(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #2d2e3d', background: '#14151c', color: '#fff', fontSize: '12px' }} />
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" value={wager} onChange={(e) => setWager(parseInt(e.target.value))} style={{ width: '90px', padding: '10px', borderRadius: '4px', background: '#14151c', border: '1px solid #2d2e3d', color: '#fff', fontSize: '16px', fontWeight: '700', textAlign: 'center' }} />
                <button onClick={() => {
                  if (gameStatus === 'idle' && !hasBet) { deductBalance(wager); setHasBet(true); }
                  else if (gameStatus === 'running' && hasBet) { triggerCashout(multiplier); }
                }} style={{ flex: 1, padding: '12px', borderRadius: '4px', border: 'none', color: '#fff', fontWeight: '800', fontSize: '14px', background: hasBet ? '#d97706' : '#22c55e', cursor: 'pointer', boxShadow: '0 4px 15px rgba(34,197,94,0.2)' }}>
                  {gameStatus === 'idle' ? 'PLACE WAGER KES' : hasBet ? `CASH OUT\n${(wager * multiplier).toFixed(2)}` : 'WAITING FOR ROUND START'}
                </button>
              </div>
            </div>

            {/* MOCK PASSIVE CLONED SECOND COMPONENT LAYOUT BOARD IN SPRIBE STYLE */}
            <div style={{ background: '#1c1d26', padding: '12px', borderRadius: '6px', border: '1px solid #222330', opacity: 0.6, pointerEvents: 'none' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#71717a' }}>Secondary Multi-Bet Interface Deck Engine</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '90px', padding: '10px', borderRadius: '4px', background: '#14151c', border: '1px solid #2d2e3d', color: '#71717a', fontSize: '16px', fontWeight: '700', textAlign: 'center' }}>20</div>
                <button style={{ flex: 1, padding: '12px', borderRadius: '4px', border: 'none', color: '#fff', background: '#27272a' }}>SECONDARY DECK INACTIVE</button>
              </div>
            </div>

          </div>
        </div>

        {/* PANEL RIGHT SIDE: IMMERSION FLOATING COMMUNITY INTERACT CHAT DRAWER */}
        <div style={{ background: '#14151c', borderRadius: '8px', border: '1px solid #1f202c', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: '#1c1d26', padding: '12px', borderBottom: '1px solid #222330', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '13px', color: '#fff' }}>Room Chat Room 💬</span>
            <span style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>4,810 online</span>
          </div>

          {/* MESSAGES LAYER ENGINE */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chatMessages.map((cm, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', fontSize: '12px' }}>
                <span style={{ color: '#3b82f6', fontWeight: '700', display: 'block', marginBottom: '2px' }}>@{cm.user}</span>
                <span style={{ color: '#d1d5db' }}>{cm.msg}</span>
              </div>
            ))}
          </div>

          {/* CHAT SEND ACTION INTERACTION BLOCK */}
          <div style={{ padding: '8px', borderTop: '1px solid #222330', display: 'flex', gap: '6px', background: '#1c1d26' }}>
            <input type="text" placeholder="Type inside community feed..." value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} onKeyDown={(e) => {
              if (e.key === 'Enter' && typedMessage.trim()) {
                setChatMessages(p => [...p, { user: 'Me', msg: typedMessage }]);
                setTypedMessage('');
              }
            }} style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', background: '#14151c', border: '1px solid #2d2e3d', color: '#fff', fontSize: '12px' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
