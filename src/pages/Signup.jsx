import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      if (data.message && !data.token) { setPending(true); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: '100%', padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter', outline: 'none', borderRadius: '6px' };
  const lbl = { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 };

  if (pending) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, textAlign: 'center', padding: 48, background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ width: 56, height: 56, border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', fontSize: 24, color: 'var(--accent)', borderRadius: '8px' }}>✓</div>
        <h2 style={{ fontFamily: 'Merriweather', fontSize: 28, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 14 }}>Request Submitted</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>Your account is pending admin approval. You&apos;ll be notified once an admin reviews and approves your request.</p>
        <Link to="/login" style={{ display: 'inline-block', padding: '11px 28px', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: '6px' }}>Back to Sign In</Link>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ width: 420, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '52px 48px', background: 'var(--surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <img src="/src/assets/favicon.ico" alt="logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--accent)' }}>TaskFlow</span>
          </div>
          <h1 style={{ fontFamily: 'Merriweather', fontSize: 42, color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>Join your team</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>Create an account to start managing projects and tasks.</p>
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '8px' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 52px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 32 }}>Create Account</p>
          {error && <div style={{ border: '1px solid var(--danger)', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '11px 14px', fontSize: 12, marginBottom: 22, borderRadius: '6px' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', label: 'Full Name', type: 'text' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'password', label: 'Password', type: 'password' },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label style={lbl}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required style={inp}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
              </div>
            ))}
            <div style={{ marginBottom: 28 }}>
              <label style={lbl}>Account Type</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ ...inp, cursor: 'pointer', appearance: 'none' }}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px 16px', background: loading ? 'var(--text-muted)' : 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '6px', transition: 'background 0.2s' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 22 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
