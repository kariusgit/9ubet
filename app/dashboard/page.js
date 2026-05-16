'use client';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function PremiumDashboard() {
  const [balance, setBalance] = useState(1500.00);
  const [wager, setWager] = useState(100);
  const [phone, setPhone] = useState('');
  const [depAmt, setDepAmt] = useState(500);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, running, crashed
  const [hasBet, setHasBet] = useState(false);
  const [serverHash, setServerHash] = useState('Generating dynamic chain verification...');
  const [nonce, setNonce] = useState(1);
  const [loadingDeposit, setLoadingDeposit] = useState(false);

  // Live Component Mock Data Lists
  const [fakeBets, setFakeBets] = useState([]);
  const [chats, setChats] = useState([
    { user: 'Omondi_K', msg: 'JetPesa is clean! Just hit 5.4x 🚀', time: '11:02' },
    { user: 'Techie_Ruto', msg: 'STK push is instant, automated nicely.', time: '11:04' },
    { user: 'Mwangi_Dev', msg: 'Crash point verified via SHA-256 hash. Pure mathematics.', time: '11:05' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const canvasRef = useRef(null);
  let targetCrashPoint = useRef(1.00);
  let animationId = useRef(null);

  // SVG representation for the standard red plane asset
  const planeSvgStr = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e11d48"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`;
  const planeImg = useRef(null);

  useEffect(() => {
    planeImg.current = new Image();
    planeImg.current.src = planeSvgStr;
    generateMockBets();
    prepNextRound();
    
    // Simulate real-time continuous chat updates
    const chatInterval = setInterval(() => {
      const activePhrases = [
        "Let it ride to 10x today!", "Wow, instantly cashed out at 3.20x KES", 
        "JetPesa is by far the cleanest interface on Next.js", "Lost that round, we scale up next time",
        "Payout hit my wallet balance completely safely", "Love how the vector curves scale up"
      ];
      const users = ["Alamin_T", "Njeri_M", "Kip_Trader", "Brian_O", "Mercy_J", "Kamau_W"];
      const newChat = {
        user: users[Math.floor(Math.random() * users.length)],
        msg: activePhrases[Math.floor(Math.random() * activePhrases.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => [...prev.slice(-15), newChat]);
    }, 4500);

    return () => {
      cancelAnimationFrame(animationId.current);
      clearInterval(chatInterval);
    };
  }, [nonce]);

  function generateMockBets() {
    const list = [];
    const highRollers = ["Cheruiyot", "Dan_K", "Amina_L", "Steve99", "FX_King", "Grace_N", "Kev_Pesa"];
    for (let i = 0; i < 8; i++) {
      list.push({
        user: highRollers[i] || "Player",
        amt: Math.floor(Math.random() * 2000) + 50,
        mult: (Math.random() * 3 + 1).toFixed(2),
        won: Math.random() > 0.4
      });
    }
    setFakeBets(list);
  }

  async function prepNextRound() {
    setGameStatus('idle');
    setMultiplier(1.00);
    try {
      const res = await fetch(`/api/game/provably?nonce=${nonce}`);
      const data = await res.json();
      targetCrashPoint.current = data.crashPoint;
      setServerHash(data.hash);
    } catch {
      targetCrashPoint.current = 2.40;
    }
    setTimeout(() => { startMultiplierFlight(); }, 4000);
  }

  function startMultiplierFlight() {
    setGameStatus('running');
    const startTime = performance.now();

    function loop(now) {
      let elapsed = (now - startTime) / 1000;
      let currentMult = parseFloat(Math.pow(Math.E, 0.075 * elapsed).toFixed(2));

      if (currentMult >= targetCrashPoint.current) {
        setGameStatus('crashed');
        setMultiplier(targetCrashPoint.current);
        setNonce(prev => prev + 1);
        setHasBet(false);
        return;
      }

      setMultiplier(currentMult);
      drawCurve(elapsed);
      animationId.current = requestAnimationFrame(loop);
    }
    animationId.current = requestAnimationFrame(loop);
  }

  function drawCurve(time) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let progress = Math.min(time / 10, 1);
    let x = 60 + (canvas.width - 140) * progress;
    let y = (canvas.height - 60) - (canvas.height - 140) * Math.sin(progress * Math.PI / 2);

    // Dynamic grid draw paths
    ctx.strokeStyle = '#18181b'; ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 60) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 60) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
    }

    // Classic red vector engine track lines
    ctx.beginPath();
    ctx.moveTo(60, canvas.height - 60);
    ctx.quadraticCurveTo((60 + x) / 2, canvas.height - 60, x, y);
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#e11d48';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Render the custom SVG plane asset cleanly over coordinate vectors
    if (planeImg.current) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 6 * (1 - progress));
      ctx.drawImage(planeImg.current, -20, -20, 40, 40);
      ctx.restore();
    }
  }

  async function triggerDeposit() {
    if (!phone || depAmt < 10) return alert("Verify fields before triggering integration layers.");
    setLoadingDeposit(true);
    try {
      const res = await fetch('/api/payhero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depAmt, phone, username: 'PlayerElite' })
      });
      const data = await res.json();
      if (data.success) {
        alert("STK push initialized successfully! Wallet update executed.");
        setBalance(prev => prev + parseFloat(depAmt));
      } else {
        alert("Gateway response failure: " + data.message);
      }
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoadingDeposit(false);
    }
  }

  function handleBetAction() {
    if (gameStatus === 'idle' && !hasBet) {
      if (wager > balance) return alert("Insufficient balance context limits.");
      setBalance(prev => prev - wager);
      setHasBet(true);
    } else if (gameStatus === 'running' && hasBet) {
      let finalWinnings = wager * multiplier;
      setBalance(prev => prev + finalWinnings);
      setHasBet(false);
      confetti({ particleCount: 120, spread: 60 });
    }
  }

  return (
    <div style={{ background: '#09090b', color: '#fafafa', minHeight: '100vh', padding: '24px' }}>
      {/* Lobby Header bar info layout */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #18181b', paddingBottom: '16px' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", margin: 0, fontWeight: '800', letterSpacing: '0.5px' }}>
          JET<span style={{ color: '#e11d48' }}>PESA LOBBY</span>
        </h2>
        <div style={{ background: '#18181b', border: '1px solid #27272a', padding: '10px 24px', borderRadius: '30px', color: '#4ade80', fontWeight: '800', fontSize: '1.1rem' }}>
          KES {balance.toFixed(2)}
        </div>
      </header>

      {/* Main Grid Content Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '24px', marginTop: '24px' }}>
        
        {/* LEFT COLUMN: Live Bets Monitoring Component */}
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: '16px', padding: '16px', height: '580px', overflowY: 'hidden' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#a1a1aa' }}>ALL BETS ROUND</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {fakeBets.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#18181b', borderRadius: '6px', fontSize: '12px' }}>
                <span style={{ color: '#e4e4e7' }}>@{b.user}</span>
                <span style={{ color: b.won ? '#4ade80' : '#a1a1aa', fontWeight: '700' }}>
                  {b.won ? `${b.mult}x` : `KES ${b.amt}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE COLUMN: Game Arena Frame Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            position: 'relative', background: '#020204', borderRadius: '20px',
            height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #18181b', overflow: 'hidden'
          }}>
            <canvas ref={canvasRef} width={650} height={380} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            
            <div style={{ zIndex: 20, textAlign: 'center' }}>
              {gameStatus === 'idle' && <div style={{ fontSize: '18px', color: '#ffaa00', fontWeight: '700', letterSpacing: '1px' }}>WAITING NEXT DEPLOYMENT FLIGHT...</div>}
              <h2 style={{ fontSize: '5.8rem', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", margin: 0, color: gameStatus === 'crashed' ? '#e11d48' : '#fff' }}>
                {gameStatus === 'crashed' ? `FLEW AWAY` : `${multiplier.toFixed(2)}x`}
              </h2>
              {gameStatus === 'crashed' && <div style={{ fontSize: '20px', color: '#be123c', fontWeight: '700' }}>({targetCrashPoint.current}x)</div>}
            </div>
          </div>

          {/* Interactive controls module cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#121214', padding: '24px', borderRadius: '20px', border: '1px solid #18181b' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#a1a1aa' }}>WAGER INPUT (KES)</label>
              <input type="number" value={wager} onChange={(e) => setWager(parseFloat(e.target.value))} style={{ width: '92%', padding: '12px', background: '#18181b', border: '1px solid #27272a', color: '#fff', borderRadius: '8px', marginTop: '6px', fontSize: '16px', fontWeight: '700' }} />
              <button onClick={handleBetAction} disabled={gameStatus === 'running' && !hasBet} style={{
                width: '100%', padding: '16px', marginTop: '12px', borderRadius: '8px', border: 'none',
                fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', transition: '0.1s',
                background: hasBet ? 'linear-gradient(135deg, #ff9800 0%, #e65100 100%)' : 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                color: hasBet ? '#fff' : '#000'
              }}>
                {gameStatus === 'idle' ? 'PLACE BET' : hasBet ? `CASH OUT ${(wager * multiplier).toFixed(2)}` : 'WAITING FOR ROUND START'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '600' }}>🛡️ VALID SERVER DEPLOYMENT PROOF SEQUENCE (SHA-256)</span>
              <div style={{ fontFamily: 'monospace', background: '#020204', border: '1px solid #18181b', padding: '12px', borderRadius: '8px', wordBreak: 'break-all', fontSize: '11px', marginTop: '8px', color: '#4ade80' }}>
                {serverHash}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Chat room / Real-time M-Pesa interface Cashier */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* M-Pesa Direct Input form element */}
          <div style={{ background: '#121214', border: '1px solid #18181b', borderRadius: '16px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', letterSpacing: '0.5px' }}>⚡ SECURE WALLET FUNDING</h4>
            <input type="text" placeholder="Phone e.g., 07XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '92%', padding: '10px', background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', marginBottom: '10px' }} />
            <input type="number" placeholder="Amount (KES)" value={depAmt} onChange={(e) => setDepAmt(parseFloat(e.target.value))} style={{ width: '92%', padding: '10px', background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', marginBottom: '12px' }} />
            <button onClick={triggerDeposit} disabled={loadingDeposit} style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#e11d48', border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
              {loadingDeposit ? 'PROMPTING PIN...' : 'DEPOSIT VIA STK'}
            </button>
          </div>

          {/* Simulated Active Player chat layout elements */}
          <div style={{ background: '#121214', border: '1px solid #18181b', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', height: '280px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#a1a1aa' }}>PLAYER LIVE CHAT</h4>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
              {chats.map((c, i) => (
                <div key={i} style={{ fontSize: '11px', background: '#18181b', padding: '6px 10px', borderRadius: '6px' }}>
                  <strong style={{ color: '#fb7185' }}>@{c.user}:</strong> <span style={{ color: '#e4e4e7' }}>{c.msg}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <input type="text" placeholder="Say something..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} style={{ flex: 1, background: '#18181b', border: '1px solid #27272a', padding: '8px', borderRadius: '4px', color: '#fff', fontSize: '11px' }} />
              <button onClick={() => { if(!chatInput)return; setChats([...chats, { user: 'Me', msg: chatInput, time: 'Now' }]); setChatInput(''); }} style={{ background: '#27272a', border: 'none', color: '#fff', padding: '0 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
