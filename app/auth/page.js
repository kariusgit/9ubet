'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState('login');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const targetTab = searchParams.get('tab');
    if (targetTab === 'signup' || targetTab === 'login') {
      setActiveTab(targetTab);
    }
  }, [searchParams]);

  const cleanPhone = (value) => value.trim().replace(/\s+/g, '');

  const resolveEmailFromPhone = async (phoneNum) => {
    const snap = await getDoc(doc(db, 'phoneLookup', cleanPhone(phoneNum)));

    if (!snap.exists()) {
      throw new Error('No account found with that phone number.');
    }

    return snap.data().email;
  };

  const validatePhone = (value) => {
    const cleaned = cleanPhone(value);
    return (
      cleaned.length === 10 &&
      (cleaned.startsWith('07') || cleaned.startsWith('01'))
    );
  };

  const handleAuthenticationExecution = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        let finalEmail = loginIdentifier.trim();

        if (!finalEmail.includes('@')) {
          finalEmail = await resolveEmailFromPhone(finalEmail);
        }

        await signInWithEmailAndPassword(auth, finalEmail, password);
        router.replace('/dashboard');
        return;
      }

      if (!validatePhone(phone)) {
        throw new Error('Enter a valid phone number, e.g. 0712345678 or 0112345678.');
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanMpesaPhone = cleanPhone(phone);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const uid = userCredential.user.uid;

      await Promise.all([
        setDoc(doc(db, 'users', uid), {
          uid,
          email: cleanEmail,
          mpesaPhone: cleanMpesaPhone,
          walletBalance: 0.0,
          createdAt: new Date().toISOString(),
        }),

        setDoc(doc(db, 'phoneLookup', cleanMpesaPhone), {
          uid,
          email: cleanEmail,
        }),
      ]);

      router.replace('/dashboard');
    } catch (err) {
      setErrorMsg(err.message.replace('Firebase:', '').trim());
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.logoWrap}>
        <div style={styles.planeBadge}>✈</div>
        <h1 style={styles.logo}>JETPESA</h1>
        <p style={styles.subtitle}>Fast flights. Instant cashouts.</p>
      </div>

      <div style={styles.tabs}>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setActiveTab('login');
            setErrorMsg('');
          }}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'login' ? styles.activeTab : {}),
          }}
        >
          Sign In
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setActiveTab('signup');
            setErrorMsg('');
          }}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'signup' ? styles.activeTab : {}),
          }}
        >
          Sign Up
        </button>
      </div>

      {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

      <form onSubmit={handleAuthenticationExecution} style={styles.form}>
        {activeTab === 'login' ? (
          <Field label="EMAIL OR PHONE">
            <input
              type="text"
              required
              disabled={loading}
              placeholder="Email or 07XXXXXXXX"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              style={styles.input}
            />
          </Field>
        ) : (
          <>
            <Field label="EMAIL ADDRESS">
              <input
                type="email"
                required
                disabled={loading}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </Field>

            <Field label="M-PESA NUMBER">
              <input
                type="tel"
                required
                disabled={loading}
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />
            </Field>
          </>
        )}

        <Field label="PASSWORD">
          <input
            type="password"
            required
            disabled={loading}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitButton,
            background:
              activeTab === 'login'
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #ef4444, #be123c)',
            opacity: loading ? 0.65 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? 'PLEASE WAIT...'
            : activeTab === 'login'
              ? 'SIGN IN'
              : 'CREATE ACCOUNT'}
        </button>
      </form>

      <p style={styles.footerText}>
        Secure wallet access for JetPesa Aviator.
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

export default function AuthenticatonPortal() {
  return (
    <div style={styles.page}>
      <div style={styles.skyGlow} />
      <div style={styles.runwayLine} />
      <Suspense fallback={<div style={styles.loading}>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top, #1e293b 0%, #07080e 42%, #020617 100%)',
    color: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },

  skyGlow: {
    position: 'absolute',
    width: '520px',
    height: '520px',
    borderRadius: '999px',
    background: 'rgba(225, 29, 72, 0.18)',
    filter: 'blur(90px)',
    top: '-160px',
    right: '-140px',
  },

  runwayLine: {
    position: 'absolute',
    width: '120%',
    height: '2px',
    background:
      'linear-gradient(to right, transparent, rgba(255,255,255,0.22), transparent)',
    transform: 'rotate(-18deg)',
    bottom: '18%',
  },

  card: {
    width: '100%',
    maxWidth: '430px',
    background: 'rgba(15, 23, 42, 0.82)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '28px',
    padding: '32px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
    backdropFilter: 'blur(18px)',
    position: 'relative',
    zIndex: 2,
  },

  logoWrap: {
    textAlign: 'center',
    marginBottom: '26px',
  },

  planeBadge: {
    width: '58px',
    height: '58px',
    borderRadius: '18px',
    margin: '0 auto 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    background: 'linear-gradient(135deg, #ef4444, #7f1d1d)',
    boxShadow: '0 14px 40px rgba(239,68,68,0.35)',
  },

  logo: {
    margin: 0,
    fontSize: '34px',
    fontWeight: 950,
    letterSpacing: '-1.5px',
  },

  subtitle: {
    margin: '6px 0 0',
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: 700,
  },

  tabs: {
    display: 'flex',
    gap: '6px',
    background: 'rgba(0,0,0,0.32)',
    padding: '5px',
    borderRadius: '14px',
    marginBottom: '22px',
  },

  tabButton: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    padding: '12px',
    borderRadius: '11px',
    fontSize: '13px',
    fontWeight: 900,
  },

  activeTab: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: 900,
    letterSpacing: '0.7px',
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 15px',
    background: 'rgba(2,6,23,0.8)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: '#fff',
    borderRadius: '13px',
    fontSize: '14px',
    outline: 'none',
  },

  submitButton: {
    width: '100%',
    marginTop: '8px',
    padding: '15px',
    border: 'none',
    color: '#fff',
    fontWeight: 950,
    borderRadius: '14px',
    fontSize: '14px',
    boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
  },

  errorBox: {
    background: 'rgba(239,68,68,0.11)',
    border: '1px solid rgba(239,68,68,0.35)',
    color: '#fca5a5',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 800,
    marginBottom: '16px',
    textAlign: 'center',
  },

  footerText: {
    margin: '18px 0 0',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: 700,
  },

  loading: {
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: 800,
  },
};
