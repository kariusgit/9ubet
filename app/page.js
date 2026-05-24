'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#020617');
      bg.addColorStop(0.5, '#08111f');
      bg.addColorStop(1, '#111827');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

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

      for (let i = 0; i < 55; i++) {
        const x = (i * 97 + elapsed * 0.018) % W;
        const y = (i * 53) % H;
        ctx.fillStyle = i % 4 === 0 ? 'rgba(34,197,94,0.32)' : 'rgba(255,255,255,0.18)';
        ctx.fillRect(x, y, 1.6, 1.6);
      }

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
            prev.map((b) =>
              b.cashedOut
                ? b
                : {
                    ...b,
                    lost: true,
                  }
            )
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

  return (
    <main style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />
      <div style={styles.glowThree} />

      <nav style={styles.nav}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandIcon}>✈</span>
          <span>JETPESA</span>
        </Link>

        <div style={styles.navCenter}>
          <a href="#demo" style={styles.navLink}>Live Demo</a>
          <a href="#jackpot" style={styles.navLink}>Jackpot</a>
          <a href="#features" style={styles.navLink}>Features</a>
        </div>

        <div style={styles.navActions}>
          <Link href="/auth?tab=login" style={styles.loginLink}>
            Login
          </Link>
          <Link href="/auth?tab=signup" style={styles.joinButton}>
            Join Now
          </Link>
        </div>
      </nav>

      <section className="hero-grid" style={styles.hero}>
        <div style={styles.copy}>
          <div style={styles.badge}>
            <span style={styles.pulseDot} />
            LIVE AVIATOR MULTIPLIER GAME
          </div>

          <h1 style={styles.title}>
            Fly higher.
            <br />
            Cash out faster.
            <br />
            Own the runway.
          </h1>

          <p style={styles.text}>
            JetPesa is a premium Aviator-style betting experience built for fast
            rounds, clean wallet tracking, mobile-first play, and high-energy
            cashout moments before the plane flies away.
          </p>

          <div style={styles.ctaRow}>
            <Link href="/auth?tab=signup" style={styles.primaryCta}>
              Start Playing
            </Link>

            <Link href="/auth?tab=login" style={styles.secondaryCta}>
              Watch Demo
            </Link>
          </div>

          <div className="stats-grid" style={styles.stats}>
            <div style={styles.statCard}>
              <strong style={styles.statValue}>KES 49</strong>
              <span style={styles.statLabel}>Minimum entry</span>
            </div>

            <div style={styles.statCard}>
              <strong style={styles.statValue}>KES 50M</strong>
              <span style={styles.statLabel}>Weekly top wager jackpot</span>
            </div>

            <div style={styles.statCard}>
              <strong style={styles.statValue}>100x+</strong>
              <span style={styles.statLabel}>Demo multiplier flight</span>
            </div>
          </div>

          <div style={styles.trustRow}>
            <span>🔐 Secure login</span>
            <span>📱 M-Pesa ready</span>
            <span>⚡ Fast rounds</span>
          </div>
        </div>

        <div style={styles.visualStack}>
          <FloatingJetSvg />

          <div id="demo" style={styles.demoCard}>
            <div style={styles.demoTop}>
              <div>
                <div style={styles.liveDotRow}>
                  <span style={styles.liveDot} />
                  <span style={styles.liveText}>LIVE ROUND</span>
                </div>
                <div style={styles.onlineText}>{totalPoolUsers.toLocaleString()} pilots online</div>
              </div>

              <div style={styles.walletPill}>KES Wallet</div>
            </div>

            <div style={styles.canvasWrap}>
              {demoStatus === 'loading' && (
                <div style={styles.loadingOverlay}>
                  <div style={styles.loaderPlane}>✈</div>
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

              <canvas ref={canvasRef} style={styles.canvas} />

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
                    <>
                      <div style={styles.multiplierText}>
                        {demoMultiplier.toFixed(2)}x
                      </div>
                      <div style={styles.multiplierSub}>cash out before takeoff peak</div>
                    </>
                  )}
                </div>
              )}

              <div style={styles.roundStats}>
                <span>✅ {activeWinners} cashed out</span>
                <span>❌ {activeLosers} lost</span>
              </div>
            </div>

            <div style={styles.ledgerHeader}>Live Round Allocations</div>

            <div style={styles.ledger}>
              {demoBets.map((b, idx) => (
                <div key={idx} style={styles.betRow}>
                  <span style={styles.betUser}>{b.user}</span>
                  <span style={styles.betStake}>{b.stake.toLocaleString()} KES</span>

                  {b.cashedOut ? (
                    <span style={styles.winPill}>
                      {b.finalMult.toFixed(2)}x +{b.winAmount.toLocaleString()}
                    </span>
                  ) : (
                    <span
                      style={{
                        ...styles.pendingPill,
                        color: demoStatus === 'crashed' ? '#ef4444' : '#94a3b8',
                      }}
                    >
                      {demoStatus === 'crashed' ? 'Lost' : 'Flying'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="jackpot" className="jackpot-grid" style={styles.jackpotSection}>
        <div style={styles.jackpotCard}>
          <div style={styles.jackpotIcon}>🏆</div>
          <div>
            <span style={styles.sectionKicker}>WEEKLY HIGH ROLLER JACKPOT</span>
            <h2 style={styles.sectionTitle}>
              KES {weeklyPot.toLocaleString()} jackpot every week.
            </h2>
            <p style={styles.sectionText}>
              The highest verified wager volume of the week gets a premium jackpot
              allocation. Keep flying, keep climbing, and finish at the top of the runway.
            </p>
          </div>
        </div>

        <div style={styles.miniCard}>
          <span style={styles.miniIcon}>🚀</span>
          <strong>Turbo Rounds</strong>
          <p>Rapid Aviator-style gameplay designed for mobile bettors.</p>
        </div>

        <div style={styles.miniCard}>
          <span style={styles.miniIcon}>💎</span>
          <strong>VIP Missions</strong>
          <p>Daily missions, streak rewards, and wager milestones.</p>
        </div>
      </section>

      <section id="features" style={styles.featureSection}>
        <div style={styles.centerCopy}>
          <span style={styles.sectionKicker}>BUILT FOR SPEED</span>
          <h2 style={styles.sectionTitle}>A sharper betting flight deck.</h2>
          <p style={styles.sectionText}>
            Give players a landing page that feels polished, alive, and conversion-ready.
          </p>
        </div>

        <div className="feature-grid" style={styles.featureGrid}>
          {[
            ['⚡', 'Instant Cashout', 'Cash out while the plane is still climbing.'],
            ['📊', 'Live Multiplier', 'Animated multiplier with real-time demo action.'],
            ['👥', 'Player Feed', 'Many simulated users winning and a few missing the flight.'],
            ['🏆', '50M Jackpot', 'Weekly top wager prize for serious players.'],
            ['🔐', 'Secure Access', 'Professional auth-focused call-to-actions.'],
            ['📱', 'Small Screen Ready', 'Responsive cards, ledger, nav, and hero layout.'],
            ['💸', 'Wallet UX', 'KES wallet messaging with M-Pesa-ready positioning.'],
            ['✈️', 'Aviator Visuals', '3D-inspired jet, runway lights, glow cards, and motion.'],
          ].map(([icon, title, text]) => (
            <div key={title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{icon}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.howItWorks}>
        <div style={styles.centerCopy}>
          <span style={styles.sectionKicker}>HOW IT WORKS</span>
          <h2 style={styles.sectionTitle}>Bet. Fly. Cash out.</h2>
        </div>

        <div className="steps-grid" style={styles.stepsGrid}>
          {[
            ['1', 'Place your stake', 'Choose your KES amount before the aircraft launches.'],
            ['2', 'Watch the multiplier', 'The multiplier climbs higher as the jet flies.'],
            ['3', 'Cash out early', 'Secure winnings before the plane disappears.'],
            ['4', 'Compete weekly', 'Push your wager volume for the 50M jackpot race.'],
          ].map(([num, title, text]) => (
            <div key={num} style={styles.stepCard}>
              <span style={styles.stepNum}>{num}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.finalCta}>
        <div>
          <span style={styles.sectionKicker}>READY FOR TAKEOFF?</span>
          <h2 style={styles.finalTitle}>Join JetPesa and enter the next round.</h2>
          <p style={styles.finalText}>
            Professional Aviator-style betting interface with live demo action,
            mobile responsiveness, jackpot positioning, and conversion-focused UI.
          </p>
        </div>

        <Link href="/auth?tab=signup" style={styles.primaryCta}>
          Create Account
        </Link>
      </section>

      <footer style={styles.footer}>
        <span>JETPESA</span>
        <span>Demo values are simulated for landing-page presentation.</span>
        <span>Play responsibly. 18+</span>
      </footer>

      <style>{`
        @media (max-width: 1100px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }

          .feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .jackpot-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 760px) {
          .stats-grid,
          .feature-grid,
          .steps-grid {
            grid-template-columns: 1fr !important;
          }

          nav .nav-center {
            display: none !important;
          }
        }

        @media (max-width: 620px) {
          body {
            overflow-x: hidden;
          }

          .hero-grid {
            padding-top: 34px !important;
            gap: 28px !important;
          }
        }

        @keyframes floatJet {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: .65; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </main>
  );
}

function FloatingJetSvg() {
  return (
    <div style={styles.jetSvgWrap}>
      <svg viewBox="0 0 420 240" style={styles.jetSvg} role="img" aria-label="3D jet illustration">
        <defs>
          <linearGradient id="jetBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="52%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="wing" x1="0" x2="1">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        <path d="M30 178 C100 128 176 96 348 72" stroke="rgba(244,63,94,.42)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M52 192 C134 142 204 111 370 90" stroke="rgba(34,197,94,.22)" strokeWidth="4" fill="none" strokeLinecap="round" />

        <g filter="url(#shadow)" transform="translate(70 44) rotate(-8 160 80)">
          <path d="M32 92 C105 38 230 31 318 76 C243 121 118 132 32 92Z" fill="url(#jetBody)" />
          <path d="M132 80 L58 24 L88 92 Z" fill="url(#wing)" />
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

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top left, #172554 0%, #07080e 38%, #020617 100%)',
    color: '#f8fafc',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },

  glowOne: {
    position: 'absolute',
    width: 560,
    height: 560,
    borderRadius: '999px',
    background: 'rgba(225,29,72,0.22)',
    filter: 'blur(110px)',
    top: -200,
    right: -170,
  },

  glowTwo: {
    position: 'absolute',
    width: 460,
    height: 460,
    borderRadius: '999px',
    background: 'rgba(34,197,94,0.15)',
    filter: 'blur(110px)',
    bottom: 90,
    left: -160,
  },

  glowThree: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: '999px',
    background: 'rgba(251,191,36,0.1)',
    filter: 'blur(100px)',
    top: 420,
    right: '18%',
  },

  nav: {
    position: 'relative',
    zIndex: 5,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
    padding: '18px clamp(16px, 5vw, 64px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(2,6,23,0.72)',
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
    width: 36,
    height: 36,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #ef4444, #991b1b)',
    boxShadow: '0 12px 28px rgba(239,68,68,0.35)',
  },

  navCenter: {
    className: 'nav-center',
    display: 'flex',
    gap: 24,
    alignItems: 'center',
  },

  navLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 850,
  },

  navActions: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },

  loginLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 850,
  },

  joinButton: {
    color: '#fff',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    padding: '11px 22px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 950,
    boxShadow: '0 12px 30px rgba(34,197,94,0.25)',
    whiteSpace: 'nowrap',
  },

  hero: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1280,
    margin: '0 auto',
    padding: '68px 20px 34px',
    display: 'grid',
    gridTemplateColumns: '0.92fr 1.08fr',
    gap: 46,
    alignItems: 'center',
  },

  copy: {
    maxWidth: 610,
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#22c55e',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.22)',
    padding: '8px 14px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: '0.8px',
    marginBottom: 20,
  },

  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: '#22c55e',
    boxShadow: '0 0 18px #22c55e',
    animation: 'pulseGlow 1.5s infinite',
  },

  title: {
    fontSize: 'clamp(42px, 6.6vw, 82px)',
    lineHeight: 0.93,
    letterSpacing: '-3.4px',
    margin: '0 0 22px',
    fontWeight: 1000,
  },

  text: {
    color: '#a8b4c7',
    fontSize: 'clamp(15px, 2vw, 18px)',
    lineHeight: 1.75,
    margin: '0 0 32px',
    maxWidth: 560,
  },

  ctaRow: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    marginBottom: 30,
  },

  primaryCta: {
    textDecoration: 'none',
    color: '#fff',
    background: 'linear-gradient(135deg, #e11d48, #be123c)',
    padding: '16px 32px',
    borderRadius: 16,
    fontSize: 15,
    fontWeight: 950,
    boxShadow: '0 18px 40px rgba(225,29,72,0.32)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryCta: {
    textDecoration: 'none',
    color: '#e2e8f0',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '16px 28px',
    borderRadius: 16,
    fontSize: 15,
    fontWeight: 900,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
  },

  statCard: {
    background: 'rgba(15,23,42,0.72)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 18,
    padding: 16,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  },

  statValue: {
    display: 'block',
    fontSize: 19,
    marginBottom: 5,
  },

  statLabel: {
    color: '#7b8aa1',
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.35,
  },

  trustRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 850,
  },

  visualStack: {
    position: 'relative',
  },

  jetSvgWrap: {
    position: 'absolute',
    top: -76,
    right: -26,
    width: 'min(360px, 56vw)',
    zIndex: 3,
    pointerEvents: 'none',
    animation: 'floatJet 5s ease-in-out infinite',
  },

  jetSvg: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },

  demoCard: {
    position: 'relative',
    zIndex: 2,
    background: 'rgba(15,23,42,0.82)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 30,
    padding: 18,
    boxShadow: '0 34px 90px rgba(0,0,0,0.55)',
    backdropFilter: 'blur(18px)',
  },

  demoTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
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
    color: '#7b8aa1',
    fontSize: 12,
    fontWeight: 800,
    marginTop: 4,
  },

  walletPill: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.24)',
    color: '#22c55e',
    borderRadius: 999,
    padding: '8px 13px',
    fontSize: 12,
    fontWeight: 950,
    whiteSpace: 'nowrap',
  },

  canvasWrap: {
    height: 'clamp(270px, 44vw, 390px)',
    background: '#020617',
    borderRadius: 24,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
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
    background: 'rgba(2,6,23,0.88)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderPlane: {
    fontSize: 42,
    marginBottom: 16,
    transform: 'rotate(-12deg)',
    filter: 'drop-shadow(0 12px 18px rgba(239,68,68,.5))',
  },

  progressTrack: {
    width: 'min(320px, 68%)',
    height: 8,
    background: 'rgba(255,255,255,0.08)',
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
    textAlign: 'center',
  },

  multiplierText: {
    fontSize: 'clamp(56px, 10vw, 112px)',
    fontWeight: 1000,
    letterSpacing: '-4px',
    textShadow: '0 0 34px rgba(255,255,255,0.24)',
  },

  multiplierSub: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 900,
    marginTop: -8,
  },

  crashedText: {
    color: '#ef4444',
    fontSize: 'clamp(32px, 6vw, 54px)',
    fontWeight: 1000,
    letterSpacing: '-1.4px',
  },

  crashMultiplier: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: 900,
    marginTop: 4,
  },

  roundStats: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 900,
  },

  ledgerHeader: {
    color: '#7b8aa1',
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    margin: '16px 0 8px',
  },

  ledger: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 7,
    maxHeight: 265,
    overflow: 'auto',
    paddingRight: 2,
  },

  betRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 8,
    alignItems: 'center',
    background: 'rgba(2,6,23,0.58)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 13,
    padding: '10px 11px',
    fontSize: 12,
  },

  betUser: {
    color: '#cbd5e1',
    fontWeight: 850,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  betStake: {
    color: '#fff',
    fontWeight: 950,
    fontSize: 11,
  },

  winPill: {
    gridColumn: '1 / -1',
    color: '#22c55e',
    background: 'rgba(34,197,94,0.11)',
    border: '1px solid rgba(34,197,94,0.18)',
    borderRadius: 999,
    padding: '5px 8px',
    fontSize: 11,
    fontWeight: 950,
    width: 'fit-content',
  },

  pendingPill: {
    gridColumn: '1 / -1',
    fontSize: 11,
    fontWeight: 950,
  },

  jackpotSection: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1180,
    margin: '24px auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: '1.5fr 0.75fr 0.75fr',
    gap: 14,
  },

  jackpotCard: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(251,191,36,0.16), rgba(225,29,72,0.12))',
    border: '1px solid rgba(251,191,36,0.25)',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
  },

  jackpotIcon: {
    width: 78,
    height: 78,
    borderRadius: 24,
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #f59e0b, #e11d48)',
    fontSize: 36,
    boxShadow: '0 20px 44px rgba(245,158,11,0.22)',
    flex: '0 0 auto',
  },

  sectionKicker: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: '0.9px',
  },

  sectionTitle: {
    margin: '8px 0 10px',
    fontSize: 'clamp(28px, 4vw, 46px)',
    lineHeight: 1.02,
    letterSpacing: '-1.8px',
    fontWeight: 1000,
  },

  sectionText: {
    color: '#94a3b8',
    lineHeight: 1.65,
    margin: 0,
    fontSize: 15,
  },

  miniCard: {
    background: 'rgba(15,23,42,0.74)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 24,
    padding: 22,
  },

  miniIcon: {
    display: 'grid',
    placeItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.08)',
    fontSize: 24,
    marginBottom: 16,
  },

  featureSection: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1180,
    margin: '54px auto',
    padding: '0 20px',
  },

  centerCopy: {
    textAlign: 'center',
    maxWidth: 700,
    margin: '0 auto 24px',
  },

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 14,
  },

  featureCard: {
    background: 'rgba(15,23,42,0.74)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 22,
    padding: 20,
    minHeight: 168,
  },

  featureIcon: {
    display: 'grid',
    placeItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 16,
    background: 'linear-gradient(135deg, rgba(225,29,72,.22), rgba(34,197,94,.14))',
    fontSize: 24,
    marginBottom: 14,
  },

  howItWorks: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1180,
    margin: '54px auto',
    padding: '0 20px',
  },

  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 14,
  },

  stepCard: {
    background: 'rgba(2,6,23,0.54)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 22,
    padding: 20,
  },

  stepNum: {
    display: 'grid',
    placeItems: 'center',
    width: 38,
    height: 38,
    borderRadius: 14,
    background: '#e11d48',
    fontWeight: 1000,
    marginBottom: 14,
  },

  finalCta: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1180,
    margin: '54px auto 28px',
    padding: 28,
    borderRadius: 30,
    background: 'linear-gradient(135deg, rgba(225,29,72,0.18), rgba(34,197,94,0.12))',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },

  finalTitle: {
    margin: '8px 0 8px',
    fontSize: 'clamp(30px, 5vw, 54px)',
    lineHeight: 1,
    letterSpacing: '-2px',
  },

  finalText: {
    color: '#94a3b8',
    margin: 0,
    maxWidth: 680,
    lineHeight: 1.6,
  },

  footer: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1180,
    margin: '0 auto',
    padding: '22px 20px 34px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 850,
  },
};
