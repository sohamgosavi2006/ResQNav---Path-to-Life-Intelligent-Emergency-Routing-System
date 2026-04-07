'use client';

import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MapPolyline } from '@/components/map/MapPolyline';
import { AnimatedMarker } from '@/components/map/AnimatedMarker';
import { MapTrafficLayer } from '@/components/map/MapTrafficLayer';
import { AlertTriangle, Route, Flame, Wind, Plus, Navigation } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { mapRoutes, mapIncidents } from '@/lib/mockData';

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function MapPage() {
  const [activeTab, setActiveTab] = useState<'ambulance' | 'fire' | 'disaster'>('ambulance');

  // Generate routes based on active tab
  const baseEmRoute = mapRoutes.find(r => r.type === 'emergency');
  const reroute = mapRoutes.find(r => r.type === 'reroute');

  const rerouteCoords = [reroute?.from, reroute?.to].filter(Boolean) as number[][];

  // Modify coordinates slightly based on tab to show distinct routes
  const offset = activeTab === 'fire' ? -0.015 : activeTab === 'disaster' ? 0.02 : 0;
  
  const emRouteCoords = [baseEmRoute?.from, ...(baseEmRoute?.waypoints || []), baseEmRoute?.to]
    .filter(Boolean)
    .map((coord: any) => [coord[0] + offset, coord[1] + offset]) as number[][];

  // UI Theme settings per tab
  const getTheme = () => {
    switch (activeTab) {
      case 'ambulance':
        return { color: '#10B981', ring: 'shadow-[0_0_20px_rgba(16,185,129,0.7)]', bg: 'bg-emerald-500', bgLight: 'bg-emerald-100', text: 'text-emerald-500', name: 'Ambulance Unit (AMB-004)' };
      case 'fire':
        return { color: '#EF4444', ring: 'shadow-[0_0_20px_rgba(239,68,68,0.7)]', bg: 'bg-red-500', bgLight: 'bg-red-100', text: 'text-red-500', name: 'Fire Engine (FR-112)' };
      case 'disaster':
        return { color: '#F59E0B', ring: 'shadow-[0_0_20px_rgba(245,158,11,0.7)]', bg: 'bg-amber-500', bgLight: 'bg-amber-100', text: 'text-amber-500', name: 'Evacuation Convoy (EV-Alpha)' };
    }
  };

  const theme = getTheme();

  return (
    <div className="h-full flex flex-col bg-[var(--bg)] relative overflow-hidden">
      <Topbar title="Live Tactical Map" subtitle="Real-time multi-agency routing" />
      
      <div className="flex-1 relative w-full h-full bg-slate-900">
        <APIProvider apiKey={GOOGLE_MAPS_KEY}>
          <Map
            defaultCenter={{ lat: 12.9716, lng: 77.5946 }}
            defaultZoom={12}
            mapId="22d3e098ed88d672" 
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%', outline: 'none' }}
          >
            {/* Live Traffic Overlay */}
            <MapTrafficLayer />

            {/* Tactical Incident Markers */}
            {mapIncidents.map(inc => (
              <AdvancedMarker key={inc.id} position={{ lat: inc.lat, lng: inc.lng }}>
                <div className={`p-1.5 rounded-full shadow-lg ${
                  inc.severity === 'critical' ? 'bg-red-500' : 
                  inc.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                } cursor-pointer flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-125 transition-transform`}>
                  <AlertTriangle size={14} className="text-white" />
                </div>
              </AdvancedMarker>
            ))}

            {/* Target Location Flag */}
            {emRouteCoords.length > 0 && (
              <AdvancedMarker position={{ lat: emRouteCoords[emRouteCoords.length - 1][1], lng: emRouteCoords[emRouteCoords.length - 1][0] }}>
                <div className={'w-6 h-6 rounded-lg text-white flex items-center justify-center ' + theme.bg}>
                   <Navigation size={14} className="rotate-180" />
                </div>
              </AdvancedMarker>
            )}

            {/* Live Animated Emergency Vehicle Marker */}
            {emRouteCoords.length > 1 && (
              <AnimatedMarker routeCoords={emRouteCoords} durationMs={20000}>
                <div className={`pulse-ring relative w-12 h-12 rounded-full ${theme.bgLight} flex items-center justify-center border-2 border-white ${theme.ring}`}>
                  <div className={`w-5 h-5 rounded-full ${theme.bg} relative z-10 flex flex-col items-center justify-center text-white`}>
                    {activeTab === 'ambulance' && <Plus size={12} strokeWidth={4} />}
                    {activeTab === 'fire' && <Flame size={12} strokeWidth={3} />}
                    {activeTab === 'disaster' && <Wind size={12} strokeWidth={3} />}
                  </div>
                </div>
              </AnimatedMarker>
            )}

            {/* Active Polylines */}
            {emRouteCoords.length > 0 && (
              <MapPolyline coordinates={emRouteCoords} strokeColor={theme.color} strokeWeight={5} />
            )}
            
            {/* Show civilian reroute lines to avoid this corridor */}
            {rerouteCoords.length > 0 && (
              <MapPolyline coordinates={rerouteCoords} strokeColor="#94A3B8" strokeWeight={4} dashed={true} />
            )}
            
          </Map>
        </APIProvider>

        {/* Floating Modern Overlay Filters (Hackathon UI) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-1.5 glass rounded-2xl shadow-xl border border-white/40">
          <button 
            onClick={() => setActiveTab('ambulance')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'ambulance' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-black/5'
            }`}
          >
            <Plus size={16} strokeWidth={3} /> Ambulance
          </button>
          <button 
            onClick={() => setActiveTab('fire')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'fire' ? 'bg-red-500 text-white shadow-md' : 'text-slate-600 hover:bg-black/5'
            }`}
          >
            <Flame size={16} strokeWidth={3} /> Fire Engine
          </button>
          <button 
            onClick={() => setActiveTab('disaster')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'disaster' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 hover:bg-black/5'
            }`}
          >
            <Wind size={16} strokeWidth={3} /> Disaster Evac
          </button>
        </div>

        {/* Floating Side Panel Console */}
        <div className="absolute top-6 right-6 bottom-6 w-80 glass rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/60">
          <div className="p-6 border-b border-white/20 bg-gradient-to-br from-white/60 to-white/10">
            <h3 className="font-bold text-xl mb-1 text-slate-800" style={{ fontFamily: 'Space Grotesk' }}>Active Dispatch</h3>
            <div className="badge bg-white/60 border border-white/80 shadow-sm text-slate-700 flex items-center gap-1.5 w-fit">
               <span className={`status-dot live ${theme.bg}`} /> Live Tracking
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Dynamic Status Card */}
            <div>
              <h4 className={`text-[11px] font-black uppercase tracking-widest ${theme.text} flex items-center gap-2 mb-3`}>
                <Route size={14} /> Mission Control
              </h4>
              <div className="bg-white/40 border border-white/40 rounded-2xl p-4 shadow-sm backdrop-blur-md">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-slate-800">{theme.name}</span>
                </div>
                
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  <div className="relative flex items-center justify-between z-10">
                     <span className="text-sm font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200">Origin</span>
                     <span className="text-xs text-slate-500 font-medium bg-white/60 rounded px-1.5 py-0.5">Depot Alpha</span>
                  </div>
                  <div className="relative flex items-center justify-between z-10 pt-4">
                     <span className="text-sm font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200">Destination</span>
                     <span className="text-xs text-slate-500 font-medium bg-white/60 rounded px-1.5 py-0.5">Ground Zero</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">AI Signals</p>
                    <p className="font-bold text-slate-700">12 Overridden</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">Est. Arrival</p>
                    <p className={`font-black ${theme.text} text-lg`}>1m 40s</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Civilian Re-routing Notice */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-3">
                <Route size={14} /> Traffic Orchestration
              </h4>
              <div className="bg-slate-800 text-white rounded-2xl p-4 shadow-xl">
                <p className="text-sm leading-relaxed text-slate-200">
                  General traffic within a 2km radius is preemptively rerouted to maintain an average clearance speed of <span className="font-bold text-emerald-400">45 km/h</span>.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
