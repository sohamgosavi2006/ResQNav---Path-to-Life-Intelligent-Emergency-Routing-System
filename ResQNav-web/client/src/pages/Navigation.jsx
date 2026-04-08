import { useState, useRef, useCallback, useEffect } from 'react';
import { Map, Marker, Source, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Sun, Moon, Navigation as NavIcon, MapPin, Loader2, AlertTriangle, Ambulance, ShieldCheck, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const INITIAL_VIEW = {
  longitude: 73.8567, // Adjusted for Pune simulation
  latitude: 18.5204,
  zoom: 13,
};

function getDistanceMeters(p1, p2) {
  const R = 6371000;
  const dLat = (p2[1] - p1[1]) * Math.PI / 180;
  const dLon = (p2[0] - p1[0]) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1[1] * Math.PI / 180) * Math.cos(p2[1] * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}
function formatDuration(s) {
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h > 0 ? `${h} hr ${m} min` : `${m} min`;
}

export default function Navigation() {
  const { user } = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [startCoord, setStartCoord] = useState(null);
  const [endCoord, setEndCoord] = useState(null);
  
  const [carPosition, setCarPosition] = useState(null);
  const [carBearing, setCarBearing] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.2); // Default slightly faster than 1 for better demo flow
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [error, setError] = useState('');
  const mapRef = useRef(null);
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [simulationState, setSimulationState] = useState('idle');
  const [incidentLocation, setIncidentLocation] = useState(null);
  const [primaryRouteGeoJSON, setPrimaryRouteGeoJSON] = useState(null);
  const [alternateRouteGeoJSON, setAlternateRouteGeoJSON] = useState(null);
  const [alternateRouteInfo, setAlternateRouteInfo] = useState(null);
  const simulationTimers = useRef([]);

  const onMapLoad = useCallback((evt) => {
    mapRef.current = evt.target;
  }, []);

  // ── Physics-Based Animation Loop ──
  useEffect(() => {
    if (!isAnimating || !routeGeoJSON) return;

    let animationFrameId;
    let lastTime = Date.now();
    const coords = routeGeoJSON.geometry.coordinates;
    let currentIdx = 0;
    let distTravelledOnSegment = 0;

    const calculateBearing = (start, end) => {
      const lat1 = (start[1] * Math.PI) / 180;
      const lat2 = (end[1] * Math.PI) / 180;
      const lon1 = (start[0] * Math.PI) / 180;
      const lon2 = (end[0] * Math.PI) / 180;
      const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      return (Math.atan2(y, x) * 180) / Math.PI;
    };

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      // Calibrated speed physics: Base speed 50km/h (13.88m/s)
      const speedMps = (50 / 3.6) * playbackSpeed;
      const stepDist = speedMps * deltaTime;
      distTravelledOnSegment += stepDist;

      const p1 = coords[currentIdx];
      const p2 = coords[currentIdx + 1];

      if (!p2) {
        setIsAnimating(false);
        return;
      }

      const segmentLen = getDistanceMeters(p1, p2);

      if (distTravelledOnSegment >= segmentLen) {
        currentIdx++;
        distTravelledOnSegment -= segmentLen;
        if (currentIdx >= coords.length - 1) {
          setCarPosition(coords[coords.length - 1]);
          setIsAnimating(false);
          return;
        }
      }

      const ratio = distTravelledOnSegment / segmentLen;
      const lng = p1[0] + (p2[0] - p1[0]) * ratio;
      const lat = p1[1] + (p2[1] - p1[1]) * ratio;
      setCarPosition([lng, lat]);
      setCarBearing(calculateBearing(p1, p2));

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnimating, routeGeoJSON, playbackSpeed]);

  const handleGetRoute = async () => {
    setIsLoading(true);
    setError('');
    try {
      const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}`);
      const starts = await startRes.json();
      const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`);
      const ends = await endRes.json();
      if (!starts.length || !ends.length) throw new Error('Could not find locations.');
      const s = { lng: parseFloat(starts[0].lon), lat: parseFloat(starts[0].lat) };
      const e = { lng: parseFloat(ends[0].lon), lat: parseFloat(ends[0].lat) };
      setStartCoord(s);
      setEndCoord(e);

      const url = `https://router.project-osrm.org/route/v1/driving/${s.lng},${s.lat};${e.lng},${e.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code !== 'Ok') throw new Error('Routing failed.');
      const route = data.routes[0];
      setRouteGeoJSON({ type: 'Feature', geometry: route.geometry, properties: {} });
      setPrimaryRouteGeoJSON({ type: 'Feature', geometry: route.geometry, properties: {} });
      setRouteInfo({ distance: formatDistance(route.distance), duration: formatDuration(route.duration) });
      setCarPosition(route.geometry.coordinates[0]);

      if (mapRef.current) {
        const coords = route.geometry.coordinates;
        const lngs = coords.map((c) => c[0]);
        const lats = coords.map((c) => c[1]);
        mapRef.current.fitBounds(
          [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
          { padding: 80, duration: 1200 }
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to calculate route.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearRoute = () => {
    simulationTimers.current.forEach(clearTimeout);
    simulationTimers.current = [];
    setRouteInfo(null);
    setRouteGeoJSON(null);
    setStartCoord(null);
    setEndCoord(null);
    setOrigin('');
    setDestination('');
    setSimulationState('idle');
    setIncidentLocation(null);
    setCarPosition(null);
    setIsAnimating(false);
  };

  const runDemoSequence = () => {
    if (!routeGeoJSON || !startCoord || !endCoord) return;
    simulationTimers.current.forEach(clearTimeout);
    setSimulationState('uploading');

    const t1 = setTimeout(async () => {
      const primaryCoords = primaryRouteGeoJSON?.geometry?.coordinates || routeGeoJSON.geometry.coordinates;
      let aheadIdx = Math.floor(primaryCoords.length * 0.7); 
      const crashCoord = primaryCoords[aheadIdx];
      setIncidentLocation({ lng: crashCoord[0], lat: crashCoord[1] });

      const detourLon = crashCoord[0] + 0.015;
      const detourLat = crashCoord[1] - 0.012;

      try {
        const startPoint = carPosition ? `${carPosition[0]},${carPosition[1]}` : `${startCoord.lng},${startCoord.lat}`;
        const url = `https://router.project-osrm.org/route/v1/driving/${startPoint};${detourLon},${detourLat};${endCoord.lng},${endCoord.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 'Ok' && data.routes.length > 0) {
          const detourRoute = data.routes[0];
          setAlternateRouteGeoJSON({ type: 'Feature', geometry: detourRoute.geometry, properties: {} });
          setAlternateRouteInfo({
            distance: formatDistance(detourRoute.distance),
            duration: formatDuration(detourRoute.duration),
          });
        }

        const incidentId = Math.floor(Math.random() * 9000) + 1000;
        await axios.post(`${API_URL}/verification/validate`, {
          incidentId,
          type: 'Collision',
          location: destination
        });
        await axios.post(`${API_URL}/verification/log-sms`, {
          phoneNumber: '+917875151851',
          message: `🚨 [ResQNav EMERGENCY] Critical Accident detected at ${destination}. Verification Hash RQ-${incidentId} initiated. Emergency services notified. Rerouting active.`
        });

      } catch (err) {
        console.error('Verification/Detour failed:', err);
      }
      setSimulationState('verified');
    }, 1500);
    simulationTimers.current.push(t1);
  };

  const handleReroute = () => {
    if (alternateRouteGeoJSON && carPosition) {
      setRouteGeoJSON(alternateRouteGeoJSON);
      setRouteInfo(alternateRouteInfo);
      setSimulationState('rerouted');
      setAlternateRouteGeoJSON(null);
      setIsAnimating(true);
    }
  };

  const routeLineLayer = { id: 'route-line', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#3b82f6', 'line-width': 5 } };
  const routeGlowLayer = { id: 'route-glow', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#3b82f6', 'line-width': 12, 'line-opacity': 0.15 } };
  const altLineLayer = { id: 'alt-line', type: 'line', source: 'alt-route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#f97316', 'line-width': 4, 'line-dasharray': [2, 2] } };
  const markerCounterFilter = isDarkMode ? 'invert(100%) hue-rotate(180deg)' : 'none';

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] mt-14 bg-[#050505] overflow-hidden selection:bg-blue-500/30">
      <aside className="w-full md:w-80 bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col z-10">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-[15px] font-semibold text-white tracking-tight">Navigation Control</h2>
          <p className="text-[12px] text-zinc-600 mt-0.5">Real-time intelligent routing</p>
        </div>
        <div className="px-5 py-5 space-y-3 border-b border-white/[0.06]">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.08em] mb-1.5">Origin</label>
            <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. SRM University" className="w-full px-3 py-2 bg-[#111111] border border-white/[0.08] rounded-lg text-white text-[13px] placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.2] transition-colors"/>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.08em] mb-1.5">Destination</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Tambaram" className="w-full px-3 py-2 bg-[#111111] border border-white/[0.08] rounded-lg text-white text-[13px] placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.2] transition-colors"/>
          </div>
          <div className="flex gap-2">
            <button onClick={handleGetRoute} disabled={isLoading || !origin.trim() || !destination.trim()} className="flex-1 py-2 bg-white text-black text-[13px] font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Get Route'}
            </button>
            {(routeInfo || error) && <button onClick={clearRoute} className="px-3 py-2 border border-white/[0.08] text-zinc-400 text-[13px] rounded-lg hover:bg-white/[0.04]">Clear</button>}
          </div>
          {error && <p className="text-[12px] text-red-400 bg-red-400/[0.06] border border-red-400/[0.1] rounded-lg px-3 py-2">{error}</p>}
        </div>
        
        {routeInfo && (
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.08em] mb-3">Live Mission Data</p>
            <div className="space-y-4">
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <div className="flex justify-between items-center mb-1"><span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Current Speed</span><span className="text-[10px] text-emerald-400 font-bold">REALTIME</span></div>
                <div className="text-2xl font-mono text-white">{(50 * playbackSpeed).toFixed(0)} <span className="text-xs text-zinc-500 uppercase">km/h</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.06]"><p className="text-[9px] text-zinc-600 font-bold uppercase mb-0.5">Distance</p><p className="text-[13px] text-white font-medium">{routeInfo.distance}</p></div>
                <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.06]"><p className="text-[9px] text-zinc-600 font-bold uppercase mb-0.5">ETA</p><p className="text-[13px] text-white font-medium">{routeInfo.duration}</p></div>
              </div>
            </div>
          </div>
        )}

        {routeGeoJSON && (
          <div className="px-5 py-4 border-b border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-zinc-500 uppercase">Simulation Speed</span><span className="text-[10px] text-blue-400 font-bold">x{playbackSpeed.toFixed(1)}</span></div>
            <div className="flex gap-1.5 h-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className={`flex-1 rounded-full transition-all ${i <= playbackSpeed * 2 ? 'bg-blue-500' : 'bg-white/10'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPlaybackSpeed(s => Math.max(s - 0.2, 0.4))} className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-bold hover:bg-white/10 transition-colors">SLOW</button>
              <button onClick={() => setPlaybackSpeed(s => Math.min(s + 0.2, 4))} className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-bold hover:bg-white/10 transition-colors">FAST</button>
            </div>
            {!isAnimating && (simulationState === 'idle' || simulationState === 'rerouted') && (
              <button onClick={() => setIsAnimating(true)} className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-sm bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer mt-4">
                <NavIcon className="w-4 h-4" /> Start Navigation
              </button>
            )}
            <button onClick={runDemoSequence} disabled={simulationState === 'uploading' || simulationState === 'verified'} className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-white font-medium text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <AlertTriangle className="w-4 h-4 text-red-500/80" /> ⚠️ Accident Ahead
            </button>
          </div>
        )}

        <div className="px-5 py-4 mt-auto border-t border-white/[0.06] bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center gap-2 mb-2"><span className={`w-1.5 h-1.5 rounded-full ${showTraffic ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`} /><span className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">{showTraffic ? 'Google Traffic Live' : 'Traffic Overlay Off'}</span></div>
          <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-zinc-600" /><span className="text-[12px] text-zinc-600 truncate">{user?.email}</span></div>
        </div>
      </aside>

      <main className="flex-1 relative">
        <div className="absolute inset-0 w-full h-full" style={{ filter: isDarkMode ? 'invert(100%) hue-rotate(180deg) contrast(90%)' : 'none', transition: 'filter 0.5s ease' }}>
          <Map initialViewState={INITIAL_VIEW} style={{ width: '100%', height: '100%' }} mapStyle="https://tiles.openfreemap.org/styles/liberty" onLoad={onMapLoad}>
            {showTraffic && (
              <Source id="google-traffic" type="raster" tiles={[`https://mt1.google.com/vt/lyrs=m@221097234,traffic&x={x}&y={y}&z={z}&key=${GOOGLE_KEY}`]} tileSize={256}>
                <Layer id="traffic-layer" type="raster" source="google-traffic" paint={{ 'raster-opacity': 0.8 }} />
              </Source>
            )}
            {routeGeoJSON && <Source id="route" type="geojson" data={routeGeoJSON}><Layer {...routeGlowLayer} /><Layer {...routeLineLayer} /></Source>}
            {alternateRouteGeoJSON && <Source id="alt-route" type="geojson" data={alternateRouteGeoJSON}><Layer {...altLineLayer} /></Source>}
            {carPosition && (
              <Marker longitude={carPosition[0]} latitude={carPosition[1]} anchor="center">
                <div style={{ transform: `rotate(${carBearing}deg)`, filter: markerCounterFilter, transition: 'transform 0.1s linear' }} className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.9)] border-2 border-white"><NavIcon className="w-4 h-4 text-white fill-current" /></div>
                </div>
              </Marker>
            )}
            {startCoord && <Marker longitude={startCoord.lng} latitude={startCoord.lat} anchor="bottom"><div style={{ filter: markerCounterFilter }} className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"><NavIcon className="w-4 h-4 text-white" /></div><div className="w-0.5 h-2 bg-blue-500/60" /></div></Marker>}
            {endCoord && <Marker longitude={endCoord.lng} latitude={endCoord.lat} anchor="bottom"><div style={{ filter: markerCounterFilter }} className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"><MapPin className="w-4 h-4 text-white" /></div><div className="w-0.5 h-2 bg-blue-500/60" /></div></Marker>}
            {incidentLocation && (simulationState === 'verified' || simulationState === 'rerouted') && (
              <Marker longitude={incidentLocation.lng} latitude={incidentLocation.lat} anchor="center">
                <div style={{ filter: markerCounterFilter }} className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full bg-red-500/30 animate-ping" /><div className="absolute w-8 h-8 rounded-full bg-red-500/40 animate-pulse" />
                  <div className="relative w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border-2 border-white shadow-[0_0_25px_rgba(239,68,68,1)]"><AlertTriangle className="w-3 h-3 text-white" /></div>
                </div>
              </Marker>
            )}
          </Map>
        </div>
        
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/[0.08] rounded-lg pointer-events-none"><span className="text-[10px] font-bold text-zinc-400 tracking-wider">LIVE</span><span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" /><span className="text-[11px] text-zinc-600 uppercase tracking-tight">Navigation System</span></div>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button onClick={() => setShowTraffic(!showTraffic)} className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all shadow-xl ${showTraffic ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-500'}`}>TRAFFIC</button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 bg-[#0A0A0A]/80 border border-white/[0.08] rounded-lg text-zinc-400 hover:text-white transition-colors shadow-xl">
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {simulationState === 'uploading' && <motion.div key="u" initial={{y:-40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-40, opacity:0}} className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-blue-500/20 px-8 py-3.5 rounded-2xl border border-blue-500/30 backdrop-blur-xl text-blue-100 font-bold shadow-2xl">Detecting Incident Area...</motion.div>}
          {simulationState === 'verified' && (
            <motion.div key="v" initial={{y:-40, opacity:0}} animate={{y:0, opacity:1}} className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md bg-red-500/90 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-2xl text-white">
              <div className="flex items-center gap-4 mb-3"><div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><AlertTriangle className="text-white w-6 h-6" /></div><div><h3 className="font-bold text-sm uppercase tracking-wider">Crash Verified</h3><p className="text-[10px] text-white/70">Blockchain ID: RQ-{Math.floor(Math.random() * 9000) + 1000}</p></div></div>
              <button onClick={handleReroute} className="w-full py-3 bg-white text-black rounded-2xl font-bold text-sm hover:bg-zinc-100 transition-all">Avoid Traffic — Switch to Bypass</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
