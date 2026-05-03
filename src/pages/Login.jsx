import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: '100%', padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter', outline: 'none', borderRadius: '6px' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ width: 420, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '52px 48px', background: 'var(--surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <img src="/src/assets/favicon.ico" alt="logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--accent)' }}>TaskFlow</span>
          </div>
          <h1 style={{ fontFamily: 'Merriweather', fontSize: 42, color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 0 }}>Sign in to your workspace and manage your tasks.</p>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28 }}>
          {['Projects', 'Tasks', 'Teams', 'Analytics'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>0{i + 1}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 52px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 32 }}>Sign In</p>
          {error && <div style={{ border: '1px solid var(--danger)', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '11px 14px', fontSize: 12, marginBottom: 22, borderRadius: '6px' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inp}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={inp}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px 16px', background: loading ? 'var(--text-muted)' : 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '6px', transition: 'background 0.2s' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 22 }}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
