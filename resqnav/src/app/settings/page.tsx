'use client';

import { useState } from 'react';
import { Smartphone, WifiOff, Bell, Activity, Send, Settings as SettingsIcon } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { useAppStore } from '@/lib/store';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const { smsPhone, smsAlertTypes, setSmsPhone, setSmsAlertTypes } = useAppStore();
  const [isSending, setIsSending] = useState(false);

  const toggleAlertType = (type: string) => {
    if (smsAlertTypes.includes(type)) {
      setSmsAlertTypes(smsAlertTypes.filter(t => t !== type));
    } else {
      setSmsAlertTypes([...smsAlertTypes, type]);
    }
  };

  const handleTestSms = async () => {
    if (!smsPhone || smsPhone.length < 10) {
      toast.error('Please enter a valid phone number with country code (e.g. +91...)');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to: smsPhone, 
          message: '🚨 Test alert from ResQNav. Your SMS notifications are active.' 
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(`Test SMS sent successfully to ${smsPhone}`);
      } else {
        throw new Error(data.error || 'Failed to send SMS');
      }
    } catch (e: any) {
      toast.error(e.message || 'Error connecting to SMS gateway');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      <Topbar title="System Settings" subtitle="Configure notifications, connectivity, and offline options" />
      <Toaster position="top-right" />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SMS & Notifications */}
            <div className="glass p-6">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2 text-slate-800">
                <Smartphone className="text-blue-500" size={20} /> SMS Alert Configuration
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number (with Country Code)</label>
                  <input 
                    type="tel" 
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    className="input-field max-w-full" 
                    placeholder="e.g. +91 98765 43210"
                  />
                  <p className="text-xs text-slate-500 mt-1">Required for emergency dispatch tracking and severe reroute advisories.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Receive SMS alerts for:</label>
                  <div className="space-y-2">
                    {['emergency', 'reroute', 'incident'].map((type) => (
                      <label key={type} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${smsAlertTypes.includes(type) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                          {smsAlertTypes.includes(type) && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className="text-sm font-medium capitalize text-slate-700">{type} Notifications</span>
                        <input type="checkbox" className="hidden" checked={smsAlertTypes.includes(type)} onChange={() => toggleAlertType(type)} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button 
                    onClick={handleTestSms}
                    disabled={isSending}
                    className="w-full py-2.5 rounded-lg border border-blue-500 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSending ? <span className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /> : <Send size={16} />}
                    {isSending ? 'Sending...' : 'Send Test SMS (Twilio)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Offline & Connectivity Settings */}
            <div className="space-y-6">
              <div className="glass p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                  <WifiOff className="text-orange-500" size={20} /> Low Connectivity Mode
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-700">Offline Routing Engine</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Caches regional map vectors locally.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-700">SMS-based Coordination</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Fallback to SMS payload when 4G/5G is down.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                  </label>
                </div>
              </div>

              <div className="glass p-6 bg-slate-900 border-slate-700 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="text-emerald-400" size={20} /> Integration Status
                </h3>
                <div className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">V2X Communication</span>
                    <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">DISCONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Smart Signal Gateway</span>
                    <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Razorpay POS</span>
                    <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-700">
                    <span className="text-xs text-slate-500">System Trace Log</span>
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold">View Raw Output</button>
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
