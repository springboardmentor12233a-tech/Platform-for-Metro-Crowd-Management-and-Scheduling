import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient glowing ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-500/5 dark:bg-red-500/10 blur-[90px] pointer-events-none"></div>

      <GlassmorphicCard className="max-w-md w-full text-center space-y-6 border-red-500/20" hoverEffect={false}>
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10 animate-bounce">
            <ShieldAlert size={36} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Access Denied
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            Your active credentials do not have operational clearance to access this control room.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-xs transition-all active:scale-[0.98] shadow-lg shadow-red-600/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default Unauthorized;
