import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6 relative overflow-hidden">
      {/* Background ambient glowing rings */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

      <GlassmorphicCard className="max-w-md w-full text-center space-y-6 border-white/5 relative z-10" hoverEffect={false}>
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400 shadow-lg shadow-violet-500/10 animate-pulse">
            <HelpCircle size={36} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tight text-white select-none bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-bold tracking-tight text-slate-200">
            Station Not Found
          </h2>
          <p className="text-sm font-semibold text-slate-400 leading-relaxed">
            The page or route you are looking for does not exist on the MetroFlow operational map.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all active:scale-[0.98] shadow-lg shadow-violet-600/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Navigate to Dashboard</span>
          </button>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default NotFound;
