import { Users, Train, AlertTriangle, Activity, ArrowRight } from 'lucide-react';
import { stationStatus } from '@/lib/mock-data';

export default function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/20">
              <Users className="text-white" size={24} />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg shadow-sm">
              +12% <Activity size={12} className="ml-1" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-semibold mb-1">Total Passengers (Today)</h3>
          <p className="text-3xl font-extrabold text-slate-800 tracking-tight">42,590</p>
        </div>

        <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
              <Train className="text-white" size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-semibold mb-1">Active Trains</h3>
          <p className="text-3xl font-extrabold text-slate-800 tracking-tight">24 <span className="text-lg text-slate-400 font-medium tracking-normal">/ 28</span></p>
        </div>

        <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-3 rounded-xl shadow-lg shadow-orange-500/20">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1.5 rounded-lg shadow-sm border border-orange-100">
              Peak Hour
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-semibold mb-1">Current Status</h3>
          <p className="text-2xl font-extrabold text-slate-800 tracking-tight">High Congestion</p>
        </div>

        <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: '300ms' }}>
           <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-500/20">
              <Activity className="text-white" size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-semibold mb-1">AI Confidence Score</h3>
          <p className="text-3xl font-extrabold text-slate-800 tracking-tight">94.2%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl flex flex-col overflow-hidden animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="p-6 border-b border-slate-200/50 flex justify-between items-center bg-white/40">
            <h3 className="text-lg font-bold text-slate-800">Top Congested Stations</h3>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
              View Map <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-slate-100 flex-1 overflow-auto bg-white/20">
            {stationStatus.filter(s => s.load > 50).map((station) => (
              <div key={station.id} className="p-4 px-6 flex items-center justify-between hover:bg-white/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${station.load > 80 ? 'bg-red-500 shadow-red-500/50' : 'bg-orange-500 shadow-orange-500/50'}`}></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{station.name}</h4>
                    <p className="text-xs font-medium text-slate-500">{station.status}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="w-24 h-2.5 bg-slate-200/50 rounded-full overflow-hidden shadow-inner cursor-pointer" title={`${station.load}% Load`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${station.load > 80 ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`}
                      style={{ width: `${station.load}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-700 w-12 text-right">{station.load}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center animate-slide-up relative overflow-hidden" style={{ animationDelay: '500ms' }}>
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500 opacity-[0.03] blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500 opacity-[0.03] blur-3xl pointer-events-none"></div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-full mb-6 shadow-inner border border-white">
              <Activity className="text-blue-600" size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 mb-3">System Models Active</h3>
            <p className="text-slate-500 mb-6 max-w-sm text-sm font-medium leading-relaxed">
              The AI demand prediction and scheduling optimization models are running optimally. Analytics are fully synched.
            </p>
        </div>
      </div>
    </div>
  );
}
