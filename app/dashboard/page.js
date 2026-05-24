'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function UltimateJetPesaCockpit() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0);
  const [phoneProfile, setPhoneProfile] = useState('');
  const [rememberPhone, setRememberPhone] = useState(true);

  const [myBetsHistory, setMyBetsHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isProvablyModalOpen, setIsProvablyModalOpen] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [mobileActivePanel, setMobileActivePanel] = useState('game');

  const [toasts, setToasts] = useState([]);

  const [inputPhone, setInputPhone] = useState('');
  const [inputAmount, setInputAmount] = useState('100');
  const [loadingDeposit, setLoadingDeposit] = useState(false);

  const [deckA, setDeckA] = useState({
    wager: 10,
    isAuto: false,
    isAutoCash: false,
    cashVal: 2.0,
    hasBetNext: false,
    hasBetCurrent: false,
  });

  const [deckB, setDeckB] = useState({
    wager: 20,
    isAuto: false,
    isAutoCash: false,
    cashVal: 3.0,
    hasBetNext: false,
    hasBetCurrent: false,
  });

  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('idle');
  const [countdownProgress, setCountdownProgress] = useState(100);
  const [historyTape, setHistoryTape] = useState([
    1.47, 12.33, 1.19, 3.05, 1.52, 18.61, 1.89, 1.08, 2.2,
  ]);

  const canvasRef = useRef(null);
  const animationId = useRef(null);
  const chatEndRef = useRef(null);
  const audioCtxRef = useRef(null);
  const planeImageRef = useRef(null);

  const [activePlayersCount, setActivePlayersCount] = useState(3412);

  const playSynthesizedTone = (freq, type, duration, volume = 0.03) => {
    if (audioMuted) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + duration
      );

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log(e);
    }
  };

  const [liveBetsFeed, setLiveBetsFeed] = useState([]);
  const [chatLogs, setChatLogs] = useState([
    { user: '🦈071***45', msg: 'Admin, background rain drop claim active? 🙌', time: '08:02' },
    { user: '🦒072***89', msg: 'Leo tunakula rocket safi sana hapa JetPesa! 🤯', time: '08:04' },
    { user: '🦅079***12', msg: 'Nĩngwenda gũkĩria 10x rũũgĩ rũfĩfĩ rwa Deck B gaka!', time: '08:04' },
    { user: '🦁011***90', msg: 'Asego mar plane ni e ma duong’! Multiplier obiro thuth!', time: '08:05' },
  ]);

  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const svgPlane = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 180">
        <defs>
          <linearGradient id="bodyRed" x1="0" x2="1">
            <stop offset="0%" stop-color="#ff6b6b"/>
            <stop offset="45%" stop-color="#e11d48"/>
            <stop offset="100%" stop-color="#7f1d1d"/>
          </linearGradient>

          <linearGradient id="glass" x1="0" x2="1">
            <stop offset="0%" stop-color="#dbeafe"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>

          <filter id="shadow">
            <feDropShadow dx="0" dy="8" stdDeviation="8"
              flood-color="#000000"
              flood-opacity="0.45"/>
          </filter>
        </defs>

        <g filter="url(#shadow)" transform="rotate(-12 210 90)">
          <path d="M70 98 L12 60 L110 84 Z"
            fill="url(#bodyRed)"
            stroke="#111827"
            stroke-width="3"/>

          <path d="M150 104 L40 168 L290 116 Z"
            fill="url(#bodyRed)"
            stroke="#111827"
            stroke-width="4"/>

          <path d="
            M72 82
            C145 44, 270 40, 360 74
            C376 80, 376 96, 360 101
            C260 130, 142 125, 72 100
            C50 92, 50 88, 72 82 Z"
            fill="url(#bodyRed)"
            stroke="#111827"
            stroke-width="4"/>

          <path d="
            M112 95
            C175 84, 255 84, 340 92"
            stroke="#ffffff"
            stroke-width="5"
            opacity="0.45"
            fill="none"/>

          <path d="
            M160 68
            C190 48, 230 50, 252 72
            C222 78, 192 80, 160 68 Z"
            fill="url(#glass)"
            stroke="#111827"
            stroke-width="2"/>

          <path d="
            M78 82
            L48 28
            C76 28, 98 50, 105 80 Z"
            fill="url(#bodyRed)"
            stroke="#111827"
            stroke-width="4"/>

          <ellipse cx="362" cy="88" rx="22" ry="15"
            fill="#1e293b"
            stroke="#000"
            stroke-width="3"/>

          <circle cx="382" cy="88" r="10"
            fill="#d1d5db"
            stroke="#111827"
            stroke-width="3"/>

          <circle cx="384" cy="88" r="4"
            fill="#ffffff"
            opacity="0.8"/>
        </g>
      </svg>
    `;

    const img = new Image();
    img.src =
      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgPlane);

    planeImageRef.current = img;
  }, []);

  const triggerToast = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const generateFreshBetsFeed = () => {
    const px = ['070***', '071***', '072***', '079***', '011***', '074***', '010***'];
    const av = ['🦒', '🦁', '🦊', '🦅', '🦈', '🦏', '🐆', '🐊'];

    setActivePlayersCount(Math.floor(Math.random() * 1500 + 3000));

    setLiveBetsFeed(
      Array.from({ length: 25 }, () => ({
        username:
          av[Math.floor(Math.random() * av.length)] +
          px[Math.floor(Math.random() * px.length)] +
          Math.floor(Math.random() * 89 + 10),
        bet: Math.floor(Math.random() * 4800 + 100),
        mult: parseFloat((Math.random() * 1.8 + 1.02).toFixed(2)),
        won: Math.random() > 0.6,
      })).sort((a, b) => b.bet - a.bet)
    );
  };

  useEffect(() => {
    const savedPhone = localStorage.getItem('jetpesa_saved_phone');

    if (savedPhone) {
      setInputPhone(savedPhone);
      setPhoneProfile(savedPhone);
    }

    const unsubscribe = onAuthStateChanged(auth, async (curr) => {
      if (!curr) {
        router.push('/');
        return;
      }

      setUser(curr);

      const userDoc = await getDoc(doc(db, 'users', curr.uid));

      if (userDoc.exists()) {
        const d = userDoc.data();
        setBalance(d.walletBalance || 0.0);

        if (!savedPhone && d.mpesaPhone) {
          setPhoneProfile(d.mpesaPhone);
          setInputPhone(d.mpesaPhone);
        }
      }
    });

    generateFreshBetsFeed();

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs]);

  useEffect(() => {
    const chatPool = [
      { user: '🦊072***14', msg: 'Weh, plane irefuka maze, cash out haraka!' },
      { user: '🎨079***88', msg: 'Mũgĩthĩ ũũ no rũgendo rũranya gũgĩkũra na igũrũ.' },
      { user: '🦅011***23', msg: 'Anya tero mwandu nyaka polo! Retain control omera.' },
      { user: '🦁070***66', msg: 'Free bets admin please.....' },
      { user: '🦁072***99', msg: '50k innit! hii ni ingine mwechecheeee' },
       { user: '🦁010***45', msg: 'Wakuu mmenikula ata school fees, watu wanichangie please' },     
      { user: '🦈075***04', msg: 'Nimeweka 500 stake hapa, twende sasa kabla iland.' },
    ];

    const intervalChat = setInterval(() => {
      const picked = chatPool[Math.floor(Math.random() * chatPool.length)];
      setChatLogs((p) => [
        ...p,
        {
          ...picked,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }, 8000);

    return () => clearInterval(intervalChat);
  }, []);

  useEffect(() => {
    function runDistributedClockLoop() {
      const epochTimeMs = Date.now();
      const cycleInterval = 21000;
      const countdownInterval = 5000;
      const simulationWindow = 14000;

      const offsetMs = epochTimeMs % cycleInterval;

      if (offsetMs < countdownInterval) {
        if (gameStatus !== 'idle') {
          setGameStatus('idle');
          setMultiplier(1.0);
          playSynthesizedTone(440, 'triangle', 0.05, 0.03);
          generateFreshBetsFeed();
        }

        setCountdownProgress(
          ((countdownInterval - offsetMs) / countdownInterval) * 100
        );

        if (offsetMs % 1000 < 20) {
          playSynthesizedTone(320, 'sine', 0.03, 0.02);
        }

        setDeckA((prev) => {
          if (prev.hasBetNext && !prev.hasBetCurrent) {
            return {
              ...prev,
              hasBetCurrent: true,
              hasBetNext: prev.isAuto,
            };
          }

          return prev;
        });

        setDeckB((prev) => {
          if (prev.hasBetNext && !prev.hasBetCurrent) {
            return {
              ...prev,
              hasBetCurrent: true,
              hasBetNext: prev.isAuto,
            };
          }

          return prev;
        });
      } else if (offsetMs < countdownInterval + simulationWindow) {
        setGameStatus('running');

        const activeSeconds = (offsetMs - countdownInterval) / 1000;
        const computedMultiplier = parseFloat(
          Math.pow(Math.E, 0.078 * activeSeconds).toFixed(2)
        );

        const trackingIndex = Math.floor(epochTimeMs / cycleInterval);
        const dynamicCrashBound = parseFloat(
          (
            1.08 +
            (parseFloat(String(Math.sin(trackingIndex) * 1200).split('.')[1] || 4) %
              9.2)
          ).toFixed(2)
        );

        if (computedMultiplier >= dynamicCrashBound) {
          setGameStatus('crashed');
          setMultiplier(dynamicCrashBound);
          setDeckA((p) => ({ ...p, hasBetCurrent: false }));
          setDeckB((p) => ({ ...p, hasBetCurrent: false }));
        } else {
          setMultiplier(computedMultiplier);

          if (offsetMs % 300 < 20) {
            playSynthesizedTone(200 + computedMultiplier * 15, 'sine', 0.015, 0.012);
          }

          setDeckA((p) => {
            if (
              p.hasBetCurrent &&
              p.isAutoCash &&
              computedMultiplier >= parseFloat(p.cashVal)
            ) {
              triggerPayoutSequence('A', computedMultiplier, p);
              return { ...p, hasBetCurrent: false };
            }

            return p;
          });

          setDeckB((p) => {
            if (
              p.hasBetCurrent &&
              p.isAutoCash &&
              computedMultiplier >= parseFloat(p.cashVal)
            ) {
              triggerPayoutSequence('B', computedMultiplier, p);
              return { ...p, hasBetCurrent: false };
            }

            return p;
          });
        }
      } else {
        setGameStatus('crashed');

        const trackingIndex = Math.floor(epochTimeMs / cycleInterval);
        const dynamicCrashBound = parseFloat(
          (
            1.08 +
            (parseFloat(String(Math.sin(trackingIndex) * 1200).split('.')[1] || 4) %
              9.2)
          ).toFixed(2)
        );

        setMultiplier(dynamicCrashBound);
        setDeckA((p) => ({ ...p, hasBetCurrent: false }));
        setDeckB((p) => ({ ...p, hasBetCurrent: false }));
      }

      renderRadarCanvas(offsetMs, countdownInterval);
      animationId.current = requestAnimationFrame(runDistributedClockLoop);
    }

    animationId.current = requestAnimationFrame(runDistributedClockLoop);

    return () => cancelAnimationFrame(animationId.current);
  }, [deckA, deckB, gameStatus, balance, audioMuted]);

const renderRadarCanvas = (offsetMs, countdownLimit) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;

  for (let i = 0; i < W; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }

  for (let j = 0; j < H; j += 40) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(W, j);
    ctx.stroke();
  }

  if (offsetMs >= countdownLimit && gameStatus === 'running') {
    const secondsInAir = (offsetMs - countdownLimit) / 1000;

    const flightProgress = Math.min(secondsInAir / 11, 1);
    const smoothProgress = 1 - Math.pow(1 - flightProgress, 2.4);

    const multiplierLift = Math.min((multiplier - 1) / 2.8, 1);
    const liftFactor = Math.max(smoothProgress * 0.9, multiplierLift);

    const startX = 50;
    const baseY = H - 48;
    const maxLift = H - 118;

    const cx =
      startX +
      (W - 135) *
      Math.min(Math.pow(flightProgress, 0.82), 1);

    const cy =
      baseY -
      maxLift *
      Math.min(liftFactor, 1);

    const controlX = startX + (cx - startX) * 0.48;
    const controlY =
      baseY -
      maxLift *
      Math.min(liftFactor * 0.42, 0.62);

    ctx.beginPath();
    ctx.moveTo(startX, baseY);
    ctx.quadraticCurveTo(controlX, controlY, cx, cy);

    ctx.strokeStyle = 'rgba(225,29,72,0.98)';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 28;
    ctx.shadowColor = '#e11d48';
    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.lineTo(cx, baseY);
    ctx.lineTo(startX, baseY);
    ctx.closePath();

    const underGradient = ctx.createLinearGradient(startX, cy, startX, baseY);
    underGradient.addColorStop(0, 'rgba(225,29,72,0.26)');
    underGradient.addColorStop(0.45, 'rgba(225,29,72,0.1)');
    underGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = underGradient;
    ctx.fill();

    const planeAngle =
      -0.32 +
      Math.min(liftFactor * 0.38, 0.26) +
      Math.sin(secondsInAir * 5) * 0.018;

    ctx.save();
    ctx.translate(cx + 8, cy + 13);
    ctx.rotate(planeAngle);
    ctx.globalAlpha = 0.24;
    ctx.filter = 'blur(11px)';

    if (planeImageRef.current) {
      ctx.drawImage(planeImageRef.current, -68, -32, 136, 64);
    }

    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(planeAngle);
    ctx.shadowBlur = 24;
    ctx.shadowColor = 'rgba(255,255,255,0.32)';

    if (planeImageRef.current) {
      ctx.drawImage(planeImageRef.current, -68, -32, 136, 64);
    }

    ctx.restore();

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(
        cx - 36 - i * 11,
        cy + Math.sin(secondsInAir * 9 + i) * 4,
        2.2 + i * 0.35,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        i % 2 === 0
          ? 'rgba(255,255,255,0.48)'
          : 'rgba(239,68,68,0.42)';

      ctx.fill();
    }
  }
};

  const triggerPayoutSequence = (deckName, multVal, activeState) => {
    const rawWin = activeState.wager * multVal;
    const resolvedBalance = balance + rawWin;

    setBalance(resolvedBalance);
    commitWalletBalance(resolvedBalance);

    setMyBetsHistory((p) => [
      {
        roundId: Date.now().toString().slice(-5),
        stake: activeState.wager,
        multiplier: multVal,
        yieldAmount: rawWin,
        status: 'WON',
      },
      ...p,
    ]);

    playSynthesizedTone(523.25, 'sine', 0.15, 0.05);
    setTimeout(() => playSynthesizedTone(659.25, 'sine', 0.15, 0.05), 100);
    setTimeout(() => playSynthesizedTone(783.99, 'sine', 0.3, 0.06), 200);

    confetti({ particleCount: 90, spread: 65, origin: { y: 0.35 } });
    triggerToast(
      `🎉 Deck ${deckName} Auto Cashout hit @ ${multVal}x! Received KES ${rawWin.toFixed(2)}`,
      'success'
    );
  };

  const commitWalletBalance = async (balTarget) => {
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      walletBalance: parseFloat(balTarget.toFixed(2)),
    });
  };

  const placeWagerIntent = (targetDeck) => {
    if (balance <= 0) {
      triggerToast(
        '❌ Operation Aborted: Your wallet reads exactly KES 0.00. Please complete a deposit execution.',
        'error'
      );
      return;
    }

    const isA = targetDeck === 'A';
    const currentWagerAmount = isA ? deckA.wager : deckB.wager;

    if (balance < currentWagerAmount) {
      triggerToast(
        '❌ Allocation Failure: Selected target stake exceeds your available profile balance.',
        'error'
      );
      return;
    }

    if (gameStatus === 'running') {
      if (isA) setDeckA((p) => ({ ...p, hasBetNext: !p.hasBetNext }));
      else setDeckB((p) => ({ ...p, hasBetNext: !p.hasBetNext }));

      triggerToast(`Deck ${targetDeck} round queue updated.`, 'info');
    } else {
      if (isA) setDeckA((p) => ({ ...p, hasBetCurrent: true }));
      else setDeckB((p) => ({ ...p, hasBetCurrent: true }));

      setBalance((b) => b - currentWagerAmount);
    }
  };

  const handleManualPayoutExecution = (targetDeck) => {
    const isA = targetDeck === 'A';
    const targetState = isA ? deckA : deckB;

    if (!targetState.hasBetCurrent) return;

    const preciseWin = targetState.wager * multiplier;
    const updatedWallet = balance + preciseWin;

    setBalance(updatedWallet);
    commitWalletBalance(updatedWallet);

    setMyBetsHistory((p) => [
      {
        roundId: Date.now().toString().slice(-5),
        stake: targetState.wager,
        multiplier,
        yieldAmount: preciseWin,
        status: 'WON',
      },
      ...p,
    ]);

    if (isA) setDeckA((p) => ({ ...p, hasBetCurrent: false }));
    else setDeckB((p) => ({ ...p, hasBetCurrent: false }));

    playSynthesizedTone(587.33, 'sine', 0.12, 0.05);
    setTimeout(() => playSynthesizedTone(880.0, 'sine', 0.25, 0.05), 110);

    confetti({ particleCount: 60, spread: 50, origin: { y: 0.4 } });
    triggerToast(
      `🎉 Manual Cashout Approved! + KES ${preciseWin.toFixed(2)}`,
      'success'
    );
  };

  const broadcastChatMessage = () => {
    if (!chatInput.trim()) return;

    if (balance <= 1000) {
      triggerToast(
        '⚠️ Premium Lobby Limitation: Only users possessing a wallet state above KES 1,000 can send a message.',
        'error'
      );
      return;
    }

    setChatLogs((p) => [
      ...p,
      {
        user: '🦈070***01',
        msg: chatInput,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);

    setChatInput('');
    playSynthesizedTone(800, 'sine', 0.03, 0.01);
  };

  const handlePaymentInitiation = async () => {
    const amt = parseInt(inputAmount);

    if (isNaN(amt) || amt < 49) {
      triggerToast('❌ Minimum parameter boundary violation: KES 49 required.', 'error');
      return;
    }

    setLoadingDeposit(true);

    try {
      const res = await fetch('/api/payhero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, phone: inputPhone, username: user.uid }),
      });

      const data = await res.json();

      if (data.success) {
        if (rememberPhone) localStorage.setItem('jetpesa_saved_phone', inputPhone);

        const nextBal = balance + amt;

        setBalance(nextBal);
        commitWalletBalance(nextBal);
        setIsDepositModalOpen(false);
        triggerToast('✅ Verification sequence acknowledged. STK push deployed.', 'success');
      } else {
        triggerToast('Gateway reported error: ' + data.message, 'error');
      }
    } catch (e) {
      triggerToast('System context failure: ' + e.message, 'error');
    } finally {
      setLoadingDeposit(false);
    }
  };

  return (
    <div style={{ background: '#07080e', color: '#f1f5f9', height: '100vh', maxHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '85px', left: '50%', transform: 'translateX(-50%)', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '8px', width: '90%', maxWidth: '440px' }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ background: t.type === 'error' ? 'rgba(220,38,38,0.95)' : t.type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(30,27,75,0.95)', color: '#fff', padding: '12px 24px', borderRadius: '30px', boxShadow: '0 16px 32px rgba(0,0,0,0.6)', fontWeight: '800', fontSize: '13px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            {t.msg}
          </div>
        ))}
      </div>

      <header style={{ background: 'rgba(12,14,24,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', flexShrink: 0, zIndex: 99 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>JETPESA</span>
          <button style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', cursor: 'pointer' }} onClick={() => setIsProvablyModalOpen(true)}>🛡️ PROVABLY FAIR</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setAudioMuted(!audioMuted)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
            {audioMuted ? '🔈' : '🔊'}
          </button>

          <button onClick={() => setIsRainActive(!isRainActive)} style={{ background: isRainActive ? '#a855f7' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
            🌧️ RAIN
          </button>

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 3px 3px 14px', borderRadius: '30px', gap: '10px' }}>
            <span style={{ color: '#22c55e', fontWeight: '900', fontSize: '14px' }}>{balance.toFixed(2)} KES</span>
            <button onClick={() => setIsDepositModalOpen(true)} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '900', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>
              DEPOSIT
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '8px', background: '#040509', padding: '10px 20px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
        {historyTape.map((h, i) => (
          <div key={i} style={{ background: h > 2 ? 'linear-gradient(135deg, #a855f7 0%, #6b21a8 100%)' : 'rgba(255,255,255,0.05)', color: h > 2 ? '#fff' : '#94a3b8', padding: '4px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', flexShrink: 0, border: '1px solid rgba(255,255,255,0.05)' }}>
            {h.toFixed(2)}x
          </div>
        ))}
      </div>

      <div className="cockpitMainLayout" style={{ flex: 1, display: 'grid', padding: '16px', gap: '16px', boxSizing: 'border-box', minHeight: 0, height: 'calc(100% - 130px)' }}>
        <div className="leftPanelLayout" style={{ background: 'rgba(18,20,32,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', flexShrink: 0 }}>
            <button onClick={() => setActiveTab('all')} style={{ flex: 1, padding: '12px', background: activeTab === 'all' ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', color: '#fff', fontSize: '11px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer' }}>ALL LIVE ({activePlayersCount})</button>
            <button onClick={() => setActiveTab('mine')} style={{ flex: 1, padding: '12px', background: activeTab === 'mine' ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', color: '#fff', fontSize: '11px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer' }}>MY BETS</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px', minHeight: 0 }}>
            {activeTab === 'all' ? (
              liveBetsFeed.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: b.won ? 'rgba(34,197,94,0.05)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8', fontWeight: '600' }}>{b.username}</span>
                  <span style={{ fontWeight: '800', color: '#fff' }}>{b.bet} KES</span>
                  <span style={{ color: b.won ? '#22c55e' : '#475569', fontWeight: '900' }}>{b.won ? `${b.mult}x` : '-'}</span>
                </div>
              ))
            ) : myBetsHistory.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#475569', fontSize: '12px', marginTop: '40px', fontWeight: '600' }}>No local round wagers recorded.</div>
            ) : (
              myBetsHistory.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', marginBottom: '6px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>ROUND #{m.roundId}</span>
                    <span style={{ fontWeight: '800' }}>{m.stake} KES</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#22c55e', fontWeight: '900', display: 'block' }}>{m.multiplier.toFixed(2)}x</span>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>+{m.yieldAmount.toFixed(1)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="centerPanelLayout" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: 0 }}>
          <div style={{ flex: 1, background: '#020306', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', minHeight: 0, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)' }}>
            {gameStatus === 'idle' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(4,5,9,0.94)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ width: '70%', maxWidth: '300px', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div style={{ height: '8px', background: 'linear-gradient(to right, #22c55e, #4ade80)', borderRadius: '8px', width: `${countdownProgress}%` }} />
                </div>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '900', marginTop: '14px', letterSpacing: '1px' }}>WAITING FOR NEXT FLIGHT ROUND...</span>
                <span style={{ color: '#475569', fontSize: '11px', fontWeight: '700', marginTop: '4px' }}>Powered by JetPesa</span>
              </div>
            )}

            <canvas ref={canvasRef} width={640} height={340} style={{ width: '100%', height: '100%', display: 'block' }} />

            {gameStatus !== 'idle' && (
              <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                {gameStatus === 'crashed' ? (
                  <div>
                    <h1 style={{ color: '#e11d48', fontSize: '3.6rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>FLEW AWAY</h1>
                    <span style={{ color: '#475569', fontSize: '14px', fontWeight: '800' }}>Ended @ {multiplier.toFixed(2)}x</span>
                  </div>
                ) : (
                  <h1 style={{ fontSize: '5.8rem', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-2px', textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>{multiplier.toFixed(2)}x</h1>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(18,20,32,0.8)', border: '1px solid rgba(255,255,255,0.08)', padding: '18px', borderRadius: '20px', flexShrink: 0 }}>
            {[['A', deckA, setDeckA, '#22c55e'], ['B', deckB, setDeckB, '#16a34a']].map(([name, deck, setter, color]) => (
              <div key={name} style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.04)', padding: '14px', borderRadius: '14px' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  <button onClick={() => setter((p) => ({ ...p, isAuto: !p.isAuto }))} style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '900', background: deck.isAuto ? '#e11d48' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>AUTO BET</button>
                  <button onClick={() => setter((p) => ({ ...p, isAutoCash: !p.isAutoCash }))} style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '900', background: deck.isAutoCash ? '#22c55e' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>AUTO CASH</button>
                </div>

                {deck.isAutoCash && (
                  <input type="number" step="0.1" value={deck.cashVal} onChange={(e) => setter((p) => ({ ...p, cashVal: e.target.value }))} style={{ width: '92%', padding: '6px 8px', background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', borderRadius: '6px', marginBottom: '8px' }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="number" value={deck.wager} onChange={(e) => setter((p) => ({ ...p, wager: parseInt(e.target.value) || 0 }))} style={{ width: '75px', padding: '12px 4px', background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '900', textAlign: 'center', borderRadius: '8px', fontSize: '16px' }} />

                  {deck.hasBetCurrent ? (
                    <button onClick={() => handleManualPayoutExecution(name)} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', border: 'none', color: '#fff', fontWeight: '900', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
                      CASH OUT<br /><span style={{ fontSize: '16px' }}>{(deck.wager * multiplier).toFixed(2)} KES</span>
                    </button>
                  ) : (
                    <button onClick={() => placeWagerIntent(name)} style={{ flex: 1, padding: '14px', background: deck.hasBetNext ? '#475569' : color, border: 'none', color: '#fff', fontWeight: '900', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}>
                      {deck.hasBetNext ? 'CANCEL' : `BET\n${deck.wager} KES`}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rightPanelLayout" style={{ background: '#0b141a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden', boxShadow: '0 12px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ background: '#202c33', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00a884' }} />
            <span style={{ fontWeight: '800', fontSize: '14px', color: '#e9edef' }}>Lobby Lounge Chat Room</span>
          </div>

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#0b141a', minHeight: 0 }}>
            {chatLogs.map((c, i) => {
              const isMe = c.user === '🦈070***01';

              return (
                <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%', background: isMe ? '#005c4b' : '#202c33', padding: '8px 12px', borderRadius: '10px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.3)', flexShrink: 0 }}>
                  {!isMe && <span style={{ color: '#30d6b5', fontWeight: '800', fontSize: '11px', display: 'block', marginBottom: '3px' }}>{c.user}</span>}
                  <span style={{ color: '#e9edef', fontSize: '12.5px', lineHeight: '1.4', wordBreak: 'break-word', display: 'block' }}>{c.msg}</span>
                  <span style={{ display: 'block', textTransform: 'uppercase', textAlign: 'right', fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{c.time}</span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '10px 14px', background: '#202c33', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <input type="text" placeholder={balance > 1000 ? 'Type chat message...' : 'Requires KES 1001+ balance'} disabled={balance <= 1000} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') broadcastChatMessage(); }} style={{ flex: 1, padding: '10px 14px', background: '#2a3942', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '13px' }} />
            <button onClick={broadcastChatMessage} style={{ background: '#00a884', border: 'none', width: '38px', height: '38px', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>➔</button>
          </div>
        </div>
      </div>

      <div className="mobileUtilityFooterBar" style={{ background: '#0c0d12', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'none', justifyContent: 'space-around', padding: '12px 0', position: 'sticky', bottom: 0, zIndex: 999, flexShrink: 0 }}>
        <button onClick={() => setMobileActivePanel('bets')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'bets' ? '#22c55e' : '#64748b', fontSize: '12px', fontWeight: '800' }}>📊 DATA LIVE</button>
        <button onClick={() => setMobileActivePanel('game')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'game' ? '#e11d48' : '#64748b', fontSize: '12px', fontWeight: '800' }}>🚀 RADAR HUB</button>
        <button onClick={() => setMobileActivePanel('chat')} style={{ background: 'transparent', border: 'none', color: mobileActivePanel === 'chat' ? '#38bdf8' : '#64748b', fontSize: '12px', fontWeight: '800' }}>💬 LOBBY ROOM</button>
      </div>

      {isDepositModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '12px' }}>
          <div style={{ background: '#0c0d12', border: '1px solid #22c55e', borderRadius: '20px', width: '100%', maxWidth: '350px', padding: '26px', position: 'relative' }}>
            <button onClick={() => setIsDepositModalOpen(false)} style={{ position: 'absolute', top: '14px', right: '16px', background: 'transparent', border: 'none', color: '#64748b', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 16px 0', color: '#22c55e', fontWeight: '900' }}>Safaricom M-Pesa Wire</h3>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>DEPOSIT QUANTITY (MIN 49 KES)</label>
              <input type="number" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} style={{ width: '92%', padding: '12px', marginTop: '4px', background: '#141622', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '16px', fontWeight: '900', borderRadius: '8px' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>M-PESA REGISTERED TELEPHONE</label>
              <input type="text" value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="07XXXXXXXX" style={{ width: '92%', padding: '12px', marginTop: '4px', background: '#141622', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '14px', borderRadius: '8px' }} />
            </div>

            <button onClick={handlePaymentInitiation} disabled={loadingDeposit} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontWeight: '900', borderRadius: '10px', cursor: 'pointer' }}>
              {loadingDeposit ? 'SYNCHRONIZING...' : 'AUTHORIZE DEPOSIT'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .cockpitMainLayout { grid-template-columns: 310px 1fr 310px; }

        @media (max-width: 992px) {
          .cockpitMainLayout {
            grid-template-columns: 1fr !important;
            height: calc(100% - 130px) !important;
            padding-bottom: 20px !important;
          }

          .mobileUtilityFooterBar {
            display: flex !important;
          }

          .leftPanelLayout {
            display: ${mobileActivePanel === 'bets' ? 'flex !important' : 'none !important'};
            height: 100% !important;
          }

          .centerPanelLayout {
            display: ${mobileActivePanel === 'game' ? 'flex !important' : 'none !important'};
            height: 100% !important;
          }

          .rightPanelLayout {
            display: ${mobileActivePanel === 'chat' ? 'flex !important' : 'none !important'};
            height: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
