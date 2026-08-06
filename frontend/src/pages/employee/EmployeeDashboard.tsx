import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle2, Circle, RefreshCw, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchEmployeeTasksAsync, updateTaskStatusAsync } from '../../features/taskSlice';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import type { Task, TaskStatus } from '../../types';
import toast from 'react-hot-toast';

const STATUS_OPTIONS: { value: TaskStatus; label: string; icon: React.FC<{ size: number }> }[] = [
  { value: 'todo', label: 'To Do', icon: Circle },
  { value: 'in_progress', label: 'In Progress', icon: RefreshCw },
  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const EmployeeDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((s) => s.tasks);
  const user = useAppSelector((s) => s.auth.user);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEmployeeTasksAsync());
  }, [dispatch]);

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    setUpdatingId(task._id);
    const result = await dispatch(updateTaskStatusAsync({ id: task._id, status: newStatus }));
    setUpdatingId(null);
    if (updateTaskStatusAsync.fulfilled.match(result)) {
      toast.success('Status updated');
    } else {
      toast.error('Failed to update status');
    }
  };

  const filtered = statusFilter ? tasks.filter((t: Task) => t.status === statusFilter) : tasks;

  const todo = tasks.filter((t: Task) => t.status === 'todo').length;
  const inProgress = tasks.filter((t: Task) => t.status === 'in_progress').length;
  const completed = tasks.filter((t: Task) => t.status === 'completed').length;

  if (loading && tasks.length === 0) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Welcome back, {user?.name}! Here are your assigned tasks.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} color="var(--color-text-muted)" />
          <select className="select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="employee-stat-grid" style={{ gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'To Do', value: todo, color: '#94a3b8', bg: 'rgba(100,116,139,0.15)' },
          { label: 'In Progress', value: inProgress, color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
          { label: 'Completed', value: completed, color: '#34d399', bg: 'rgba(16,185,129,0.15)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginTop: '0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckCircle2 size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            {statusFilter ? 'No tasks match this filter.' : 'No tasks assigned yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.map((task: Task) => (
            <div key={task._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.4, flex: 1, marginRight: '0.75rem' }}>
                  {task.title}
                </h3>
                <Badge value={task.priority} />
              </div>

              {task.description && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {task.description}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {task.dueDate && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.875rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Update Status</p>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      disabled={updatingId === task._id}
                      onClick={() => handleStatusChange(task, value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        padding: '0.375rem 0.625rem', borderRadius: '0.375rem',
                        fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        border: task.status === value ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                        background: task.status === value ? 'rgba(99,102,241,0.15)' : 'transparent',
                        color: task.status === value ? 'var(--color-accent-light)' : 'var(--color-text-muted)',
                        transition: 'all 0.15s',
                        opacity: updatingId === task._id ? 0.6 : 1,
                      }}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
