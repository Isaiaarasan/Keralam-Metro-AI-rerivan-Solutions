import { Train, Activity, Calendar, MapPin, Settings, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 h-full flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Train className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">KMRL AI</h1>
          <p className="text-xs text-slate-400">Intelligent Scheduling</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 shadow-md shadow-blue-500/20' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Overview</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('predictions')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'predictions' ? 'bg-blue-600 shadow-md shadow-blue-500/20' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          <Activity size={20} />
          <span className="font-medium">Demand Prediction</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('scheduling')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'scheduling' ? 'bg-blue-600 shadow-md shadow-blue-500/20' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          <Calendar size={20} />
          <span className="font-medium">Train Scheduling</span>
        </button>

        <button 
          onClick={() => setActiveTab('stations')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stations' ? 'bg-blue-600 shadow-md shadow-blue-500/20' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          <MapPin size={20} />
          <span className="font-medium">Live Stations</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
