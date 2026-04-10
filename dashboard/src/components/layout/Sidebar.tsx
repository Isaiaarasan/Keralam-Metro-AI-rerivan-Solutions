"use client";

import { LayoutDashboard, TrendingUp, Calendar, MapPin, Settings as SettingsIcon, Train, Users } from 'lucide-react';
export type TabType = 'overview' | 'predictions' | 'scheduling' | 'stations' | 'resources';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'predictions', label: 'Demand Prediction', icon: <TrendingUp size={20} /> },
    { id: 'scheduling', label: 'Train Scheduling', icon: <Calendar size={20} /> },
    { id: 'stations', label: 'Live Stations', icon: <MapPin size={20} /> },
    { id: 'resources', label: 'Staff Allocation', icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 relative shadow-2xl z-20 overflow-hidden m-2 rounded-[2rem]">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-[-20%] w-64 h-64 bg-blue-600 opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="p-8 pb-6 flex items-center gap-4 relative z-10">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
          <Train size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Metro AI</h1>
          <p className="text-[10px] text-indigo-200 tracking-wider uppercase font-semibold mt-0.5">Intelligent Scheduling</p>
        </div>
      </div>

       <nav className="flex-1 px-4 py-6 space-y-2 relative z-10 w-full overflow-hidden">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium text-sm group relative overflow-hidden
                ${isActive 
                  ? 'text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 opacity-100 transition-opacity z-0 pointer-events-none layout-active"></div>
              )}
              {isActive && (
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"></div>
              )}
              
              <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110 text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </div>
              <span className="relative z-10 truncate tracking-wide">{item.label}</span>
              
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white opacity-80 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 relative z-10">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-2xl transition-all font-medium text-sm group">
          <div className="bg-slate-800 p-1.5 rounded-xl border border-white/5 group-hover:border-white/20 transition-colors">
             <SettingsIcon size={16} />
          </div>
          <span className="tracking-wide">Settings</span>
        </button>
      </div>
    </aside>
  );
}
