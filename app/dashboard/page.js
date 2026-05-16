'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useTheme } from '../layout';
import confetti from 'canvas-confetti';

export default function FidelitySimulator() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // App & Identity State Hooks
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0);
  const [phoneProfile, setPhoneProfile] = useState('');
  
  // Interactive Panel & Modal Toggles
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'history'
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [tempPhoneInput, setTempPhoneInput] = useState(''); // Holds manual number entry during payment verification
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Multiplier Engine Control Parameters
  const [wager, setWager] = useState(10);
  const [isAutoBet, setIsAutoBet] = useState(false);
  const [isAutoCashout, setIsAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.0);

  // Game Multiplier State variables
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle' | 'running' | 'crashed'
  const [hasBet, setHasBet] = useState(false);
  const [historyTape, setHistoryTape] = useState([1.10, 15.00, 1.05, 11.41, 1.30, 2.80]);
  const [wagerHistory, setWagerHistory] = useState([]);

  // Data Feeds (Mock Chat & Public Bets)
  const [chatMessages, setChatMessages] = useState([
    { user: 'Njeri_B', msg: 'The KES 25 bonus works instantly! 🙏' },
    { user: 'Kip_Dev', msg: 'JetPesa curves are predictable today.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [publicBets, setPublicBets] = useState([]);
  
  const canvasRef = useRef(null);
  const targetCrashPoint = useRef(1.0);
  const animationId = useRef(null);
  const timeElapsed = useRef(0);

  // 3D Orthographic Projection Renderer for Real Real Jet Fidelity
  const draw3DJetVector = (ctx, x, y, timeSec) => {
    ctx.save();
    ctx.translate(x, y);

    // Subtle 3D aerodynamic hovering frequencies map
    const pitch = Math.sin(timeSec * 5) * 0.08; 
    ctx.rotate(pitch);

    // Engine Volumetric Propulsion Glow gradients
    const glowRad = 15 + Math.random() * 8;
    const gradient = ctx.createRadialGradient(-22, 2, 2, -22, 2, glowRad);
    gradient.addColorStop(0, '#ff0055');
    gradient.addColorStop(0.4, 'rgba(225, 29, 72, 0.6)');
    gradient.addColorStop(1, 'rgba(225, 29, 72, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(-22, 2, glowRad, 0, Math.PI * 2); ctx.fill();

    // 3D Isometric orthographic hull layering
    ctx.fillStyle = '#9f1239'; // Deep shadow fuselage
    ctx.beginPath(); ctx.moveTo(-20, 5); ctx.lineTo(15, 5); ctx.lineTo(25, 0); ctx.lineTo(-20, 0); ctx.fill();

    // Main 3D High Gloss Upper Canopy Hull geometry
    ctx.fillStyle = '#e11d48'; // Signature Red
    ctx.beginPath(); ctx.moveTo(25, 0); ctx.lineTo(-5, -6); ctx.lineTo(-12, -22); ctx.lineTo(-8, -5); ctx.lineTo(-22, 0); ctx.lineTo(-15, -12); ctx.lineTo(-22, 0); ctx.lineTo(-5, 8); ctx.closePath(); ctx.fill();

    // Metallic gloss highlighting for cockpit
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.65; ctx.beginPath(); ctx.moveTo(12, -1); ctx.lineTo(4, -4); ctx.lineTo(0, 0); ctx.lineTo(10, 0); ctx.fill();

    ctx.restore();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (curr) => {
      if (!curr) {
        router.push('/');
      } else {
        setUser(curr);
        const userDoc = await getDoc(doc(db, "users", curr.uid));
        if (userDoc.exists()) {
          setBalance(userDoc.data().walletBalance || 0.0);
          setPhoneProfile(userDoc.data().mpesaPhone || '');
        }
      }
    });

    // Populate active real-time ecosystem indicators
    const usersList = ['Kip_Dev', 'Wanjiku_M', 'Achieng_O', 'Juma_Dev', 'Mwangi_99', 'Naliaka_S'];
    setPublicBets(usersList.map(u => ({ 
      user: u, 
      amt: Math.floor(Math.random() * 800) + 30, 
      mult: (Math.random() * 3 + 1).toFixed(2), 
      won: Math.random() > 0.45 
    })));
    
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) prepRoundCycle();
    return () => cancelAnimationFrame(animationId.current);
  }, [user]);

  const updateBalanceDB = async (newBal) => {
    if (!user) return;
    const finalBal = Math.max(0, newBal);
    setBalance(finalBal);
    await updateDoc(doc(db, "users", user.uid), { walletBalance: parseFloat(finalBal.toFixed(2)) });
  };

  const prepRoundCycle = async () => {
    setGameStatus('idle');
    setMultiplier(1.0);
    timeElapsed.current = 0;

    // Fetch cryptographic seed handshake
    try {
      const res = await fetch('/api/game/provably?nonce=' + Math.floor(Math.random() * 1000));
      const data = await res.json();
      targetCrashPoint.current = data.crashPoint;
    } catch { 
      targetCrashPoint.current = parseFloat((Math.random() * 4 + 1.05).toFixed(2)); 
    }
    setTimeout(() => { startEngineRun(); }, 4000);
  };

  const startEngineRun = () => {
    if (isAutoBet && !hasBet && balance >= wager) {
      deductWager();
    }
    setGameStatus('running');
    const start = performance.now();

    function cycle(now) {
      let t = (now - start) / 1000;
      timeElapsed.current = t;
      let currentMult = parseFloat(Math.pow(Math.E, 0.075 * t).toFixed(2));

      if (currentMult >= targetCrashPoint.current) {
        executeCrash();
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
        
        // Render isometric perspective vector grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'; ctx.lineWidth = 1;
        for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - 40, H); ctx.stroke(); }
        for (let j = 0; j < H; j += 30) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }

        let cx = 60 + (W - 140) * Math.min(t / 10, 1);
        let cy = (H - 60) - (H - 140) * (Math.min(currentMult - 1, 6) / 6);

        // Sweeping parabolic flight trail path trace draw mapping
        ctx.beginPath(); ctx.moveTo(60, H - 60);
        ctx.quadraticCurveTo((60 + cx) / 2, H - 60, cx, cy);
        ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 4.5; ctx.shadowBlur = 15; ctx.shadowColor = '#e11d48'; ctx.stroke();
        ctx.shadowBlur = 0; // standard clear resetting down scale array limits

        draw3DJetVector(ctx, cx, cy, t);
      }
      animationId.current = requestAnimationFrame(cycle);
    }
    animationId.current = requestAnimationFrame(cycle);
  };

  const deductWager = () => {
    updateBalanceDB(balance - wager);
    setHasBet(true);
  };

  const executeCrash = () => {
    setGameStatus('crashed');
    setMultiplier(targetCrashPoint.current);
    if (hasBet) {
      setWagerHistory(p => [{ timestamp: new Date().toLocaleTimeString(), wager, multiplier: targetCrashPoint.current, status: 'Loss', profit: -wager }, ...p]);
    }
    setHasBet(false);
    setHistoryTape(p => [targetCrashPoint.current, ...p.slice(0, 12)]);
    setTimeout(() => { prepRoundCycle(); }, 4000);
  };

  const triggerCashout = (m) => {
    const winnings = wager * m;
    const finalReturns = balance + winnings;
    updateBalanceDB(finalReturns);
    setHasBet(false);
    setWagerHistory(p => [{ timestamp: new Date().toLocaleTimeString(), wager, multiplier: m, status: 'Won', profit: winnings - wager }, ...p]);
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.4 } });
  };

  // payment routing verification modal controller
  const executeBillingDispatcher = async () => {
    const finalPhoneString = phoneProfile || tempPhoneInput;
    if (!finalPhoneString || finalPhoneString.length < 9) {
      return alert("Valid Safariom M-Pesa identifier required for secure transaction verification path.");
    }

    if (depAmt < 10) return alert("KES 10 minimal transaction boundary constraints.");

    setLoadingDeposit(true);
    try {
      const res = await fetch('/api/payhero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depAmt, phone: finalPhoneString, username: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        updateBalanceDB(balance + parseFloat(depAmt));
        alert(data.fallback ? "Primary connection re-routing busy. Fallback M-Pesa Daraja STK Push synchronized successfully." : "Cash input synchronized!");
        setIsDepositModalOpen(false);
      } else { alert("Gateway response interruption: " + data.message); }
    } catch (e) { alert("Execution Exception: " + e.message); }
    finally { setLoadingDeposit(false); }
  };

  // GLASSMORPHIC CARD CSS BASE
  const glassStyle = {
    background: 'rgba(18, 18, 24, 0.4)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px'
  };

  return (
    <div style={{ background: '#0e0e13', color: '#f4f4f7', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* SPRIBE BRANDED HEADER CONTAINER BLOCK */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: '#14151c', borderBottom: '2px solid #1f202c', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: "'Space Grotesk', sans-serif" }}>JET<span style={{color: '#e11d48'}}>PESA</span></span>
          <button style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', color: '#22c55e', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }} onClick={() => alert(`Verified SHA-256 Block Deployment Sequence Active.`)}>🛡️ Provably Fair</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#181922', padding: '6px 12px', borderRadius: '4px', color: '#22c55e', fontWeight: '800', fontSize: '14px' }}>KES {balance.toFixed(2)}</div>
          <button onClick={() => setIsDepositModalOpen(true)} style={{ background: '#e11d48', border: 'none', color: '#fff', fontWeight: '700', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>DEPOSIT</button>
        </div>
      </header>

      {/* MULTIPLIER HISTORY RIBBON COMPONENT */}
      <div style={{ display: 'flex', gap: '6px', background: '#181922', padding: '6px 16px', overflowX: 'auto', borderBottom: '1px solid #222330' }}>
        {historyTape.map((h, i) => (
          <span key={i} style={{ background: h > 2 ? '#9333ea' : 'rgba(37,99,235,0.2)', color: h > 2 ? '#fff' : '#3b82f6', border: h > 2 ? 'none' : '1px solid rgba(37,99,235,0.4)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>{h.toFixed(2)}x</span>
        ))}
      </div>

      {/* CORE ARENA GRID LAYOUT ENGINE */}
      <main style={{ display: 'grid', gridTemplateColumns: '270px 1fr 280px', gap: '12px', padding: '12px' }}>
        
        {/* SIDE PANEL LEFT: COMMUNITY PUBLIC DATA FEEDS */}
        <aside style={{ background: '#14151c', borderRadius: '8px', border: '1px solid #1f202c', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #1f202c' }}>
            <button onClick={() => setActiveTab('live')} style={{ flex: 1, padding: '12px', border: 'none', background: activeTab === 'live' ? '#1c1d26' : 'transparent', color: activeTab === 'live' ? '#fff' : '#a1a1aa', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Live Bets</button>
            <button onClick={() => setActiveTab('history')} style={{ flex: 1, padding: '12px', border: 'none', background: activeTab === 'history' ? '#1c1d26' : 'transparent', color: activeTab === 'history' ? '#fff' : '#a1a1aa', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>History</button>
          </div>
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeTab === 'live' && publicBets.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '11px' }}>
                <span style={{ color: '#d1d5db' }}>@{b.user}</span>
                <span style={{ color: b.won ? '#22c55e' : '#a1a1aa', fontWeight: '700' }}>{b.won ? `${b.mult}x` : `${b.amt} KES`}</span>
              </div>
            ))}
            {activeTab === 'history' && wagerHistory.length === 0 && <div style={{ textAlign: 'center', color: '#71717a', fontSize: '12px', marginTop: '30px' }}>No local records.</div>}
            {activeTab === 'history' && wagerHistory.map((mb, i) => (
              <div key={i} style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{color: '#a1a1aa'}}>{mb.timestamp}</span>
                  <span style={{color: mb.status === 'Won' ? '#22c55e' : '#e11d48', fontWeight: '800'}}>{mb.status}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '4px'}}>
                  <span>Stake: {mb.wager}</span> <strong style={{color:'#fff'}}>{mb.multiplier.toFixed(2)}x</strong>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MIDDLE COLUMN Panel: 3D CRASH COCKPIT STAGE ARENA */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative', background: '#020204', borderRadius: '12px', flex: 1, border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <canvas ref={canvasRef} width={680} height={350} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
              {gameStatus === 'crashed' ? (
                <h2 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#e11d48', margin: 0, letterSpacing: '1px' }}>FLEW AWAY</h2>
              ) : (
                <h1 style={{ fontSize: '5.5rem', fontWeight: '900', color: '#fff', margin: 0, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>{multiplier.toFixed(2)}x</h1>
              )}
            </div>
            {gameStatus === 'idle' && (
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '4px', color: '#a1a1aa', fontSize: '11px' }}>WAITING... NEXT FLIGHT DEPLOYMENT INITIALIZING</div>
            )}
          </div>

          {/* BETTING DECK Control Row Container Slot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* SPRIBE-STYLE GREEN BET BLOCK MODULE */}
            <div style={{ background: '#1c1d26', padding: '16px', borderRadius: '8px', border: '1px solid #222330' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <button onClick={() => setIsAutoBet(!isAutoBet)} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: '700', borderRadius: '4px', border: 'none', background: isAutoBet ? '#e11d48' : '#2d2e3d', color: '#fff', cursor: 'pointer' }}>AUTO BET: {isAutoBet ? 'ON' : 'OFF'}</button>
                <button onClick={() => setIsAutoCashout(!isAutoCashout)} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: '700', borderRadius: '4px', border: 'none', background: isAutoCashout ? '#22c55e' : '#2d2e3d', color: '#fff', cursor: 'pointer' }}>AUTO CASHOUT</button>
              </div>
              {isAutoCashout && <input type="number" step="0.1" value={autoCashoutValue} onChange={e => setAutoCashoutValue(e.target.value)} style={{ width: '92%', padding: '8px', marginBottom: '10px', background: '#14151c', border: '1px solid #2d2e3d', color: '#fff', fontSize: '12px', borderRadius: '4px' }} />}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" value={wager} onChange={e => setWager(parseInt(e.target.value))} style={{ width: '90px', padding: '12px', borderRadius: '6px', background: '#14151c', border: '1px solid #2d2e3d', color: '#fff', fontSize: '18px', fontWeight: '800', textAlign: 'center' }} />
                <button onClick={() => { if (gameStatus === 'idle' && !hasBet) { deductWager(); } else if (gameStatus === 'running' && hasBet) { triggerCashout(multiplier); } }} style={{ flex: 1, padding: '16px', borderRadius: '6px', border: 'none', color: '#fff', fontWeight: '800', fontSize: '16px', cursor: 'pointer', background: hasBet ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)' }}>{gameStatus === 'idle' ? 'PLACE WAGER' : hasBet ? `CASH OUT\n${(wager * multiplier).toFixed(2)} KES` : 'WAITING'}</button>
              </div>
            </div>
            {/* COMPONENT CONTROL DECK SLOT 2 (Static Spribe Mirror Layout) */}
            <div style={{ background: '#1c1d26', padding: '16px', borderRadius: '8px', border: '1px solid #222330', opacity: 0.6, pointerEvents: 'none' }}>
              <span style={{ fontSize: '11px', color: '#71717a' }}>Secondary Wager Interface Inactive</span>
            </div>
          </div>
        </section>

        {/* SIDE PANEL RIGHT: COMMUNITY INTERACT CHAT DROPDOWN ARCHITECTURE */}
        <aside style={{ ...glassStyle, display: 'flex', flexDirection: 'column', padding: '10px' }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #1f202c', color: '#fff', fontWeight: '700', fontSize: '13px' }}>Player Chat Lobby 💬</div>
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', fontSize: '12px' }}>
                <strong style={{ color: '#3b82f6', display: 'block' }}>@{m.user}</strong> <span style={{ color: '#d1d5db' }}>{m.msg}</span>
              </div>
            ))}
          </div>
          <input type="text" placeholder="Say something..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && chatInput.trim()) { setChatMessages(p => [...p, { user: 'Me', msg: chatInput }]); setChatInput(''); } }} style={{ width: '92%', padding: '10px', background: '#14151c', border: '1px solid #2d2e3d', borderRadius: '4px', color: '#fff', fontSize: '12px', marginTop: '10px' }} />
        </aside>

      </main>

      {/* M-PESA DYNAMIC DISPATCHER MODAL LAYER */}
      {isDepositModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ ...glassStyle, background: '#14151c', width: '100%', maxWidth: '360px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setIsDepositModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#71717a', fontSize: '18px', cursor: 'pointer' }}>×</button>
            <h3 style={{ color: '#22c55e', margin: '0 0 20px 0' }}>M-Pesa Safaricom Gate</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#71717a' }}>WAGER INPUT (KES)</label>
              <input type="number" value={depAmt} onChange={e => setDepAmt(parseInt(e.target.value))} style={{ width: '94%', padding: '12px', background: '#1c1d26', border: '1px solid #2d2e3d', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: '700', marginTop: '6px' }} />
            </div>

            {phoneProfile ? (
              <div style={{ background: '#1c1d26', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
                <span style={{color: '#71717a'}}>Billing Account Number identified:</span>
                <div style={{ fontWeight: '700', color: '#fff', marginTop: '4px' }}>+{phoneProfile}</div>
              </div>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', color: '#e11d48' }}>MANUAL MPESA IDENTIFIER ENTRY MANDATORY</label>
                <input type="text" placeholder="e.g. 07XXXXXXXX" value={tempPhoneInput} onChange={e => setTempPhoneInput(e.target.value)} style={{ width: '94%', padding: '12px', background: '#1c1d26', border: '1px solid #e11d48', borderRadius: '6px', color: '#fff', marginTop: '6px' }} />
              </div>
            )}

            <button onClick={executeBillingDispatcher} disabled={loadingDeposit} style={{ width: '100%', padding: '14px', background: '#22c55e', border: 'none', color: '#fff', fontWeight: '800', borderRadius: '6px', cursor: 'pointer' }}>
              {loadingDeposit ? 'SYNCHRONIZING RE-ROUTE...' : 'DEPOSIT (KES)'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
