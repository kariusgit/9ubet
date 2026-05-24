'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function JetPesaLandingPage() {
  const [demoMultiplier, setDemoMultiplier] = useState(1.0);
  const [demoStatus, setDemoStatus] = useState('running');
  const [demoProgress, setDemoProgress] = useState(100);
  const [demoBets, setDemoBets] = useState([]);
  const [totalPoolUsers, setTotalPoolUsers] = useState(3452);

  const canvasRef = useRef(null);
  const animationId = useRef(null);

  useEffect(() => {
    let startTime = Date.now();
    const cycleDuration = 16000;

    const generateDemoBets = () => {
      const avatars = ['🦈', '🦁', '🦅', '🐆', '🦊', '🦏'];
      const phones = ['071***', '072***', '079***', '070***', '011***'];

      setTotalPoolUsers(Math.floor(Math.random() * 900 + 3200));

      setDemoBets(
        Array.from({ length: 6 }, (_, i) => ({
          user:
            avatars[i % avatars.length] +
            phones[i % phones.length] +
            Math.floor(Math.random() * 89 + 10),
          stake: [200, 500, 1000, 1500, 2500, 5000][i],
          autoTarget: parseFloat((1.2 + i * 0.25).toFixed(2)),
          cashedOut: false,
          winAmount: 0,
          finalMult: 1.0,
        }))
      );
    };

    const drawDemoRadar = (elapsed, status, multiplier) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#030712');
      bg.addColorStop(1, '#111827');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;

      for (let i = 0; i < W; i += 42) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
      }

      for (let j = 0; j < H; j += 32) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(W, j);
        ctx.stroke();
      }

      if (elapsed >= 3000 && status === 'running') {
        const airTime = (elapsed - 3000) / 1000;
        const cx = 45 + (W - 115) * Math.min(airTime / 7, 1);
        const cy =
          H -
          42 -
          (H - 115) * (Math.min(multiplier - 1, 1.7) / 1.7);

        ctx.beginPath();
        ctx.moveTo(45, H - 42);
        ctx.quadraticCurveTo((45 + cx) / 2, H - 24, cx, cy);

        ctx.strokeStyle = 'rgba(225,29,72,0.95)';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 24;
        ctx.shadowColor = '#e11d48';
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.lineTo(cx, H - 42);
        ctx.lineTo(45, H - 42);
        ctx.closePath();

        const fill = ctx.createLinearGradient(40, cy, 40, H - 42);
        fill.addColorStop(0, 'rgba(225,29,72,0.23)');
        fill.addColorStop(1, 'transparent');
        ctx.fillStyle = fill;
        ctx.fill();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.08 + Math.sin(airTime * 5) * 0.025);

        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255,255,255,0.35)';

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(34, 0);
        ctx.quadraticCurveTo(8, -13, -26, -8);
        ctx.lineTo(-36, 0);
        ctx.lineTo(-26, 8);
        ctx.quadraticCurveTo(8, 13, 34, 0);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(8, -7);
        ctx.quadraticCurveTo(22, -4, 34, 0);
        ctx.quadraticCurveTo(22, 4, 8, 7);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.moveTo(-12, -8);
        ctx.lineTo(-34, -25);
        ctx.lineTo(-28, -4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(6, -5, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    };

    function runDemoLoop() {
      const elapsed = (Date.now() - startTime) % cycleDuration;

      if (elapsed < 3000) {
        if (demoStatus !== 'loading') {
          setDemoStatus('loading');
          setDemoMultiplier(1.0);
          generateDemoBets();
        }

        setDemoProgress(((3000 - elapsed) / 3000) * 100);
        drawDemoRadar(elapsed, 'loading', 1.0);
      } else if (elapsed < 13000) {
        const flightSeconds = (elapsed - 3000) / 1000;
        const currentMult = parseFloat(
          Math.pow(Math.E, 0.09 * flightSeconds).toFixed(2)
        );

        if (currentMult >= 2.45) {
          setDemoStatus('crashed');
          setDemoMultiplier(2.45);
          drawDemoRadar(elapsed, 'crashed', 2.45);
        } else {
          setDemoStatus('running');
          setDemoMultiplier(currentMult);

          setDemoBets((prev) =>
            prev.map((b) => {
              if (!b.cashedOut && currentMult > b.autoTarget && Math.random() > 0.9) {
                return {
                  ...b,
                  cashedOut: true,
                  finalMult: currentMult,
                  winAmount: Math.floor(b.stake * currentMult),
                };
              }

              return b;
            })
          );

          drawDemoRadar(elapsed, 'running', currentMult);
        }
      } else {
        setDemoStatus('crashed');
        drawDemoRadar(elapsed, 'crashed', 2.45);
      }

      animationId.current = requestAnimationFrame(runDemoLoop);
    }

    generateDemoBets();
    animationId.current = requestAnimationFrame(runDemoLoop);

    return () => cancelAnimationFrame(animationId.current);
  }, [demoStatus]);

  return (
    <main style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <nav style={styles.nav}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandIcon}>✈</span>
          JETPESA
        </Link>

        <div style={styles.navActions}>
          <Link href="/auth?tab=login" style={styles.loginLink}>
            Login
          </Link>
          <Link href="/auth?tab=signup" style={styles.joinButton}>
            Join Now
          </Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.copy}>
          <div style={styles.badge}>LIVE AVIATOR MULTIPLIER GAME</div>

          <h1 style={styles.title}>
            Fly higher.
            <br />
            Cash out faster.
            <br />
            Win before the crash.
          </h1>

          <p style={styles.text}>
            JetPesa brings a fast Aviator-style crash experience with live
            rounds, instant wallet funding, and quick M-Pesa based play.
          </p>

          <div style={styles.ctaRow}>
            <Link href="/auth?tab=signup" style={styles.primaryCta}>
              Start Playing
            </Link>

            <Link href="/auth?tab=login" style={styles.secondaryCta}>
              Sign In
            </Link>
          </div>

          <div style={styles.stats}>
            <div style={styles.statCard}>
              <strong style={styles.statValue}>KES 49</strong>
              <span style={styles.statLabel}>Minimum entry</span>
            </div>

            <div style={styles.statCard}>
              <strong style={styles.statValue}>M-Pesa</strong>
              <span style={styles.statLabel}>Fast deposits</span>
            </div>

            <div style={styles.statCard}>
              <strong style={styles.statValue}>Live</strong>
              <span style={styles.statLabel}>Real-time rounds</span>
            </div>
          </div>
        </div>

        <div style={styles.demoCard}>
          <div style={styles.demoTop}>
            <div>
              <div style={styles.liveDotRow}>
                <span style={styles.liveDot} />
                <span style={styles.liveText}>LIVE ROUND</span>
              </div>
              <div style={styles.onlineText}>{totalPoolUsers} pilots online</div>
            </div>

            <div style={styles.walletPill}>KES Wallet</div>
          </div>

          <div style={styles.canvasWrap}>
            {demoStatus === 'loading' && (
              <div style={styles.loadingOverlay}>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${demoProgress}%`,
                    }}
                  />
                </div>
                <span style={styles.loadingText}>Preparing next flight...</span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={520}
              height={300}
              style={styles.canvas}
            />

            {demoStatus !== 'loading' && (
              <div style={styles.multiplierBox}>
                {demoStatus === 'crashed' ? (
                  <>
                    <div style={styles.crashedText}>FLEW AWAY</div>
                    <div style={styles.crashMultiplier}>
                      @ {demoMultiplier.toFixed(2)}x
                    </div>
                  </>
                ) : (
                  <div style={styles.multiplierText}>
                    {demoMultiplier.toFixed(2)}x
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={styles.ledgerHeader}>Live Round Allocations</div>

          <div style={styles.ledger}>
            {demoBets.map((b, idx) => (
              <div key={idx} style={styles.betRow}>
                <span style={styles.betUser}>{b.user}</span>
                <span style={styles.betStake}>{b.stake} KES</span>

                {b.cashedOut ? (
                  <span style={styles.winPill}>
                    {b.finalMult.toFixed(2)}x +{b.winAmount}
                  </span>
                ) : (
                  <span
                    style={{
                      ...styles.pendingPill,
                      color: demoStatus === 'crashed' ? '#ef4444' : '#64748b',
                    }}
                  >
                    {demoStatus === 'crashed' ? 'Lost' : 'Flying'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.featureStrip}>
        <div style={styles.featureItem}>
          <span>⚡</span>
          Fast rounds
        </div>
        <div style={styles.featureItem}>
          <span>🔐</span>
          Secure login
        </div>
        <div style={styles.featureItem}>
          <span>📱</span>
          Mobile-first play
        </div>
        <div style={styles.featureItem}>
          <span>💸</span>
          Wallet tracking
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top left, #172554 0%, #07080e 42%, #020617 100%)',
    color: '#f8fafc',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },

  glowOne: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: '999px',
    background: 'rgba(225,29,72,0.2)',
    filter: 'blur(100px)',
    top: -180,
    right: -160,
  },

  glowTwo: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: '999px',
    background: 'rgba(34,197,94,0.13)',
    filter: 'blur(100px)',
    bottom: -140,
    left: -120,
  },

  nav: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '22px clamp(20px, 5vw, 60px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(2,6,23,0.55)',
    backdropFilter: 'blur(18px)',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 24,
    fontWeight: 950,
    letterSpacing: '-1px',
  },

  brandIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #ef4444, #991b1b)',
    boxShadow: '0 12px 28px rgba(239,68,68,0.35)',
  },

  navActions: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
  },

  loginLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 800,
  },

  joinButton: {
    color: '#fff',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    padding: '11px 24px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 950,
    boxShadow: '0 12px 30px rgba(34,197,94,0.25)',
  },

  hero: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1240,
    margin: '0 auto',
    padding: '70px 20px 30px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 46,
    alignItems: 'center',
  },

  copy: {
    maxWidth: 580,
  },

  badge: {
    display: 'inline-flex',
    color: '#22c55e',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.22)',
    padding: '7px 14px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: '0.8px',
    marginBottom: 20,
  },

  title: {
    fontSize: 'clamp(42px, 6vw, 76px)',
    lineHeight: 0.95,
    letterSpacing: '-3px',
    margin: '0 0 22px',
    fontWeight: 1000,
  },

  text: {
    color: '#94a3b8',
    fontSize: 17,
    lineHeight: 1.7,
    margin: '0 0 34px',
    maxWidth: 510,
  },

  ctaRow: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    marginBottom: 34,
  },

  primaryCta: {
    textDecoration: 'none',
    color: '#fff',
    background: 'linear-gradient(135deg, #e11d48, #be123c)',
    padding: '16px 34px',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 950,
    boxShadow: '0 18px 40px rgba(225,29,72,0.32)',
  },

  secondaryCta: {
    textDecoration: 'none',
    color: '#e2e8f0',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '16px 28px',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 900,
  },

  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
  },

  statCard: {
    background: 'rgba(15,23,42,0.7)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
  },

  statValue: {
    display: 'block',
    fontSize: 18,
    marginBottom: 4,
  },

  statLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 800,
  },

  demoCard: {
    background: 'rgba(15,23,42,0.78)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 28,
    padding: 20,
    boxShadow: '0 34px 90px rgba(0,0,0,0.55)',
    backdropFilter: 'blur(18px)',
  },

  demoTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  liveDotRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },

  liveDot: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 16px #22c55e',
  },

  liveText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: 950,
  },

  onlineText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 800,
    marginTop: 4,
  },

  walletPill: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.22)',
    color: '#22c55e',
    borderRadius: 999,
    padding: '7px 12px',
    fontSize: 12,
    fontWeight: 950,
  },

  canvasWrap: {
    height: 320,
    background: '#020617',
    borderRadius: 22,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.07)',
    position: 'relative',
  },

  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },

  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 5,
    background: 'rgba(2,6,23,0.86)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressTrack: {
    width: '58%',
    height: 7,
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #22c55e, #86efac)',
    borderRadius: 999,
  },

  loadingText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 900,
    marginTop: 12,
  },

  multiplierBox: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },

  multiplierText: {
    fontSize: 'clamp(54px, 8vw, 86px)',
    fontWeight: 1000,
    letterSpacing: '-3px',
    textShadow: '0 0 30px rgba(255,255,255,0.22)',
  },

  crashedText: {
    color: '#ef4444',
    fontSize: 38,
    fontWeight: 1000,
  },

  crashMultiplier: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: 900,
    marginTop: 4,
  },

  ledgerHeader: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    margin: '16px 0 8px',
  },

  ledger: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },

  betRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: 10,
    alignItems: 'center',
    background: 'rgba(2,6,23,0.55)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: '10px 12px',
    fontSize: 12,
  },

  betUser: {
    color: '#cbd5e1',
    fontWeight: 800,
  },

  betStake: {
    color: '#fff',
    fontWeight: 950,
  },

  winPill: {
    color: '#22c55e',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.16)',
    borderRadius: 999,
    padding: '4px 8px',
    fontSize: 11,
    fontWeight: 950,
  },

  pendingPill: {
    fontSize: 11,
    fontWeight: 950,
  },

  featureStrip: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1100,
    margin: '20px auto 44px',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 12,
  },

  featureItem: {
    background: 'rgba(15,23,42,0.72)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '16px',
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: 900,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
