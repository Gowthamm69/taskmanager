import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const statusConfig = {
  PENDING: { color: '#F59E0B', bg: '#FFFBEB', label: 'Pending' },
  APPROVED: { color: '#10B981', bg: '#ECFDF5', label: 'Approved' },
  DENIED: { color: '#EF4444', bg: '#FEF2F2', label: 'Denied' },
};

function UserTable({ users, loading, filter, setFilter, onAction, actionLoading, type }) {
  const filtered = users.filter((u) => u.status === filter);
  const counts = {
    PENDING: users.filter((u) => u.status === 'PENDING').length,
    APPROVED: users.filter((u) => u.status === 'APPROVED').length,
    DENIED: users.filter((u) => u.status === 'DENIED').length,
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { key: 'PENDING', label: 'Pending', color: '#F59E0B', bg: '#FFFBEB' },
          { key: 'APPROVED', label: 'Approved', color: '#10B981', bg: '#ECFDF5' },
          { key: 'DENIED', label: 'Denied', color: '#EF4444', bg: '#FEF2F2' },
        ].map((s) => (
          <div key={s.key} onClick={() => setFilter(s.key)} style={{
            background: filter === s.key ? s.bg : 'var(--surface)',
            border: `1.5px solid ${filter === s.key ? s.color : 'var(--border)'}`,
            borderRadius: '8px', padding: '22px 24px', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: filter === s.key ? s.color : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 32, fontWeight: 600, fontFamily: 'Merriweather', color: filter === s.key ? s.color : 'var(--text-primary)' }}>{counts[s.key]}</p>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontFamily: 'Merriweather', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {statusConfig[filter].label} {type}s
            <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>({filtered.length})</span>
          </h3>
        </div>
        {loading && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>Loading...</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '56px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>No {statusConfig[filter].label.toLowerCase()} {type.toLowerCase()}s</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
              {filter === 'PENDING' ? 'All requests have been reviewed.' : `No ${type.toLowerCase()}s have been ${filter.toLowerCase()} yet.`}
            </p>
          </div>
        )}
        {!loading && filtered.map((user, i) => {
          const s = statusConfig[user.status];
          return (
            <div key={user.id} style={{
              padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '8px',
                background: type === 'Admin' ? 'linear-gradient(135deg, #0066CC 0%, #003B99 100%)' : 'linear-gradient(135deg, var(--accent) 0%, #003B99 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 600,
                color: '#fff',
                flexShrink: 0,
              }}>{user.name[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: '4px',
                    background: type === 'Admin' ? 'var(--info-bg)' : 'var(--accent-light)',
                    color: type === 'Admin' ? 'var(--info)' : 'var(--accent)',
                    textTransform: 'uppercase', letterSpacing: '0.3px',
                  }}>{type}</span>
                </div>
                <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--text-secondary)' }}>{user.email}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                  Requested {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: '4px', background: s.bg, color: s.color, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</span>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                {user.status !== 'APPROVED' && (
                  <button onClick={() => onAction(user.id, 'APPROVED')} disabled={actionLoading === user.id + 'APPROVED'} style={{
                    padding: '8px 16px', borderRadius: '6px', background: 'var(--success-bg)',
                    border: '1px solid var(--success)', color: 'var(--success)',
                    fontSize: 12, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
                    opacity: actionLoading === user.id + 'APPROVED' ? 0.6 : 1,
                  }}>Approve</button>
                )}
                {user.status !== 'DENIED' && (
                  <button onClick={() => onAction(user.id, 'DENIED')} disabled={actionLoading === user.id + 'DENIED'} style={{
                    padding: '8px 16px', borderRadius: '6px', background: 'var(--danger-bg)',
                    border: '1px solid var(--danger)', color: 'var(--danger)',
                    fontSize: 12, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
                    opacity: actionLoading === user.id + 'DENIED' ? 0.6 : 1,
                  }}>Deny</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MemberAuth() {
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [memberFilter, setMemberFilter] = useState('PENDING');
  const [adminFilter, setAdminFilter] = useState('PENDING');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/members'),
      api.get('/admin/admins'),
    ]).then(([m, a]) => {
      setMembers(m.data);
      setAdmins(a.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAction = async (userId, status) => {
    setActionLoading(userId + status);
    try {
      await api.patch(`/admin/users/${userId}/status`, { status });
      fetchAll();
    } finally {
      setActionLoading(null);
    }
  };

  const pendingMembers = members.filter((m) => m.status === 'PENDING').length;
  const pendingAdmins = admins.filter((a) => a.status === 'PENDING').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32 }}>
        <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Admin Panel</p>
        <h1 style={{ fontFamily: 'Merriweather', fontSize: 36, color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>Account Approvals</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: '8px 0 0' }}>Review and manage member and admin account requests</p>
      </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 32, background: 'var(--surface)', padding: '6px', borderRadius: '8px', width: 'fit-content', border: '1px solid var(--border)' }}>
          {[
            { key: 'members', label: 'Members', pending: pendingMembers },
            { key: 'admins', label: 'Admins', pending: pendingAdmins },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '9px 18px', borderRadius: '6px', border: 'none',
              background: activeTab === tab.key ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}>
              {tab.label}
              {tab.pending > 0 && (
                <span style={{
                  background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : 'var(--bg)',
                  color: activeTab === tab.key ? '#fff' : 'var(--text-primary)',
                  fontSize: 11, fontWeight: 600, padding: '2px 8px',
                  borderRadius: '4px', minWidth: 20, textAlign: 'center',
                }}>{tab.pending}</span>
              )}
            </button>
          ))}
        </div>
        {activeTab === 'members' && (
          <UserTable
            users={members}
            loading={loading}
            filter={memberFilter}
            setFilter={setMemberFilter}
            onAction={handleAction}
            actionLoading={actionLoading}
            type="Member"
          />
        )}
        {activeTab === 'admins' && (
          <UserTable
            users={admins}
            loading={loading}
            filter={adminFilter}
            setFilter={setAdminFilter}
            onAction={handleAction}
            actionLoading={actionLoading}
            type="Admin"
          />
        )}
      </main>
    </div>
  );
}
