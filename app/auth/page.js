'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('login'); 
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Can be Email OR Phone
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const targetTab = searchParams.get('tab');
    if (targetTab === 'signup' || targetTab === 'login') {
      setActiveTab(targetTab);
    }
  }, [searchParams]);

  // Helper to cleanly match phone records to authentication emails
  const resolveEmailFromPhone = async (phoneNum) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('mpesaPhone', '==', phoneNum.trim()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('No account found with the provided phone number.');
    }
    
    let resolvedEmail = '';
    querySnapshot.forEach((doc) => {
      resolvedEmail = doc.data().email;
    });
    return resolvedEmail;
  };

  const handleAuthenticationExecution = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        let finalEmail = loginIdentifier.trim();

        // If the user typed a phone number instead of an email address
        if (!finalEmail.includes('@')) {
          finalEmail = await resolveEmailFromPhone(finalEmail);
        }

        await signInWithEmailAndPassword(auth, finalEmail, password);
        router.push('/dashboard');

      } else {
        // Strict phone validation for Safaricom credentials
        if ((!phone.startsWith('07') && !phone.startsWith('01')) || phone.length !== 10) {
          throw new Error('Please enter a valid phone number (e.g. 0712***/011***).');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email.trim(),
          mpesaPhone: phone.trim(),
          walletBalance: 0.0,
          createdAt: new Date().toISOString()
        });
        
        setSuccessMsg('🚀 Account Created Successfully! Welcome to JetPesa. Preparing your cockpit...');
        
        // 3-second delay to display the welcome state before forcing route switch
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    } catch (err) {
      setErrorMsg(err.message.replace("Firebase:", ""));
      setLoading(false); // Only unset loading on error; success handles redirect away
    }
  };

  return (
    <div style={{ background: '#0e111a', border: '1px solid rgba(255,255,255,0.06)', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 6px 0', letterSpacing: '-1px' }}>JETPESA</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Secure High-Stakes Gateway</p>
      </div>

      {/* Tab Controls */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', marginBottom: '24px' }}>
        <button type="button" disabled={loading} onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }} style={{ flex: 1, padding: '10px', background: activeTab === 'login' ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>Login</button>
        <button type="button" disabled={loading} onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }} style={{ flex: 1, padding: '10px', background: activeTab === 'signup' ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>Register</button>
      </div>

      {/* Notification Messaging Alerts */}
      {errorMsg && (
        <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleAuthenticationExecution} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {activeTab === 'login' ? (
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>EMAIL OR PHONE NUMBER</label>
            <input type="text" required disabled={loading} placeholder="Email or 07XXXXXXXX" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} style={{ width: '93%', padding: '12px', background: '#020306', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', fontSize: '14px' }} />
          </div>
        ) : (
          <>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>EMAIL ADDRESS</label>
              <input type="email" required disabled={loading} value={email} onChange={e => setEmail(e.target.value)} style={{ width: '93%', padding: '12px', background: '#020306', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>M-PESA NUMBER</label>
              <input type="text" required disabled={loading} value={phone} onChange={e => setPhone(e.target.value)} placeholder="07***/01***" style={{ width: '93%', padding: '12px', background: '#020306', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', fontSize: '14px' }} />
            </div>
          </>
        )}

        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>ACCOUNT SECURE PASSWORD</label>
          <input type="password" required disabled={loading} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '93%', padding: '12px', background: '#020306', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', fontSize: '14px' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '10px', background: activeTab === 'login' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', border: 'none', color: '#fff', fontWeight: '900', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
          {loading ? 'PROCESSING SECURE UPLINK...' : activeTab === 'login' ? 'SECURE LOGIN' : 'CREATE ACCOUNT'}
        </button>
      </form>
    </div>
  );
}

export default function AuthenticatonPortal() {
  return (
    <div style={{ background: '#07080e', color: '#f1f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '20px' }}>
      <Suspense fallback={
        <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '700' }}>
          Loading Secure Interface...
        </div>
      }>
        <AuthForm />
      </Suspense>
    </div>
  );
}
