import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', code: '01' },
    { to: '/projects', label: 'Projects', code: '02' },
    ...(user?.role === 'ADMIN' ? [{ to: '/admin/members', label: 'Approvals', code: '03' }] : []),
  ];

  return (
    <aside style={{ width: 240, minHeight: '100vh', background: 'var(--sidebar)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <img src="/src/assets/favicon.ico" alt="logo" style={{ width: 26, height: 26, objectFit: 'contain' }} />
          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--sidebar-text-active)', letterSpacing: '0.5px' }}>TaskFlow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--accent) 0%, #003B99 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff', borderRadius: '6px' }}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--sidebar-text-active)', margin: 0 }}>{user?.name}</p>
            <span style={{ fontSize: 10, color: 'var(--sidebar-text)', textTransform: 'uppercase' }}>{user?.role}</span>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
            textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
            background: isActive ? 'var(--sidebar-active)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
            marginBottom: '4px', borderRadius: '0 4px 4px 0', transition: 'all 0.15s',
          })}>
            <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? 'var(--accent)' : 'var(--sidebar-text)', minWidth: 20 }}>{item.code}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: 10, color: 'var(--sidebar-text)', margin: '0 0 10px', textTransform: 'uppercase', fontWeight: 500 }}>{user?.email}</p>
        <button onClick={handleLogout} style={{ width: '100%', padding: '8px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--sidebar-text)', fontSize: 12, cursor: 'pointer', borderRadius: '4px', textAlign: 'left', transition: 'all 0.15s', fontWeight: 500 }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(0,102,204,0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'var(--sidebar-text)'; e.currentTarget.style.background = 'transparent'; }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
