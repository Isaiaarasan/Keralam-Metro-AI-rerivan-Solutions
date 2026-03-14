import { Clock } from 'lucide-react';

export default function Header({ activeTab }: { activeTab: string }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {activeTab === 'dashboard' && 'System Overview'}
          {activeTab === 'predictions' && 'AI Demand Prediction'}
          {activeTab === 'scheduling' && 'Optimized Scheduling'}
          {activeTab === 'stations' && 'Station Status'}
        </h2>
        <p className="text-slate-500 mt-1">Real-time AI analysis & operational recommendations.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
          <Clock size={16} className="text-blue-500" />
          <span>Today, 08:45 AM</span>
        </div>
      </div>
    </header>
  );
}
