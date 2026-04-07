'use client';

import { 
  AlertTriangle, Route, Clock, Zap, CheckCircle2, TrendingUp, Navigation
} from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { kpiData, recentAlerts, ambulances, systemStatus } from '@/lib/mockData';

export default function Dashboard() {
  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      <Topbar title="Dashboard Overview" subtitle="Real-time system health and operations" />
      
      <div className="flex-1 overflow-y-auto p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard 
            title="Active Incidents" 
            value={kpiData.activeIncidents} 
            icon={<AlertTriangle className="text-red-500" />} 
            trend="+2 from last hr" 
          />
          <KpiCard 
            title="Avg Response Time" 
            value={kpiData.avgResponseTime} 
            icon={<Clock className="text-orange-500" />} 
            trend="-12% vs avg" 
            good
          />
          <KpiCard 
            title="Green Corridors" 
            value={kpiData.greenCorridors} 
            icon={<Route className="text-emerald-500" />} 
            trend="Active now" 
            good
          />
          <KpiCard 
            title="Reports Verified" 
            value={kpiData.reportsVerified} 
            icon={<CheckCircle2 className="text-blue-500" />} 
            trend="94% accuracy" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-8">
            <div className="glass p-6">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Navigation size={20} className="text-[var(--primary)]" /> Active Fleet Status
              </h3>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Call Sign</th>
                      <th>Driver</th>
                      <th>ETA</th>
                      <th>Status</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambulances.map((amb) => (
                      <tr key={amb.id}>
                        <td className="font-semibold">{amb.id}</td>
                        <td>{amb.driver}</td>
                        <td className="font-medium text-emerald-600">{amb.eta || '—'}</td>
                        <td>
                          <span className={`badge ${
                            amb.status === 'en-route' ? 'bg-emerald-100 text-emerald-700' :
                            amb.status === 'available' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {amb.status === 'en-route' && <span className="status-dot live bg-emerald-500" />}
                            {amb.status}
                          </span>
                        </td>
                        <td>
                          {amb.progress > 0 ? (
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${amb.progress}%` }} />
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass p-6">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <TrendingUp size={20} className="text-purple-500" /> Recent Alerts Feed
              </h3>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex gap-4 items-start p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
                    <div className={`p-2.5 rounded-xl ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-[15px] capitalize">{alert.type} Report</h4>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{alert.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Location: <span className="font-medium text-gray-900">{alert.location}</span></p>
                      <div className="flex gap-2">
                        {alert.verified ? (
                          <span className="badge bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 size={10} /> Verified by AI
                          </span>
                        ) : (
                          <span className="badge bg-amber-50 text-amber-600 border border-amber-100">Pending verification</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-8">
            <div className="glass p-6 bg-gradient-dark text-white border-0 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] rounded-full blur-[60px] opacity-20 -mr-10 -mt-10 pointer-events-none" />
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Zap size={20} className="text-blue-400" /> System Health
              </h3>
              <div className="space-y-5">
                {systemStatus.slice(0,5).map((sys) => (
                  <div key={sys.name} className="flex justify-between items-center group">
                    <span className="text-sm text-gray-300 font-medium">{sys.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{sys.latency}</span>
                      <span className={`status-dot ${
                        sys.status === 'operational' ? 'bg-emerald-400 live' :
                        sys.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass rounded-xl overflow-hidden shadow-md">
              <div className="p-0 relative h-48 bg-slate-100 overflow-hidden">
                {/* Modern subtle topographic or generic grid background representing a region */}
                <div 
                  className="absolute inset-0 opacity-40 bg-center bg-cover" 
                  style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png'), linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)` }}
                />
                
                {/* Abstract Route visualization to keep it dynamic and independent of static map APIs */}
                <div className="absolute top-[40%] left-[20%] right-[30%] h-1.5 bg-emerald-500 rounded-full rotate-[-15deg] shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200 flex items-center gap-3">
                  <div className="pulse-ring relative w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 relative z-10" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">1 Active Corridor</h4>
                    <p className="text-xs text-slate-500">Hebbal → M.S. Ramaiah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend, good }: { title: string, value: string | number, icon: any, trend: string, good?: boolean }) {
  return (
    <div className="glass p-5 flex items-start justify-between card-hover">
      <div>
        <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-1">{title}</h4>
        <div className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2" style={{ fontFamily: 'Space Grotesk' }}>{value}</div>
        <div className={`text-xs font-semibold ${good ? 'text-emerald-500' : 'text-gray-500'}`}>
          {trend}
        </div>
      </div>
      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
        {icon}
      </div>
    </div>
  );
}
