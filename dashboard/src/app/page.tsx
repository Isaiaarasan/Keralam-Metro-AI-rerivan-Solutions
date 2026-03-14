"use client";

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import OverviewTab from '@/components/dashboard/OverviewTab';
import PredictionsTab from '@/components/dashboard/PredictionsTab';
import SchedulingTab from '@/components/dashboard/SchedulingTab';
import StationsTab from '@/components/dashboard/StationsTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen text-slate-800 font-sans overflow-hidden bg-transparent">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto w-full relative z-10 animate-fade-in">
        <Header activeTab={activeTab} />
        
        <div className="flex-1 pb-10">
          {activeTab === 'dashboard' && <OverviewTab />}
          {activeTab === 'predictions' && <PredictionsTab />}
          {activeTab === 'scheduling' && <SchedulingTab />}
          {activeTab === 'stations' && <StationsTab />}
        </div>
      </main>
    </div>
  );
}
