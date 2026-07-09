import { useState } from 'react';
import { Activity, ShieldCheck, TrainFront } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-6 inline-flex rounded-2xl bg-cyan-400 p-3 text-slate-950">
            <TrainFront size={34} />
          </div>
          <h1 className="text-5xl font-black leading-tight">MetroFlow Crowd Monitoring Dashboard</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Milestone 1 platform for metro passenger density tracking, station congestion monitoring, and operator access control.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <ShieldCheck className="text-cyan-300" />
              <h3 className="mt-3 font-bold">Role based access</h3>
              <p className="mt-1 text-sm text-slate-300">Admin and operator login using JWT.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <Activity className="text-cyan-300" />
              <h3 className="mt-3 font-bold">Live crowd view</h3>
              <p className="mt-1 text-sm text-slate-300">Station load, passenger trends, and congestion status.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 text-slate-950 card-shadow">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Use the demo credentials to open the dashboard.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-slate-600">Username</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="admin123"
              />
            </div>
            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Login to dashboard'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Operator:</strong> operator / operator123</p>
          </div>
        </section>
      </div>
    </main>
  );
}
