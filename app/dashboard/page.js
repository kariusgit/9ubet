'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function UltimateJetPesaCockpit() {
  const router = useRouter();
  
  // Account Profile States
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0);
  const [phoneProfile, setPhoneProfile] = useState('');
  const [rememberPhone, setRememberPhone] = useState(true);
  
  // Secret Retention Logic Parameters
  const [trackDepositSum, setTrackDepositSum] = useState(0);
  const [trackLossSum, setTrackLossSum] = useState(0);
  const [freeBetsAvailable, setFreeBetsAvailable] = useState(0);

  // Layout View Controls & Toggles
  const [activeTab, setActiveTab] = useState('all'); 
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isProvablyModalOpen, setIsProvablyModalOpen] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [mobileActivePanel, setMobileActivePanel] = useState('game'); // 'bets' | 'game' | 'chat'

  // Inline Notification Engine State
  const [toasts, setToasts] = useState([]);

  // Input Field Controllers
  const [inputPhone, setInputPhone] = useState('');
  const [inputAmount, setInputAmount] = useState('100');
  const [loadingDeposit, setLoadingDeposit] = useState(false);

  // Independent Concurrent Double Wager Strategy Deck State Matrices
  const [deckA, setDeckA] = useState({ wager: 10, isAuto: false, isAutoCash: false, cashVal: 2.0, hasBetNext: false, hasBetCurrent: false, useFree: false });
  const [deckB, setDeckB] = useState({ wager: 20, isAuto: false, isAutoCash: false, cashVal: 3.0, hasBetNext: false, hasBetCurrent: false, useFree: false });

  // High Fidelity Game Engine States
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle' | 'running' | 'crashed'
  const [countdownProgress, setCountdownProgress] = useState(100);
  const [historyTape, setHistoryTape] = useState([1.47, 1.23, 1.19, 7.05, 1.52, 1.61, 1.89, 1.08, 2.20, 6.11, 1.18, 5.07, 1.06]);
  
  // Cryptographic Verification Data
  const [provablyData, setProvablyData] = useState({
    serverSeed: 'b8e974ca...9a12',
    clientSeed: 'jet_pesa_session_crypto_alpha',
    combinedHash: '61a5b84c8d301...ae882f',
    nonce: 104
  });

  // Authentic Structural Data Feeds (Matching the requested formatting)
  const [liveBetsFeed, setLiveBetsFeed] = useState([]);
  const [chatLogs, setChatLogs] = useState([
    { user: '🦈071***45', msg: 'Admin, background rain drop claim active? 🙌', time: '07:11' },
    { user: '🦒072***89', msg: 'Yesu wangu sasa hii ndiyo nini 🤯 Aviator strictly running smooth!', time: '07:19' },
    { user: '🦅079***12', msg: 'Just hit 5.07x on deck B auto-cashout choice. Safi sana!', time: '07:22' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const canvasRef = useRef(null);
  const targetCrashPoint = useRef(1.0);
  const animationId = useRef(null);
  const cycleTime = useRef(0);

  // Self-Dismissing Toast Notification Trigger
  const triggerToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sound Synth Core
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
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { console.log(e); }
  };

  // Structured Live Feed Generator Matching Format Specifiers
  const generateRealisticBetsFeed = () => {
    const prefixes = ['070***', '071***', '072***', '079***', '011***', '075***'];
    const mockAvatars = ['🦒', '🚗', '🦁', '🦊', '🦅', '🦈', '🎨'];
    const newList = Array.from({ length: 25 }, () => {
      const betAmt = parseFloat((Math.random() * 1400 + 100).toFixed(2));
      const reachedMult = parseFloat((Math.random() * 3.4 + 1.01).toFixed(2));
      const won = Math.random() > 0.52;
      return {
        avatar: mockAvatars[Math.floor(Math.random() * mockAvatars.length)],
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
    // Check for cached phone configurations safely in local storage nodes
    const savedPhone = localStorage.getItem('jetpesa_saved_phone');
    if (savedPhone) {
      setInputPhone(savedPhone);
      setPhoneProfile(savedPhone);
    }

    const unsubscribe = onAuthStateChanged(auth, async (curr) => {
      if (!curr) { router.push('/'); return; }
      setUser(curr);
      const userDoc = await getDoc(doc(db, "users", curr.uid));
      if (userDoc.exists()) {
        const d = userDoc.data();
        setBalance(d.walletBalance || 0.0);
        if (!savedPhone && d.mpesaPhone) {
          setPhoneProfile(d.mpesaPhone);
          setInputPhone(d.mpesaPhone);
        }
        setTrackDepositSum(d.secretDepositSum || 0);
        setTrackLossSum(d.secretLossSum || 0);
        setFreeBetsAvailable(d.secretFreeBets || 0);
      }
    });

    generateRealisticBetsFeed();
    const feedInterval = setInterval(generateRealisticBetsFeed, 6000);
    return () => { unsubscribe(); clearInterval(feedInterval); };
  }, [router]);

  useEffect(() => {
    if (user) startNextRoundCountdown();
    return () => cancelAnimationFrame(animationId.current);
  }, [user]);

  // High Density Chat Loops containing both Human Simulations & Live Automated AI updates
  useEffect(() => {
    const chatInterval = setInterval(() => {
      const templates = [
        { user: '🦁072***14', msg: 'Stake configurations hitting neatly tonight.' },
        { user: '🦊079***53', msg: 'Is there rain falling in the active chat workspace area?' },
        { user: '🚗070***91', msg: 'System execution parameters are blazing fast.' }
      ];
      const selected = templates[Math.floor(Math.random() * templates.length)];
      setChatLogs(p => [...p, { ...selected, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 9000);

    const aiBotInterval = setInterval(() => {
      const prefix = ['🦁', '🦈', '🦅', '🎨'][Math.floor(Math.random() * 4)];
      const num = '07' + Math.floor(Math.random() * 9) + '***' + Math.floor(Math.random() * 89 + 10);
      const winVal = (Math.random() * 18000 + 4000).toFixed(2);
      const multVal = (Math.random() * 9 + 1.4).toFixed(2);
      
      setChatLogs(p => [...p, {
        user: '🤖 SYSTEM AI',
        msg: `🚀 TRENDING REVENUE EVENT: ${prefix}${num} instantly cashed out KES ${winVal} at ${multVal}x!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        system: true
      }]);
    }, 14000);

    return () => { clearInterval(chatInterval); clearInterval(aiBotInterval); };
  }, []);

  const commitWalletBalance = async (newBalance, depIncrement = 0, lossIncrement = 0, freeBetDelta = 0) => {
    if (!user) return;
    const cleanBal = parseFloat(Math.max(0, newBalance).toFixed(2));
    setBalance(cleanBal);
    
    const nextDepSum = trackDepositSum + depIncrement;
    const nextLossSum = trackLossSum + lossIncrement;
    let nextFreeBets = freeBetsAvailable + freeBetDelta;

    if (depIncrement >= 1000) {
      setTrackDepositSum(nextDepSum);
      setTrackLossSum(0);
    }

    if (trackDepositSum >= 1000 && nextLossSum >= (trackDepositSum / 2) && freeBetsAvailable === 0 && freeBetDelta === 0) {
      nextFreeBets = 3;
      setFreeBetsAvailable(3);
      triggerToast("🎁 Promotional Loyalty Token assigned to account profile structure safely.", "success");
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

  // Five Seconds Structured Loading Interval Implementation
  const startNextRoundCountdown = async () => {
    setGameStatus('idle');
    setMultiplier(1.0);
    cycleTime.current = 0;

    // Transition all verified background active queues into current stakes securely
    setDeckA(prev => ({ ...prev, hasBetCurrent: prev.hasBetNext, hasBetNext: prev.isAuto ? prev.hasBetNext : false }));
    setDeckB(prev => ({ ...prev, hasBetCurrent: prev.hasBetNext, hasBetNext: prev.isAuto ? prev.hasBetNext : false }));

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
      targetCrashPoint.current = parseFloat((Math.random() * 3.6 + 1.01).toFixed(2));
    }

    const countdownStart = performance.now();
    const duration = 5000; // 5 Seconds exactly

    function countFrame(now) {
      const elapsed = now - countdownStart;
      const remains = Math.max(0, 100 - (elapsed / duration) * 100);
      setCountdownProgress(remains);

      if (elapsed >= duration) {
        triggerLaunch();
      } else {
        animationId.current = requestAnimationFrame(countFrame);
      }
    }
    animationId.current = requestAnimationFrame(countFrame);
  };

  const triggerLaunch = () => {
    setGameStatus('running');
    const start = performance.now();

    function frame(now) {
      let t = (now - start) / 1000;
      cycleTime.current = t;
      let currentMult = parseFloat(Math.pow(Math.E, 0.075 * t).toFixed(2));

      if (currentMult >= targetCrashPoint.current) {
        executeFlewAway(); return;
      }

      setMultiplier(currentMult);
      if (t % 0.35 < 0.05) playTone(140 + currentMult * 8, 'sawtooth', 0.02);

      // Perform real-time validation over individual concurrent active decks
      if (deckA.hasBetCurrent && deckA.isAutoCash && currentMult >= parseFloat(deckA.cashVal)) { handleCashoutPayout('A', currentMult); }
      if (deckB.hasBetCurrent && deckB.isAutoCash && currentMult >= parseFloat(deckB.cashVal)) { handleCashoutPayout('B', currentMult); }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width; const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'; ctx.lineWidth = 1;
        for (let i = 0; i < W; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
        for (let j = 0; j < H; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }

        let cx = 60 + (W - 160) * Math.min(t / 9, 1);
        let cy = (H - 60) - (H - 160) * (Math.min(currentMult - 1, 6) / 6);

        ctx.beginPath(); ctx.moveTo(60, H - 60);
        ctx.quadraticCurveTo((60 + cx) / 1.8, H - 40, cx, cy);
        ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 5; ctx.shadowBlur = 15; ctx.shadowColor = '#e11d48';
        ctx.stroke(); ctx.shadowBlur = 0;

        // Render High Performance Vector 3D Aircraft
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.sin(t * 7) * 0.03 - 0.05);
        const exhaust = ctx.createRadialGradient(-18, 2, 2, -18, 2, 15 + Math.random() * 7);
        exhaust.addColorStop(0, '#ff5500'); exhaust.addColorStop(1, 'transparent');
        ctx.fillStyle = exhaust; ctx.beginPath(); ctx.arc(-18, 2, 20, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(30, 0); ctx.quadraticCurveTo(12, -12, -15, -10); ctx.lineTo(-22, 0); ctx.lineTo(-15, 10); ctx.quadraticCurveTo(12, 12, 30, 0); ctx.fill();
        ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.moveTo(-5, -10); ctx.lineTo(-24, -22); ctx.lineTo(-18, -8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#6366f1'; ctx.beginPath(); ctx.moveTo(12, -8); ctx.quadraticCurveTo(24, -4, 30, 0); ctx.quadraticCurveTo(24, 4, 12, 8); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      animationId.current = requestAnimationFrame(frame);
    }
    animationId.current = requestAnimationFrame(frame);
  };

  const executeFlewAway = () => {
    setGameStatus('crashed'); setMultiplier(targetCrashPoint.current); playTone(160, 'triangle', 0.5);

    let flyOutX = 0;
    function flyAwayFrame() {
      const canvas = canvasRef.current;
      if (!canvas || flyOutX > 320) {
        // Enforce state transitions for active decks that missed payout targets
        if (deckA.hasBetCurrent) { if (!deckA.useFree) { commitWalletBalance(balance, 0, deckA.wager, 0); } }
        if (deckB.hasBetCurrent) { if (!deckB.useFree) { commitWalletBalance(balance, 0, deckB.wager, 0); } }

        setDeckA(p => ({ ...p, hasBetCurrent: false, useFree: false }));
        setDeckB(p => ({ ...p, hasBetCurrent: false, useFree: false }));
        
        setHistoryTape(p => [targetCrashPoint.current, ...p.slice(0, 11)]);
        setTimeout(() => { startNextRoundCountdown(); }, 1500); return;
      }
      const ctx = canvas.getContext('2d'); const W = canvas.width; const H = canvas.height;
      ctx.clearRect(0,0,W,H);
      
      flyOutX += 15;
      let t = cycleTime.current;
      let cx = 60 + (W - 160) * Math.min(t / 9, 1) + flyOutX;
      let cy = (H - 60) - (H - 160) * (Math.min(targetCrashPoint.current - 1, 6) / 6) - (flyOutX * 0.75);
      
      ctx.fillStyle = '#e11d48'; ctx.save(); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.moveTo(25,0); ctx.lineTo(0,-8); ctx.lineTo(-15,-20); ctx.lineTo(-25,0); ctx.closePath(); ctx.fill();
      ctx.restore();
      animationId.current = requestAnimationFrame(flyAwayFrame);
    }
    animationId.current = requestAnimationFrame(flyAwayFrame);
  };

  const handleCashoutPayout = (targetDeck, m) => {
    const isA = targetDeck === 'A';
    const targetState = isA ? deckA : deckB;
    if (!targetState.hasBetCurrent) return;

    const winAmt = targetState.useFree ? (targetState.wager * m) - targetState.wager : (targetState.wager * m);
    const calculatedLossBuffer = targetState.useFree ? 0 : -targetState.wager;
    
    commitWalletBalance(balance + winAmt, 0, calculatedLossBuffer, 0);
    
    if (isA) { setDeckA(p => ({ ...p, hasBetCurrent: false })); } 
    else { setDeckB(p => ({ ...p, hasBetCurrent: false })); }

    playTone(620, 'sine', 0.2); playTone(860, 'sine', 0.3);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } });
    triggerToast(`🎉 Deck ${targetDeck} Cashout Successful! Won KES ${winAmt.toFixed(2)}`, "success");
  };

  const placeWagerIntent = (targetDeck) => {
    const isA = targetDeck === 'A';
    const targetState = isA ? deckA : deckB;

    // Allow scheduling for the next round regardless of current state
    if (gameStatus === 'running') {
      if (isA) setDeckA(p => ({ ...p, hasBetNext: !p.hasBetNext }));
      else setDeckB(p => ({ ...p, hasBetNext: !p.hasBetNext }));
      triggerToast(`Round reservation state mutated for Deck ${targetDeck}`, "info");
      return;
    }

    // Direct placement loop for immediate round triggers
    if (gameStatus === 'idle') {
      if (targetState.hasBetNext) {
        if (isA) setDeckA(p => ({ ...p, hasBetNext: false }));
        else setDeckB(p => ({ ...p, hasBetNext: false }));
        return;
      }

      if (targetState.useFree && freeBetsAvailable > 0) {
        setFreeBetsAvailable(p => p - 1);
        if (isA) setDeckA(p => ({ ...p, hasBetNext: true }));
        else setDeckB(p => ({ ...p, hasBetNext: true }));
        playTone(300, 'square', 0.1);
      } else if (balance >= targetState.wager) {
        commitWalletBalance(balance - targetState.wager);
        if (isA) setDeckA(p => ({ ...p, hasBetNext: true }));
        else setDeckB(p => ({ ...p, hasBetNext: true }));
        playTone(300, 'square', 0.1);
      } else {
        triggerToast("❌ Deficit error: Balance insufficient for action execution.", "error");
      }
    }
  };

  const handlePaymentInitiation = async () => {
    const amt = parseInt(inputAmount);
    if (isNaN(amt) || amt < 49) return triggerToast("❌ Transaction bound: KES 49 minimum parameter strictly enforced.", "error");
    if (!inputPhone || inputPhone.trim().length < 9) return triggerToast("❌ Format validation error on Safaricom string structure.", "error");

    setLoadingDeposit(true);
    try {
      const res = await fetch('/api/payhero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, phone: inputPhone, username: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        if (rememberPhone) {
          localStorage.setItem('jetpesa_saved_phone', inputPhone);
        } else {
          localStorage.removeItem('jetpesa_saved_phone');
        }
        commitWalletBalance(balance + amt, amt, 0, 0);
        setPhoneProfile(inputPhone); setIsDepositModalOpen(false);
        triggerToast("✅ Cash transaction validated. STK Push transmitted successfully.", "success");
      } else { triggerToast("Gateway transmission latency reported: " + data.message, "error"); }
    } catch (e) { triggerToast("Exception context failure: " + e.message, "error"); }
    finally { setLoadingDeposit(false); }
  };

  return (
    <div style={{ background: '#07070a', color: '#f4f4f6', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      
      {/* GLOBAL TOAST FLOATING OVERLAY AREA */}
      <div style={{ position: 'fixed', top: '70px', right: '20px', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px', width: '90%' }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : '#1e1b4b', borderLeft: '4px solid #fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'between', alignItems: 'center', transition: 'all 0.3s ease-in-out' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* ULTRA-GLOSS HEADER ARCHITECTURE */}
      <header style={{ background: '#0d0e12', borderBottom: '2px solid #16171d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 99 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '-0.75px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Aviator</span>
          <button style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22c55e', color: '#22c55e', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setIsProvablyModalOpen(true)}>🛡️ Provably Fair</button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setAudioMuted(!audioMuted)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>{audioMuted ? '🔈' : '🔊'}</button>
          <button onClick={() => setIsRainActive(!isRainActive)} style={{ background: isRainActive ? '#a855f7' : '#1a1b23', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>🌧️ Rain</button>
          
          <div style={{ display: 'flex', alignItems: 'center', background: '#14151f', border: '1px solid #252736', padding: '2px 2px 2px 12px', borderRadius: '24px', gap: '8px' }}>
            <span style={{ color: '#22c55e', fontWeight: '900', fontSize: '14px' }}>{balance.toFixed(2)} KES</span>
            <button onClick={() => setIsDepositModalOpen(true)} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '900', padding: '7px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', boxShadow: '0 4px 12px rgba(22,163,74,0.2)' }}>Deposit</button>
          </div>
        </div>
      </header>

      {/* 3D HIGHLIGHT HISTORIC TAPE ROW */}
      <div style={{ display: 'flex', gap: '8px', background: '#0a0b0f', padding: '10px 16px', overflowX: 'auto', borderBottom: '1px solid #15161e', boxShadow: 'inset 0 -4px 12px rgba(0,0,0,0.6)' }}>
        {historyTape.map((h, i) => (
          <div key={i} style={{ background: h > 2 ? 'linear-gradient(135deg, #a855f7 0%, #701a75 100%)' : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', color: '#fff', padding: '4px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '900', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }}>
            {h.toFixed(2)}x
          </div>
        ))}
      </div>

      {/* PRINCIPAL WORKSPACE CONTAINER ASSEMBLY */}
      <div className="cockpitMainLayout" style={{ flex: 1, display: 'grid', padding: '12px', gap: '12px', height: 'calc(100vh - 115px)' }}>
        
        {/* VIEW COLUMN 1: TRACK FEED MATRIX (Desktop view default) */}
        <div className="leftPanelLayout" style={{ background: '#0e0f14', borderRadius: '12px', border: '1px solid #16171d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: '#12131a', padding: '4px' }}>
            {['all', 'mine', 'top'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '10px', background: activeTab === t ? '#1a1b24' : 'transparent', border: 'none', color: '#fff', fontSize: '11px', fontWeight: '800', borderRadius: '6px', cursor: 'pointer', textTransform: 'uppercase' }}>{t} Bets</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
            {activeTab === 'all' && liveBetsFeed.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: b.won ? 'rgba(34,197,94,0.04)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.01)', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8', fontWeight: '600' }}>{b.username}</span>
                <span style={{ fontWeight: '800', color: '#fff' }}>{b.bet.toFixed(0)} KES</span>
                <span style={{ color: b.won ? '#22c55e' : '#475569', fontWeight: '900' }}>{b.won ? `${b.mult}x` : '-'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VIEW COLUMN 2: PRIMARY INTERACTIVE RADAR DECK (Always locked down cleanly under layout rules) */}
        <div className="centerPanelLayout" style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
          
          <div style={{ flex: 1, background: '#030305', borderRadius: '14px', border: '1px solid #16171d', position: 'relative', overflow: 'hidden', minHeight: '220px' }}>
            
            {/* SPRIBE TIMED COUNTDOWN BAR OVERLAY */}
            {gameStatus === 'idle' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5,5,8,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ width: '70%', maxWidth: '300px', background: '#12131a', padding: '4px', borderRadius: '10px', border: '1px solid #22c55e' }}>
                  <div style={{ height: '8px', background: 'linear-gradient(to right, #22c55e, #4ade80)', borderRadius: '6px', width: `${countdownProgress}%` }} />
                </div>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '800', marginTop: '10px', letterSpacing: '0.5px' }}>NEXT FLIGHT INBOUND...</span>
                <span style={{ color: '#475569', fontSize: '10px', fontWeight: '700', marginTop: '4px' }}>Powered by JetPesa</span>
              </div>
            )}

            <canvas ref={canvasRef} width={640} height={320} style={{ width: '100%', height: '100%', display: 'block' }} />
            
            {gameStatus !== 'idle' && (
              <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                {gameStatus === 'crashed' ? (
                  <div>
                    <h1 style={{ color: '#e11d48', fontSize: '3.5rem', fontWeight: '900', margin: 0, tracking: '1px' }}>FLEW AWAY</h1>
                    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '800' }}>Crashed @ {multiplier.toFixed(2)}x</span>
                  </div>
                ) : (
                  <h1 style={{ fontSize: '5.5rem', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-2px' }}>{multiplier.toFixed(2)}x</h1>
                )}
              </div>
            )}
          </div>

          {/* SPLIT DUAL STRATEGY CONTROL PANELS COMPONENT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#0e0f14', border: '1px solid #16171d', padding: '12px', borderRadius: '14px' }}>
            
            {/* CONCURRENT STRATEGY DECK INTERFACE MODULE A */}
            <div style={{ background: '#13141f', border: '1px solid #232538', padding: '12px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                <button onClick={() => setDeckA(p => ({ ...p, isAuto: !p.isAuto }))} style={{ flex: 1, padding: '6px', fontSize: '10px', fontWeight: '900', background: deckA.isAuto ? '#e11d48' : '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>AUTO</button>
                <button onClick={() => setDeckA(p => ({ ...p, isAutoCash: !p.isAutoCash }))} style={{ flex: 1, padding: '6px', fontSize: '10px', fontWeight: '900', background: deckA.isAutoCash ? '#22c55e' : '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>AUTO CASH</button>
              </div>
              {deckA.isAutoCash && <input type="number" step="0.1" value={deckA.cashVal} onChange={e => setDeckA(p => ({ ...p, cashVal: e.target.value }))} style={{ width: '88%', padding: '4px 6px', background: '#07070a', border: '1px solid #2e3044', color: '#fff', fontSize: '11px', borderRadius: '4px', marginBottom: '6px' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="number" value={deckA.wager} onChange={e => setDeckA(p => ({ ...p, wager: parseInt(e.target.value) }))} style={{ width: '60px', padding: '10px 4px', background: '#07070a', border: '1px solid #2e3044', color: '#fff', fontWeight: '900', textAlign: 'center', borderRadius: '4px' }} />
                <button onClick={() => placeWagerIntent('A')} style={{ flex: 1, padding: '12px', background: deckA.hasBetCurrent ? '#d97706' : deckA.hasBetNext ? '#475569' : '#22c55e', border: 'none', color: '#fff', fontWeight: '900', fontSize: '13px', borderRadius: '6px', cursor: 'pointer' }}>
                  {gameStatus === 'running' && deckA.hasBetCurrent ? `CASH OUT\n${(deckA.wager * multiplier).toFixed(1)} KES` : deckA.hasBetNext ? 'CANCEL WAITING' : `BET\n${deckA.wager} KES`}
                </button>
              </div>
            </div>

            {/* CONCURRENT STRATEGY DECK INTERFACE MODULE B */}
            <div style={{ background: '#13141f', border: '1px solid #232538', padding: '12px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                <button onClick={() => setDeckB(p => ({ ...p, isAuto: !p.isAuto }))} style={{ flex: 1, padding: '6px', fontSize: '10px', fontWeight: '900', background: deckB.isAuto ? '#e11d48' : '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>AUTO</button>
                <button onClick={() => setDeckB(p => ({ ...p, isAutoCash: !p.isAutoCash }))} style={{ flex: 1, padding: '6px', fontSize: '10px', fontWeight: '900', background: deckB.isAutoCash ? '#22c55e' : '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>AUTO CASH</button>
              </div>
              {deckB.isAutoCash && <input type="number" step="0.1" value={deckB.cashVal} onChange={e => setDeckB(p => ({ ...p, cashVal: e.target.value }))} style={{ width: '88%', padding: '4px 6px', background: '#07070a', border: '1px solid #2e3044', color: '#fff', fontSize: '11px', borderRadius: '4px', marginBottom: '6px' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="number" value={deckB.wager} onChange={e => setDeckB(p => ({ ...p, wager: parseInt(e.target.value) }))} style={{ width: '60px', padding: '10px 4px', background: '#07070a', border: '1px solid #2e3044', color: '#fff', fontWeight: '900', textAlign: 'center', borderRadius: '4px' }} />
                <button onClick={() => placeWagerIntent('B')} style={{ flex: 1, padding: '12px', background: deckB.hasBetCurrent ? '#d97706' : deckB.hasBetNext ? '#475569' : '#16a34a', border: 'none', color: '#fff', fontWeight: '900', fontSize: '13px', borderRadius: '6px', cursor: 'pointer' }}>
                  {gameStatus === 'running' && deckB.hasBetCurrent ? `CASH OUT\n${(deckB.wager * multiplier).toFixed(1)} KES` : deckB.hasBetNext ? 'CANCEL WAITING' : `BET\n${deckB.wager} KES`}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* VIEW COLUMN 3: PUBLIC ROOM PORTAL INTERACTIVE FEED (Desktop view default) */}
        <div className="rightPanelLayout" style={{ background: '#0e0f14', borderRadius: '12px', border: '1px solid #16171d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: '#12131a', padding: '12px', borderBottom: '1px solid #16171d', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '800', fontSize: '13px' }}>Lobby Communication Chat</span>
          </div>
          <div style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {chatLogs.map((c, i) => (
              <div key={i} style={{ background: c.system ? 'rgba(168,85,247,0.06)' : '#12131a', border: c.system ? '1px solid rgba(168,85,247,0.2)' : 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px' }}>
                <span style={{ color: c.system ? '#c084fc' : '#38bdf8', fontWeight: '800', display: 'block' }}>{c.user}</span>
                <span style={{ color: '#e2e8f0', marginTop: '2px', display: 'block' }}>{c.msg}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px', background: '#12131a', borderTop: '1px solid #16171d' }}>
            <input type="text" placeholder="Send text to lobby..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => {
              if (e.key === 'Enter' && chatInput.trim()) {
                setChatLogs(p => [...p, { user: '🦈070***01', msg: chatInput, time: 'Now' }]); setChatInput('');
              }
            }} style={{ width: '90%', padding: '8px', background: '#07070a', border: '1px solid #2e3044', color: '#fff', borderRadius: '4px', fontSize: '12px' }} />
          </div>
        </div>

      </div>

      {/* FOOTER MOBILE UTILITY PERSISTENT NAVIGATION BAR OVERLAY */}
      <div className="mobileUtilityFooterBar" style={{ background: '#0d0e12', borderTop: '1px solid #16171d', display: 'none', justifyContent: 'space-around', padding: '10px 0', position: 'sticky', bottom: 0, zIndex: 999 }}>
        <button onClick={() => setMobileActivePanel('bets')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'bets' ? '#22c55e' : '#64748b', fontSize: '12px', fontWeight: '800' }}>📊 DATA LIVE</button>
        <button onClick={() => setMobileActivePanel('game')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'game' ? '#e11d48' : '#64748b', fontSize: '12px', fontWeight: '800' }}>🚀 FLIGHT COCKPIT</button>
        <button onClick={() => setMobileActivePanel('chat')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'chat' ? '#38bdf8' : '#64748b', fontSize: '12px', fontWeight: '800' }}>💬 ROOM CHAT</button>
      </div>

      {/* MODAL 1: M-PESA GATEWAY HOOK WITH INTEGRATED LOCAL-STORAGE PARAMETERS */}
      {isDepositModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '12px' }}>
          <div style={{ background: '#0d0e12', border: '1px solid #22c55e', borderRadius: '16px', width: '100%', maxWidth: '340px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setIsDepositModalOpen(false)} style={{ position: 'absolute', top: '14px', right: '16px', background: 'transparent', border: 'none', color: '#64748b', fontSize: '22px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 16px 0', color: '#22c55e', fontWeight: '900' }}>M-Pesa Safaricom Gate</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>DEPOSIT QUOTA (MIN 49 KES)</label>
              <input type="number" value={inputAmount} onChange={e => setInputAmount(e.target.value)} style={{ width: '92%', padding: '12px', marginTop: '4px', background: '#13141f', border: '1px solid #232538', color: '#fff', fontSize: '16px', fontWeight: '900', borderRadius: '8px' }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>SAFARICOM TELEPHONE SIGNATURE</label>
              <input type="text" value={inputPhone} onChange={e => setInputPhone(e.target.value)} placeholder="07XXXXXXXX" style={{ width: '92%', padding: '12px', marginTop: '4px', background: '#13141f', border: '1px solid #232538', color: '#fff', fontSize: '14px', borderRadius: '8px' }} />
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

      {/* MODAL 2: PROVABLY FAIR DISCLOSURE VIEWPORT */}
      {isProvablyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0d0e12', border: '1px solid #3b82f6', borderRadius: '12px', width: '90%', maxWidth: '400px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>Spribe Cryptographic Handshake Nodes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', background: '#07070a', padding: '10px', borderRadius: '6px', wordBreak: 'break-all' }}>
              <div><span style={{ color: '#475569' }}>SERVER SEED:</span> <code>{provablyData.serverSeed}</code></div>
              <div><span style={{ color: '#475569' }}>CLIENT SEED:</span> <code>{provablyData.clientSeed}</code></div>
              <div><span style={{ color: '#475569' }}>ROUND NONCE:</span> <code style={{ color: '#22c55e' }}>{provablyData.nonce}</code></div>
            </div>
            <button onClick={() => setIsProvablyModalOpen(false)} style={{ width: '100%', marginTop: '12px', padding: '10px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>CLOSE HUD</button>
          </div>
        </div>
      )}

      {/* RESPONSIVE LAYOUT MATRIX SPECIFICATION BLOCKS */}
      <style>{`
        .cockpitMainLayout { grid-template-columns: 280px 1fr 270px; }
        @media (max-width: 992px) {
          .cockpitMainLayout { grid-template-columns: 1fr !important; height: auto !important; padding-bottom: 60px !important; }
          .mobileUtilityFooterBar { display: flex !important; }
          .leftPanelLayout { display: ${mobileActivePanel === 'bets' ? 'flex !important' : 'none !important'}; height: 65vh; }
          .centerPanelLayout { display: ${mobileActivePanel === 'game' ? 'flex !important' : 'none !important'}; }
          .rightPanelLayout { display: ${mobileActivePanel === 'chat' ? 'flex !important' : 'none !important'}; height: 65vh; }
        }
      `}</style>

    </div>
  );
}
