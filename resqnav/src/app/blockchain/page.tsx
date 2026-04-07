'use client';

import { Shield, Search, Download, Filter, Key, CheckCircle } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { blockchainLedger } from '@/lib/mockData';

export default function BlockchainPage() {
  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      <Topbar title="Immutable Ledger" subtitle="Cryptographically verified incident logs and routing history" />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 glass p-5 relative overflow-hidden bg-slate-900 border-none text-white shadow-xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-1">Network Status</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-2xl font-bold font-mono">Consensus Built</span>
                  </div>
                </div>
                <Shield size={40} className="text-emerald-500/20 absolute right-4" />
              </div>
              <div className="relative z-10 mt-6 grid grid-cols-3 gap-4 border-t border-slate-700 pt-4">
                <div>
                  <span className="block text-xs text-slate-400">Total Blocks</span>
                  <span className="font-mono text-lg text-blue-400">194,523</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Avg Block Time</span>
                  <span className="font-mono text-lg text-blue-400">2.1s</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Nodes Active</span>
                  <span className="font-mono text-lg text-blue-400">42</span>
                </div>
              </div>
            </div>
            
            <div className="glass p-5 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-2 text-slate-700">
                <Key className="text-[var(--primary)]" />
                <span className="font-semibold text-sm">Your Verification Key (Public Address)</span>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg font-mono text-xs text-slate-500 break-all select-all flex items-center justify-between border border-slate-200">
                0x71C...89af
                <button className="text-[var(--primary)] hover:text-orange-600 font-semibold px-2">Copy</button>
              </div>
              <p className="text-xs text-slate-500">This key is used to sign your incident reports, providing a tamper-proof civic audit trail.</p>
            </div>
          </div>

          <div className="glass p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Shield className="text-purple-500" size={20} /> Decentralized Event Log
              </h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search hash or block..." className="input-field pl-9 h-10 w-64 text-sm" />
                </div>
                <button className="px-3 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition">
                  <Filter size={16} />
                </button>
                <button className="px-4 h-10 rounded-xl bg-gradient-dark text-white font-semibold text-sm hover:shadow-lg transition flex items-center gap-2">
                  <Download size={16} /> Export Audit
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="data-table w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">Txn Hash</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">Block #</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">Event Type</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">Location Zone</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase">Consensus Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blockchainLedger.map((log, i) => (
                    <tr key={log.hash} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono text-xs text-blue-600 hover:text-blue-800 cursor-pointer">{log.hash}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">{log.block}</td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-700">{log.type}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{log.location}</td>
                      <td className="py-3 px-4 text-sm text-slate-500 font-mono text-xs">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${log.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {log.status === 'confirmed' ? <CheckCircle size={10} className="mr-1" /> : undefined}
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm text-slate-500">
              <span>Showing 8 most recent blocks</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 transition">Prev</button>
                <button className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 transition">Next</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
