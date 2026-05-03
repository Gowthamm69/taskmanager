import { Link } from 'react-router-dom';

const features = [
  { tag: '01', title: 'Project Architecturing', desc: 'Structure work into projects. Assign ownership, set scope, and give every team member clear context on what matters.' },
  { tag: '02', title: 'Role-Based Permissions', desc: 'Admins control the workspace. Members execute. Account approvals.' },
  { tag: '03', title: 'Live Progress Tracking', desc: 'Dashboards with task distribution, priority charts, and overdue alerts.' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/src/assets/favicon.ico" alt="logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--accent)' }}>TaskFlow</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" style={{ padding: '9px 22px', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, textDecoration: 'none', borderRadius: '6px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>Sign In</Link>
          <Link to="/signup" style={{ padding: '9px 22px', background: 'var(--accent)', border: '1px solid var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: '6px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>Sign Up</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 60px 80px' }}>
        <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 28, marginBottom: 64 }}>
          <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 20, textTransform: 'uppercase' }}>Team Collaboration & Task Management</p>
          <h1 style={{ fontFamily: 'Merriweather', fontSize: 56, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 24 }}>
            Organize. Assign. Execute.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 540, marginBottom: 40 }}>
            TaskFlow helps teams create projects, assign tasks, and track progress with role-based permissions and real-time visibility into your work.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <Link to="/signup" style={{ padding: '12px 30px', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: '6px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>Get Started</Link>
            <Link to="/login" style={{ padding: '12px 30px', border: '1.5px solid var(--accent)', color: 'var(--accent)', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: '6px', transition: 'all 0.2s', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>Sign In</Link>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--border)', marginTop: 100, background: 'var(--surface)' }}>
          {features.map((f, i) => (
            <div key={f.tag} style={{ padding: '40px 36px', borderRight: i < features.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 16, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{f.tag}</p>
              <h3 style={{ fontFamily: 'Merriweather', fontSize: 20, color: 'var(--text-primary)', marginBottom: 12, fontWeight: 600 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          {[
            { val: 'Admin', sub: 'Full workspace control' },
            { val: 'Member', sub: 'Task execution & updates' },
            { val: '4 States', sub: 'Todo, Progress, Done, Overdue' },
          ].map((s, i) => (
            <div key={s.val} style={{ padding: '32px 36px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontFamily: 'Merriweather', fontSize: 28, color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>{s.val}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>TaskFlow © 2024</span>
      </div>
    </div>
  );
}
