import React from 'react';
import { useWebSockets } from '../context/WebSocketContext';
import LeafletMap from '../components/LeafletMap';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { Train, Info, ShieldAlert } from 'lucide-react';

const MetroMapPage = () => {
  const { realTimeData } = useWebSockets();

  const stations = realTimeData?.stations || [];
  const trains = realTimeData?.trains || [];

  const overcrowdedStations = stations.filter(s => s.crowd_level === 'Red');
  const activeTrainsCount = trains.filter(t => t.status === 'In Service').length;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Interactive Map</h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Live tracking of metro lines, stations crowd density, and rolling stock positions.
        </p>
      </div>

      {/* Main Grid: Map + Side Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Leaflet Map (Takes 3/4 width on desktop) */}
        <div className="lg:col-span-3 h-full">
          <LeafletMap stationsData={stations} trainsData={trains} />
        </div>

        {/* Side Panel (Takes 1/4 width on desktop) */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          {/* Quick Stats */}
          <GlassmorphicCard className="space-y-4" hoverEffect={false}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Info size={18} className="text-blue-500" />
              <span>Map Overview</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-3 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="opacity-60">Total Stations</span>
                <p className="text-lg font-black">{stations.length || 286}</p>
              </div>
              <div className="p-3 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="opacity-60">Active Trains</span>
                <p className="text-lg font-black text-blue-500">{activeTrainsCount}</p>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Overcrowded Stations List */}
          <GlassmorphicCard className="flex-1 flex flex-col gap-3 min-h-0" hoverEffect={false}>
            <h3 className="font-bold text-base flex items-center gap-2 text-red-500">
              <ShieldAlert size={18} />
              <span>Overcrowded Stations ({overcrowdedStations.length})</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {overcrowdedStations.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  No overcrowding warnings at present.
                </div>
              ) : (
                overcrowdedStations.map((station) => (
                  <div 
                    key={station.station_id} 
                    className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between text-xs transition-all hover:scale-[1.02]"
                  >
                    <div>
                      <h4 className="font-bold text-red-200">{station.name}</h4>
                      <p className="opacity-65 text-[10px] mt-0.5">{station.line}</p>
                    </div>
                    <div className="text-right font-bold">
                      <p className="text-red-400">{station.passenger_count} pax</p>
                      <p className="text-[10px] opacity-60">{station.crowd_percentage}% cap</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassmorphicCard>

          {/* Active Trains List */}
          <GlassmorphicCard className="flex-1 flex flex-col gap-3 min-h-0" hoverEffect={false}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Train size={18} className="text-blue-500" />
              <span>Active Trains ({trains.length})</span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {trains.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  No trains currently in service.
                </div>
              ) : (
                trains.map((train) => (
                  <div 
                    key={train.train_id} 
                    className="p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-200/20 dark:bg-slate-800/20 flex flex-col gap-1.5 text-xs transition-all hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{train.train_number}</h4>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        train.crowd_level === 'Red'
                          ? 'bg-red-500/10 text-red-500'
                          : train.crowd_level === 'Orange'
                          ? 'bg-orange-500/10 text-orange-500'
                          : train.crowd_level === 'Yellow'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {train.crowd_level}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] opacity-75">
                      <span>{train.train_name}</span>
                      <span>At: <b>{train.current_station}</b></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
};

export default MetroMapPage;
