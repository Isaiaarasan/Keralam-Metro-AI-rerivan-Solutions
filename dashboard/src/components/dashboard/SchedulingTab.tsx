"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ArrowRight } from 'lucide-react';
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
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col min-h-[500px] h-[calc(100vh-12rem)]">
        <div className="flex justify-between">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Headway Optimization</h3>
            {loading && <span className="text-blue-500 font-medium text-sm animate-pulse">Running Scheduler...</span>}
        </div>
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scheduleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }}/>
                <Bar dataKey="current_frequency" fill="#94a3b8" name="Current Freq (mins)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recommended_frequency" fill="#3b82f6" name="AI Proposed (mins)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Recommendation Panel */}
      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden h-fit">
        {/* decorative circle */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-white/20 p-2 rounded-lg">
            <Activity size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold">AI Recommended Actions</h3>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition cursor-pointer">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-100">08:00 - 10:00 Peak</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">URGENT</span>
            </div>
            <p className="font-semibold mb-2">Reduce headway to 5 mins</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-100">Impact: -25% crowding</span>
              <button className="flex items-center gap-1 text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition">
                Apply <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition cursor-pointer">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-100">11:00 - 15:00 Off-Peak</span>
            </div>
            <p className="font-semibold mb-2">Increase headway to 15 mins</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-100">Impact: 12% energy saving</span>
              <button className="flex items-center gap-1 text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition">
                Apply <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
