'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function PremiumLanding() {
  const router = useRouter();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let angle = 0;
    let particles = [];

    // Initialize decorative 3D floating flight matrix items
    for(let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        z: Math.random() * 800,
        speed: Math.random() * 2 + 1
      });
    }

    const render3DScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fov = 400; // 3D Field of View perspective anchor

      // Draw Rotating 3D Perspective Matrix Grid Lines
      ctx.strokeStyle = 'rgba(225, 29, 72, 0.08)';
      ctx.lineWidth = 1;
      angle += 0.003;

      for (let i = -400; i <= 400; i += 80) {
        // Projecting 3D coordinates (X, Y, Z) down into 2D screen space
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);

        let rotX1 = i * cosA - (-300) * sinA;
        let rotZ1 = i * sinA + (-300) * cosA + 500;
        let screenX1 = cx + (rotX1 * fov) / rotZ1;
        let screenY1 = cy + (200 * fov) / rotZ1;

        let rotX2 = i * cosA - (300) * sinA;
        let rotZ2 = i * sinA + (300) * cosA + 500;
        let screenX2 = cx + (rotX2 * fov) / rotZ2;
        let screenY2 = cy + (200 * fov) / rotZ2;

        ctx.beginPath();
        ctx.moveTo(screenX1, screenY1);
        ctx.lineTo(screenX2, screenY2);
        ctx.stroke();
      }

      // Render flying propulsion space vectors
      particles.forEach(p => {
        p.z -= p.speed;
        if(p.z <= 0) p.z = 800;

        let sx = cx + ((p.x - cx) * fov) / p.z;
        let sy = cy + ((p.y - cy) * fov) / p.z;
        let size = (fov / p.z) * 1.5;

        if(sx >= 0 && sx <= canvas.width && sy >= 0 && sy <= canvas.height) {
          ctx.fillStyle = `rgba(225, 29, 72, ${1 - p.z / 800})`;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw the central glowing marketing jet vector silhouette
      ctx.save();
      ctx.translate(cx, cy + Math.sin(angle * 5) * 15); // Smooth hover sequence
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(35, 20);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 30);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-35, 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render3DScene);
    };

    render3DScene();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050507', color: '#fff', overflowX: 'hidden' }}>
      
      {/* Premium Header Navigation Control */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 6%', background: 'rgba(5, 5, 7, 0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #14141a', position: 'fixed', width: '88%', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          JET<span style={{ color: '#e11d48' }}>PESA</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => router.push('/auth?mode=login')} style={{ background: 'transparent', border: '1px solid #272732', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            LOGIN
          </button>
          <button onClick={() => router.push('/auth?mode=signup')} style={{ background: '#e11d48', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(225,29,72,0.4)' }}>
            SIGN UP
          </button>
        </div>
      </nav>

      {/* Hero Ad Advertising Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '0 8%', paddingTop: '140px', alignItems: 'center', minHeight: '80vh' }}>
        <div>
          <div style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#fb7185', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', display: 'inline-block', marginBottom: '20px', border: '1px solid rgba(225,29,72,0.2)' }}>
            🚀 KENYA'S NUMBER ONE AUTOPILOT MULTIPLIER
          </div>
          <h1 style={{ fontSize: '4.2rem', fontWeight: '900', lineHeight: '1.05', margin: '0 0 24px 0', letterSpacing: '-1px' }}>
            Watch It Fly. <br/>Multiply Your Cash <br/><span style={{ color: '#e11d48' }}>Up To 100x!</span>
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.25rem', lineHeight: '1.6', margin: '0 0 40px 0', maxWidth: '520px' }}>
            Join thousands of active players online. Turn your <span style={{ color: '#fff', fontWeight: '700' }}>KES 25 FREE Sign-Up Bonus</span> into instant M-Pesa payouts before the plane flies away!
          </p>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => router.push('/auth?mode=signup')} style={{ padding: '18px 36px', fontSize: '17px', fontWeight: '800', color: '#fff', background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(225, 29, 72, 0.4)' }}>
              CLAIM FREE KES 25 NOW
            </button>
          </div>
        </div>

        {/* 3D Animated Plane Space Canvas Component */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <canvas ref={canvasRef} width={500} height={420} style={{ background: '#09090b', borderRadius: '24px', border: '1px solid #14141a', boxShadow: '0 30px 60px rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'absolute', bottom: '24px', right: '24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', fontWeight: '700' }}>
            ● LIVE MATCH ENGINE ACTIVE
          </div>
        </div>
      </section>

      {/* "How It Works" Informational Section */}
      <section style={{ padding: '80px 8%', background: '#09090b', borderTop: '1px solid #14141a' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>How To Play In <span style={{ color: '#e11d48' }}>3 Simple Steps</span></h2>
          <p style={{ color: '#71717a', marginTop: '8px' }}>Zero experience required. Pure intuition and instant speeds.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
          <div style={{ background: '#050507', padding: '32px', borderRadius: '16px', border: '1px solid #14141a' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
            <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', fontWeight: '700' }}>1. Place Your Wager</h3>
            <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>Enter your preferred bet amount before the round begins. Use your free KES 25 bonus immediately upon profile activation.</p>
          </div>

          <div style={{ background: '#050507', padding: '32px', borderRadius: '16px', border: '1px solid #14141a' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📈</div>
            <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', fontWeight: '700' }}>2. Watch Multiplier Scale</h3>
            <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>As the jet gains altitude, your potential payout accelerates exponentially from 1.00x up to 100x or higher in real-time.</p>
          </div>

          <div style={{ background: '#050507', padding: '32px', borderRadius: '16px', border: '1px solid #14141a' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', fontWeight: '700' }}>3. Cashout Securely</h3>
            <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>Press CASHOUT before the plane flies away to lock in your winnings. Winnings are paid out directly to your M-Pesa balance wallet!</p>
          </div>
        </div>
      </section>

    </div>
  );
}
