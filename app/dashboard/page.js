'use client';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function JetPesaDashboard() {
    const [balance, setBalance] = useState(1000.00);
    const [wager, setWager] = useState(10);
    const [phone, setPhone] = useState('');
    const [depAmount, setDepAmount] = useState(100);
    const [multiplier, setMultiplier] = useState(1.00);
    const [gameStatus, setGameStatus] = useState('idle'); // idle, running, crashed
    const [hasBet, setHasBet] = useState(false);
    const [serverHash, setServerHash] = useState('Waiting...');
    const [nonce, setNonce] = useState(1);
    
    const canvasRef = useRef(null);
    let targetCrashPoint = useRef(1.00);
    let animationId = useRef(null);

    // Fetch new secure round calculations from Vercel Serverless endpoint
    async function prepNextRound() {
        setGameStatus('idle');
        setMultiplier(1.00);
        
        try {
            const res = await fetch(`/api/game/provably?nonce=${nonce}`);
            const data = await res.json();
            targetCrashPoint.current = data.crashPoint;
            setServerHash(data.hash);
        } catch (e) {
            targetCrashPoint.current = 2.15; // failback safety default
        }

        setTimeout(() => { startMultiplierFlight(); }, 4000);
    }

    function startMultiplierFlight() {
        setGameStatus('running');
        const startTime = performance.now();

        function loop(now) {
            let elapsed = (now - startTime) / 1000;
            let currentMult = parseFloat(Math.pow(Math.E, 0.065 * elapsed).toFixed(2));

            if (currentMult >= targetCrashPoint.current) {
                setGameStatus('crashed');
                setMultiplier(targetCrashPoint.current);
                setNonce(prev => prev + 1);
                setHasBet(false);
                setTimeout(() => { prepNextRound(); }, 3000);
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

        let progress = Math.min(time / 12, 1);
        let x = 50 + (canvas.width - 100) * progress;
        let y = (canvas.height - 50) - (canvas.height - 100) * Math.sin(progress * Math.PI / 2);

        // Neon Glow Trace Design
        ctx.beginPath();
        ctx.moveTo(50, canvas.height - 50);
        ctx.quadraticCurveTo((50 + x) / 2, canvas.height - 50, x, y);
        ctx.strokeStyle = '#ff003c';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#ff003c';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    async function triggerMpesaDeposit() {
        if (!phone || depAmount < 10) return alert("Verify deposit inputs");
        
        const res = await fetch('/api/payhero', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: depAmount, phone, username: 'Player1' })
        });
        const data = await res.json();
        if (data.success) {
            alert("STK Push sent successfully!");
            setBalance(prev => prev + parseFloat(depAmount)); // Instant UI update
        } else {
            alert("Deposit Failed: " + data.message);
        }
    }

    function executeBetAction() {
        if (gameStatus === 'idle' && !hasBet) {
            if (wager > balance) return alert("Insufficient funds");
            setBalance(prev => prev - wager);
            setHasBet(true);
        } else if (gameStatus === 'running' && hasBet) {
            let winnings = wager * multiplier;
            setBalance(prev => prev + winnings);
            setHasBet(false);
            confetti({ particleCount: 120, spread: 60 });
        }
    }

    useEffect(() => {
        prepNextRound();
        return () => cancelAnimationFrame(animationId.current);
    }, [nonce]);

    return (
        <div style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f1f23', paddingBottom: '15px' }}>
                <h1 style={{ color: '#ff003c', margin: 0, letterSpacing: '1px', fontWeight: '900' }}>JETPESA PRO</h1>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ background: '#18181b', padding: '10px 20px', borderRadius: '30px', border: '1px solid #27272a', color: '#00ff66', fontWeight: 'bold' }}>
                        KES {balance.toFixed(2)}
                    </div>
                </div>
            </header>

            <main style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px', marginTop: '30px' }}>
                <div>
                    <div style={{ position: 'relative', background: '#020205', borderRadius: '16px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1c1c24' }}>
                        <canvas ref={canvasRef} width={700} height={400} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                        <h2 style={{ fontSize: '6rem', fontWeight: '900', color: gameStatus === 'crashed' ? '#ff003c' : '#fff', zIndex: 10 }}>
                            {gameStatus === 'crashed' ? `FLEW AWAY (${multiplier}x)` : `${multiplier.toFixed(2)}x`}
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px', background: '#121214', padding: '20px', borderRadius: '16px' }}>
                        <div>
                            <input type="number" value={wager} onChange={(e) => setWager(parseFloat(e.target.value))} style={{ width: '100%', padding: '12px', background: '#1c1c24', border: '1px solid #2d2d3d', color: '#fff', borderRadius: '8px', marginBottom: '10px', fontSize: '16px' }} />
                            <button onClick={executeBetAction} disabled={gameStatus === 'running' && !hasBet} style={{ width: '100%', padding: '15px', background: hasBet ? '#ffaa00' : '#00ff66', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}>
                                {gameStatus === 'idle' ? 'PLACE BET' : hasBet ? `CASH OUT ${(wager * multiplier).toFixed(2)}` : 'WAITING FOR NEXT ROUND'}
                            </button>
                        </div>
                        <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', fontSize: '12px', color: '#a1a1aa' }}>
                            <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>🛡️ SERVER PROVABLY FAIR HASH:</div>
                            <div style={{ fontFamily: 'monospace', background: '#09090b', padding: '8px', borderRadius: '4px', wordBreak: 'break-all', color: '#00ff66' }}>{serverHash}</div>
                        </div>
                    </div>
                </div>

                <aside style={{ background: '#121214', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>⚡ INSTANT DEPOSIT</h3>
                    <div>
                        <label style={{ fontSize: '12px', color: '#a1a1aa' }}>M-Pesa Mobile Number</label>
                        <input type="text" placeholder="07XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '10px', background: '#1c1c24', border: '1px solid #2d2d3d', color: '#fff', borderRadius: '6px', marginTop: '5px' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: '#a1a1aa' }}>Amount (KES)</label>
                        <input type="number" value={depAmount} onChange={(e) => setDepAmount(e.target.value)} style={{ width: '100%', padding: '10px', background: '#1c1c24', border: '1px solid #2d2d3d', color: '#fff', borderRadius: '6px', marginTop: '5px' }} />
                    </div>
                    <button onClick={triggerMpesaDeposit} style={{ background: '#ff003c', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        INITIATE STK PUSH
                    </button>
                </aside>
            </main>
        </div>
    );
}
