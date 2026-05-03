import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const statusStyle = {
  TODO: { color: '#F59E0B', bg: '#FFFBEB', label: 'To Do' },
  IN_PROGRESS: { color: '#0066CC', bg: '#EFF6FF', label: 'In Progress' },
  DONE: { color: '#10B981', bg: '#ECFDF5', label: 'Done' },
};

const PIE_COLORS = ['#FFFBEB', '#EFF6FF', '#ECFDF5', '#FEF2F2'];
const PIE_STROKE = ['#F59E0B', '#0066CC', '#10B981', '#EF4444'];

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
  if (value === 0) return null;
  const R = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * R);
  const y = cy + radius * Math.sin(-midAngle * R);
  const lx1 = cx + (outerRadius + 6) * Math.cos(-midAngle * R);
  const ly1 = cy + (outerRadius + 6) * Math.sin(-midAngle * R);
  const lx2 = cx + (outerRadius + 22) * Math.cos(-midAngle * R);
  const ly2 = cy + (outerRadius + 22) * Math.sin(-midAngle * R);
  return (
    <g>
      <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="var(--border)" strokeWidth={1} />
      <text x={x} y={y - 7} textAnchor="middle" fill="var(--text-secondary)" fontSize={11} fontFamily="Inter">{name}</text>
      <text x={x} y={y + 7} textAnchor="middle" fill="var(--text-primary)" fontSize={13} fontFamily="Inter" fontWeight={600}>{value}</text>
    </g>
  );
};

const statConfig = [
  { key: 'total', label: 'Total', color: 'var(--text-primary)', bg: '#F0F4F8' },
  { key: 'todo', label: 'To Do', color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'inProgress', label: 'In Progress', color: '#0066CC', bg: '#EFF6FF' },
  { key: 'done', label: 'Done', color: '#10B981', bg: '#ECFDF5' },
  { key: 'overdue', label: 'Overdue', color: '#EF4444', bg: '#FEF2F2' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/projects')])
      .then(([d, p]) => { setData(d.data); setProjects(p.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'Inter', fontSize: 13, fontWeight: 500 }}>Loading...</p>
    </div>
  );

  const taskStatusData = [
    { name: 'To Do', value: data?.todo || 0 },
    { name: 'In Progress', value: data?.inProgress || 0 },
    { name: 'Done', value: data?.done || 0 },
    { name: 'Overdue', value: data?.overdue || 0 },
  ];

  const priorityData = [
    { name: 'Low', value: 0, fill: '#EAF4EE', stroke: '#2D6A4F' },
    { name: 'Medium', value: 0, fill: '#FBF4E3', stroke: '#9C6B00' },
    { name: 'High', value: 0, fill: '#F7EAE6', stroke: '#8B2500' },
  ];
  data?.recentTasks?.forEach((t) => {
    if (t.priority === 'LOW') priorityData[0].value++;
    if (t.priority === 'MEDIUM') priorityData[1].value++;
    if (t.priority === 'HIGH') priorityData[2].value++;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Workspace Overview</p>
            <h1 style={{ fontFamily: 'Merriweather', fontSize: 36, color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>Dashboard</h1>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
          {statConfig.map((s) => (
            <div key={s.key} style={{ padding: '24px', background: s.bg, border: '1px solid var(--border)', borderRadius: '8px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: s.color, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 12 }}>{s.label}</p>
              <p style={{ fontFamily: 'Merriweather', fontSize: 40, color: s.color, margin: 0, lineHeight: 1, fontWeight: 600 }}>{data?.[s.key] || 0}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px', borderRadius: '8px' }}>
            <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>Distribution</p>
            <h2 style={{ fontFamily: 'Merriweather', fontSize: 18, color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 24px' }}>Task Status</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={taskStatusData} cx="50%" cy="50%" outerRadius={88} innerRadius={44} dataKey="value" labelLine={false} label={CustomPieLabel}>
                  {taskStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke={PIE_STROKE[i]} strokeWidth={1.5} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'Inter', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px', borderRadius: '8px' }}>
            <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>Overview</p>
            <h2 style={{ fontFamily: 'Merriweather', fontSize: 18, color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 24px' }}>Priority Breakdown</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priorityData} barSize={44} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Inter', fill: 'var(--text-secondary)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'Inter', fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0, 102, 204, 0.05)' }} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'Inter', fontSize: 12 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((e, i) => <Cell key={i} fill={e.fill} stroke={e.stroke} strokeWidth={1.5} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', marginBottom: 24, overflow: 'hidden', borderRadius: '8px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>Overview</p>
              <h2 style={{ fontFamily: 'Merriweather', fontSize: 18, color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>Project Progress</h2>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{projects.length} projects</span>
          </div>
          {projects.length === 0 && <div style={{ padding: '48px 24px', textAlign: 'center' }}><p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No projects yet.</p></div>}
          {projects.map((project, i) => {
            const total = project.tasks?.length || 0;
            const done = project.tasks?.filter((t) => t.status === 'DONE').length || 0;
            const inProg = project.tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} style={{ padding: '20px 24px', borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{project.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {project.members?.length} members • {total} tasks • {inProg} in progress
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 24 }}>
                    <span style={{ fontFamily: 'Merriweather', fontSize: 26, color: pct === 100 ? '#10B981' : 'var(--text-primary)', fontWeight: 600 }}>{pct}%</span>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{done}/{total} complete</p>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--border)', position: 'relative', overflow: 'hidden', borderRadius: '3px' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: pct === 100 ? '#10B981' : pct > 50 ? '#0066CC' : '#F59E0B', transition: 'width 0.4s ease', borderRadius: '3px' }}></div>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                  {[
                    { label: 'To Do', count: project.tasks?.filter((t) => t.status === 'TODO').length || 0, color: '#F59E0B' },
                    { label: 'In Progress', count: inProg, color: '#0066CC' },
                    { label: 'Done', count: done, color: '#10B981' },
                  ].map((s) => (
                    <span key={s.label} style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.count} {s.label}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Activity</p>
            <h2 style={{ fontFamily: 'Times New Roman', fontSize: 20, color: 'var(--text-primary)', fontWeight: 400, margin: 0 }}>Recent Tasks</h2>
          </div>
          {data?.recentTasks?.length === 0 && <div style={{ padding: '40px 24px', textAlign: 'center' }}><p style={{ color: 'var(--text-muted)', fontSize: 12 }}>No tasks yet.</p></div>}
          {data?.recentTasks?.map((task, i) => {
            const s = statusStyle[task.status] || statusStyle.TODO;
            return (
              <div key={task.id} onClick={() => navigate(`/projects/${task.projectId}`)} style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < data.recentTasks.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F7F2EA'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{task.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono', margin: 0, letterSpacing: '0.03em' }}>{task.project?.name}{task.assignee ? ` · ${task.assignee.name}` : ''}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, padding: '4px 10px', background: s.bg, color: s.color, fontFamily: 'IBM Plex Mono', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', border: `1px solid ${s.color}20` }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
