"use client";

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchPredictionsForToday } from '@/lib/api';

export default function PredictionsTab() {
  const [demandData, setDemandData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictionsForToday().then(data => {
      setDemandData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-[calc(100vh-12rem)] min-h-[500px] animate-slide-up relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[100px] pointer-events-none rounded-full"></div>
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">AI Demand Prediction (Operating Hours)</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Multi-nodal passenger forecasting</p>
        </div>
        {loading && <span className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-max shadow-sm border border-blue-100 animate-pulse"><div className="w-2 h-2 bg-blue-600 rounded-full"></div> Running ML Model...</span>}
      </div>
      <div className="flex-1 w-full relative z-10">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAluva" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(241, 245, 249, 0.4)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1e293b' }}
                itemStyle={{fontWeight: 600}}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '24px', fontWeight: 600, color: '#475569' }}/>
              <Area type="monotone" dataKey="aluva" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAluva)" name="Aluva Node" activeDot={{r: 6, strokeWidth: 0, fill: '#3b82f6'}} />
              <Area type="monotone" dataKey="mg_road" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMg)" name="MG Road Node" activeDot={{r: 6, strokeWidth: 0, fill: '#8b5cf6'}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
