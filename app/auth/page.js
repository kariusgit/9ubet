'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthenticatonPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab alignment controlled cleanly by landing page configuration parameters
  const [activeTab, setActiveTab] = useState('login'); 
  
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

  const handleAuthenticationExecution = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
      } else {
        if (!phone.startsWith('07') && !phone.startsWith('01') || phone.length !== 10) {
          throw new Error('Please supply a valid 10-digit Safaricom phone number (e.g. 0712345678).');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Build fresh user collection schema mapping straight into Firebase
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          mpesaPhone: phone,
          walletBalance: 0.0,
          createdAt: new Date().toISOString()
        });
        
        router.push('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#07080e', color: '#f1f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '20px' }}>
      <div style={{ background: '#0e111a', border: '1px solid rgba(255,255,255,0.06)', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 6px 0', letterSpacing: '-1px' }}>JETPESA</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Secure High-Stakes Gateway</p>
        </div>

        {/* Tab Selection Row */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', marginBottom: '24px' }}>
          <button onClick={() => { setActiveTab('login'); setErrorMsg(''); }} style={{ flex: 1, padding: '10px', background: activeTab === 'login' ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer' }}>Login</button>
          <button onClick={() => { setActiveTab('signup'); setErrorMsg(''); }} style={{ flex: 1, padding: '10px', background: activeTab === 'signup' ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer' }}>Register</button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuthenticationExecution} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>EMAIL ADDRESS</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '91%', padding: '12px', background: '#020306', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', fontSize: '14px' }} />
          </div>

          {activeTab === 'signup' && (
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>SAFARICOM M-PESA PHONE NUMBER</label>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XXXXXXXX" style={{ width: '91%', padding: '12px', background: '#020306', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', fontSize: '14px' }} />
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>ACCOUNT SECURE PASSWORD</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '91%', padding: '12px', background: '#020306', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', fontSize: '14px' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '10px', background: activeTab === 'login' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', border: 'none', color: '#fff', fontWeight: '900', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>
            {loading ? 'PROCESSING SECURE UPLINK...' : activeTab === 'login' ? 'SECURE LOGIN' : 'CREATE ACCOUNT'}
          </button>
        </form>

      </div>
    </div>
  );
}
