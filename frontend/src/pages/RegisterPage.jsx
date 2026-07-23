import { useState } from 'react';
import { authApi } from '../services/api';
import { useNavigate } from '../router';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'passenger' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.register(form);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-bg-glow blue" />
      <div className="auth-bg-glow purple" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🚇</div>
          <h1>Create Account</h1>
          <p>Join the MetroFlow platform</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input id="reg-username" type="text" className="form-input" placeholder="Choose a username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input id="reg-email" type="email" className="form-input" placeholder="Your email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="reg-password" type="password" className="form-input" placeholder="Create a secure password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select id="reg-role" className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="passenger">Passenger</option>
              <option value="station_master">Station Master</option>
              <option value="operator">Operator</option>
            </select>
          </div>

          <button id="reg-submit" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={16} /> Create Account</>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign in</a>
        </div>
      </div>
    </div>
  );
}
