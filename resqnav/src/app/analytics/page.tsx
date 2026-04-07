'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { Download, TrendingUp, TrendingDown, Users, AlertTriangle } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { trafficData, hotspots } from '@/lib/mockData';

const COLORS = ['#FF6B35', '#F59E0B', '#10B981', '#0EA5E9', '#8B5CF6', '#EC4899'];

export default function AnalyticsPage() {
  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      <Topbar title="Government Analytics" subtitle="City-wide traffic orchestration metrics" />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Today's Performance</h2>
            <p className="text-sm text-slate-500">Data updated 5 minutes ago</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:shadow transition">
            <Download size={16} /> Export PDF Report
          </button>
        </div>

        {/* Top KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">Avg Response Time</p>
              <h3 className="text-3xl font-extrabold text-[var(--primary)]" style={{ fontFamily: 'Space Grotesk' }}>4.2 <span className="text-lg">min</span></h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center mt-1"><TrendingDown size={14} className="mr-1" /> 18% improvement</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center text-[var(--primary)] text-xl">⏱️</div>
          </div>
          
          <div className="glass p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">Traffic Rerouted</p>
              <h3 className="text-3xl font-extrabold text-blue-500" style={{ fontFamily: 'Space Grotesk' }}>14,205 <span className="text-lg">cars</span></h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center mt-1"><TrendingUp size={14} className="mr-1" /> +2,100 from yesterday</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <Users size={24} />
            </div>
          </div>

          <div className="glass p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">Incidents Prevented</p>
              <h3 className="text-3xl font-extrabold text-emerald-500" style={{ fontFamily: 'Space Grotesk' }}>28</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Via AI prediction engine</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Traffic Flow vs Response Time */}
          <div className="glass p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="text-[var(--primary)]" size={20} /> Traffic Volume vs Emergency Response
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" stroke="#0EA5E9" />
                  <YAxis yAxisId="right" orientation="right" stroke="#FF6B35" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="flow" name="Vehicles/Hour" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" />
                  <Area yAxisId="right" type="step" dataKey="response" name="Response Time (m)" stroke="#FF6B35" strokeWidth={3} fillOpacity={1} fill="url(#colorResp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Accident Hotspots */}
          <div className="glass p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={20} /> Danger Zones & Hotspots
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hotspots} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="zone" type="category" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="accidents" name="Incidents" fill="#EF4444" radius={[0, 4, 4, 0]}>
                    {hotspots.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.severity === 'critical' ? '#EF4444' : entry.severity === 'high' ? '#F59E0B' : '#10B981'} />
                    ))}
                  </Bar>
                  <Bar dataKey="congestion" name="Congestion Index" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="glass bg-slate-900 border-slate-700 text-white rounded-2xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-bold text-lg flex items-center gap-2">
               AI Predictive Analysis
            </h3>
            <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30">ML Model v2.4 Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 text-sm mb-2">High Probability Congestion</h4>
              <p className="text-xl font-bold">K.R. Puram Junction</p>
              <p className="text-xs text-slate-400 mt-2">Between 17:30 - 19:00 today. Pre-emptive rerouting algorithms staged.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-emerald-400 text-sm mb-2">Algorithm Efficiency</h4>
              <p className="text-xl font-bold">+22% Flow Rate</p>
              <p className="text-xs text-slate-400 mt-2">Corridor optimization is outperforming baseline static signals.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-orange-400 text-sm mb-2">Weather Impact Alert</h4>
              <p className="text-xl font-bold">Rain Expected</p>
              <p className="text-xs text-slate-400 mt-2">Minor showers at 16:00. Estimating +8% increase in emergency dispatch volume.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
