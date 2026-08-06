import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  fetchAdminTasksAsync, createTaskAsync, updateTaskAsync, deleteTaskAsync,
} from '../../features/taskSlice';
import { fetchEmployeesAsync } from '../../features/userSlice';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import type { Task, User, CreateTaskPayload, TaskStatus, TaskPriority } from '../../types';
import toast from 'react-hot-toast';

const EMPTY_FORM: CreateTaskPayload = {
  title: '', description: '', assignedTo: '', priority: 'medium', status: 'todo', dueDate: '',
};

const AdminTasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((s) => s.tasks);
  const { employees } = useAppSelector((s) => s.users);

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState<CreateTaskPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAdminTasksAsync());
    dispatch(fetchEmployeesAsync());
  }, [dispatch]);

  const openCreate = () => {
    setEditTask(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo._id,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, dueDate: form.dueDate || null };

    if (editTask) {
      const result = await dispatch(updateTaskAsync({ id: editTask._id, data: payload }));
      if (updateTaskAsync.fulfilled.match(result)) {
        toast.success('Task updated');
        setShowModal(false);
      } else toast.error(result.payload as string || 'Update failed');
    } else {
      const result = await dispatch(createTaskAsync(payload));
      if (createTaskAsync.fulfilled.match(result)) {
        toast.success('Task created');
        setShowModal(false);
      } else toast.error(result.payload as string || 'Create failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteTaskAsync(id));
    setDeleteId(null);
    if (deleteTaskAsync.fulfilled.match(result)) toast.success('Task deleted');
    else toast.error('Failed to delete task');
  };

  const filtered = statusFilter ? tasks.filter((t: Task) => t.status === statusFilter) : tasks;

  if (loading && tasks.length === 0) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={14} color="var(--color-text-muted)" />
            <select
              className="select-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    {statusFilter ? 'No tasks match this filter.' : 'No tasks yet. Create your first task.'}
                  </td>
                </tr>
              ) : (
                filtered.map((task: Task) => (
                  <tr key={task._id}>
                    <td>
                      <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0,
                        }}>
                          {task.assignedTo.name.charAt(0).toUpperCase()}
                        </div>
                        {task.assignedTo.name}
                      </div>
                    </td>
                    <td><Badge value={task.status} /></td>
                    <td><Badge value={task.priority} /></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      {deleteId === task._id ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-danger" onClick={() => handleDelete(task._id)}>Confirm</button>
                          <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-ghost" onClick={() => openEdit(task)} style={{ padding: '0.375rem 0.625rem' }}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn-danger" onClick={() => setDeleteId(task._id)} style={{ padding: '0.375rem 0.625rem' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editTask ? 'Edit Task' : 'Create New Task'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Title *</label>
              <input
                className="form-input" placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required minLength={3} maxLength={100}
              />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea
                className="form-input" placeholder="Task description..." rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div>
              <label className="form-label">Assign To *</label>
              <select
                className="form-input"
                value={form.assignedTo}
                onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                required
              >
                <option value="">Select employee</option>
                {employees.map((emp: User) => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>
            <div className="form-grid-2" style={{ gap: '0.75rem' }}>
              <div>
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={form.dueDate as string}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminTasksPage;
