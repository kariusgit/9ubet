'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useTheme } from '../layout';

function AuthFormElement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup');
  }, [searchParams]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    let clean = mpesaNumber.trim().replace(/\s+/g, '');
    if (clean.startsWith('0')) clean = '254' + clean.substring(1);
    const mpesaEmail = `${clean}@mpesa.jetpesa.local`;

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, mpesaEmail, password);
        await setDoc(doc(db, "users", cred.user.uid), {
          mpesaPhone: clean,
          walletBalance: 25.0,
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, mpesaEmail, password);
      }
      router.push('/dashboard');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{
        background: theme === 'dark' ? '#0f0f15' : '#fff',
        border: theme === 'dark' ? '1px solid #1e1e26' : '1px solid #e2e8f0',
        padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '380px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: "'Space Grotesk', sans-serif" }}>
          {isSignUp ? 'Register Account' : 'Sign In'}
        </h2>

        {errorMessage && <div style={{ color: '#e11d48', fontSize: '13px', marginBottom: '12px' }}>{errorMessage}</div>}

        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="M-Pesa Safaricom Number" value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #3f3f46', background: 'transparent', color: theme === 'dark' ? '#fff' : '#000' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #3f3f46', background: 'transparent', color: theme === 'dark' ? '#fff' : '#000' }} />
          <button type="submit" disabled={loading} style={{ padding: '14px', background: '#e11d48', border: 'none', color: '#fff', fontWeight: '700', borderRadius: '6px', cursor: 'pointer' }}>
            {loading ? 'PROCESSING...' : 'CONTINUE'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading Secure Portal Layout...</div>}>
      <AuthFormElement />
    </Suspense>
  );
}
