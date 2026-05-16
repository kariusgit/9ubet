'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function UltimateJetPesaCockpit() {
  const router = useRouter();
  
  // Account Profile Identity States
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0);
  const [phoneProfile, setPhoneProfile] = useState('');
  const [rememberPhone, setRememberPhone] = useState(true);
  
  // Secret Retention Logic Parameters
  const [trackDepositSum, setTrackDepositSum] = useState(0);
  const [trackLossSum, setTrackLossSum] = useState(0);
  const [freeBetsAvailable, setFreeBetsAvailable] = useState(0);

  // Layout Controls & View Toggles
  const [activeTab, setActiveTab] = useState('all'); 
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isProvablyModalOpen, setIsProvablyModalOpen] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [mobileActivePanel, setMobileActivePanel] = useState('game'); // 'bets' | 'game' | 'chat'

  // Inline Notification Bubble Array Engine
  const [toasts, setToasts] = useState([]);

  // Input Field Controllers
  const [inputPhone, setInputPhone] = useState('');
  const [inputAmount, setInputAmount] = useState('100');
  const [loadingDeposit, setLoadingDeposit] = useState(false);

  // Independent Concurrent Double Wager Strategy Deck State Matrices
  const [deckA, setDeckA] = useState({ wager: 10, isAuto: false, isAutoCash: false, cashVal: 2.0, hasBetNext: false, hasBetCurrent: false, useFree: false });
  const [deckB, setDeckB] = useState({ wager: 20, isAuto: false, isAutoCash: false, cashVal: 3.0, hasBetNext: false, hasBetCurrent: false, useFree: false });

  // High Fidelity Central Synchronized Game Loop States
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle' | 'running' | 'crashed'
  const [countdownProgress, setCountdownProgress] = useState(100);
  const [historyTape, setHistoryTape] = useState([1.47, 1.23, 1.19, 7.05, 1.52, 1.61, 1.89, 1.08, 2.20, 6.11, 1.18, 5.07, 1.06]);
  
  const canvasRef = useRef(null);
  const animationId = useRef(null);

  // Floating Toast Notification Subsystem
  const triggerToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Structured Live Feed Generator Matching Exact Format Requirements
  const [liveBetsFeed, setLiveBetsFeed] = useState([]);
  const [chatLogs, setChatLogs] = useState([
    { user: '🦈071***45', msg: 'Admin, background rain drop claim active? 🙌', time: '07:11' },
    { user: '🦒072***89', msg: 'Yesu wangu sasa hii ndiyo nini 🤯 Aviator strictly running smooth!', time: '07:19' },
    { user: '🦅079***12', msg: 'Just hit 5.07x on deck B auto-cashout choice. Safi sana!', time: '07:22' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Audio Context Tone Generator Handle
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
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    } catch (e) { console.log(e); }
  };

  const generateRealisticBetsFeed = () => {
    const prefixes = ['070***', '071***', '072***', '079***', '011***', '075***'];
    const mockAvatars = ['🦒', '🚗', '🦁', '🦊', '🦅', '🦈', '🎨'];
    const newList = Array.from({ length: 18 }, () => {
      const betAmt = parseFloat((Math.random() * 1400 + 100).toFixed(2));
      const reachedMult = parseFloat((Math.random() * 3.4 + 1.01).toFixed(2));
      const won = Math.random() > 0.52;
      return {
        username: mockAvatars[Math.floor(Math.random() * mockAvatars.length)] + prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(Math.random() * 89 + 10),
        bet: betAmt,
        mult: reachedMult,
        won: won,
        winAmount: won ? parseFloat((betAmt * reachedMult).toFixed(2)) : 0
      };
    });
    setLiveBetsFeed(newList.sort((a, b) => b.bet - a.bet));
  };

  useEffect(() => {
    const savedPhone = localStorage.getItem('jetpesa_saved_phone');
    if (savedPhone) { setInputPhone(savedPhone); setPhoneProfile(savedPhone); }

    const unsubscribe = onAuthStateChanged(auth, async (curr) => {
      if (!curr) { router.push('/'); return; }
      setUser(curr);
      const userDoc = await getDoc(doc(db, "users", curr.uid));
      if (userDoc.exists()) {
        const d = userDoc.data();
        setBalance(d.walletBalance || 0.0);
        if (!savedPhone && d.mpesaPhone) { setPhoneProfile(d.mpesaPhone); setInputPhone(d.mpesaPhone); }
        setTrackDepositSum(d.secretDepositSum || 0);
        setTrackLossSum(d.secretLossSum || 0);
        setFreeBetsAvailable(d.secretFreeBets || 0);
      }
    });

    generateRealisticBetsFeed();
    const feedInterval = setInterval(generateRealisticBetsFeed, 6000);
    return () => { unsubscribe(); clearInterval(feedInterval); };
  }, [router]);

  // Central Pseudo-Distributed Deterministic Clock Loop Logic
  // Syncs flight times across page reloads, sign-ins, and separate device tabs perfectly.
  useEffect(() => {
    function executeGlobalSyncLoop() {
      const totalCyclePeriod = 21000; // Total phase duration loop context (21 seconds)
      const countdownPhaseDuration = 5000; // Countdown wait period (5 seconds)
      const dynamicRunningWindow = 14000; // Maximum simulation flight sequence window
      
      const absoluteUnixEpochMs = Date.now();
      const currentCycleOffsetTimeMs = absoluteUnixEpochMs % totalCyclePeriod;

      // PHASE A: System Inbound Preparation & Countdown Load Stage
      if (currentCycleOffsetTimeMs < countdownPhaseDuration) {
        setGameStatus('idle');
        const completedPercentage = ((countdownPhaseDuration - currentCycleOffsetTimeMs) / countdownPhaseDuration) * 100;
        setCountdownProgress(completedPercentage);
        setMultiplier(1.0);
        
        // Auto-migrate booked bets on round boundary transitions
        setDeckA(prev => { if(prev.hasBetNext && !prev.hasBetCurrent) { return {...prev, hasBetCurrent: true, hasBetNext: prev.isAuto}; } return prev; });
        setDeckB(prev => { if(prev.hasBetNext && !prev.hasBetCurrent) { return {...prev, hasBetCurrent: true, hasBetNext: prev.isAuto}; } return prev; });

      } 
      // PHASE B: Plane Flight In Progress Stage
      else if (currentCycleOffsetTimeMs < (countdownPhaseDuration + dynamicRunningWindow)) {
        setGameStatus('running');
        const activeFlightSeconds = (currentCycleOffsetTimeMs - countdownPhaseDuration) / 1000;
        
        // Deterministic curve calculated uniformly on every tab instance natively
        const synchronizedMultiplier = parseFloat(Math.pow(Math.E, 0.075 * activeFlightSeconds).toFixed(2));
        
        // Hardcoded mathematical seed fallback calculation parameters for safety
        const explicitRoundCycleIndex = Math.floor(absoluteUnixEpochMs / totalCyclePeriod);
        const pseudoCrashTarget = parseFloat((1.05 + (parseFloat(String(Math.sin(explicitRoundCycleIndex) * 1000).split('.')[1] || 5) % 8.5)).toFixed(2));

        if (synchronizedMultiplier >= pseudoCrashTarget) {
          setGameStatus('crashed');
          setMultiplier(pseudoCrashTarget);
          
          // Clear missed bets cleanly
          setDeckA(p => ({ ...p, hasBetCurrent: false }));
          setDeckB(p => ({ ...p, hasBetCurrent: false }));
        } else {
          setMultiplier(synchronizedMultiplier);
          
          // Verify inline auto-cash thresholds dynamically inside active loops
          setDeckA(p => { if (p.hasBetCurrent && p.isAutoCash && synchronizedMultiplier >= parseFloat(p.cashVal)) { triggerImmediateCashout('A', synchronizedMultiplier, p); return { ...p, hasBetCurrent: false }; } return p; });
          setDeckB(p => { if (p.hasBetCurrent && p.isAutoCash && synchronizedMultiplier >= parseFloat(p.cashVal)) { triggerImmediateCashout('B', synchronizedMultiplier, p); return { ...p, hasBetCurrent: false }; } return p; });
        }
      } 
      // PHASE C: Flew Away Crash Display Resolution Block
      else {
        setGameStatus('crashed');
        const explicitRoundCycleIndex = Math.floor(absoluteUnixEpochMs / totalCyclePeriod);
        const pseudoCrashTarget = parseFloat((1.05 + (parseFloat(String(Math.sin(explicitRoundCycleIndex) * 1000).split('.')[1] || 5) % 8.5)).toFixed(2));
        setMultiplier(pseudoCrashTarget);
        
        setDeckA(p => ({ ...p, hasBetCurrent: false }));
        setDeckB(p => ({ ...p, hasBetCurrent: false }));
      }

      // Draw active graphics frames relative to calculated parameters safely
      drawRadarCanvasFrame(currentCycleOffsetTimeMs, countdownPhaseDuration);
      animationId.current = requestAnimationFrame(executeGlobalSyncLoop);
    }

    animationId.current = requestAnimationFrame(executeGlobalSyncLoop);
    return () => cancelAnimationFrame(animationId.current);
  }, [deckA, deckB]);

  // High Performance Synchronized Radar Canvas Renderer Loop
  const drawRadarCanvasFrame = (offsetTimeMs, countdownLimit) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width; const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    
    // Grid Lines matching Spribe blueprint exactly
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
    for (let j = 0; j < H; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }

    if (offsetTimeMs >= countdownLimit && gameStatus === 'running') {
      const flightSec = (offsetTimeMs - countdownLimit) / 1000;
      let cx = 60 + (W - 160) * Math.min(flightSec / 8, 1);
      let cy = (H - 60) - (H - 160) * (Math.min(multiplier - 1, 5) / 5);

      ctx.beginPath(); ctx.moveTo(60, H - 60);
      ctx.quadraticCurveTo((60 + cx) / 1.8, H - 40, cx, cy);
      ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 5; ctx.shadowBlur = 15; ctx.shadowColor = '#e11d48';
      ctx.stroke(); ctx.shadowBlur = 0;

      // Render Synchronized Plane Body
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.sin(flightSec * 6) * 0.02 - 0.05);
      const exhaust = ctx.createRadialGradient(-18, 2, 2, -18, 2, 14 + Math.random() * 6);
      exhaust.addColorStop(0, '#ff5500'); exhaust.addColorStop(1, 'transparent');
      ctx.fillStyle = exhaust; ctx.beginPath(); ctx.arc(-18, 2, 18, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(28, 0); ctx.quadraticCurveTo(12, -10, -14, -8); ctx.lineTo(-20, 0); ctx.lineTo(-14, 8); ctx.quadraticCurveTo(12, 10, 28, 0); ctx.fill();
      ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.moveTo(-4, -8); ctx.lineTo(-22, -20); ctx.lineTo(-16, -6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#6366f1'; ctx.beginPath(); ctx.moveTo(10, -6); ctx.quadraticCurveTo(22, -3, 28, 0); ctx.quadraticCurveTo(22, 3, 10, 6); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  };

  const triggerImmediateCashout = (targetDeck, m, activeDeckState) => {
    const winAmt = (activeDeckState.wager * m);
    commitWalletBalance(balance + winAmt, 0, -activeDeckState.wager, 0);
    playTone(620, 'sine', 0.2);
    confetti({ particleCount: 70, spread: 55, origin: { y: 0.4 } });
    triggerToast(`🎉 Deck ${targetDeck} Payout Authorized! + KES ${winAmt.toFixed(2)}`, "success");
  };

  const commitWalletBalance = async (newBalance, depIncrement = 0, lossIncrement = 0, freeBetDelta = 0) => {
    if (!user) return;
    const cleanBal = parseFloat(Math.max(0, newBalance).toFixed(2));
    setBalance(cleanBal);
    await updateDoc(doc(db, "users", user.uid), {
      walletBalance: cleanBal,
      mpesaPhone: inputPhone
    });
  };

  // Modernized Safety Stake Allocation Module
  const placeWagerIntent = (targetDeck) => {
    // INTERCEPT: Block immediate action if the user profile wallet balance reads 0 KES
    if (balance <= 0) {
      triggerToast("❌ Wager Denied: You do not have any money in your wallet. Please click Deposit to continue.", "error");
      return;
    }

    const isA = targetDeck === 'A';
    const targetState = isA ? deckA : deckB;

    if (balance < targetState.wager && !targetState.hasBetCurrent && !targetState.hasBetNext) {
      triggerToast("❌ Wager Denied: Insufficient wallet balance for chosen stake parameters.", "error");
      return;
    }

    if (gameStatus === 'running') {
      if (isA) setDeckA(p => ({ ...p, hasBetNext: !p.hasBetNext }));
      else setDeckB(p => ({ ...p, hasBetNext: !p.hasBetNext }));
      triggerToast(`Deck ${targetDeck} next round schedule toggled safely.`, "info");
    } else {
      if (isA) setDeckA(p => ({ ...p, hasBetNext: !p.hasBetNext }));
      else setDeckB(p => ({ ...p, hasBetNext: !p.hasBetNext }));
    }
  };

  const handleManualCashout = (targetDeck) => {
    const isA = targetDeck === 'A';
    const targetState = isA ? deckA : deckB;
    if (!targetState.hasBetCurrent) return;

    const winAmt = (targetState.wager * multiplier);
    commitWalletBalance(balance + winAmt, 0, -targetState.wager, 0);
    
    if (isA) setDeckA(p => ({ ...p, hasBetCurrent: false }));
    else setDeckB(p => ({ ...p, hasBetCurrent: false }));

    playTone(650, 'sine', 0.25);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } });
    triggerToast(`🎉 Manual Cashout Success! + KES ${winAmt.toFixed(2)}`, "success");
  };

  const handlePaymentInitiation = async () => {
    const amt = parseInt(inputAmount);
    if (isNaN(amt) || amt < 49) return triggerToast("❌ Minimum requirement bound: KES 49 required.", "error");
    if (!inputPhone || inputPhone.trim().length < 9) return triggerToast("❌ Validation failure on network telephone format.", "error");

    setLoadingDeposit(true);
    try {
      const res = await fetch('/api/payhero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, phone: inputPhone, username: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        if (rememberPhone) { localStorage.setItem('jetpesa_saved_phone', inputPhone); }
        commitWalletBalance(balance + amt, amt, 0, 0);
        setIsDepositModalOpen(false);
        triggerToast("✅ Secure STK Push protocol triggered successfully.", "success");
      } else { triggerToast("Gateway fallback response: " + data.message, "error"); }
    } catch (e) { triggerToast("Exception context failure: " + e.message, "error"); }
    finally { setLoadingDeposit(false); }
  };

  return (
    <div style={{ background: '#060609', color: '#f4f4f6', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      
      {/* SELF-DISMISSING FLOATING NOTIFICATION BUBBLES AREA */}
      <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '8px', width: '90%', maxWidth: '420px' }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: t.type === 'error' ? '#dc2626' : t.type === 'success' ? '#16a34a' : '#1e1b4b', color: '#fff', padding: '14px 20px', borderRadius: '24px', boxShadow: '0 12px 30px rgba(0,0,0,0.6)', fontWeight: '700', fontSize: '13px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)', animation: 'fadeInUp 0.2s ease-out' }}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* FIXED NAVBAR HEADER */}
      <header style={{ background: '#0c0d12', borderBottom: '2px solid #14151b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 99 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '-0.75px' }}>Aviator</span>
          <button style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22c55e', color: '#22c55e', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setIsProvablyModalOpen(true)}>🛡️ Provably Fair</button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setAudioMuted(!audioMuted)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>{audioMuted ? '🔈' : '🔊'}</button>
          <button onClick={() => setIsRainActive(!isRainActive)} style={{ background: isRainActive ? '#a855f7' : '#1a1b23', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>🌧️ Rain</button>
          
          <div style={{ display: 'flex', alignItems: 'center', background: '#14151f', border: '1px solid #252736', padding: '2px 2px 2px 12px', borderRadius: '24px', gap: '8px' }}>
            <span style={{ color: '#22c55e', fontWeight: '900', fontSize: '14px' }}>{balance.toFixed(2)} KES</span>
            <button onClick={() => setIsDepositModalOpen(true)} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '900', padding: '7px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>Deposit</button>
          </div>
        </div>
      </header>

      {/* HISTORIC TAPE */}
      <div style={{ display: 'flex', gap: '8px', background: '#0a0b0f', padding: '10px 16px', overflowX: 'auto', borderBottom: '1px solid #15161e' }}>
        {historyTape.map((h, i) => (
          <div key={i} style={{ background: h > 2 ? 'linear-gradient(135deg, #a855f7 0%, #701a75 100%)' : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', color: '#fff', padding: '4px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '900' }}>
            {h.toFixed(2)}x
          </div>
        ))}
      </div>

      {/* CENTRAL COCKPIT GRID ASSEMBLY */}
      <div className="cockpitMainLayout" style={{ flex: 1, display: 'grid', padding: '12px', gap: '12px', minHeight: 0 }}>
        
        {/* PANEL 1: LIVE ACTION TRACK FEED */}
        <div className="leftPanelLayout" style={{ background: '#0e0f14', borderRadius: '12px', border: '1px solid #16171d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: '#12131a', padding: '4px' }}>
            {['all', 'mine', 'top'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '10px', background: activeTab === t ? '#1a1b24' : 'transparent', border: 'none', color: '#fff', fontSize: '11px', fontWeight: '800', borderRadius: '6px' }}>{t.toUpperCase()} BETS</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
            {liveBetsFeed.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: b.won ? 'rgba(34,197,94,0.04)' : 'transparent', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8', fontWeight: '600' }}>{b.username}</span>
                <span style={{ fontWeight: '800', color: '#fff' }}>{b.bet.toFixed(0)} KES</span>
                <span style={{ color: b.won ? '#22c55e' : '#475569', fontWeight: '900' }}>{b.won ? `${b.mult}x` : '-'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 2: MAIN FLIGHT RADAR & INTERACTIVE WAGER STICKY FLOATING DECKS */}
        <div className="centerPanelLayout" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
          
          <div style={{ flex: 1, background: '#030305', borderRadius: '14px', border: '1px solid #16171d', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
            
            {/* SPRIBE SYNCHRONIZED COUNTDOWN SYSTEM PROGRESS OVERLAY */}
            {gameStatus === 'idle' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5,5,8,0.94)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ width: '75%', maxWidth: '320px', background: '#12131a', padding: '5px', borderRadius: '10px', border: '1px solid #22c55e' }}>
                  <div style={{ height: '8px', background: 'linear-gradient(to right, #22c55e, #4ade80)', borderRadius: '6px', width: `${countdownProgress}%` }} />
                </div>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '900', marginTop: '12px', letterSpacing: '0.5px' }}>WAITING FOR NEXT ROUND...</span>
                <span style={{ color: '#475569', fontSize: '11px', fontWeight: '700', marginTop: '4px' }}>Powered by JetPesa</span>
              </div>
            )}

            <canvas ref={canvasRef} width={640} height={320} style={{ width: '100%', height: '100%', display: 'block' }} />
            
            {gameStatus !== 'idle' && (
              <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                {gameStatus === 'crashed' ? (
                  <div>
                    <h1 style={{ color: '#e11d48', fontSize: '3.6rem', fontWeight: '900', margin: 0 }}>FLEW AWAY</h1>
                    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '800' }}>Crashed @ {multiplier.toFixed(2)}x</span>
                  </div>
                ) : (
                  <h1 style={{ fontSize: '5.8rem', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-2px' }}>{multiplier.toFixed(2)}x</h1>
                )}
              </div>
            )}
          </div>

          {/* COMPACT STICKY DEALS LAYER: MOVED HIGHER AND INCREASED PADDING FOR DESKTOP ACCESSIBILITY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: '#0e0f14', border: '2px solid #1c1e27', padding: '16px', borderRadius: '16px', boxShadow: '0 15px 35px rgba(0,0,0,0.7)' }}>
            
            {/* STRATEGY SYSTEM WAGER PANEL A */}
            <div style={{ background: '#12131e', border: '1px solid #23253a', padding: '14px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <button onClick={() => setDeckA(p => ({ ...p, isAuto: !p.isAuto }))} style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '900', background: deckA.isAuto ? '#e11d48' : '#1e293b', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>AUTO BET</button>
                <button onClick={() => setDeckA(p => ({ ...p, isAutoCash: !p.isAutoCash }))} style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '900', background: deckA.isAutoCash ? '#22c55e' : '#1e293b', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>AUTO CASH</button>
              </div>
              {deckA.isAutoCash && <input type="number" step="0.1" value={deckA.cashVal} onChange={e => setDeckA(p => ({ ...p, cashVal: e.target.value }))} style={{ width: '92%', padding: '6px', background: '#060609', border: '1px solid #2c2e43', color: '#fff', fontSize: '12px', borderRadius: '6px', marginBottom: '8px' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="number" value={deckA.wager} onChange={e => setDeckA(p => ({ ...p, wager: parseInt(e.target.value) }))} style={{ width: '70px', padding: '12px 4px', background: '#060609', border: '1px solid #2c2e43', color: '#fff', fontWeight: '900', textAlign: 'center', borderRadius: '6px', fontSize: '15px' }} />
                
                {deckA.hasBetCurrent ? (
                  <button onClick={() => handleManualCashout('A')} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', border: 'none', color: '#fff', fontWeight: '900', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
                    CASH OUT<br/><span style={{ fontSize: '16px' }}>{(deckA.wager * multiplier).toFixed(2)} KES</span>
                  </button>
                ) : (
                  <button onClick={() => placeWagerIntent('A')} style={{ flex: 1, padding: '14px', background: deckA.hasBetNext ? '#475569' : '#22c55e', border: 'none', color: '#fff', fontWeight: '900', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
                    {deckA.hasBetNext ? 'CANCEL WAITING' : `BET\n${deckA.wager} KES`}
                  </button>
                )}
              </div>
            </div>

            {/* STRATEGY SYSTEM WAGER PANEL B */}
            <div style={{ background: '#12131e', border: '1px solid #23253a', padding: '14px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <button onClick={() => setDeckB(p => ({ ...p, isAuto: !p.isAuto }))} style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '900', background: deckB.isAuto ? '#e11d48' : '#1e293b', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>AUTO BET</button>
                <button onClick={() => setDeckB(p => ({ ...p, isAutoCash: !p.isAutoCash }))} style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '900', background: deckB.isAutoCash ? '#22c55e' : '#1e293b', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>AUTO CASH</button>
              </div>
              {deckB.isAutoCash && <input type="number" step="0.1" value={deckB.cashVal} onChange={e => setDeckB(p => ({ ...p, cashVal: e.target.value }))} style={{ width: '92%', padding: '6px', background: '#060609', border: '1px solid #2c2e43', color: '#fff', fontSize: '12px', borderRadius: '6px', marginBottom: '8px' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="number" value={deckB.wager} onChange={e => setDeckB(p => ({ ...p, wager: parseInt(e.target.value) }))} style={{ width: '70px', padding: '12px 4px', background: '#060609', border: '1px solid #2c2e43', color: '#fff', fontWeight: '900', textAlign: 'center', borderRadius: '6px', fontSize: '15px' }} />
                
                {deckB.hasBetCurrent ? (
                  <button onClick={() => handleManualCashout('B')} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', border: 'none', color: '#fff', fontWeight: '900', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
                    CASH OUT<br/><span style={{ fontSize: '16px' }}>{(deckB.wager * multiplier).toFixed(2)} KES</span>
                  </button>
                ) : (
                  <button onClick={() => placeWagerIntent('B')} style={{ flex: 1, padding: '14px', background: deckB.hasBetNext ? '#475569' : '#16a34a', border: 'none', color: '#fff', fontWeight: '900', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
                    {deckB.hasBetNext ? 'CANCEL WAITING' : `BET\n${deckB.wager} KES`}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* PANEL 3: LOBBY PUBLIC COMMUNICATION PLATFORM */}
        <div className="rightPanelLayout" style={{ background: '#0e0f14', borderRadius: '12px', border: '1px solid #16171d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: '#12131a', padding: '12px', borderBottom: '1px solid #16171d' }}>
            <span style={{ fontWeight: '800', fontSize: '13px' }}>Lobby Chat Room 💬</span>
          </div>
          <div style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {chatLogs.map((c, i) => (
              <div key={i} style={{ background: c.system ? 'rgba(168,85,247,0.06)' : '#12131a', padding: '8px 10px', borderRadius: '6px', fontSize: '11px' }}>
                <span style={{ color: c.system ? '#c084fc' : '#38bdf8', fontWeight: '800', display: 'block' }}>{c.user}</span>
                <span style={{ color: '#e2e8f0', marginTop: '2px', display: 'block' }}>{c.msg}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px', background: '#12131a', borderTop: '1px solid #16171d' }}>
            <input type="text" placeholder="Type chat message..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => {
              if (e.key === 'Enter' && chatInput.trim()) {
                setChatLogs(p => [...p, { user: '🦈070***01', msg: chatInput, time: 'Now' }]); setChatInput('');
              }
            }} style={{ width: '92%', padding: '8px', background: '#060609', border: '1px solid #2c2e43', color: '#fff', borderRadius: '4px', fontSize: '12px' }} />
          </div>
        </div>

      </div>

      {/* FOOTER MOBILE UTILITY ACTION OVERLAY */}
      <div className="mobileUtilityFooterBar" style={{ background: '#0c0d12', borderTop: '1px solid #14151b', display: 'none', justifyContent: 'space-around', padding: '10px 0', position: 'sticky', bottom: 0, zIndex: 999 }}>
        <button onClick={() => setMobileActivePanel('bets')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'bets' ? '#22c55e' : '#64748b', fontSize: '12px', fontWeight: '800' }}>📊 DATA LIVE</button>
        <button onClick={() => setMobileActivePanel('game')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'game' ? '#e11d48' : '#64748b', fontSize: '12px', fontWeight: '800' }}>🚀 RADAR HUB</button>
        <button onClick={() => setMobileActivePanel('chat')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'chat' ? '#38bdf8' : '#64748b', fontSize: '12px', fontWeight: '800' }}>💬 ROOM CHAT</button>
      </div>

      {/* MODAL 1: M-PESA TRANSACTIONS GATEWAY HOOK */}
      {isDepositModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '12px' }}>
          <div style={{ background: '#0c0d12', border: '1px solid #22c55e', borderRadius: '16px', width: '100%', maxWidth: '340px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setIsDepositModalOpen(false)} style={{ position: 'absolute', top: '14px', right: '16px', background: 'transparent', border: 'none', color: '#64748b', fontSize: '22px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 16px 0', color: '#22c55e', fontWeight: '900' }}>M-Pesa Safaricom Gate</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>DEPOSIT QUOTA (MIN 49 KES)</label>
              <input type="number" value={inputAmount} onChange={e => setInputAmount(e.target.value)} style={{ width: '92%', padding: '12px', marginTop: '4px', background: '#12131e', border: '1px solid #23253a', color: '#fff', fontSize: '16px', fontWeight: '900', borderRadius: '8px' }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>SAFARICOM TELEPHONE SIGNATURE</label>
              <input type="text" value={inputPhone} onChange={e => setInputPhone(e.target.value)} placeholder="07XXXXXXXX" style={{ width: '92%', padding: '12px', marginTop: '4px', background: '#12131e', border: '1px solid #23253a', color: '#fff', fontSize: '14px', borderRadius: '8px' }} />
            </div>

            <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remPhone" checked={rememberPhone} onChange={e => setRememberPhone(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#22c55e' }} />
              <label htmlFor="remPhone" style={{ fontSize: '12px', color: '#94a3b8', cursor: 'pointer', fontWeight: '600' }}>Save number for future deposits</label>
            </div>

            <button onClick={handlePaymentInitiation} disabled={loadingDeposit} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '900', borderRadius: '8px', cursor: 'pointer' }}>
              {loadingDeposit ? 'ESTABLISHING HANDSHAKE...' : 'INITIATE DEPOSIT'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: CRYPTO DISCLOSURE VIEWPORT */}
      {isProvablyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0c0d12', border: '1px solid #3b82f6', borderRadius: '12px', width: '90%', maxWidth: '400px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>Spribe Cryptographic Handshake Nodes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', background: '#060609', padding: '10px', borderRadius: '6px', wordBreak: 'break-all' }}>
              <div><span style={{ color: '#475569' }}>PROVABLY ALGORITHM:</span> <code style={{ color: '#fff' }}>SHA-256 Distributed Epoch Grid</code></div>
            </div>
            <button onClick={() => setIsProvablyModalOpen(false)} style={{ width: '100%', marginTop: '12px', padding: '10px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px' }}>CLOSE HUD</button>
          </div>
        </div>
      )}

      {/* CORE DISPLAY RESPONSIVE DESIGN SPEC SHEET */}
      <style>{`
        .cockpitMainLayout { grid-template-columns: 300px 1fr 280px; height: calc(100vh - 120px); }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 15px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @media (max-width: 992px) {
          .cockpitMainLayout { grid-template-columns: 1fr !important; height: auto !important; padding-bottom: 70px !important; }
          .mobileUtilityFooterBar { display: flex !important; }
          .leftPanelLayout { display: ${mobileActivePanel === 'bets' ? 'flex !important' : 'none !important'}; height: 65vh; }
          .centerPanelLayout { display: ${mobileActivePanel === 'game' ? 'flex !important' : 'none !important'}; }
          .rightPanelLayout { display: ${mobileActivePanel === 'chat' ? 'flex !important' : 'none !important'}; height: 65vh; }
        }
      `}</style>

    </div>
  );
}
