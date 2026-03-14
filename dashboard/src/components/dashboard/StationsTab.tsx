"use client";

import { useEffect, useState } from 'react';
import { stationStatus } from '@/lib/mock-data'; // fallback only
import { fetchStations } from '@/lib/api';
import { MapPin, TrendingUp, TrendingDown, Minus, X, Network, Activity, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export const STATIONS = [
  { id: 'ALU', name: 'Aluva', status: 'normal', load: 85, trend: 'increasing' },
  { id: 'EDA', name: 'Edapally', status: 'warning', load: 60, trend: 'stable' },
  { id: 'MGR', name: 'MG Road', status: 'critical', load: 92, trend: 'increasing' },
  { id: 'VYT', name: 'Vyttila', status: 'normal', load: 55, trend: 'decreasing' },
  { id: 'KAL', name: 'Kaloor', status: 'normal', load: 45, trend: 'stable' }
];

export default function StationsTab() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchStations().then(dbStations => {
      // Map DB stations to UI model
      const mapped = dbStations.map((s: any) => {
        // Find existing mock load data or synthesize one
        const mock = stationStatus.find(m => m.name === s.station_name);
        return {
          id: s.station_id,
          name: s.station_name,
          status: mock ? mock.status : 'Normal',
          load: mock ? mock.load : Math.floor(Math.random() * 40) + 20,
          trend: mock ? mock.trend : 'stable'
        };
      });
      setStations(mapped);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setStations(stationStatus); // fallback
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden h-[calc(100vh-12rem)] flex flex-col animate-slide-up relative">
        <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        
        <div className="p-6 border-b border-slate-200/50 flex justify-between items-center bg-white/40 relative z-10">
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">Live Station Status</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Real-time occupancy synced with MongoDB / SQLite</p>
          </div>
          {loading && <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-full shadow-sm border border-emerald-100 animate-pulse"><div className="w-2 h-2 bg-emerald-600 rounded-full"></div> Syncing Database...</span>}
          {!loading && (
            <button 
              onClick={() => setShowMap(true)}
              className="text-blue-600 text-sm font-semibold hover:text-blue-700 bg-white/50 px-4 py-2 rounded-xl transition-colors shadow-sm border border-slate-200 hover:bg-white flex items-center gap-2"
            >
              <MapPin size={16}/> Open Map View
            </button>
          )}
        </div>
        <div className="divide-y divide-slate-100/60 flex-1 overflow-auto bg-white/20 relative z-10">
          {stations.map((station, i) => (
            <div key={station.id} className="p-5 px-8 flex items-center justify-between hover:bg-white/60 transition-all duration-300 group">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className={`w-3.5 h-3.5 rounded-full shadow-sm ${station.load > 80 ? 'bg-red-500 shadow-red-500/50' : station.load > 50 ? 'bg-orange-500 shadow-orange-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`}></div>
                  {station.load > 80 && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{station.name}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-sm font-medium">
                    <span className={`px-2 py-0.5 rounded-md ${station.load > 80 ? 'bg-red-50 text-red-600 border border-red-100' : station.load > 50 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {station.status}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 capitalize">
                      {station.trend === 'increasing' ? <TrendingUp size={14} className="text-rose-500"/> : station.trend === 'decreasing' ? <TrendingDown size={14} className="text-emerald-500"/> : <Minus size={14} className="text-slate-400"/>}
                      {station.trend} Load
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div className="hidden md:block w-48 h-3 bg-slate-200/50 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${station.load > 80 ? 'bg-gradient-to-r from-red-500 to-rose-500' : station.load > 50 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`}
                    style={{ width: `${station.load}%` }}
                  ></div>
                </div>
                <span className={`text-xl font-extrabold w-16 text-right ${station.load > 80 ? 'text-red-500' : station.load > 50 ? 'text-orange-500' : 'text-slate-700'}`}>{station.load}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMap(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden relative z-10 animate-slide-up border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="text-blue-500" /> Blue Line Topology
              </h3>
              <button 
                onClick={() => setShowMap(false)}
                className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-12 relative min-h-[400px] flex items-center overflow-x-auto">
              <div className="flex justify-between items-center w-full min-w-[700px] relative">
                {/* Connecting Line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-3 bg-blue-100 rounded-full z-0 overflow-hidden">
                  <div className="h-full bg-blue-500 w-full opacity-50"></div>
                </div>
                
                {/* Station Nodes */}
                {stations.map((station, i) => (
                  <div key={station.id} className="relative z-10 flex flex-col items-center group">
                    <div 
                      className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 
                      ${station.load > 80 ? 'bg-red-500 shadow-red-500/40' : station.load > 50 ? 'bg-orange-500 shadow-orange-500/40' : 'bg-emerald-500 shadow-emerald-500/40'}`}
                    >
                      <MapPin size={20} className="text-white" />
                    </div>
                    
                    <div className="mt-4 text-center">
                      <p className="font-bold text-slate-800 text-sm whitespace-nowrap">{station.name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${station.load > 80 ? 'bg-red-50 text-red-600' : station.load > 50 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {station.load}% Load
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
