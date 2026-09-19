'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/*  Icon system — replaces every emoji with a clean, scalable SVG             */
/* -------------------------------------------------------------------------- */
function Icon({ name, size = 18, className = '', stroke = 2 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  };

  switch (name) {
    case 'plane':
      return (
        <svg {...common}>
          <path d="M17.8 16.8 21 21l-4.2-3.2" />
          <path d="M2.5 13.5 21 3l-8.5 18-2.7-7.3-7.3-2.7Z" />
        </svg>
      );
    case 'plane-filled':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16Z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'mobile':
      return (
        <svg {...common}>
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M11 18h2" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
        </svg>
      );
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case 'rocket':
      return (
        <svg {...common}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case 'diamond':
      return (
        <svg {...common}>
          <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="m7 14 4-4 4 4 5-5" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'wallet':
      return (
        <svg {...common}>
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      );
    case 'cash':
      return (
        <svg {...common}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case 'x':
      return (
        <svg {...common}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...common}>
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
          <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...common}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M6 4.5v15l13-7.5Z" />
        </svg>
      );
    case 'target':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Landing Page                                                              */
/* -------------------------------------------------------------------------- */
export default function JetPesaLandingPage() {
  const [demoMultiplier, setDemoMultiplier] = useState(1.0);
  const [demoStatus, setDemoStatus] = useState('loading');
  const [demoProgress, setDemoProgress] = useState(100);
  const [demoBets, setDemoBets] = useState([]);
  const [totalPoolUsers, setTotalPoolUsers] = useState(3452);
  const [weeklyPot, setWeeklyPot] = useState(50000000);

  const canvasRef = useRef(null);
  const animationId = useRef(null);
  const lastPhase = useRef('');

  useEffect(() => {
    let startTime = Date.now();
    const cycleDuration = 30000;
    const crashAt = 118.75;

    const names = [
      'Shark071', 'Lion072', 'Falcon079', 'Cheetah070', 'Fox011', 'Rhino074',
      'JetKing', 'PilotX', 'CashPilot', 'TurboBet', 'AeroBoss', 'Mamba254',
      'SkyHunter', 'FastWing', 'LuckyJet', 'CloudMan', 'CaptainK', 'Rocket254',
    ];

    const generateDemoBets = () => {
      const targets = [
        1.24, 1.41, 1.67, 1.95, 2.2, 2.85, 3.6, 4.4, 5.8,
        8.2, 12.5, 18.8, 25.4, 39.6, 58.2, 78.4, 135.5, 180.0,
      ];

      setTotalPoolUsers(Math.floor(Math.random() * 4200 + 6800));
      setWeeklyPot(50000000 + Math.floor(Math.random() * 850000));

      setDemoBets(
        names.map((name, i) => ({
          user: `${name}***`,
          stake: [100, 200, 350, 500, 750, 1000, 1500, 2500, 3000, 5000, 7500, 10000][i % 12],
          autoTarget: targets[i],
          cashedOut: false,
          lost: false,
          winAmount: 0,
          finalMult: 1.0,
        }))
      );
    };

    const drawDemoRadar = (elapsed, status, multiplier) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      const ratio = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
      }

      const ctx = canvas.getContext('2d');
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const W = width;
      const H = height;

      ctx.clearRect(0, 0, W, H);

      // Deep space background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#020617');
      bg.addColorStop(0.5, '#08111f');
      bg.addColorStop(1, '#111827');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle radial vignette
      const vignette = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, Math.max(W, H));
      vignette.addColorStop(0, 'rgba(244,63,94,0.08)');
      vignette.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 42) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
      }
      for (let j = 0; j < H; j += 34) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(W, j);
        ctx.stroke();
      }

      // Starfield
      for (let i = 0; i < 55; i++) {
        const x = (i * 97 + elapsed * 0.018) % W;
        const y = (i * 53) % H;
        ctx.fillStyle = i % 4 === 0 ? 'rgba(34,197,94,0.32)' : 'rgba(255,255,255,0.18)';
        ctx.fillRect(x, y, 1.6, 1.6);
      }

      // Flight trail
      if (elapsed >= 3500 && status === 'running') {
        const airTime = (elapsed - 3500) / 1000;
        const progress = Math.min(Math.log(multiplier) / Math.log(120), 1);
        const cx = 40 + (W - 105) * progress;
        const cy = H - 44 - (H - 105) * Math.pow(progress, 0.72);

        ctx.beginPath();
        ctx.moveTo(38, H - 42);
        ctx.bezierCurveTo(W * 0.22, H - 20, W * 0.48, cy + 75, cx, cy);

        ctx.strokeStyle = 'rgba(244,63,94,0.98)';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 28;
        ctx.shadowColor = '#f43f5e';
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.lineTo(cx, H - 42);
        ctx.lineTo(38, H - 42);
        ctx.closePath();

        const fill = ctx.createLinearGradient(40, cy, 40, H - 42);
        fill.addColorStop(0, 'rgba(244,63,94,0.22)');
        fill.addColorStop(1, 'rgba(244,63,94,0)');
        ctx.fillStyle = fill;
        ctx.fill();

        // Jet
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.16 + Math.sin(airTime * 5) * 0.025);

        ctx.shadowBlur = 26;
        ctx.shadowColor = 'rgba(255,255,255,0.4)';

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(40, 0);
        ctx.quadraticCurveTo(10, -17, -34, -9);
        ctx.lineTo(-45, 0);
        ctx.lineTo(-34, 9);
        ctx.quadraticCurveTo(10, 17, 40, 0);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(8, -8);
        ctx.quadraticCurveTo(25, -5, 40, 0);
        ctx.quadraticCurveTo(25, 5, 8, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.moveTo(-14, -8);
        ctx.lineTo(-40, -30);
        ctx.lineTo(-32, -4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.moveTo(-12, 8);
        ctx.lineTo(-38, 30);
        ctx.lineTo(-30, 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(8, -5, 11, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(251,191,36,0.9)';
        ctx.beginPath();
        ctx.moveTo(-46, 0);
        ctx.lineTo(-70, -9);
        ctx.lineTo(-60, 0);
        ctx.lineTo(-70, 9);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    };

    const runDemoLoop = () => {
      const elapsed = (Date.now() - startTime) % cycleDuration;

      if (elapsed < 3500) {
        if (lastPhase.current !== 'loading') {
          lastPhase.current = 'loading';
          setDemoStatus('loading');
          setDemoMultiplier(1.0);
          generateDemoBets();
        }
        setDemoProgress(((3500 - elapsed) / 3500) * 100);
        drawDemoRadar(elapsed, 'loading', 1.0);
      } else if (elapsed < 25500) {
        const flightSeconds = (elapsed - 3500) / 1000;
        const currentMult = parseFloat(Math.exp(0.218 * flightSeconds).toFixed(2));

        if (currentMult >= crashAt) {
          lastPhase.current = 'crashed';
          setDemoStatus('crashed');
          setDemoMultiplier(crashAt);
          setDemoBets((prev) =>
            prev.map((b) => (b.cashedOut ? b : { ...b, lost: true }))
          );
          drawDemoRadar(elapsed, 'crashed', crashAt);
        } else {
          lastPhase.current = 'running';
          setDemoStatus('running');
          setDemoMultiplier(currentMult);
          setDemoBets((prev) =>
            prev.map((b) => {
              if (!b.cashedOut && !b.lost && currentMult >= b.autoTarget && b.autoTarget < crashAt) {
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
        if (lastPhase.current !== 'crashed') {
          lastPhase.current = 'crashed';
          setDemoStatus('crashed');
          setDemoMultiplier(crashAt);
        }
        drawDemoRadar(elapsed, 'crashed', crashAt);
      }

      animationId.current = requestAnimationFrame(runDemoLoop);
    };

    generateDemoBets();
    animationId.current = requestAnimationFrame(runDemoLoop);

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, []);

  const activeWinners = demoBets.filter((b) => b.cashedOut).length;
  const activeLosers = demoBets.filter((b) => b.lost).length;

  const formatKES = (n) => `KES ${n.toLocaleString()}`;

  return (
    <main className="jp-page">
      {/* Ambient glows */}
      <div className="jp-glow jp-glow-1" />
      <div className="jp-glow jp-glow-2" />
      <div className="jp-glow jp-glow-3" />
      <div className="jp-noise" />

      {/* Nav */}
      <nav className="jp-nav">
        <Link href="/" className="jp-brand" aria-label="JetPesa home">
          <span className="jp-brand-mark">
            <Icon name="plane-filled" size={18} />
          </span>
          <span className="jp-brand-text">
            JET<span className="jp-brand-accent">PESA</span>
          </span>
        </Link>

        <div className="jp-nav-center">
          <a href="#demo" className="jp-nav-link">Live Demo</a>
          <a href="#jackpot" className="jp-nav-link">Jackpot</a>
          <a href="#features" className="jp-nav-link">Features</a>
          <a href="#how" className="jp-nav-link">How it works</a>
        </div>

        <div className="jp-nav-actions">
          <Link href="/auth?tab=login" className="jp-login-link">
            <Icon name="shield" size={15} />
            Login
          </Link>
          <Link href="/auth?tab=signup" className="jp-join-button">
            Join Now
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="jp-hero">
        <div className="jp-hero-copy">
          <div className="jp-badge">
            <span className="jp-pulse-dot" />
            LIVE AVIATOR MULTIPLIER GAME
          </div>

          <h1 className="jp-title">
            <span>Fly higher.</span>
            <span>Cash out faster.</span>
            <span className="jp-title-accent">Own the runway.</span>
          </h1>

          <p className="jp-text">
            JetPesa is a premium Aviator-style betting experience built for fast
            rounds, clean wallet tracking, mobile-first play, and high-energy
            cashout moments before the plane flies away.
          </p>

          <div className="jp-cta-row">
            <Link href="/auth?tab=signup" className="jp-primary-cta">
              <Icon name="play" size={16} />
              Start Playing
            </Link>
            <a href="#demo" className="jp-secondary-cta">
              <Icon name="chart" size={16} />
              Watch Demo
            </a>
          </div>

          <div className="jp-stats">
            <div className="jp-stat-card">
              <div className="jp-stat-icon">
                <Icon name="cash" size={18} />
              </div>
              <div>
                <strong className="jp-stat-value">KES 49</strong>
                <span className="jp-stat-label">Minimum entry</span>
              </div>
            </div>
            <div className="jp-stat-card">
              <div className="jp-stat-icon jp-stat-icon-gold">
                <Icon name="trophy" size={18} />
              </div>
              <div>
                <strong className="jp-stat-value">KES 50M</strong>
                <span className="jp-stat-label">Weekly top wager jackpot</span>
              </div>
            </div>
            <div className="jp-stat-card">
              <div className="jp-stat-icon jp-stat-icon-rose">
                <Icon name="rocket" size={18} />
              </div>
              <div>
                <strong className="jp-stat-value">100x+</strong>
                <span className="jp-stat-label">Demo multiplier flight</span>
              </div>
            </div>
          </div>

          <div className="jp-trust-row">
            <span><Icon name="shield" size={14} /> Secure login</span>
            <span><Icon name="wallet" size={14} /> M-Pesa ready</span>
            <span><Icon name="bolt" size={14} /> Fast rounds</span>
          </div>
        </div>

        <div className="jp-visual-stack">
          <FloatingJetSvg />

          <div id="demo" className="jp-demo-card">
            <div className="jp-demo-top">
              <div>
                <div className="jp-live-dot-row">
                  <span className="jp-live-dot" />
                  <span className="jp-live-text">LIVE ROUND</span>
                </div>
                <div className="jp-online-text">
                  <Icon name="users" size={12} />
                  {totalPoolUsers.toLocaleString()} pilots online
                </div>
              </div>
              <div className="jp-wallet-pill">
                <Icon name="wallet" size={13} />
                KES Wallet
              </div>
            </div>

            <div className="jp-canvas-wrap">
              {demoStatus === 'loading' && (
                <div className="jp-loading-overlay">
                  <div className="jp-loader-plane">
                    <Icon name="plane-filled" size={44} />
                  </div>
                  <div className="jp-progress-track">
                    <div className="jp-progress-fill" style={{ width: `${demoProgress}%` }} />
                  </div>
                  <span className="jp-loading-text">Preparing next flight…</span>
                </div>
              )}

              <canvas ref={canvasRef} className="jp-canvas" />

              {demoStatus !== 'loading' && (
                <div className="jp-multiplier-box">
                  {demoStatus === 'crashed' ? (
                    <>
                      <div className="jp-crashed-text">
                        <Icon name="x" size={28} className="jp-crash-x" />
                        FLEW AWAY
                      </div>
                      <div className="jp-crash-multiplier">@ {demoMultiplier.toFixed(2)}x</div>
                    </>
                  ) : (
                    <>
                      <div className="jp-multiplier-text">
                        {demoMultiplier.toFixed(2)}x
                      </div>
                      <div className="jp-multiplier-sub">cash out before takeoff peak</div>
                    </>
                  )}
                </div>
              )}

              <div className="jp-round-stats">
                <span className="jp-round-stat jp-round-stat-win">
                  <Icon name="check" size={12} /> {activeWinners} cashed out
                </span>
                <span className="jp-round-stat jp-round-stat-lose">
                  <Icon name="x" size={12} /> {activeLosers} lost
                </span>
              </div>
            </div>

            <div className="jp-ledger-header">
              <Icon name="users" size={12} />
              Live Round Allocations
            </div>

            <div className="jp-ledger">
              {demoBets.map((b, idx) => (
                <div key={idx} className="jp-bet-row">
                  <span className="jp-bet-user">{b.user}</span>
                  <span className="jp-bet-stake">{b.stake.toLocaleString()} KES</span>

                  {b.cashedOut ? (
                    <span className="jp-win-pill">
                      <Icon name="check" size={11} />
                      {b.finalMult.toFixed(2)}x · +{b.winAmount.toLocaleString()}
                    </span>
                  ) : (
                    <span
                      className={`jp-pending-pill ${
                        demoStatus === 'crashed' ? 'jp-pending-lost' : ''
                      }`}
                    >
                      <Icon name={demoStatus === 'crashed' ? 'x' : 'plane'} size={11} />
                      {demoStatus === 'crashed' ? 'Lost' : 'Flying'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jackpot */}
      <section id="jackpot" className="jp-jackpot-section">
        <div className="jp-jackpot-card">
          <div className="jp-jackpot-icon">
            <Icon name="trophy" size={34} />
          </div>
          <div>
            <span className="jp-section-kicker">WEEKLY HIGH ROLLER JACKPOT</span>
            <h2 className="jp-section-title">
              {formatKES(weeklyPot)} jackpot every week.
            </h2>
            <p className="jp-section-text">
              The highest verified wager volume of the week gets a premium jackpot
              allocation. Keep flying, keep climbing, and finish at the top of the runway.
            </p>
          </div>
        </div>

        <div className="jp-mini-card">
          <div className="jp-mini-icon jp-mini-icon-rose">
            <Icon name="rocket" size={22} />
          </div>
          <strong>Turbo Rounds</strong>
          <p>Rapid Aviator-style gameplay designed for mobile bettors.</p>
        </div>

        <div className="jp-mini-card">
          <div className="jp-mini-icon jp-mini-icon-indigo">
            <Icon name="diamond" size={22} />
          </div>
          <strong>VIP Missions</strong>
          <p>Daily missions, streak rewards, and wager milestones.</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="jp-feature-section">
        <div className="jp-center-copy">
          <span className="jp-section-kicker">BUILT FOR SPEED</span>
          <h2 className="jp-section-title">A sharper betting flight deck.</h2>
          <p className="jp-section-text">
            Give players a landing page that feels polished, alive, and conversion-ready.
          </p>
        </div>

        <div className="jp-feature-grid">
          {[
            ['cash', 'Instant Cashout', 'Cash out while the plane is still climbing.'],
            ['chart', 'Live Multiplier', 'Animated multiplier with real-time demo action.'],
            ['users', 'Player Feed', 'Many simulated users winning and a few missing the flight.'],
            ['trophy', '50M Jackpot', 'Weekly top wager prize for serious players.'],
            ['shield', 'Secure Access', 'Professional auth-focused call-to-actions.'],
            ['mobile', 'Small Screen Ready', 'Responsive cards, ledger, nav, and hero layout.'],
            ['wallet', 'Wallet UX', 'KES wallet messaging with M-Pesa-ready positioning.'],
            ['sparkles', 'Aviator Visuals', '3D-inspired jet, runway lights, glow cards, and motion.'],
          ].map(([icon, title, text]) => (
            <div key={title} className="jp-feature-card">
              <div className="jp-feature-icon">
                <Icon name={icon} size={22} />
              </div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="jp-how">
        <div className="jp-center-copy">
          <span className="jp-section-kicker">HOW IT WORKS</span>
          <h2 className="jp-section-title">Bet. Fly. Cash out.</h2>
        </div>

        <div className="jp-steps-grid">
          {[
            ['1', 'target', 'Place your stake', 'Choose your KES amount before the aircraft launches.'],
            ['2', 'chart', 'Watch the multiplier', 'The multiplier climbs higher as the jet flies.'],
            ['3', 'cash', 'Cash out early', 'Secure winnings before the plane disappears.'],
            ['4', 'trophy', 'Compete weekly', 'Push your wager volume for the 50M jackpot race.'],
          ].map(([num, icon, title, text]) => (
            <div key={num} className="jp-step-card">
              <div className="jp-step-head">
                <span className="jp-step-num">{num}</span>
                <div className="jp-step-icon">
                  <Icon name={icon} size={18} />
                </div>
              </div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="jp-final-cta">
        <div>
          <span className="jp-section-kicker">READY FOR TAKEOFF?</span>
          <h2 className="jp-final-title">Join JetPesa and enter the next round.</h2>
          <p className="jp-final-text">
            Professional Aviator-style betting interface with live demo action,
            mobile responsiveness, jackpot positioning, and conversion-focused UI.
          </p>
        </div>

        <Link href="/auth?tab=signup" className="jp-primary-cta jp-final-cta-btn">
          Create Account
          <Icon name="arrow-right" size={16} />
        </Link>
      </section>

      <footer className="jp-footer">
        <div className="jp-footer-brand">
          <Icon name="plane-filled" size={16} />
          <span>JETPESA</span>
        </div>
        <span>Demo values are simulated for landing-page presentation.</span>
        <span>Play responsibly · 18+</span>
      </footer>

      <style>{`
        /* ---------- Base ---------- */
        .jp-page {
          min-height: 100vh;
          background: radial-gradient(circle at top left, #172554 0%, #07080e 38%, #020617 100%);
          color: #f8fafc;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
        }
        .jp-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .035;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          z-index: 1;
        }
        .jp-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(110px);
          z-index: 0;
        }
        .jp-glow-1 { width: 560px; height: 560px; background: rgba(225,29,72,.22); top: -200px; right: -170px; }
        .jp-glow-2 { width: 460px; height: 460px; background: rgba(34,197,94,.15); bottom: 90px; left: -160px; }
        .jp-glow-3 { width: 360px; height: 360px; background: rgba(251,191,36,.1); top: 420px; right: 18%; }

        /* ---------- Nav ---------- */
        .jp-nav {
          position: relative;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          padding: 18px clamp(16px, 5vw, 64px);
          border-bottom: 1px solid rgba(255,255,255,.08);
          background: rgba(2,6,23,.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        .jp-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          text-decoration: none;
          font-weight: 950;
          letter-spacing: -1px;
        }
        .jp-brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ef4444, #991b1b);
          box-shadow: 0 12px 28px rgba(239,68,68,.35), inset 0 1px 0 rgba(255,255,255,.25);
        }
        .jp-brand-text { font-size: 22px; }
        .jp-brand-accent {
          background: linear-gradient(135deg, #22c55e, #86efac);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .jp-nav-center { display: flex; gap: 26px; align-items: center; }
        .jp-nav-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: color .2s ease;
          position: relative;
        }
        .jp-nav-link:hover { color: #fff; }
        .jp-nav-link::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 2px;
          background: linear-gradient(90deg, #ef4444, #22c55e);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .25s ease;
          border-radius: 2px;
        }
        .jp-nav-link:hover::after { transform: scaleX(1); }
        .jp-nav-actions { display: flex; gap: 12px; align-items: center; }
        .jp-login-link {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.08);
          transition: all .2s ease;
        }
        .jp-login-link:hover { color: #fff; border-color: rgba(255,255,255,.2); background: rgba(255,255,255,.04); }
        .jp-join-button {
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 12px 30px rgba(34,197,94,.28), inset 0 1px 0 rgba(255,255,255,.2);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .jp-join-button:hover { transform: translateY(-1px); box-shadow: 0 16px 36px rgba(34,197,94,.36); }

        /* ---------- Hero ---------- */
        .jp-hero {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 68px 20px 34px;
          display: grid;
          grid-template-columns: .92fr 1.08fr;
          gap: 46px;
          align-items: center;
        }
        .jp-hero-copy { max-width: 610px; }
        .jp-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #22c55e;
          background: rgba(34,197,94,.1);
          border: 1px solid rgba(34,197,94,.22);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          margin-bottom: 22px;
        }
        .jp-pulse-dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 18px #22c55e;
          animation: jpPulse 1.5s infinite;
        }
        @keyframes jpPulse {
          0%,100% { opacity: .65; transform: scale(1); }
          50%     { opacity: 1;   transform: scale(1.15); }
        }
        .jp-title {
          font-size: clamp(42px, 6.6vw, 82px);
          line-height: .93;
          letter-spacing: -3.4px;
          margin: 0 0 22px;
          font-weight: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .jp-title span { display: block; }
        .jp-title-accent {
          background: linear-gradient(135deg, #f43f5e 0%, #f59e0b 50%, #22c55e 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .jp-text {
          color: #a8b4c7;
          font-size: clamp(15px, 2vw, 17px);
          line-height: 1.75;
          margin: 0 0 32px;
          max-width: 560px;
        }
        .jp-cta-row { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 30px; }
        .jp-primary-cta {
          text-decoration: none;
          color: #fff;
          background: linear-gradient(135deg, #e11d48, #be123c);
          padding: 15px 28px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 18px 40px rgba(225,29,72,.32), inset 0 1px 0 rgba(255,255,255,.18);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .jp-primary-cta:hover { transform: translateY(-2px); box-shadow: 0 22px 46px rgba(225,29,72,.4); }
        .jp-secondary-cta {
          text-decoration: none;
          color: #e2e8f0;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          padding: 15px 24px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 850;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(10px);
          transition: all .2s ease;
        }
        .jp-secondary-cta:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.22); }

        .jp-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .jp-stat-card {
          background: rgba(15,23,42,.72);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 18px;
          padding: 14px;
          display: flex;
          gap: 12px;
          align-items: center;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
          transition: border-color .2s ease, transform .2s ease;
        }
        .jp-stat-card:hover { border-color: rgba(255,255,255,.18); transform: translateY(-2px); }
        .jp-stat-icon {
          width: 38px; height: 38px;
          border-radius: 12px;
          display: grid; place-items: center;
          background: rgba(34,197,94,.12);
          color: #22c55e;
          flex: 0 0 auto;
        }
        .jp-stat-icon-gold { background: rgba(251,191,36,.14); color: #fbbf24; }
        .jp-stat-icon-rose { background: rgba(244,63,94,.14); color: #f43f5e; }
        .jp-stat-value { display: block; font-size: 17px; font-weight: 950; margin-bottom: 2px; }
        .jp-stat-label { color: #7b8aa1; font-size: 11px; font-weight: 750; line-height: 1.35; }

        .jp-trust-row {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin-top: 18px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
        }
        .jp-trust-row span {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 10px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 999px;
        }

        /* ---------- Visual stack ---------- */
        .jp-visual-stack { position: relative; }
        .jp-jet-svg-wrap {
          position: absolute;
          top: -76px; right: -26px;
          width: min(360px, 56vw);
          z-index: 3;
          pointer-events: none;
          animation: jpFloat 5s ease-in-out infinite;
        }
        .jp-jet-svg { width: 100%; height: auto; display: block; }
        @keyframes jpFloat {
          0%,100% { transform: translateY(0) rotate(-4deg); }
          50%     { transform: translateY(-16px) rotate(2deg); }
        }

        .jp-demo-card {
          position: relative;
          z-index: 2;
          background: rgba(15,23,42,.82);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 28px;
          padding: 18px;
          box-shadow: 0 34px 90px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.05);
          backdrop-filter: blur(18px);
        }
        .jp-demo-top {
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px; margin-bottom: 14px;
        }
        .jp-live-dot-row { display: flex; gap: 8px; align-items: center; }
        .jp-live-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 16px #22c55e;
          animation: jpPulse 1.5s infinite;
        }
        .jp-live-text { color: #e2e8f0; font-size: 12px; font-weight: 950; letter-spacing: .5px; }
        .jp-online-text {
          color: #7b8aa1; font-size: 12px; font-weight: 800; margin-top: 4px;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .jp-wallet-pill {
          background: rgba(34,197,94,.1);
          border: 1px solid rgba(34,197,94,.24);
          color: #22c55e;
          border-radius: 999px;
          padding: 8px 13px;
          font-size: 12px;
          font-weight: 900;
          display: inline-flex; align-items: center; gap: 6px;
          white-space: nowrap;
        }

        .jp-canvas-wrap {
          height: clamp(270px, 44vw, 390px);
          background: #020617;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.08);
          position: relative;
        }
        .jp-canvas { width: 100%; height: 100%; display: block; }

        .jp-loading-overlay {
          position: absolute; inset: 0; z-index: 5;
          background: rgba(2,6,23,.88);
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          backdrop-filter: blur(4px);
        }
        .jp-loader-plane {
          color: #ef4444;
          margin-bottom: 16px;
          transform: rotate(-12deg);
          filter: drop-shadow(0 12px 18px rgba(239,68,68,.5));
          animation: jpFloat 2.5s ease-in-out infinite;
        }
        .jp-progress-track {
          width: min(320px, 68%);
          height: 8px;
          background: rgba(255,255,255,.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .jp-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #86efac);
          border-radius: 999px;
          transition: width .1s linear;
          box-shadow: 0 0 12px rgba(34,197,94,.5);
        }
        .jp-loading-text { color: #94a3b8; font-size: 12px; font-weight: 850; margin-top: 12px; }

        .jp-multiplier-box {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          pointer-events: none;
          text-align: center;
        }
        .jp-multiplier-text {
          font-size: clamp(56px, 10vw, 112px);
          font-weight: 1000;
          letter-spacing: -4px;
          background: linear-gradient(180deg, #fff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 34px rgba(255,255,255,.24);
        }
        .jp-multiplier-sub { color: #94a3b8; font-size: 13px; font-weight: 850; margin-top: -8px; }
        .jp-crashed-text {
          color: #ef4444;
          font-size: clamp(28px, 5vw, 46px);
          font-weight: 1000;
          letter-spacing: -1.4px;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .jp-crash-x {
          width: 34px; height: 34px;
          padding: 6px;
          border-radius: 10px;
          background: rgba(239,68,68,.14);
          border: 1px solid rgba(239,68,68,.3);
        }
        .jp-crash-multiplier { color: #94a3b8; font-size: 16px; font-weight: 900; margin-top: 6px; }

        .jp-round-stats {
          position: absolute; left: 14px; right: 14px; bottom: 14px;
          display: flex; justify-content: space-between; gap: 10px;
          font-size: 12px; font-weight: 900;
        }
        .jp-round-stat {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(2,6,23,.7);
          border: 1px solid rgba(255,255,255,.08);
          backdrop-filter: blur(6px);
        }
        .jp-round-stat-win  { color: #22c55e; border-color: rgba(34,197,94,.2); }
        .jp-round-stat-lose { color: #f87171; border-color: rgba(239,68,68,.2); }

        .jp-ledger-header {
          color: #7b8aa1;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 16px 0 8px;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .jp-ledger {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
          max-height: 265px;
          overflow: auto;
          padding-right: 2px;
        }
        .jp-ledger::-webkit-scrollbar { width: 6px; }
        .jp-ledger::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 999px; }

        .jp-bet-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          align-items: center;
          background: rgba(2,6,23,.58);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 12px;
          padding: 10px 11px;
          font-size: 12px;
          transition: border-color .2s ease, background .2s ease;
        }
        .jp-bet-row:hover { border-color: rgba(255,255,255,.16); background: rgba(2,6,23,.8); }
        .jp-bet-user {
          color: #cbd5e1; font-weight: 850;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .jp-bet-stake { color: #fff; font-weight: 950; font-size: 11px; }
        .jp-win-pill {
          grid-column: 1 / -1;
          color: #22c55e;
          background: rgba(34,197,94,.11);
          border: 1px solid rgba(34,197,94,.2);
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 900;
          width: fit-content;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .jp-pending-pill {
          grid-column: 1 / -1;
          font-size: 11px; font-weight: 900;
          color: #94a3b8;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .jp-pending-lost { color: #ef4444; }

        /* ---------- Jackpot ---------- */
        .jp-jackpot-section {
          position: relative; z-index: 2;
          max-width: 1180px;
          margin: 24px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1.5fr .75fr .75fr;
          gap: 14px;
        }
        .jp-jackpot-card {
          display: flex; gap: 20px; align-items: center;
          background: linear-gradient(135deg, rgba(251,191,36,.16), rgba(225,29,72,.12));
          border: 1px solid rgba(251,191,36,.25);
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 24px 70px rgba(0,0,0,.28);
        }
        .jp-jackpot-icon {
          width: 78px; height: 78px;
          border-radius: 22px;
          display: grid; place-items: center;
          background: linear-gradient(135deg, #f59e0b, #e11d48);
          color: #fff;
          box-shadow: 0 20px 44px rgba(245,158,11,.22), inset 0 1px 0 rgba(255,255,255,.2);
          flex: 0 0 auto;
        }
        .jp-section-kicker {
          color: #22c55e;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 1.2px;
        }
        .jp-section-title {
          margin: 8px 0 10px;
          font-size: clamp(26px, 4vw, 44px);
          line-height: 1.02;
          letter-spacing: -1.8px;
          font-weight: 1000;
        }
        .jp-section-text { color: #94a3b8; line-height: 1.65; margin: 0; font-size: 15px; }

        .jp-mini-card {
          background: rgba(15,23,42,.74);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 22px;
          padding: 22px;
          transition: border-color .2s ease, transform .2s ease;
        }
        .jp-mini-card:hover { border-color: rgba(255,255,255,.18); transform: translateY(-2px); }
        .jp-mini-card strong { display: block; font-size: 17px; font-weight: 900; margin-bottom: 6px; }
        .jp-mini-card p { color: #94a3b8; margin: 0; font-size: 14px; line-height: 1.55; }
        .jp-mini-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: grid; place-items: center;
          margin-bottom: 16px;
          background: rgba(255,255,255,.08);
        }
        .jp-mini-icon-rose  { background: rgba(244,63,94,.14); color: #f43f5e; }
        .jp-mini-icon-indigo { background: rgba(99,102,241,.16); color: #818cf8; }

        /* ---------- Features ---------- */
        .jp-feature-section {
          position: relative; z-index: 2;
          max-width: 1180px;
          margin: 54px auto;
          padding: 0 20px;
        }
        .jp-center-copy { text-align: center; max-width: 700px; margin: 0 auto 24px; }
        .jp-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .jp-feature-card {
          background: rgba(15,23,42,.74);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 20px;
          padding: 20px;
          min-height: 168px;
          transition: border-color .2s ease, transform .2s ease, background .2s ease;
        }
        .jp-feature-card:hover {
          border-color: rgba(255,255,255,.18);
          transform: translateY(-3px);
          background: rgba(15,23,42,.9);
        }
        .jp-feature-card strong { display: block; font-size: 16px; font-weight: 900; margin-bottom: 6px; }
        .jp-feature-card p { color: #94a3b8; margin: 0; font-size: 13.5px; line-height: 1.55; }
        .jp-feature-icon {
          width: 46px; height: 46px;
          border-radius: 14px;
          display: grid; place-items: center;
          background: linear-gradient(135deg, rgba(225,29,72,.22), rgba(34,197,94,.14));
          color: #fff;
          margin-bottom: 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
        }

        /* ---------- How it works ---------- */
        .jp-how {
          position: relative; z-index: 2;
          max-width: 1180px;
          margin: 54px auto;
          padding: 0 20px;
        }
        .jp-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .jp-step-card {
          background: rgba(2,6,23,.54);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px;
          padding: 20px;
          transition: border-color .2s ease, transform .2s ease;
        }
        .jp-step-card:hover { border-color: rgba(255,255,255,.18); transform: translateY(-2px); }
        .jp-step-card strong { display: block; font-size: 16px; font-weight: 900; margin: 14px 0 6px; }
        .jp-step-card p { color: #94a3b8; margin: 0; font-size: 13.5px; line-height: 1.55; }
        .jp-step-head { display: flex; align-items: center; justify-content: space-between; }
        .jp-step-num {
          display: grid; place-items: center;
          width: 38px; height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e11d48, #be123c);
          font-weight: 1000;
          box-shadow: 0 10px 24px rgba(225,29,72,.3), inset 0 1px 0 rgba(255,255,255,.15);
        }
        .jp-step-icon {
          width: 38px; height: 38px;
          border-radius: 12px;
          display: grid; place-items: center;
          background: rgba(255,255,255,.06);
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,.08);
        }

        /* ---------- Final CTA ---------- */
        .jp-final-cta {
          position: relative; z-index: 2;
          max-width: 1180px;
          margin: 54px auto 28px;
          padding: 32px;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(225,29,72,.18), rgba(34,197,94,.12));
          border: 1px solid rgba(255,255,255,.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          box-shadow: 0 30px 80px rgba(0,0,0,.35);
        }
        .jp-final-title {
          margin: 8px 0 8px;
          font-size: clamp(28px, 5vw, 48px);
          line-height: 1;
          letter-spacing: -2px;
          font-weight: 1000;
        }
        .jp-final-text { color: #94a3b8; margin: 0; max-width: 680px; line-height: 1.6; }
        .jp-final-cta-btn { padding: 16px 28px; font-size: 15px; }

        /* ---------- Footer ---------- */
        .jp-footer {
          position: relative; z-index: 2;
          max-width: 1180px;
          margin: 0 auto;
          padding: 22px 20px 34px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
          border-top: 1px solid rgba(255,255,255,.06);
        }
        .jp-footer-brand {
          display: inline-flex; align-items: center; gap: 8px;
          color: #cbd5e1;
          font-weight: 950;
          letter-spacing: .5px;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1100px) {
          .jp-hero { grid-template-columns: 1fr !important; }
          .jp-feature-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .jp-jackpot-section { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .jp-stats, .jp-feature-grid, .jp-steps-grid { grid-template-columns: 1fr !important; }
          .jp-nav-center { display: none !important; }
        }
        @media (max-width: 620px) {
          body { overflow-x: hidden; }
          .jp-hero { padding-top: 34px !important; gap: 28px !important; }
          .jp-final-cta { padding: 22px; }
        }
      `}</style>
    </main>
  );
}

function FloatingJetSvg() {
  return (
    <div className="jp-jet-svg-wrap">
      <svg viewBox="0 0 420 240" className="jp-jet-svg" role="img" aria-label="3D jet illustration">
        <defs>
          <linearGradient id="jpJetBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="52%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="jpWing" x1="0" x2="1">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="jpTrail" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(244,63,94,0)" />
            <stop offset="100%" stopColor="rgba(244,63,94,.6)" />
          </linearGradient>
          <filter id="jpShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        <path d="M30 178 C100 128 176 96 348 72" stroke="url(#jpTrail)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M52 192 C134 142 204 111 370 90" stroke="rgba(34,197,94,.22)" strokeWidth="4" fill="none" strokeLinecap="round" />

        <g filter="url(#jpShadow)" transform="translate(70 44) rotate(-8 160 80)">
          <path d="M32 92 C105 38 230 31 318 76 C243 121 118 132 32 92Z" fill="url(#jpJetBody)" />
          <path d="M132 80 L58 24 L88 92 Z" fill="url(#jpWing)" />
          <path d="M144 100 L70 168 L98 94 Z" fill="#991b1b" />
          <path d="M258 62 C283 64 306 69 330 78 C305 87 282 92 256 94 C272 82 272 74 258 62Z" fill="#fff" />
          <ellipse cx="178" cy="69" rx="34" ry="13" fill="#0f172a" opacity=".92" />
          <ellipse cx="178" cy="69" rx="18" ry="6" fill="#38bdf8" opacity=".75" />
          <path d="M28 92 L-24 73 L-5 94 L-25 114 Z" fill="#fbbf24" />
        </g>

        <circle cx="74" cy="54" r="5" fill="#22c55e" opacity=".9" />
        <circle cx="350" cy="38" r="4" fill="#f43f5e" opacity=".9" />
        <circle cx="384" cy="150" r="6" fill="#fbbf24" opacity=".9" />
      </svg>
    </div>
  );
}
