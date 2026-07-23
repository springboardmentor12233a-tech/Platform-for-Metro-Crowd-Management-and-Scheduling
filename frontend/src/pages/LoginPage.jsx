import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '../router';
import { Train, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { username: 'admin', password: 'admin123' },
      operator: { username: 'operator', password: 'operator123' },
      passenger: { username: 'passenger', password: 'passenger123' },
    };
    setForm(creds[role]);
  };

  return (
    <div className="auth-screen">
      <div className="auth-bg-glow blue" />
      <div className="auth-bg-glow purple" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🚇</div>
          <h1>MetroFlow</h1>
          <p>Metro Crowd Management & Scheduling</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              id="login-username"
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in...</> : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        <div style={{ margin: '24px 0 16px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>Quick Demo Login</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['admin', 'operator', 'passenger'].map(role => (
              <button
                key={role}
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => fillDemo(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="#/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Register here</a>
        </div>
      </div>
    </div>
  );
}
