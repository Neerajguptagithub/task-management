import React, { useEffect } from 'react';
import { Users, ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { fetchDashboardStats } from '../../api/admin.api';
import type { DashboardStats, Task } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your organization's task management</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} color="#818cf8" bgColor="rgba(99,102,241,0.15)" />
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={ClipboardList} color="#fbbf24" bgColor="rgba(245,158,11,0.15)" />
        <StatCard title="Completed" value={stats.tasksByStatus.completed} icon={CheckCircle} color="#34d399" bgColor="rgba(16,185,129,0.15)" subtitle="tasks done" />
        <StatCard title="In Progress" value={stats.tasksByStatus.in_progress} icon={Clock} color="#60a5fa" bgColor="rgba(96,165,250,0.15)" subtitle="tasks active" />
        <StatCard title="Todo" value={stats.tasksByStatus.todo} icon={AlertCircle} color="#f87171" bgColor="rgba(239,68,68,0.15)" subtitle="tasks pending" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Tasks by Priority
          </h2>
          {[
            { label: 'High', value: stats.tasksByPriority.high, color: '#ef4444' },
            { label: 'Medium', value: stats.tasksByPriority.medium, color: '#f59e0b' },
            { label: 'Low', value: stats.tasksByPriority.low, color: '#10b981' },
          ].map(({ label, value, color }) => {
            const total = stats.totalTasks || 1;
            const pct = Math.round((value / total) * 100);
            return (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</span>
                </div>
                <div style={{ height: '6px', borderRadius: '9999px', background: 'var(--color-bg-secondary)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '9999px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Recent Tasks
          </h2>
          {stats.recentTasks.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No tasks yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentTasks.map((task: Task) => (
                <div key={task._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem', background: 'var(--color-bg-secondary)', borderRadius: '0.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{task.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {typeof task.assignedTo === 'object' ? task.assignedTo.name : ''}
                    </p>
                  </div>
                  <Badge value={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
