import { Train, Activity, Calendar, MapPin, Settings, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-slate-900/95 backdrop-blur-2xl text-slate-100 flex flex-col transition-all duration-300 h-full flex-shrink-0 border-r border-slate-800 shadow-2xl relative z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
          <Train className="text-white" size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">KMRL AI</h1>
          <p className="text-xs text-slate-400 font-medium">Intelligent Scheduling</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}
        >
          <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'text-white' : ''} />
          <span className="font-medium">Overview</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('predictions')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'predictions' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}
        >
          <Activity size={20} className={activeTab === 'predictions' ? 'text-white' : ''} />
          <span className="font-medium">Demand Prediction</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('scheduling')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'scheduling' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}
        >
          <Calendar size={20} className={activeTab === 'scheduling' ? 'text-white' : ''} />
          <span className="font-medium">Train Scheduling</span>
        </button>

        <button 
          onClick={() => setActiveTab('stations')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'stations' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'}`}
        >
          <MapPin size={20} className={activeTab === 'stations' ? 'text-white' : ''} />
          <span className="font-medium">Live Stations</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/80 rounded-xl text-slate-400 hover:text-slate-200 transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
