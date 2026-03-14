"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ArrowRight, Zap, Target } from 'lucide-react';
import { fetchSchedule, fetchPredictionsForToday } from '@/lib/api';

export default function SchedulingTab() {
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Get AI predictions for the morning layout
      const predictions = await fetchPredictionsForToday();
      
      const newSchedule = [];
      for(let hour of [8, 9, 10, 11, 12, 16, 17, 18, 19]) {
        // Aggregate passenger demand across top stations for this hour to feed into scheduler
        const hourData = predictions.find((p: any) => p.time === `${hour.toString().padStart(2,'0')}:00`);
        const total_demand = hourData ? (hourData.aluva + hourData.edapally + hourData.mg_road) : 500;
        
        const sched = await fetchSchedule(total_demand);
        newSchedule.push({
          time: `${hour.toString().padStart(2,'0')}:00`,
          current_frequency: hour > 10 && hour < 16 ? 15 : 10, // Simulated static legacy system pattern
          recommended_frequency: sched.dispatchInterval,
          trains_needed: sched.requiredTrains
        });
      }
      setScheduleData(newSchedule);
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col min-h-[500px] h-[calc(100vh-12rem)] animate-slide-up relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">Headway Optimization</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">AI-driven vs Current Frequency</p>
            </div>
            {loading && <span className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-full shadow-sm border border-indigo-100 animate-pulse"><div className="w-2 h-2 bg-indigo-600 rounded-full"></div> Running Scheduler...</span>}
        </div>
        <div className="flex-1 w-full relative z-10">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scheduleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(241, 245, 249, 0.4)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                <Tooltip cursor={{fill: 'rgba(248, 250, 252, 0.5)'}} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1e293b' }} itemStyle={{fontWeight: 600}}/>
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '24px', fontWeight: 600, color: '#475569' }}/>
                <Bar dataKey="current_frequency" fill="#cbd5e1" name="Current Freq (mins)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="recommended_frequency" fill="#6366f1" name="AI Proposed (mins)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Recommendation Panel */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-xl shadow-indigo-500/20 p-6 text-white relative overflow-hidden h-fit animate-slide-up" style={{ animationDelay: '100ms' }}>
        {/* decorative circles */}
        <div className="absolute top-0 right-[-10%] -mt-8 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 rounded-full bg-indigo-300 opacity-20 blur-xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/20 shadow-inner">
            <Zap size={22} className="text-indigo-100" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">AI Prescriptions</h3>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group shadow-lg shadow-black/5 hover:-translate-y-1">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-indigo-100 tracking-wider uppercase flex items-center gap-1"><Target size={12}/>08:00 - 10:00 Peak</span>
              <span className="bg-rose-500/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase shadow-sm border border-rose-400">URGENT</span>
            </div>
            <p className="font-extrabold text-lg mb-3 leading-tight tracking-tight text-white group-hover:text-indigo-50 transition-colors">Reduce headway to 5 mins</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-100/90">Impact: <span className="text-white">-25% crowding</span></span>
              <button className="flex items-center gap-1.5 text-white bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl transition font-semibold text-sm shadow-inner group-hover:shadow-md">
                Apply <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group shadow-lg shadow-black/5 hover:-translate-y-1">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-indigo-100 tracking-wider uppercase flex items-center gap-1"><Target size={12}/>11:00 - 15:00 Off-Peak</span>
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase shadow-sm border border-white/10">STABLE</span>
            </div>
            <p className="font-extrabold text-lg mb-3 leading-tight tracking-tight text-white group-hover:text-indigo-50 transition-colors">Increase headway to 15 mins</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-100/90">Impact: <span className="text-white">+12% energy saving</span></span>
              <button className="flex items-center gap-1.5 text-white bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl transition font-semibold text-sm shadow-inner group-hover:shadow-md">
                Apply <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
