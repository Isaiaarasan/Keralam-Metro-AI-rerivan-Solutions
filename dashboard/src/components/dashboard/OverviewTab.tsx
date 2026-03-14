import { Users, Train, AlertTriangle, Activity } from 'lucide-react';
import { stationStatus } from '@/lib/mock-data';

export default function OverviewTab() {
  return (
    <>
      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="text-blue-600" size={24} />
            </div>
            <span className="flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +12% <Activity size={12} className="ml-1" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Passengers (Today)</h3>
          <p className="text-3xl font-bold text-slate-800">42,590</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-50 p-3 rounded-xl">
              <Train className="text-indigo-600" size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Active Trains</h3>
          <p className="text-3xl font-bold text-slate-800">24 / 28</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
            <span className="flex items-center text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
              Peak Hour
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Current Status</h3>
          <p className="text-xl font-bold text-slate-800">High Congestion</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Activity className="text-emerald-600" size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">AI Confidence Score</h3>
          <p className="text-3xl font-bold text-slate-800">94.2%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Top Congested Stations</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View Map</button>
          </div>
          <div className="divide-y divide-slate-100 flex-1 overflow-auto">
            {stationStatus.filter(s => s.load > 50).map((station) => (
              <div key={station.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${station.load > 80 ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{station.name}</h4>
                    <p className="text-xs text-slate-500">{station.status}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${station.load > 80 ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${station.load}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-12 text-right">{station.load}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Activity className="text-blue-500" size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">System Models Active</h3>
            <p className="text-slate-500 mb-4 max-w-sm text-sm">
              The AI demand prediction and scheduling optimization models are currently active and running optimally. Monitor detailed analytics from the navigation sidebar.
            </p>
        </div>
      </div>
    </>
  );
}
