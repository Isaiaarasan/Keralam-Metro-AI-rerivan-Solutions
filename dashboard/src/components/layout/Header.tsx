import { Clock, Bell } from 'lucide-react';

export default function Header({ activeTab }: { activeTab: string }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 glass-card p-6 rounded-2xl">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
          {activeTab === 'dashboard' && 'System Overview'}
          {activeTab === 'predictions' && 'AI Demand Prediction'}
          {activeTab === 'scheduling' && 'Optimized Scheduling'}
          {activeTab === 'stations' && 'Station Status'}
        </h2>
        <p className="text-slate-500 mt-1 font-medium">Real-time AI analysis & operational recommendations.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm relative">
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-700">
          <Clock size={16} className="text-blue-500" />
          <span>Today, 08:45 AM</span>
        </div>
      </div>
    </header>
  );
}
