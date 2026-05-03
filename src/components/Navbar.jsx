import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link to="/dashboard" style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>TaskFlow</Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/dashboard" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Dashboard</Link>
          <Link to="/projects" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Projects</Link>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.name}</span>
        <span style={{ fontSize: 11, background: 'var(--accent-light)', color: 'var(--accent)', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>{user?.role}</span>
        <button onClick={handleLogout} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--danger)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Logout</button>
      </div>
    </nav>
  );
}
