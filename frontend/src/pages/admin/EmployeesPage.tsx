import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Mail, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchEmployeesAsync, createEmployeeAsync, deleteEmployeeAsync } from '../../features/userSlice';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import type { User } from '../../types';
import toast from 'react-hot-toast';

const EmployeesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees, loading } = useAppSelector((s) => s.users);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEmployeesAsync());
  }, [dispatch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await dispatch(createEmployeeAsync(form));
    setSubmitting(false);
    if (createEmployeeAsync.fulfilled.match(result)) {
      toast.success('Employee created successfully');
      setShowModal(false);
      setForm({ name: '', email: '', password: '' });
    } else {
      toast.error(result.payload as string || 'Failed to create employee');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteEmployeeAsync(id));
    setDeleteId(null);
    if (deleteEmployeeAsync.fulfilled.match(result)) {
      toast.success('Employee deleted');
    } else {
      toast.error('Failed to delete employee');
    }
  };

  if (loading && employees.length === 0) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{employees.length} employee{employees.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No employees yet. Add your first employee.
                  </td>
                </tr>
              ) : (
                employees.map((emp: User) => (
                  <tr key={emp._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.875rem', fontWeight: 700, color: 'white',
                        }}>
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{emp.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Mail size={13} />
                        {emp.email}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                        background: emp.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: emp.isActive ? '#34d399' : '#f87171',
                        border: `1px solid ${emp.isActive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      }}>
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                    <td>
                      {deleteId === emp._id ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-danger" onClick={() => handleDelete(emp._id)}>Confirm</button>
                          <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button className="btn-danger" onClick={() => setDeleteId(emp._id)}>
                          <Trash2 size={14} /> Delete
                        </button>
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
        <Modal title="Add New Employee" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="john@company.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label">Temporary Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: '2.5rem' }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Employee'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default EmployeesPage;
