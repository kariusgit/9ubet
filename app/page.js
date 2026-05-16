'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Formats standard Kenyan phone contexts to structured email formats for Firebase Auth
  const formatMpesaEmail = (num) => {
    let clean = num.trim().replace(/\s+/g, '');
    if (clean.startsWith('0')) clean = '254' + clean.substring(1);
    if (!clean.startsWith('254')) clean = '254' + clean;
    return `${clean}@mpesa.jetpesa.local`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (mpesaNumber.length < 9 || password.length < 6) {
      setErrorMessage('Provide a valid Safaricom number and minimum 6-character password.');
      setLoading(false);
      return;
    }

    const mpesaEmail = formatMpesaEmail(mpesaNumber);

    try {
      if (isSignUp) {
        // Create Authentication profile
        const userCredential = await createUserWithEmailAndPassword(auth, mpesaEmail, password);
        const user = userCredential.user;

        // Establish core user document map with KES 25 Signup Bonus
        await setDoc(doc(db, "users", user.uid), {
          mpesaPhone: mpesaEmail.split('@')[0],
          walletBalance: 25.00,
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, mpesaEmail, password);
      }
      router.push('/dashboard');
    } catch (err) {
      setErrorMessage(err.message.includes('auth/user-not-found') ? 'Account profile context not found.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerPasswordReset = async () => {
    if (!mpesaNumber) return alert('Enter your Safaricom phone number above first.');
    try {
      await sendPasswordResetEmail(auth, formatMpesaEmail(mpesaNumber));
      alert('Password reset link dispatched via platform channels successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at center, #18111e 0%, #050507 100%)', padding: '20px'
    }}>
      <div style={{
        background: '#0e0e12', border: '1px solid #221a2b', padding: '40px',
        borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', margin: 0, fontWeight: '800', letterSpacing: '1px' }}>
            JET<span style={{ color: '#e11d48' }}>PESA</span>
          </h1>
          <p style={{ color: '#71717a', fontSize: '14px', marginTop: '6px' }}>Spribe Crash Engine Hub</p>
        </div>

        {errorMessage && (
          <div style={{ background: 'rgba(225,29,72,0.1)', color: '#f43f5e', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid rgba(225,29,72,0.2)' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '600' }}>SAFARICOM M-PESA NUMBER</label>
            <input type="text" placeholder="e.g., 0712345678 or 254..." value={mpesaNumber} onChange={(e) => setMpesaNumber(e.target.value)} required style={{ width: '100%', padding: '14px', boxSizing: 'border-box', background: '#16161e', border: '1px solid #272732', borderRadius: '8px', color: '#fff', marginTop: '6px', fontSize: '15px' }} />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '600' }}>SECURITY ACCREDITATION PASSWORD</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '14px', boxSizing: 'border-box', background: '#16161e', border: '1px solid #272732', borderRadius: '8px', color: '#fff', marginTop: '6px', fontSize: '15px' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px', transition: '0.2s' }}>
            {loading ? 'SYNCHRONIZING SECURE TUNNELS...' : isSignUp ? 'CLAIM KES 25 & SIGN UP' : 'SIGN IN TO FLIGHT LOBBY'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px' }}>
          <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: '#fb7185', cursor: 'pointer' }}>
            {isSignUp ? 'Have an account? Login' : 'Create an Account'}
          </span>
          <span onClick={triggerPasswordReset} style={{ color: '#a1a1aa', cursor: 'pointer' }}>
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
}
