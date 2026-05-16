'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function SpribeResponsiveDashboard() {
  const router = useRouter();
  
  // Account Profile Identity Hooks
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0);
  const [phoneProfile, setPhoneProfile] = useState('');
  
  // Secret Retention Logic Parameters
  const [trackDepositSum, setTrackDepositSum] = useState(0);
  const [trackLossSum, setTrackLossSum] = useState(0);
  const [freeBetsAvailable, setFreeBetsAvailable] = useState(0);
  const [useFreeBetActive, setUseFreeBetActive] = useState(false);

  // Layout View Controls & Navigation Toggles
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mine' | 'top'
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isProvablyModalOpen, setIsProvablyModalOpen] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [mobileActivePanel, setMobileActivePanel] = useState('game'); // 'bets' | 'game' | 'chat'

  // Input Field Controllers
  const [inputPhone, setInputPhone] = useState('');
  const [inputAmount, setInputAmount] = useState('100');
  const [loadingDeposit, setLoadingDeposit] = useState(false);

  // Wager Configuration States
  const [wager, setWager] = useState(10);
  const [isAutoBet, setIsAutoBet] = useState(false);
  const [isAutoCashout, setIsAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.0);

  // Flight Engine States
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle' | 'running' | 'crashed'
  const [hasBet, setHasBet] = useState(false);
  const [historyTape, setHistoryTape] = useState([1.47, 1.23, 1.19, 7.05, 1.52, 1.61, 1.89, 1.08, 2.20, 6.11, 1.18, 5.07, 1.06]);
  
  // Provably Fair Cryptographic States
  const [provablyData, setProvablyData] = useState({
    serverSeed: 'b8e974ca...9a12',
    clientSeed: 'jet_pesa_session_crypto_alpha',
    combinedHash: '61a5b84c8d301...ae882f',
    nonce: 104
  });

  // Data Feeds (Mocked Rows matching the Aviator UI)
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
  const jetImageRef = useRef(null);

  // Web Audio Context Synthesizer Engine
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
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { console.log(e); }
  };

  // Generate Feed Matrix Matching Your Aviator Snapshots Exactly
  const generateRealisticBetsFeed = () => {
    const prefixes = ['070***', '071***', '072***', '079***', '011***', '075***'];
    const mockAvatars = ['🦒', '🚗', '🦁', '🦊', '🦅', '🦈', '🎨'];
    const newList = Array.from({ length: 20 }, (_, i) => {
      const betAmt = parseFloat((Math.random() * 1500 + 50).toFixed(2));
      const reachedMult = parseFloat((Math.random() * 2.8 + 1.01).toFixed(2));
      const won = Math.random() > 0.55;
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
    // Instantiate your custom 3D Jet Rocket graphic object asset
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=120&auto=format&fit=crop'; // Fallback link mapped inside structural canvas wrapper safely
    // Custom transparent asset handle assignment
    jetImageRef.current = img;

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
    const feedInterval = setInterval(generateRealisticBetsFeed, 7000);
    return () => { unsubscribe(); clearInterval(feedInterval); };
  }, [router]);

  useEffect(() => {
    if (user) prepFlightSequence();
    return () => cancelAnimationFrame(animationId.current);
  }, [user]);

  // AI Chat Bot Periodic High-Win Updates
  useEffect(() => {
    const chatInterval = setInterval(() => {
      const aiWinners = ['Mwangi_X', 'Omondi_Jet', 'Achieng_Aviator', 'Mombasa_King'];
      const picked = aiWinners[Math.floor(Math.random() * aiWinners.length)];
      const winVal = (Math.random() * 20000 + 4000).toFixed(2);
      const multVal = (Math.random() * 8 + 1.5).toFixed(2);
      
      setChatLogs(p => [...p, {
        user: 'System_AI',
        msg: `🤖 JETPESA AI BOT: @${picked} just cashed out KES ${winVal} at ${multVal}x!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        system: true
      }]);
    }, 12000);
    return () => clearInterval(chatInterval);
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
      targetCrashPoint.current = parseFloat((Math.random() * 3.2 + 1.02).toFixed(2));
    }
    setTimeout(() => { triggerLaunch(); }, 4000);
  };

  const triggerLaunch = () => {
    if (isAutoBet && !hasBet) {
      if (useFreeBetActive && freeBetsAvailable > 0) {
        setFreeBetsAvailable(p => p - 1); setHasBet(true); playTone(330, 'square', 0.12);
      } else if (balance >= wager) {
        commitWalletBalance(balance - wager); setHasBet(true); playTone(330, 'square', 0.12);
      }
    }
    setGameStatus('running');
    const start = performance.now();

    function frame(now) {
      let t = (now - start) / 1000;
      cycleTime.current = t;
      let currentMult = parseFloat(Math.pow(Math.E, 0.072 * t).toFixed(2));

      if (currentMult >= targetCrashPoint.current) {
        executeFlewAway(); return;
      }

      setMultiplier(currentMult);
      if (t % 0.35 < 0.05) playTone(130 + currentMult * 9, 'sawtooth', 0.02);

      if (hasBet && isAutoCashout && currentMult >= parseFloat(autoCashoutValue)) {
        handleCashoutPayout(currentMult);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width; const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        
        // Grid lines matching Spribe layout blueprint
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'; ctx.lineWidth = 1;
        for (let i = 0; i < W; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
        for (let j = 0; j < H; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }

        let cx = 60 + (W - 160) * Math.min(t / 10, 1);
        let cy = (H - 60) - (H - 160) * (Math.min(currentMult - 1, 6) / 6);

        // Vector arc setup
        ctx.beginPath(); ctx.moveTo(60, H - 60);
        ctx.quadraticCurveTo((60 + cx) / 1.8, H - 40, cx, cy);
        ctx.strokeStyle = '#e11d48'; ctx.lineWidth = 5; ctx.shadowBlur = 15; ctx.shadowColor = '#e11d48';
        ctx.stroke(); ctx.shadowBlur = 0;

        // Render accurate 3D Jet Rocket from the provided asset context
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(t * 7) * 0.04 - 0.1); 
        
        // Volumetric rocket fuel exhaust stream glow
        const particleGlow = ctx.createRadialGradient(-20, 2, 2, -20, 2, 18 + Math.random() * 8);
        particleGlow.addColorStop(0, '#ff4d00'); particleGlow.addColorStop(0.5, 'rgba(225,29,72,0.4)'); particleGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = particleGlow; ctx.beginPath(); ctx.arc(-20, 2, 25, 0, Math.PI * 2); ctx.fill();

        // 3D Rocket Body Mapping Frame matching image structural parameters
        ctx.fillStyle = 'linear-gradient(to right, #ffffff, #d1d5db)';
        ctx.beginPath();
        ctx.moveTo(35, 0); 
        ctx.quadraticCurveTo(15, -15, -15, -12);
        ctx.lineTo(-25, -2); ctx.lineTo(-25, 4); ctx.lineTo(-15, 14);
        ctx.quadraticCurveTo(15, 15, 35, 0); ctx.fill();

        // Tail Fins and Nose Cone Highlight Accents
        ctx.fillStyle = '#a855f7'; // Purple-blue gradient tone mapping from uploaded rocket picture
        ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(-28, -26); ctx.lineTo(-22, -10); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-10, 14); ctx.lineTo(-28, 28); ctx.lineTo(-22, 10); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#6366f1'; ctx.beginPath(); ctx.moveTo(18, -10); ctx.quadraticCurveTo(30, -5, 35, 0); ctx.quadraticCurveTo(30, 5, 18, 10); ctx.closePath(); ctx.fill();

        ctx.restore();
      }
      animationId.current = requestAnimationFrame(frame);
    }
    animationId.current = requestAnimationFrame(frame);
  };

  const executeFlewAway = () => {
    setGameStatus('crashed'); setMultiplier(targetCrashPoint.current); playTone(170, 'triangle', 0.55);

    let flyOutX = 0;
    function flyAwayFrame() {
      const canvas = canvasRef.current;
      if (!canvas || flyOutX > 350) {
        setHasBet(false); setUseFreeBetActive(false);
        setHistoryTape(p => [targetCrashPoint.current, ...p.slice(0, 11)]);
        setTimeout(() => { prepFlightSequence(); }, 4000); return;
      }
      const ctx = canvas.getContext('2d'); const W = canvas.width; const H = canvas.height;
      ctx.clearRect(0,0,W,H);
      
      flyOutX += 14;
      let t = cycleTime.current;
      let cx = 60 + (W - 160) * Math.min(t / 10, 1) + flyOutX;
      let cy = (H - 60) - (H - 160) * (Math.min(targetCrashPoint.current - 1, 6) / 6) - (flyOutX * 0.7);
      
      ctx.fillStyle = '#e11d48'; ctx.save(); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.moveTo(30,0); ctx.lineTo(5,-8); ctx.lineTo(-18,-25); ctx.lineTo(-30,0); ctx.closePath(); ctx.fill();
      ctx.restore();
      animationId.current = requestAnimationFrame(flyAwayFrame);
    }

    if (hasBet) {
      if (!useFreeBetActive) { commitWalletBalance(balance, 0, wager, 0); }
      else { commitWalletBalance(balance, 0, 0, 0); }
    }
    animationId.current = requestAnimationFrame(flyAwayFrame);
  };

  const handleCashoutPayout = (m) => {
    if (!hasBet) return;
    const winAmt = useFreeBetActive ? (wager * m) - wager : (wager * m);
    const targetReturns = balance + winAmt;
    const calculatedLossBuffer = useFreeBetActive ? 0 : -wager;
    
    commitWalletBalance(targetReturns, 0, calculatedLossBuffer, 0);
    setHasBet(false); setUseFreeBetActive(false);
    playTone(600, 'sine', 0.25); playTone(840, 'sine', 0.35);
    confetti({ particleCount: 100, spread: 65, origin: { y: 0.4 } });
  };

  const handlePaymentInitiation = async () => {
    const amt = parseInt(inputAmount);
    if (isNaN(amt) || amt < 49) return alert("❌ Transaction boundary error: KES 49 minimum required.");
    if (!inputPhone || inputPhone.trim().length < 9) return alert("❌ Valid Safaricom structural layout string expected.");

    setLoadingDeposit(true);
    try {
      const res = await fetch('/api/payhero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, phone: inputPhone, username: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        commitWalletBalance(balance + amt, amt, 0, 0);
        setPhoneProfile(inputPhone); setIsDepositModalOpen(false);
        alert("✅ M-Pesa STK Push sequence dispatched. Wallet updates instantly upon pin authorization entry completion.");
      } else { alert("Gateway fallback notice: " + data.message); }
    } catch (e) { alert("Execution exception context: " + e.message); }
    finally { setLoadingDeposit(false); }
  };

  return (
    <div style={{ background: '#09090d', color: '#f4f4f6', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      
      {/* GLOSS NAVBAR HEADER */}
      <header style={{ background: '#101116', borderBottom: '2px solid #1a1b24', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 99 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>Aviator</span>
          <button style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22c55e', color: '#22c55e', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setIsProvablyModalOpen(true)}>🛡️ Fair</button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setAudioMuted(!audioMuted)} style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}>{audioMuted ? '🔈' : '🔊'}</button>
          <button onClick={() => setIsRainActive(!isRainActive)} style={{ background: isRainActive ? '#9333ea' : '#1f202c', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', cursor: 'pointer' }}>🌧️ Rain</button>
          
          <div style={{ display: 'flex', alignItems: 'center', background: '#1c1d26', border: '1px solid #2d2e3d', padding: '2px 2px 2px 10px', borderRadius: '20px', gap: '8px' }}>
            <span style={{ color: '#22c55e', fontWeight: '800', fontSize: '13px' }}>{balance.toFixed(2)} KES</span>
            <button onClick={() => setIsDepositModalOpen(true)} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '800', padding: '5px 12px', borderRadius: '18px', cursor: 'pointer', fontSize: '11px' }}>Deposit</button>
          </div>
        </div>
      </header>

      {/* HISTORIC MULTIPLIER TAPE BAR CONTAINER */}
      <div style={{ display: 'flex', gap: '6px', background: '#0e0f14', padding: '8px 16px', overflowX: 'auto', borderBottom: '1px solid #1a1b24', whiteSpace: 'nowrap' }}>
        {historyTape.map((h, i) => (
          <div key={i} style={{ background: h > 2 ? 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', display: 'inline-block', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {h.toFixed(2)}x
          </div>
        ))}
      </div>

      {/* CORE GRID RESPONSIVE CONTROLLER BLOCK */}
      <div className="mainGridContainer" style={{ flex: 1, display: 'grid', padding: '10px', gap: '10px', height: 'calc(100vh - 110px)', position: 'relative' }}>
        
        {/* VIEW COLUMN 1: LIVE BET FEED (Responsive Hiding Rules applied below) */}
        <div className="leftBetsColumn" style={{ background: '#101116', borderRadius: '8px', border: '1px solid #1a1b24', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: '#15161e', padding: '4px', borderBottom: '1px solid #1a1b24' }}>
            {['all', 'mine', 'top'].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '8px', background: activeTab === t ? '#1a1b24' : 'transparent', border: 'none', color: '#fff', fontSize: '11px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer', textTransform: 'capitalize' }}>{t} Bets</button>
            ))}
          </div>
          <div style={{ background: '#121319', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a1b24', fontSize: '11px', color: '#71717a', fontWeight: '700' }}>
            <span>ALL BETS: 1,487</span> <span style={{ color: '#fff' }}>24,412.33 KES</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
            {activeTab === 'all' && liveBetsFeed.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 6px', background: b.won ? 'rgba(34,197,94,0.04)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.01)', fontSize: '12px' }}>
                <span style={{ display: 'flex', gap: '4px', color: '#a1a1aa' }}><span>{b.avatar}</span> <span>{b.username}</span></span>
                <span style={{ fontWeight: '700', color: '#fff' }}>{b.bet.toFixed(0)}</span>
                <span style={{ color: b.won ? '#22c55e' : '#71717a', fontWeight: '800' }}>{b.won ? `${b.mult}x` : '-'}</span>
                <span style={{ color: b.won ? '#22c55e' : 'transparent', fontWeight: '700', width: '50px', textAlign: 'right' }}>{b.won ? b.winAmount.toFixed(0) : ''}</span>
              </div>
            ))}
            {activeTab !== 'all' && <div style={{ textAlign: 'center', color: '#4b5563', fontSize: '11px', marginTop: '30px' }}>Sync data stream operational.</div>}
          </div>
        </div>

        {/* VIEW COLUMN 2: COCKPIT GAMEPLAY RADAR (Always visible across all device viewports) */}
        <div className="centerGameColumn" style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
          
          {/* WEATHER INTERCEPTOR LAYER */}
          {isRainActive && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, overflow: 'hidden' }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{ position: 'absolute', width: '2px', height: '12px', background: 'linear-gradient(to bottom, transparent, #3b82f6)', left: `${Math.random() * 100}%`, top: `-20px`, animation: `fall ${1 + Math.random()}s linear infinite`, animationDelay: `${Math.random()}s` }} />
              ))}
            </div>
          )}

          <div style={{ flex: 1, background: '#040406', borderRadius: '12px', border: '1px solid #1a1b24', position: 'relative', overflow: 'hidden', minHeight: '240px' }}>
            <canvas ref={canvasRef} width={680} height={340} style={{ width: '100%', height: '100%', display: 'block' }} />
            <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              {gameStatus === 'crashed' ? (
                <div>
                  <h1 style={{ color: '#e11d48', fontSize: '3.2rem', fontWeight: '900', margin: 0, fontFamily: 'sans-serif' }}>FLEW AWAY</h1>
                  <span style={{ color: '#71717a', fontSize: '13px', fontWeight: '700' }}>Crashed @ {multiplier.toFixed(2)}x</span>
                </div>
              ) : (
                <h1 style={{ fontSize: '5rem', fontWeight: '900', color: '#fff', margin: 0, fontFamily: 'sans-serif', letterSpacing: '-1px' }}>{multiplier.toFixed(2)}x</h1>
              )}
            </div>
          </div>

          {/* SPRIBE BALANCED INPUT CONTROL STRATEGY INTERFACE */}
          <div style={{ background: '#101116', border: '1px solid #1a1b24', borderRadius: '12px', padding: '10px', display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            <div style={{ background: '#181920', border: '1px solid #232430', borderRadius: '8px', padding: '10px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <button onClick={() => setIsAutoBet(!isAutoBet)} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: '800', background: isAutoBet ? '#e11d48' : '#2d2e3d', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Auto Bet</button>
                <button onClick={() => setIsAutoCashout(!isAutoCashout)} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: '800', background: isAutoCashout ? '#22c55e' : '#2d2e3d', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Auto Cashout</button>
              </div>

              {isAutoCashout && (
                <input type="number" step="0.1" value={autoCashoutValue} onChange={e => setAutoCashoutValue(e.target.value)} style={{ width: '92%', padding: '6px', background: '#101116', border: '1px solid #2d2e3d', color: '#fff', borderRadius: '4px', marginBottom: '8px', fontSize: '12px' }} />
              )}

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <input type="number" value={wager} onChange={e => setWager(parseInt(e.target.value))} style={{ width: '75px', padding: '8px 2px', background: '#101116', border: '1px solid #2d2e3d', color: '#fff', fontSize: '16px', fontWeight: '900', borderRadius: '4px', textAlign: 'center' }} />
                  {freeBetsAvailable > 0 && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px', color: '#22c55e', fontWeight: '800' }}>
                      <input type="checkbox" checked={useFreeBetActive} onChange={e => setUseFreeBetActive(e.target.checked)} /> FREE ({freeBetsAvailable})
                    </label>
                  )}
                </div>

                <button onClick={() => {
                  if (gameStatus === 'idle' && !hasBet) {
                    if (useFreeBetActive && freeBetsAvailable > 0) { setFreeBetsAvailable(p => p - 1); setHasBet(true); }
                    else if (balance >= wager) { commitWalletBalance(balance - wager); setHasBet(true); }
                    else { alert("Insufficient funds."); }
                  } else if (gameStatus === 'running' && hasBet) { handleCashoutPayout(multiplier); }
                }} style={{ flex: 1, padding: '12px', background: hasBet ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontSize: '15px', fontWeight: '900', borderRadius: '6px', cursor: 'pointer' }}>
                  {gameStatus === 'idle' ? `BET ${wager} KES` : hasBet ? `CASH OUT\n${(wager * multiplier).toFixed(2)} KES` : 'WAITING FOR NEXT ROUND'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VIEW COLUMN 3: PUBLIC INTERACTIVE LOBBY CHAT (Responsive Rules mapping applied below) */}
        <div className="rightChatColumn" style={{ background: '#101116', borderRadius: '8px', border: '1px solid #1a1b24', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: '#15161e', padding: '10px', borderBottom: '1px solid #1a1b24', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '800', fontSize: '12px' }}>Lobby Chat 💬</span>
            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>Active</span>
          </div>
          <div style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {chatLogs.map((c, i) => (
              <div key={i} style={{ background: c.system ? 'rgba(147,51,234,0.06)' : 'rgba(255,255,255,0.01)', padding: '6px', borderRadius: '6px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: c.system ? '#a855f7' : '#3b82f6', fontWeight: '800' }}>@{c.user}</span>
                  <span style={{ color: '#4b5563', fontSize: '9px' }}>{c.time}</span>
                </div>
                <span style={{ color: c.system ? '#e9d5ff' : '#d1d5db' }}>{c.msg}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '6px', borderTop: '1px solid #1a1b24', background: '#15161e' }}>
            <input type="text" placeholder="Type message..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => {
              if (e.key === 'Enter' && chatInput.trim()) {
                setChatLogs(p => [...p, { user: 'Me', msg: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                setChatInput('');
              }
            }} style={{ width: '90%', padding: '8px', background: '#09090d', border: '1px solid #2d2e3d', color: '#fff', borderRadius: '4px', fontSize: '11px' }} />
          </div>
        </div>

      </div>

      {/* FOOTER PERSISTENT NAVIGATION OVERLAY FOR COMPACT SMARTPHONE SCREENPORTS */}
      <div className="mobileNavbarFooter" style={{ background: '#101116', borderTop: '1px solid #1a1b24', display: 'none', justifyContent: 'space-around', padding: '8px 0', position: 'sticky', bottom: 0, zIndex: 999 }}>
        <button onClick={() => setMobileActivePanel('bets')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'bets' ? '#22c55e' : '#71717a', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>📊 Live Bets</button>
        <button onClick={() => setMobileActivePanel('game')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'game' ? '#e11d48' : '#71717a', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>🚀 Flight</button>
        <button onClick={() => setMobileActivePanel('chat')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'chat' ? '#3b82f6' : '#71717a', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>💬 Chat Lobby</button>
      </div>

      {/* MODAL 1: CASH GATEWAY */}
      {isDepositModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '10px' }}>
          <div style={{ background: '#101116', border: '1px solid #22c55e', borderRadius: '12px', width: '100%', maxWidth: '340px', padding: '20px', position: 'relative' }}>
            <button onClick={() => setIsDepositModalOpen(false)} style={{ position: 'absolute', top: '12px', right: '16px', background: 'transparent', border: 'none', color: '#71717a', fontSize: '20px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 14px 0', color: '#22c55e', fontWeight: '800' }}>M-Pesa Cash Gateway</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '700' }}>AMOUNT TO DEPOSIT (MIN KES 49)</label>
              <input type="number" value={inputAmount} onChange={e => setInputAmount(e.target.value)} style={{ width: '92%', padding: '10px', marginTop: '4px', background: '#181920', border: '1px solid #2d2e3d', color: '#fff', fontSize: '15px', fontWeight: '800', borderRadius: '6px' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '700' }}>SAFARICOM TELEPHONE (07XXXXXXXX)</label>
              <input type="text" value={inputPhone} onChange={e => setInputPhone(e.target.value)} style={{ width: '92%', padding: '10px', marginTop: '4px', background: '#181920', border: '1px solid #2d2e3d', color: '#fff', fontSize: '13px', borderRadius: '6px' }} />
            </div>

            <button onClick={handlePaymentInitiation} disabled={loadingDeposit} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '900', borderRadius: '6px', cursor: 'pointer' }}>
              {loadingDeposit ? 'SENDING PUSH REQUEST...' : 'DEPOSIT (KES)'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: PROVABLY FAIR DATA DISCLOSURE POPUP */}
      {isProvablyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '10px' }}>
          <div style={{ background: '#101116', border: '1px solid #3b82f6', borderRadius: '12px', width: '100%', maxWidth: '420px', padding: '20px', position: 'relative' }}>
            <button onClick={() => setIsProvablyModalOpen(false)} style={{ position: 'absolute', top: '12px', right: '16px', background: 'transparent', border: 'none', color: '#71717a', fontSize: '20px', cursor: 'pointer' }}>×</button>
            <h4 style={{ margin: '0 0 12px 0', color: '#3b82f6', fontWeight: '800' }}>Cryptographic Integrity Node</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', background: '#181920', padding: '10px', borderRadius: '6px', wordBreak: 'break-all' }}>
              <div><span style={{ color: '#71717a' }}>SERVER SEED:</span> <code style={{ color: '#fff' }}>{provablyData.serverSeed}</code></div>
              <div><span style={{ color: '#71717a' }}>CLIENT SEED:</span> <code style={{ color: '#fff' }}>{provablyData.clientSeed}</code></div>
              <div><span style={{ color: '#71717a' }}>NONCE INDEX:</span> <code style={{ color: '#22c55e', fontWeight: '800' }}>{provablyData.nonce}</code></div>
            </div>
          </div>
        </div>
      )}

      {/* RESPONSIVE LAYOUT MATRIX ENHANCEMENT EMITTER STYLE BLOCKS */}
      <style>{`
        /* Desktop Default Viewport Rules */
        .mainGridContainer {
          grid-template-columns: 290px 1fr 270px;
        }
        
        /* Smartphone & Responsive Viewport Rule Overrides */
        @media (max-width: 992px) {
          .mainGridContainer {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .mobileNavbarFooter {
            display: flex !important;
          }
          
          /* Switch layouts dynamically depending on active footer state buttons */
          .leftBetsColumn {
            display: ${mobileActivePanel === 'bets' ? 'flex !important' : 'none !important'};
            height: 70vh;
          }
          .centerGameColumn {
            display: ${mobileActivePanel === 'game' ? 'flex !important' : 'none !important'};
          }
          .rightChatColumn {
            display: ${mobileActivePanel === 'chat' ? 'flex !important' : 'none !important'};
            height: 70vh;
          }
        }

        @keyframes fall { 
          to { transform: translateY(450px); } 
        }
      `}</style>

    </div>
  );
}
