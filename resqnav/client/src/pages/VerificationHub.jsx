import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, MessageSquare, Database, Activity, AlertCircle, CheckCircle2, WifiOff, Globe } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function VerificationHub() {
  const [vLogs, setVLogs] = useState([]);
  const [sLogs, setSLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/verification/logs`);
      setVLogs(res.data.verificationLogs);
      setSLogs(res.data.smsLogs);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 px-6 pb-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> Incident Integrity Layer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-400 to-zinc-800 bg-clip-text text-transparent">
            Verification Protocol & Hub
          </h1>
          <p className="text-zinc-500 max-w-2xl leading-relaxed">
            Real-time consensus monitoring across the ResQNav network. Every reported accident is validated through decentralized blockchain ledgers and secondary communication layers.
          </p>
        </header>

        {/* Top Grid: Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Validations" value={vLogs.length} icon={<Database className="text-blue-400" />} />
          <StatCard title="Active Nodes" value="442" icon={<Cpu className="text-purple-400" />} />
          <StatCard title="SMS Queue" value={sLogs.filter(l => l.status === 'queued').length} icon={<MessageSquare className="text-amber-400" />} />
          <StatCard title="Network Latency" value="14ms" icon={<Activity className="text-emerald-400" />} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Blockchain Ledger */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> Decentralized Ledger
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Updated Live</span>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {vLogs.length > 0 ? vLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all group overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
                      {log.status === 'validated' ? <CheckCircle2 className="text-emerald-500 w-12 h-12" /> : <AlertCircle className="text-amber-500 w-12 h-12" />}
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-tighter">
                            Incident #{log.incidentId}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${log.status === 'validated' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {log.status === 'validated' ? 'Confirmed Root' : 'Pending Consensus'}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-[10px] font-mono truncate max-w-[300px]">
                          Chain Hash: <span className="text-zinc-300">{log.blockchainHash}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest mb-0.5">Confidence</p>
                          <p className="text-lg font-mono text-white">{(log.confidenceScore * 100).toFixed(0)}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest mb-0.5">Public Reports</p>
                          <p className="text-lg font-mono text-white">{log.consensusCount}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-white/[0.05] rounded-3xl text-zinc-600 text-sm italic">
                    No verified records in current block...
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Section 2: Communication Fallback (SMS) */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="text-blue-500" /> Edge Comm Layer
            </h2>
            
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <span>Layer 1: Cellular SMS</span>
                  <span className="text-emerald-400">Operational</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="h-full bg-emerald-400" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-zinc-600 font-bold">Recent Failover Logs</h3>
                <div className="space-y-2">
                  {sLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className={`mt-1 h-2 w-2 rounded-full ${log.status === 'sent' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] font-mono text-zinc-400">{log.phoneNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")}</p>
                          <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-tighter">
                            {log.status === 'queued' ? <WifiOff className="w-2.5 h-2.5 inline mr-1 text-amber-500" /> : null}
                            {log.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{log.message}</p>
                      </div>
                    </div>
                  ))}
                  {sLogs.length === 0 && <p className="text-center text-zinc-700 text-xs py-8 italic">No cellular fallback activity...</p>}
                </div>
              </div>
            </div>

            {/* Layer Explanation Box */}
            <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
              <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Store-and-Forward (Layer 3)</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                Offline detection logic is active. If signal drops below 10%, messages are encrypted and held locally until telecom handshake is restored.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all space-y-2 relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
      </div>
      <div className="text-2xl font-mono font-bold">{value}</div>
    </div>
  );
}
