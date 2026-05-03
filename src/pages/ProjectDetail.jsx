import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

const statusStyle = {
  TODO: { color: '#F59E0B', bg: '#FFFBEB', label: 'To Do' },
  IN_PROGRESS: { color: '#0066CC', bg: '#EFF6FF', label: 'In Progress' },
  DONE: { color: '#10B981', bg: '#ECFDF5', label: 'Done' },
};

const priorityBar = { LOW: '#10B981', MEDIUM: '#F59E0B', HIGH: '#EF4444' };
const priorityColor = { LOW: '#10B981', MEDIUM: '#F59E0B', HIGH: '#EF4444' };

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProject = () => api.get(`/projects/${id}`).then((r) => setProject(r.data));
  useEffect(() => { fetchProject(); }, [id]);

  const isAdmin = project?.members?.find((m) => m.userId === user?.id)?.role === 'ADMIN';

  const handleCreateTask = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await api.post(`/projects/${id}/tasks`, { ...taskForm, assigneeId: taskForm.assigneeId || undefined });
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
      setShowTaskForm(false); fetchProject();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create task'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (taskId, status) => { await api.put(`/projects/${id}/tasks/${taskId}`, { status }); fetchProject(); };
  const handleDeleteTask = async (taskId) => { await api.delete(`/projects/${id}/tasks/${taskId}`); fetchProject(); };
  const handleAddMember = async (e) => {
    e.preventDefault(); setError('');
    try { await api.post(`/projects/${id}/members`, { email: memberEmail, role: 'MEMBER' }); setMemberEmail(''); setShowMemberForm(false); fetchProject(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to add member'); }
  };
  const handleRemoveMember = async (userId) => { await api.delete(`/projects/${id}/members/${userId}`); fetchProject(); };

  if (!project) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: 13, fontWeight: 500 }}>Loading...</p>
    </div>
  );

  const inp = { width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter', outline: 'none', borderRadius: '6px' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32 }}>
          <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter', padding: 0, marginBottom: 12, fontWeight: 500 }}>← Projects</button>
          <h1 style={{ fontFamily: 'Merriweather', fontSize: 36, color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 6px' }}>{project.name}</h1>
          {project.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{project.description}</p>}
        </div>
        {error && <div style={{ border: '1px solid var(--danger)', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px 14px', fontSize: 13, marginBottom: 24, borderRadius: '6px' }}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px' }}>Task List</p>
                <h2 style={{ fontFamily: 'Merriweather', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Tasks <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400 }}>({project.tasks?.length || 0})</span></h2>
              </div>
              {isAdmin && (
                <button onClick={() => setShowTaskForm(!showTaskForm)} style={{ padding: '9px 18px', background: showTaskForm ? 'transparent' : 'var(--accent)', border: `1.5px solid ${showTaskForm ? 'var(--border)' : 'var(--accent)'}`, color: showTaskForm ? 'var(--text-secondary)' : '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s' }}>
                  {showTaskForm ? 'Cancel' : 'Add Task'}
                </button>
              )}
            </div>
            {showTaskForm && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '24px', marginBottom: 20, borderRadius: '8px' }}>
                <form onSubmit={handleCreateTask}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Title</label>
                    <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required placeholder="Task title" style={inp}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Description</label>
                    <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={2} style={{ ...inp, resize: 'none' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                    {[
                      { label: 'Priority', el: <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} style={{ ...inp, cursor: 'pointer', appearance: 'none' }}>{PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}</select> },
                      { label: 'Assignee', el: <select value={taskForm.assigneeId} onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })} style={{ ...inp, cursor: 'pointer', appearance: 'none' }}><option value="">Unassigned</option>{project.members?.map((m) => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}</select> },
                      { label: 'Due Date', el: <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} style={inp} /> },
                    ].map((f) => (
                      <div key={f.label}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>{f.label}</label>
                        {f.el}
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={loading} style={{ padding: '10px 22px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer', borderRadius: '6px' }}>
                    {loading ? 'Creating...' : 'Create Task'}
                  </button>
                </form>
              </div>
            )}
            {project.tasks?.length === 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '52px 24px', textAlign: 'center', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No tasks yet.</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.tasks?.map((task) => {
                const s = statusStyle[task.status] || statusStyle.TODO;
                return (
                  <div key={task.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', borderRadius: '8px' }}>
                    <div style={{ width: 3, alignSelf: 'stretch', background: priorityBar[task.priority] || 'var(--text-muted)', flexShrink: 0, borderRadius: '1.5px' }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{task.title}</p>
                      {task.description && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>{task.description}</p>}
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: priorityColor[task.priority] }}>{task.priority}</span>
                        {task.assignee && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>→ {task.assignee.name}</span>}
                        {task.dueDate && <span style={{ fontSize: 12, color: new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? '#EF4444' : 'var(--text-secondary)' }}>Due {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      {isAdmin ? (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', background: s.bg, color: s.color, borderRadius: '4px', border: `1px solid ${s.color}30` }}>{s.label}</span>
                      ) : (
                        <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} style={{ padding: '6px 10px', border: `1px solid ${s.color}50`, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', borderRadius: '4px' }}>
                          {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{statusStyle[opt].label}</option>)}
                        </select>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, padding: '2px 6px', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px' }}>Team</p>
                <h2 style={{ fontFamily: 'Merriweather', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Members</h2>
              </div>
              {isAdmin && (
                <button onClick={() => setShowMemberForm(!showMemberForm)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent-dim)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--accent)'}>
                  {showMemberForm ? 'Cancel' : 'Add Member'}
                </button>
              )}
            </div>
            {showMemberForm && (
              <form onSubmit={handleAddMember} style={{ marginBottom: 16 }}>
                <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required placeholder="email@example.com" style={{ ...inp, marginBottom: 10 }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                <button type="submit" style={{ width: '100%', padding: '10px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer', borderRadius: '6px' }}>Add Member</button>
              </form>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.members?.map((m) => (
                <div key={m.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: '8px' }}>
                  <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent) 0%, #003B99 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', borderRadius: '6px', flexShrink: 0 }}>{m.user.name[0].toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.user.name}</p>
                    <span style={{ fontSize: 11, color: m.role === 'ADMIN' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{m.role}</span>
                  </div>
                  {isAdmin && m.userId !== user?.id && (
                    <button onClick={() => handleRemoveMember(m.userId)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, padding: '2px 6px', transition: 'color 0.2s', flexShrink: 0 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>×</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
