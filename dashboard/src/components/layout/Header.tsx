"use client";

import { useState } from 'react';
import { Clock, Bell } from 'lucide-react';

export default function Header({ activeTab }: { activeTab: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'AI Demand Model Retrained', type: 'info', time: '10m ago' },
    { id: 2, text: 'Peak Surge Detected at Station Alpha', type: 'warning', time: '1h ago' }
  ]);

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 glass-card p-6 rounded-2xl relative z-50">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
          {activeTab === 'overview' && 'System Overview'}
          {activeTab === 'predictions' && 'AI Demand Prediction'}
          {activeTab === 'scheduling' && 'Optimized Scheduling'}
          {activeTab === 'stations' && 'Station Status'}
          {activeTab === 'resources' && 'Resource Planning'}
        </h2>
        <p className="text-slate-500 mt-1 font-medium">Real-time AI analysis & operational recommendations.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm relative"
          >
            {notifications.length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            <Bell size={18} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-slide-up">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h4 className="font-bold text-slate-800">Notifications</h4>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Clear All</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm font-medium">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                      <p className={`text-sm font-semibold ${n.type === 'warning' ? 'text-rose-600' : 'text-slate-700'}`}>{n.text}</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{n.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-700">
          <Clock size={16} className="text-blue-500" />
          <span>Today, 08:45 AM</span>
        </div>
      </div>
    </header>
  );
}
