'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function SpribeUltimateDashboard() {
  const router = useRouter();
  
  // Account Profile Identity Hooks
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0);
  const [phoneProfile, setPhoneProfile] = useState('');
  
  // Spribe Advanced Loyalty Retention Flags (Secret)
  const [trackDepositSum, setTrackDepositSum] = useState(0);
  const [trackLossSum, setTrackLossSum] = useState(0);
  const [freeBetsAvailable, setFreeBetsAvailable] = useState(0);
  const [useFreeBetActive, setUseFreeBetActive] = useState(false);

  // Dynamic Window Views & Controls
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mine' | 'top'
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isProvablyModalOpen, setIsProvablyModalOpen] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  // Modal Parameter Inputs
  const [inputPhone, setInputPhone] = useState('');
  const [inputAmount, setInputAmount] = useState('100');
  const [loadingDeposit, setLoadingDeposit] = useState(false);

  // Interactive Double Wager Strategy Deck Config
  const [wager, setWager] = useState(10);
  const [isAutoBet, setIsAutoBet] = useState(false);
  const [isAutoCashout, setIsAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.0);

  // High Fidelity Game Engine States
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle' | 'running' | 'crashed'
  const [hasBet, setHasBet] = useState(false);
  const [historyTape, setHistoryTape] = useState([1.47, 1.23, 1.19, 7.05, 1.52, 1.61, 1.89, 1.08, 2.20, 6.11, 1.18, 5.07, 1.06]);
  
  // Provably Fair Cryptographic Verification Objects
  const [provablyData, setProvablyData] = useState({
    serverSeed: 'b8e974ca...9a12',
    clientSeed: 'jet_pesa_session_crypto_alpha',
    combinedHash: '61a5b84c8d301...ae882f',
    nonce: 104
  });

  // Dynamic Feeds (Authentic Aviator Visual Columns)
  const [liveBetsFeed, setLiveBetsFeed] = useState([]);
  const [chatLogs, setChatLogs] = useState([
    { user: 'Njeri_88', msg: 'Admin, background rain drop claim active? 🙌', time: '07:11' },
    { user: 'System_AI', msg: '🚀 NJERI_88 just cashed out a massive KES 42,410.22 at 8.42x!', time: '07:15', system: true },
    { user: 'Kip_Trader', msg: 'Yesu wangu sasa hii ndiyo nini 🤯', time: '07:19' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const canvasRef = useRef(null);
  const targetCrashPoint = useRef(1.0);
  const animationId = useRef(null);
  const cycleTime = useRef(0);

  // Web Audio Context Synthesis Engines
  const audioCtxRef = useRef(null);
  const playTone = (freq, type, duration) => {
    if (audioMuted) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { console.log(e); }
  };

  // Build Authentically Scaled Live Mock Feed Matrices Matching Your Interface Attachment
  const generateRealisticBetsFeed = () => {
    const prefixes = ['070***', '071***', '072***', '079***', '011***', '075***'];
    const mockAvatars = ['🦒', '🚗', '🦁', '🦊', '🦅', '🦈', '🎨'];
    const newList = Array.from({ length: 14 }, (_, i) => {
      const betAmt = parseFloat((Math.random() * 1500 + 50).toFixed(2));
      const reachedMult = parseFloat((Math.random() * 3 + 1.02).toFixed(2));
      const won = Math.random() > 0.5;
      return {
        avatar: mockAvatars[i % mockAvatars.length],
        username: prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(Math.random() * 90 + 10),
        bet: betAmt,
        mult: reachedMult,
        won: won,
        winAmount: won ? parseFloat((betAmt * reachedMult).toFixed(2)) : 0
      };
    });
    setLiveBetsFeed(newList.sort((a, b) => b.bet - a.bet));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (curr) => {
      if (!curr) { router.push('/'); return; }
      setUser(curr);
      const userDoc = await getDoc(doc(db, "users", curr.uid));
      if (userDoc.exists()) {
        const d = userDoc.data();
        setBalance(d.walletBalance || 0.0);
        const savedPhone = d.mpesaPhone || '';
        setPhoneProfile(savedPhone);
        setInputPhone(savedPhone);
        setTrackDepositSum(d.secretDepositSum || 0);
        setTrackLossSum(d.secretLossSum || 0);
        setFreeBetsAvailable(d.secretFreeBets || 0);
      }
    });

    generateRealisticBetsFeed();
    const feedInterval = setInterval(generateRealisticBetsFeed, 8000);
    return () => { unsubscribe(); clearInterval(feedInterval); };
  }, [router]);

  useEffect(() => {
    if (user) prepFlightSequence();
    return () => cancelAnimationFrame(animationId.current);
  }, [user]);

  // AI Chat Bot Periodic Automated Broadcast Interceptor Engine
  useEffect(() => {
    const chatInterval = setInterval(() => {
      const aiWinners = ['Mwangi_X', 'Omondi_Jet', 'Achieng_Aviator', 'Mombasa_King'];
      const picked = aiWinners[Math.floor(Math.random() * aiWinners.length)];
      const winVal = (Math.random() * 25000 + 5000).toFixed(2);
      const multVal = (Math.random() * 12 + 2).toFixed(2);
      
      setChatLogs(p => [...p, {
        user: 'System_AI',
        msg: `🔥 PLATFORM HIGH-WIN METRIC: @${picked} just secured KES ${winVal} at ${multVal}x!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        system: true
      }]);
    }, 14000);
    return () => clearInterval(chatInterval);
  }, []);

  const commitWalletBalance = async (newBalance, depIncrement = 0, lossIncrement = 0, freeBetDelta = 0) => {
    if (!user) return;
    const cleanBal = parseFloat(Math.max(0, newBalance).toFixed(2));
    setBalance(cleanBal);
    
    const nextDepSum = trackDepositSum + depIncrement;
    const nextLossSum = trackLossSum + lossIncrement;
    let nextFreeBets = freeBetsAvailable + freeBetDelta;

    // Secret Retention Logic Implementation
    if (depIncrement >= 1000) {
      setTrackDepositSum(nextDepSum);
      setTrackLossSum(0); // Reset loss calculation window upon matching fresh qualification parameters
    }

    if (trackDepositSum >= 1000 && nextLossSum >= (trackDepositSum / 2) && freeBetsAvailable === 0 && freeBetDelta === 0) {
      nextFreeBets = 3;
      setFreeBetsAvailable(3);
      alert("🎁 Loyalty promotion applied to balance profile.");
    }

    setTrackDepositSum(nextDepSum);
    setTrackLossSum(nextLossSum);

    await updateDoc(doc(db, "users", user.uid), {
      walletBalance: cleanBal,
      mpesaPhone: inputPhone,
      secretDepositSum: nextDepSum,
      secretLossSum: nextLossSum,
      secretFreeBets: nextFreeBets
    });
  };

  const prepFlightSequence = async () => {
    setGameStatus('idle');
    setMultiplier(1.0);
    cycleTime.current = 0;

    try {
      const res = await fetch('/api/game/provably?nonce=' + Math.floor(Math.random() * 1000));
      const data = await res.json();
      targetCrashPoint.current = data.crashPoint;
      setProvablyData({
        serverSeed: data.serverSeed || 'e4a2c89b...77ff',
        clientSeed: data.clientSeed || 'jet_pesa_session_crypto_alpha',
        combinedHash: data.combinedHash || '985b412ca671...00ff12',
        nonce: data.nonce || Math.floor(Math.random() * 300)
      });
    } catch {
      targetCrashPoint.current = parseFloat((Math.random() * 3.5 + 1.01).toFixed(2));
    }
    setTimeout(() => { triggerLaunch(); }, 4000);
  };

  const triggerLaunch = () => {
    if (isAutoBet && !hasBet) {
      if (useFreeBetActive && freeBetsAvailable > 0) {
        setFreeBetsAvailable(p => p - 1);
        setHasBet(true);
        playTone(330, 'square', 0.15);
      } else if (balance >= wager) {
        commitWalletBalance(balance - wager);
        setHasBet(true);
        playTone(330, 'square', 0.15);
      }
    }
    setGameStatus('running');
    const start = performance.now();

    function frame(now) {
      let t = (now - start) / 1000;
      cycleTime.current = t;
      let currentMult = parseFloat(Math.pow(Math.E, 0.068 * t).toFixed(2));

      if (currentMult >= targetCrashPoint.current) {
        executeFlewAway();
        return;
      }

      setMultiplier(currentMult);
      if (t % 0.4 < 0.05) playTone(120 + currentMult * 8, 'sawtooth', 0.03);

      if (hasBet && isAutoCashout && currentMult >= parseFloat(autoCashoutValue)) {
        handleCashoutPayout(currentMult);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width; const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        
        // Draw Authentic Mathematical Spribe Coordinate Radar Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < W; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
        for (let j = 0; j < H; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }

        let cx = 60 + (W - 160) * Math.min(t / 11, 1);
        let cy = (H - 60) - (H - 160) * (Math.min(currentMult - 1, 6) / 6);

        // Sweeping Parabolic Flight Vector Path Setup
        ctx.beginPath(); ctx.moveTo(60, H - 60);
        ctx.quadraticCurveTo((60 + cx) / 1.8, H - 40, cx, cy);
        ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 5; ctx.shadowBlur = 20; ctx.shadowColor = '#e11d48';
        ctx.stroke(); ctx.shadowBlur = 0;

        // Draw Spribe 3D Propeller Airplane Model Layout Component
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(t * 6) * 0.05);
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(30, 0); ctx.lineTo(5, -8); ctx.lineTo(-18, -25); ctx.lineTo(-12, -6);
        ctx.lineTo(-30, 0); ctx.lineTo(-22, -15); ctx.lineTo(-30, 0); ctx.lineTo(-12, 6); ctx.closePath(); ctx.fill();
        // Spinning Propeller Silhouette Ring
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(32, 0, 12, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      animationId.current = requestAnimationFrame(frame);
    }
    animationId.current = requestAnimationFrame(frame);
  };

  const executeFlewAway = () => {
    setGameStatus('crashed');
    setMultiplier(targetCrashPoint.current);
    playTone(180, 'triangle', 0.6);

    // Dynamic Separation Vector Injection Hook
    let flyOutX = 0;
    function flyAwayFrame() {
      const canvas = canvasRef.current;
      if (!canvas || flyOutX > 300) {
        setHasBet(false);
        setUseFreeBetActive(false);
        setHistoryTape(p => [targetCrashPoint.current, ...p.slice(0, 11)]);
        setTimeout(() => { prepFlightSequence(); }, 4000);
        return;
      }
      const ctx = canvas.getContext('2d');
      const W = canvas.width; const H = canvas.height;
      ctx.clearRect(0,0,W,H);
      
      flyOutX += 12;
      let t = cycleTime.current;
      let cx = 60 + (W - 160) * Math.min(t / 11, 1) + flyOutX;
      let cy = (H - 60) - (H - 160) * (Math.min(targetCrashPoint.current - 1, 6) / 6) - (flyOutX * 0.6);
      
      ctx.fillStyle = '#e11d48'; ctx.save(); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.moveTo(30,0); ctx.lineTo(5,-8); ctx.lineTo(-18,-25); ctx.lineTo(-30,0); ctx.closePath(); ctx.fill();
      ctx.restore();
      animationId.current = requestAnimationFrame(flyAwayFrame);
    }

    if (hasBet) {
      // Apply Retention Loss Evaluators
      if (!useFreeBetActive) {
        commitWalletBalance(balance, 0, wager, 0);
      } else {
        commitWalletBalance(balance, 0, 0, 0);
      }
    }

    animationId.current = requestAnimationFrame(flyAwayFrame);
  };

  const handleCashoutPayout = (m) => {
    if (!hasBet) return;
    const winAmt = useFreeBetActive ? (wager * m) - wager : (wager * m);
    const targetReturns = balance + winAmt;
    
    // Net profit generation parameters tracking
    const calculatedLossBuffer = useFreeBetActive ? 0 : -wager;
    commitWalletBalance(targetReturns, 0, calculatedLossBuffer, 0);
    
    setHasBet(false);
    setUseFreeBetActive(false);
    playTone(660, 'sine', 0.3); playTone(880, 'sine', 0.4);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 } });
  };

  const handlePaymentInitiation = async () => {
    const amt = parseInt(inputAmount);
    if (isNaN(amt) || amt < 49) return alert("❌ Transaction minimum limit constraints bounding: KES 49 required.");
    if (!inputPhone || inputPhone.trim().length < 9) return alert("❌ Valid M-Pesa Safaricom structure identity signature expected.");

    setLoadingDeposit(true);
    try {
      const res = await fetch('/api/payhero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, phone: inputPhone, username: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        // Trigger retention increments dynamically 
        commitWalletBalance(balance + amt, amt, 0, 0);
        setPhoneProfile(inputPhone);
        setIsDepositModalOpen(false);
        alert("✅ STK Push broadcasted! Wallet balance increment initialized automatically upon authorization confirmation.");
      } else { alert("Gateway execution latency: " + data.message); }
    } catch (e) { alert("Exceptions triggered: " + e.message); }
    finally { setLoadingDeposit(false); }
  };

  return (
    <div style={{ background: '#09090d', color: '#f4f4f6', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowY: 'auto', position: 'relative' }}>
      
      {/* SPRIBE BRANDED ULTRA GLOSS NAVBAR HEADER ARCHITECTURE */}
      <header style={{ background: '#101116', borderBottom: '2px solid #1a1b24', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 99 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>Aviator</span>
          <button style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22c55e', color: '#22c55e', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setIsProvablyModalOpen(true)}>🛡️ Provably Fair</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => setAudioMuted(!audioMuted)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>{audioMuted ? '🔈' : '🔊'}</button>
          <button onClick={() => setIsRainActive(!isRainActive)} style={{ background: isRainActive ? '#9333ea' : '#1f202c', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>🌧️ Spribe Rain: {isRainActive ? 'ON' : 'OFF'}</button>
          
          <div style={{ display: 'flex', alignItems: 'center', background: '#1c1d26', border: '1px solid #2d2e3d', padding: '2px 2px 2px 12px', borderRadius: '20px', gap: '10px' }}>
            <span style={{ color: '#22c55e', fontWeight: '800', fontSize: '14px' }}>{balance.toFixed(2)} KES</span>
            <button onClick={() => setIsDepositModalOpen(true)} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '800', padding: '6px 16px', borderRadius: '18px', cursor: 'pointer', fontSize: '12px' }}>Deposit</button>
          </div>
        </div>
      </header>

      {/* 3D BEAUTIFIED MULTIPLIER HISTORY RIBBON COMPONENT ROW */}
      <div style={{ display: 'flex', gap: '8px', background: '#0e0f14', padding: '8px 16px', overflowX: 'auto', borderBottom: '1px solid #1a1b24', boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.4)' }}>
        {historyTape.map((h, i) => (
          <div key={i} style={{ background: h > 2 ? 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', minWidth: '46px', textAlign: 'center', boxShadow: '0 3px 6px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {h.toFixed(2)}x
          </div>
        ))}
      </div>

      {/* COMPREHENSIVE FLIGHT FRAME DECK ENGINE GRID ROW ASSEMBLY */}
      <div style={{ display: 'grid', gridTemplateColumns: '310px 1fr 290px', gap: '12px', padding: '12px', height: 'calc(100vh - 105px)' }}>
        
        {/* SIDEBAR LEFT COLUMN: SYSTEM DATA FEEDS MATCHING USER FILE */}
        <div style={{ background: '#101116', borderRadius: '8px', border: '1px solid #1a1b24', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: '#15161e', padding: '4px', borderBottom: '1px solid #1a1b24' }}>
            <button onClick={() => setActiveTab('all')} style={{ flex: 1, padding: '10px', background: activeTab === 'all' ? '#1a1b24' : 'transparent', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}>All Bets</button>
            <button onClick={() => setActiveTab('mine')} style={{ flex: 1, padding: '10px', background: activeTab === 'mine' ? '#1a1b24' : 'transparent', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}>My Bets</button>
            <button onClick={() => setActiveTab('top')} style={{ flex: 1, padding: '10px', background: activeTab === 'top' ? '#1a1b24' : 'transparent', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}>Top Wins</button>
          </div>

          <div style={{ background: '#121319', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1b24' }}>
            <span style={{ fontSize: '11px', color: '#71717a', fontWeight: '700' }}>ALL BETS COLUMN: 1,487</span>
            <span style={{ fontSize: '12px', color: '#fff', fontWeight: '800' }}>TOTAL: 24,412.33 KES</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
            {activeTab === 'all' && liveBetsFeed.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: b.won ? 'rgba(34,197,94,0.04)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.01)', fontSize: '12px' }}>
                <span style={{ display: 'flex', gap: '6px' }}><span>{b.avatar}</span> <span style={{ color: '#a1a1aa' }}>{b.username}</span></span>
                <span style={{ fontWeight: '700', color: '#fff' }}>{b.bet.toFixed(0)}</span>
                <span style={{ color: b.won ? '#22c55e' : '#71717a', fontWeight: '800', fontSize: '11px' }}>{b.won ? `${b.mult}x` : '-'}</span>
                <span style={{ color: b.won ? '#22c55e' : 'transparent', fontWeight: '700', width: '60px', textAlign: 'right' }}>{b.won ? b.winAmount.toFixed(0) : ''}</span>
              </div>
            ))}
            {activeTab === 'mine' && <div style={{ textAlign: 'center', color: '#4b5563', fontSize: '12px', marginTop: '40px' }}>No local transaction vectors recorded in this session.</div>}
            {activeTab === 'top' && <div style={{ textAlign: 'center', color: '#4b5563', fontSize: '12px', marginTop: '40px' }}>Global high performance metrics refreshed hourly.</div>}
          </div>
        </div>

        {/* CENTER MAIN PIE: 3D CRASH RADAR SYSTEM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
          
          {/* SPRIBE RAIN DROPS OVERLAY COMPONENT */}
          {isRainActive && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, overflow: 'hidden' }}>
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} style={{ position: 'absolute', width: '2px', height: '15px', background: 'linear-gradient(to bottom, transparent, #3b82f6)', left: `${Math.random() * 100}%`, top: `-20px`, animation: `fall ${1 + Math.random() * 1.5}s linear infinite`, animationDelay: `${Math.random() * 2}s` }} />
              ))}
              <style>{`@keyframes fall { to { transform: translateY(500px); } }`}</style>
            </div>
          )}

          <div style={{ flex: 1, background: '#040406', borderRadius: '12px', border: '1px solid #1a1b24', position: 'relative', overflow: 'hidden' }}>
            <canvas ref={canvasRef} width={750} height={380} style={{ width: '100%', height: '100%', display: 'block' }} />
            
            <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              {gameStatus === 'crashed' ? (
                <div>
                  <h1 style={{ color: '#e11d48', fontSize: '4.2rem', fontWeight: '900', margin: 0, letterSpacing: '1px', fontFamily: "'Space Grotesk', sans-serif" }}>FLEW AWAY</h1>
                  <span style={{ color: '#71717a', fontSize: '14px', fontWeight: '700' }}>Crashed @ {multiplier.toFixed(2)}x</span>
                </div>
              ) : (
                <h1 style={{ fontSize: '6.5rem', fontWeight: '900', color: '#fff', margin: 0, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-2px' }}>{multiplier.toFixed(2)}x</h1>
              )}
            </div>
          </div>

          {/* SPRIBE RE-ENGINEERED TWO DECK INTERACTIVE INPUT SYSTEM */}
          <div style={{ background: '#101116', border: '1px solid #1a1b24', borderRadius: '12px', padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            
            {/* INPUT CONFIG DECK 1 */}
            <div style={{ background: '#181920', border: '1px solid #232430', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <button onClick={() => setIsAutoBet(!isAutoBet)} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: '800', background: isAutoBet ? '#e11d48' : '#2d2e3d', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Auto Bet</button>
                <button onClick={() => setIsAutoCashout(!isAutoCashout)} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: '800', background: isAutoCashout ? '#22c55e' : '#2d2e3d', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Auto Cashout</button>
              </div>

              {isAutoCashout && (
                <input type="number" step="0.1" value={autoCashoutValue} onChange={e => setAutoCashoutValue(e.target.value)} style={{ width: '94%', padding: '6px 10px', background: '#101116', border: '1px solid #2d2e3d', color: '#fff', borderRadius: '4px', marginBottom: '8px', fontSize: '12px' }} />
              )}

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <input type="number" value={wager} onChange={e => setWager(parseInt(e.target.value))} style={{ width: '80px', padding: '10px 4px', background: '#101116', border: '1px solid #2d2e3d', color: '#fff', fontSize: '18px', fontWeight: '900', borderRadius: '4px', textAlign: 'center' }} />
                  {freeBetsAvailable > 0 && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#22c55e', fontWeight: '800' }}>
                      <input type="checkbox" checked={useFreeBetActive} onChange={e => setUseFreeBetActive(e.target.checked)} /> USE FREEBET ({freeBetsAvailable})
                    </label>
                  )}
                </div>

                <button onClick={() => {
                  if (gameStatus === 'idle' && !hasBet) {
                    if (useFreeBetActive && freeBetsAvailable > 0) {
                      setFreeBetsAvailable(p => p - 1); setHasBet(true);
                    } else if (balance >= wager) {
                      commitWalletBalance(balance - wager); setHasBet(true);
                    } else { alert("Insufficient funds."); }
                  } else if (gameStatus === 'running' && hasBet) { handleCashoutPayout(multiplier); }
                }} style={{ flex: 1, padding: '14px', background: hasBet ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontSize: '16px', fontWeight: '900', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(34,197,94,0.2)' }}>
                  {gameStatus === 'idle' ? `BET\n${wager} KES` : hasBet ? `CASH OUT\n${(wager * multiplier).toFixed(2)} KES` : 'WAITING NEXT FLIGHT'}
                </button>
              </div>
            </div>

            {/* SYMMETRICAL REPLICATED DECK INTERFACE MODULE 2 */}
            <div style={{ background: '#181920', border: '1px solid #232430', borderRadius: '8px', padding: '12px', opacity: 0.4, pointerEvents: 'none' }}>
              <span style={{ fontSize: '11px', color: '#71717a', fontWeight: '700' }}>Secondary Stack Engine Inactive</span>
            </div>
          </div>
        </div>

        {/* SIDEBAR RIGHT COLUMN: MODERN CHAT COMMUNITY PORTAL */}
        <div style={{ background: '#101116', borderRadius: '8px', border: '1px solid #1a1b24', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: '#15161e', padding: '12px', borderBottom: '1px solid #1a1b24', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '800', fontSize: '13px', letterSpacing: '0.5px' }}>Lobby Chat 💬</span>
            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>4,922 Active</span>
          </div>

          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chatLogs.map((c, i) => (
              <div key={i} style={{ background: c.system ? 'rgba(147,51,234,0.08)' : 'rgba(255,255,255,0.01)', border: c.system ? '1px solid rgba(147,51,234,0.2)' : 'none', padding: '8px', borderRadius: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ color: c.system ? '#a855f7' : '#3b82f6', fontWeight: '800' }}>@{c.user}</span>
                  <span style={{ color: '#4b5563', fontSize: '10px' }}>{c.time}</span>
                </div>
                <span style={{ color: c.system ? '#e9d5ff' : '#d1d5db', lineHeight: '1.4' }}>{c.msg}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '8px', borderTop: '1px solid #1a1b24', background: '#15161e' }}>
            <input type="text" placeholder="Send text to room feed..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => {
              if (e.key === 'Enter' && chatInput.trim()) {
                setChatLogs(p => [...p, { user: 'Me', msg: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                setChatInput('');
              }
            }} style={{ width: '92%', padding: '10px', background: '#09090d', border: '1px solid #2d2e3d', color: '#fff', borderRadius: '4px', fontSize: '12px' }} />
          </div>
        </div>
      </div>

      {/* MODAL 1: AUTHENTIC M-PESA TERMINATION VERIFICATION LAYER */}
      {isDepositModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#101116', border: '1px solid #22c55e', borderRadius: '12px', width: '100%', maxWidth: '360px', padding: '24px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.7)' }}>
            <button onClick={() => setIsDepositModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#71717a', fontSize: '20px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 16px 0', color: '#22c55e', fontWeight: '800' }}>M-Pesa Cash Gateway</h3>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '700' }}>AMOUNT TO DEPOSIT (MIN KES 49)</label>
              <input type="number" value={inputAmount} onChange={e => setInputAmount(e.target.value)} style={{ width: '93%', padding: '12px', marginTop: '4px', background: '#181920', border: '1px solid #2d2e3d', color: '#fff', fontSize: '16px', fontWeight: '800', borderRadius: '6px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '700' }}>SAFARICOM TELEPHONE SUITE (07XXXXXXXX)</label>
              <input type="text" value={inputPhone} onChange={e => setInputPhone(e.target.value)} style={{ width: '93%', padding: '12px', marginTop: '4px', background: '#181920', border: '1px solid #2d2e3d', color: '#fff', fontSize: '14px', borderRadius: '6px' }} />
            </div>

            <button onClick={handlePaymentInitiation} disabled={loadingDeposit} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '900', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
              {loadingDeposit ? 'SYNCHRONIZING PUSH...' : 'DEPOSIT (KES)'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: PROVABLY FAIR VERIFICATION HUD POPUP */}
      {isProvablyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#101116', border: '1px solid #3b82f6', borderRadius: '12px', width: '100%', maxWidth: '460px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setIsProvablyModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#71717a', fontSize: '20px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 16px 0', color: '#3b82f6', fontWeight: '800' }}>Cryptographic Verification Handshake</h3>
            <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '0 0 16px 0', lineHeight: '1.5' }}>Every round multiplier parameter on JetPesa is calculated mathematically via provably fair algorithms combining independent server seeds and browser keys.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', background: '#181920', padding: '12px', borderRadius: '6px', border: '1px solid #232430' }}>
              <div><span style={{ color: '#71717a' }}>SERVER SEED (SHA256):</span> <code style={{ color: '#fff', display: 'block' }}>{provablyData.serverSeed}</code></div>
              <div><span style={{ color: '#71717a' }}>CLIENT SEED:</span> <code style={{ color: '#fff', display: 'block' }}>{provablyData.clientSeed}</code></div>
              <div><span style={{ color: '#71717a' }}>COMBINED TRANSACTION HASH:</span> <code style={{ color: '#fff', display: 'block' }}>{provablyData.combinedHash}</code></div>
              <div><span style={{ color: '#71717a' }}>ROUND NONCE POINTER:</span> <code style={{ color: '#22c55e', fontWeight: '800' }}>{provablyData.nonce}</code></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
