'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/* -------------------------------------------------------------------------- */
/*  Icon System — Professional, scalable SVG replacements                     */
/* -------------------------------------------------------------------------- */
function Icon({ name, size = 18, className = '' }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  };

  switch (name) {
    case 'plane':
      return <svg {...props}><path d="M17.8 16.8 21 21l-4.2-3.2" /><path d="M2.5 13.5 21 3l-8.5 18-2.7-7.3-7.3-2.7Z" /></svg>;
    case 'user':
      return <svg {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case 'mail':
      return <svg {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
    case 'phone':
      return <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
    case 'lock':
      return <svg {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case 'alert-triangle':
      return <svg {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
    case 'shield-check':
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>;
    case 'loader-2':
      return <svg {...props} className={`jp-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Auth Form Component                                                       */
/* -------------------------------------------------------------------------- */
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
    return cleaned.length === 10 && (cleaned.startsWith('07') || cleaned.startsWith('01'));
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

      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
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
    <div className="jp-auth-card">
      <div className="jp-auth-logo-wrap">
        <div className="jp-auth-plane-badge">
          <Icon name="plane" size={28} />
        </div>
        <h1 className="jp-auth-logo">
          JET<span>PESA</span>
        </h1>
        <p className="jp-auth-subtitle">Fast flights. Instant cashouts.</p>
      </div>

      <div className="jp-auth-tabs">
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setActiveTab('login');
            setErrorMsg('');
          }}
          className={`jp-auth-tab ${activeTab === 'login' ? 'jp-active' : ''}`}
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
          className={`jp-auth-tab ${activeTab === 'signup' ? 'jp-active' : ''}`}
        >
          Sign Up
        </button>
      </div>

      {errorMsg && (
        <div className="jp-auth-error" role="alert">
          <Icon name="alert-triangle" size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleAuthenticationExecution} className="jp-auth-form">
        {activeTab === 'login' ? (
          <div className="jp-input-group">
            <label className="jp-input-label">EMAIL OR PHONE</label>
            <div className="jp-input-wrapper">
              <Icon name={loginIdentifier.includes('@') ? 'mail' : 'user'} size={18} className="jp-input-icon" />
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Email or 07XXXXXXXX"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="jp-input-field"
                aria-invalid={!!errorMsg}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="jp-input-group">
              <label className="jp-input-label">EMAIL ADDRESS</label>
              <div className="jp-input-wrapper">
                <Icon name="mail" size={18} className="jp-input-icon" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="jp-input-field"
                />
              </div>
            </div>

            <div className="jp-input-group">
              <label className="jp-input-label">M-PESA NUMBER</label>
              <div className="jp-input-wrapper">
                <Icon name="phone" size={18} className="jp-input-icon" />
                <input
                  type="tel"
                  required
                  disabled={loading}
                  placeholder="0712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="jp-input-field"
                />
              </div>
            </div>
          </>
        )}

        <div className="jp-input-group">
          <label className="jp-input-label">PASSWORD</label>
          <div className="jp-input-wrapper">
            <Icon name="lock" size={18} className="jp-input-icon" />
            <input
              type="password"
              required
              disabled={loading}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="jp-input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`jp-auth-submit ${activeTab === 'login' ? 'jp-auth-submit-login' : 'jp-auth-submit-signup'}`}
        >
          {loading ? (
            <>
              <Icon name="loader-2" size={18} />
              PLEASE WAIT...
            </>
          ) : activeTab === 'login' ? (
            'SIGN IN'
          ) : (
            'CREATE ACCOUNT'
          )}
        </button>
      </form>

      <p className="jp-auth-footer">
        <Icon name="shield-check" size={14} />
        Secure wallet access for JetPesa Aviator.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Portal Component                                                     */
/* -------------------------------------------------------------------------- */
export default function AuthenticatonPortal() {
  return (
    <div className="jp-auth-page">
      <div className="jp-auth-glow" />
      <div className="jp-auth-glow-2" />
      
      <Suspense
        fallback={
          <div className="jp-loading-fallback">
            <Icon name="loader-2" size={20} />
            Loading secure environment...
          </div>
        }
      >
        <AuthForm />
      </Suspense>

      <style>{`
        .jp-auth-page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #1e293b 0%, #07080e 42%, #020617 100%);
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .jp-auth-glow {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          background: rgba(225, 29, 72, 0.15);
          filter: blur(100px);
          top: -160px;
          right: -140px;
          pointer-events: none;
        }
        .jp-auth-glow-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.1);
          filter: blur(90px);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
        }
        .jp-auth-card {
          width: 100%;
          max-width: 440px;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 36px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: relative;
          z-index: 2;
          animation: jpSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes jpSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .jp-auth-logo-wrap {
          text-align: center;
          margin-bottom: 28px;
        }
        .jp-auth-plane-badge {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ef4444, #991b1b);
          box-shadow: 0 14px 40px rgba(239, 68, 68, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          color: #fff;
        }
        .jp-auth-logo {
          margin: 0;
          font-size: 32px;
          font-weight: 950;
          letter-spacing: -1.5px;
          color: #fff;
        }
        .jp-auth-logo span {
          background: linear-gradient(135deg, #22c55e, #86efac);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .jp-auth-subtitle {
          margin: 8px 0 0;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 600;
        }
        .jp-auth-tabs {
          display: flex;
          gap: 6px;
          background: rgba(0, 0, 0, 0.3);
          padding: 5px;
          border-radius: 14px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .jp-auth-tab {
          flex: 1;
          border: none;
          background: transparent;
          color: #94a3b8;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .jp-auth-tab:hover:not(:disabled) {
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.05);
        }
        .jp-auth-tab.jp-active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .jp-auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: jpShake 0.4s ease-in-out;
        }
        @keyframes jpShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .jp-auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .jp-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .jp-input-label {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .jp-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .jp-input-icon {
          position: absolute;
          left: 14px;
          color: #64748b;
          transition: color 0.2s ease;
          pointer-events: none;
        }
        .jp-input-field {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 14px 14px 42px;
          background: rgba(2, 6, 23, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          outline: none;
          transition: all 0.2s ease;
        }
        .jp-input-field::placeholder {
          color: #475569;
          font-weight: 500;
        }
        .jp-input-field:hover {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(2, 6, 23, 0.8);
        }
        .jp-input-field:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
          background: rgba(2, 6, 23, 0.9);
        }
        .jp-input-wrapper:focus-within .jp-input-icon {
          color: #22c55e;
        }
        .jp-auth-submit {
          width: 100%;
          margin-top: 8px;
          padding: 16px;
          border: none;
          color: #fff;
          font-weight: 900;
          border-radius: 14px;
          font-size: 14px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        .jp-auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
          filter: brightness(1.1);
        }
        .jp-auth-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .jp-auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .jp-auth-submit-login {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }
        .jp-auth-submit-signup {
          background: linear-gradient(135deg, #ef4444, #be123c);
        }
        .jp-auth-footer {
          margin: 24px 0 0;
          text-align: center;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .jp-spin {
          animation: jpSpin 1s linear infinite;
        }
        @keyframes jpSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .jp-loading-fallback {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
