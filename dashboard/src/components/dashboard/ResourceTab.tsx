"use client";

import { useEffect, useState } from 'react';
import { fetchPredictionsForToday, fetchStations, BASE_URL } from '@/lib/api';
import { Users, Shield, MapPin, Search, ArrowRight, Download } from 'lucide-react';

export default function ResourceTab() {
  const [allocationData, setAllocationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // 1. Fetch Stations and AI demand predictions for 8 AM
        const [stations, predictions] = await Promise.all([
          fetchStations(),
          fetchPredictionsForToday()
        ]);

        const morningData = predictions.find((p: any) => p.time === '08:00');
        
        if (!morningData) {
           setLoading(false);
           return;
        }

        const activeDate = new Date();

        // 2. Prepare payload using real station numeric IDs
        const requests = stations.map((s: any) => ({
          station_id: s.station_id,
          hour: 8,
          day_of_week: activeDate.getDay(),
          weekend_flag: [0, 6].includes(activeDate.getDay()) ? 1 : 0
        }));

        // 3. Post to backend to get Staffing Numbers
        const res = await fetch(`${BASE_URL}/resource-allocation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requests })
        });
        const data = await res.json();
        
        // 4. Merge visual names
        const mergedData = data.map((d: any) => {
          const station = stations.find((s: any) => s.station_id == d.station_id);
          return {
            ...d,
            name: station ? station.station_name : `Station ${d.station_id}`
          };
        });

        setAllocationData(mergedData);
      } catch (err) {
        console.error("Failed to fetch resource allocation", err);
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleExportCSV = () => {
    if (!allocationData.length) return;
    
    // Convert JSON to CSV manually
    const headers = ['Station', 'Predicted Demand (08:00)', 'Ticketing Staff', 'Security Staff', 'Total Staff Needed'];
    const rows = allocationData.map(d => [
      d.name,
      d.predicted_demand,
      d.staff_allocation.ticketing,
      d.staff_allocation.security,
      d.staff_allocation.total_staff
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateString = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `Metro_Staffing_Plan_${dateString}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex justify-between items-center mb-2">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">Resource Planning</h2>
            <p className="text-slate-500 text-sm mt-1">AI-optimized staff allocation based on predicted passenger surges.</p>
         </div>
         <button 
           onClick={handleExportCSV}
           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-md transition-all">
            <Download size={18} /> Export Staffing Plan (CSV)
         </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {loading ? (
           <div className="h-64 flex items-center justify-center text-slate-400 font-medium">Running AI allocation model...</div>
         ) : (
           <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-200/60">
                   <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Station</th>
                   <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider border-l border-slate-200/50 flex items-center gap-2"><MapPin size={16}/> Expected Demand (Peak)</th>
                   <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider border-l border-slate-200/50"><Users size={16} className="inline mr-2 text-blue-500"/>Ticketing</th>
                   <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider border-l border-slate-200/50"><Shield size={16} className="inline mr-2 text-rose-500"/>Security</th>
                   <th className="py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider border-l border-slate-200/50">Total Duty Roster</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {allocationData.map((row, idx) => (
                   <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                     <td className="py-4 px-6 font-semibold text-slate-800 flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${row.predicted_demand > 500 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                        {row.name}
                     </td>
                     <td className="py-4 px-6 font-bold text-slate-600 border-l border-slate-200/50">
                        {row.predicted_demand.toLocaleString()} <span className="text-xs text-slate-400 font-normal ml-1">passengers/hr</span>
                     </td>
                     <td className="py-4 px-6 font-semibold text-blue-700 bg-blue-50/10 border-l border-slate-200/50">
                        {row.staff_allocation.ticketing} 
                     </td>
                     <td className="py-4 px-6 font-semibold text-rose-700 bg-rose-50/10 border-l border-slate-200/50">
                        {row.staff_allocation.security}
                     </td>
                     <td className="py-4 px-6 border-l border-slate-200/50">
                        <span className="bg-indigo-100 text-indigo-700 py-1.5 px-3 rounded-full font-bold text-sm">
                          {row.staff_allocation.total_staff} Assigned
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
      </div>
    </div>
  );
}
