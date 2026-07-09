import { LogOut, TrainFront } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400 p-2 text-slate-950">
            <TrainFront size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">MetroFlow</h1>
            <p className="text-sm text-slate-300">AI Metro Crowd Management Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold">{user?.full_name}</p>
            <p className="text-xs uppercase tracking-wide text-cyan-300">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
