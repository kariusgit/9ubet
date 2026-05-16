'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function GlassmorphismAuthGateway() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [gateError, setGateError] = useState('');

  const executeGateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGateError('');
    try {
      if (isSignUp) {
        if (!phone.startsWith('07') && !phone.startsWith('01')) {
          throw new Error('Please provide a valid Safaricom phone format structure.');
        }
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", credential.user.uid), {
          uid: credential.user.uid,
          email,
          mpesaPhone: phone,
          walletBalance: 0.0,
          secretDepositSum: 0,
          secretLossSum: 0,
          secretFreeBets: 0,
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (err) {
      setGateError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 50%, #11131e 0%, #050609 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Ambient Blur Blobs */}
      <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'rgba(225,29,72,0.15)', borderRadius: '50%', filter: 'blur(80px)', top: '10%', left: '15%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(168,85,247,0.12)', borderRadius: '50%', filter: 'blur(100px)', bottom: '10%', right: '15%', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', marginBottom: '28px', zIndex: 2 }}>
        <h1 style={{ fontSize: '3.2rem', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
          JetPesa<span style={{ color: '#e11d48' }}>.🚀</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: '600', maxWidth: '440px', margin: '0 auto', lineHeight: '1.5' }}>
          The fastest multiplying crash arena in East Africa. Watch the altitude swell, retain control, and unlock financial scale in seconds.
        </p>
      </div>

      {/* Glassmorphic Portal Core Frame */}
      <div style={{ width: '100%', maxWidth: '400px', background: 'rgba(18, 20, 32, 0.45)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', zIndex: 2 }}>
        
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
          <button onClick={() => { setIsSignUp(false); setGateError(''); }} style={{ flex: 1, padding: '10px', background: !isSignUp ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>LOGIN</button>
          <button onClick={() => { setIsSignUp(true); setGateError(''); }} style={{ flex: 1, padding: '10px', background: isSignUp ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>SIGN UP</button>
        </div>

        {gateError && (
          <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>
            {gateError}
          </div>
        )}

        <form onSubmit={executeGateTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '6px' }}>EMAIL PROFILE NODE</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="pilot@jetpesa.com" style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          {isSignUp && (
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '6px' }}>SAFARICOM TELEPHONE (M-PESA)</label>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712345678" style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '6px' }}>SECURE ACCESS KEY</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '8px', background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', border: 'none', color: '#fff', fontWeight: '900', fontSize: '14px', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(225,29,72,0.35)', transition: 'transform 0.2s' }}>
            {loading ? 'SYNCHRONIZING SECURE TUNNEL...' : isSignUp ? 'REGISTER PROFILE & RECEIVE BONUS' : 'START RADAR OPERATIONS'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#475569', marginTop: '20px', fontWeight: '600', margin: '20px 0 0 0' }}>
          By establishing connectivity, you certify your age parameter is strictly 18+.
        </p>
      </div>
    </div>
  );
}
