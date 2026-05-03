import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchProjects = () => api.get('/projects').then((r) => setProjects(r.data));
  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post('/projects', form); setForm({ name: '', description: '' }); setShowForm(false); fetchProjects(); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter', outline: 'none', borderRadius: '6px' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Workspace</p>
            <h1 style={{ fontFamily: 'Merriweather', fontSize: 36, color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>Projects</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{projects.length} total</span>
            {user?.role === 'ADMIN' && (
              <button onClick={() => setShowForm(!showForm)} style={{ padding: '9px 20px', background: showForm ? 'transparent' : 'var(--accent)', border: `1.5px solid ${showForm ? 'var(--border)' : 'var(--accent)'}`, color: showForm ? 'var(--text-secondary)' : '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s' }}>
                {showForm ? 'Cancel' : 'New Project'}
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px', marginBottom: 28, borderRadius: '8px' }}>
            <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 20 }}>New Project</p>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Project Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Website Redesign" style={inp}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inp, resize: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '10px 24px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer', borderRadius: '6px' }}>
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        )}
        {projects.length === 0 && !showForm && (
          <div style={{ padding: '96px 0', textAlign: 'center', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: '8px' }}>
            <p style={{ fontFamily: 'Merriweather', fontSize: 22, color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 8px' }}>No projects yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Create your first project to get started</p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {projects.map((p) => (
            <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '24px', cursor: 'pointer', transition: 'all 0.2s', borderRadius: '8px' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'Merriweather', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0, flex: 1 }}>{p.name}</h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg)', padding: '4px 10px', borderRadius: '4px', flexShrink: 0, marginLeft: 8 }}>{p.tasks?.length || 0}</span>
              </div>
              {p.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>{p.description}</p>}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {p.members?.slice(0, 4).map((m) => (
                    <div key={m.id} title={m.user.name} style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--accent) 0%, #003B99 100%)', border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff', borderRadius: '50%', marginLeft: -8 }}>{m.user.name[0].toUpperCase()}</div>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{p.members?.length} members</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
