'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, Shield, ChevronRight, Trophy, Plus } from 'lucide-react';
import Script from 'next/script';
import toast, { Toaster } from 'react-hot-toast';
import Topbar from '@/components/layout/Topbar';
import { leaderboard, rewardHistory } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function RewardsPage() {
  const { userCredits, addCredits } = useAppStore();
  const [showPaymentContext, setShowPaymentContext] = useState(false);
  const [amount, setAmount] = useState(500);

  const startRazorpayPayment = () => {
    if (!(window as any).Razorpay) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_RON6tSrjBgbF6h', // fallback just in case
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      name: "ResQNav Ecosystem",
      description: "Civic Fast Tag Top-up",
      image: "https://example.com/your_logo",
      handler: function (response: any) {
        toast.success(`Payment successful! Top-up ID: ${response.razorpay_payment_id}`);
        addCredits(amount);
        setShowPaymentContext(false);
      },
      prefill: {
        name: "Sokka Chandra",
        email: "sokka.chandra@resqnav.com",
        contact: "9999999999"
      },
      theme: { color: "#FF6B35" }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      <Toaster position="top-right" />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Topbar title="Civic Rewards & Payments" subtitle="Earn credits for cooperative participation" />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Balances & Actions */}
          <div className="space-y-6">
            
            {/* Credit Card Graphic */}
            <div className="relative w-full h-56 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 overflow-hidden text-white shadow-xl shadow-blue-900/10 hover:scale-[1.02] transition-transform">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)] rounded-full blur-[50px] opacity-30 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-[50px] opacity-30 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <span className="font-bold tracking-widest text-slate-400 text-sm">RESQNAV CIVIC</span>
                <Gift className="text-blue-400" size={24} />
              </div>
              
              <div className="mt-8 relative z-10">
                <span className="text-sm text-slate-400 block mb-1">Available Credits</span>
                <span className="text-4xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                  {userCredits.toLocaleString()}
                </span>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10">
                <span className="text-sm font-medium tracking-wide">SOKKA CHANDRA</span>
                <span className="badge bg-white/20 text-white border-none">TOP 5%</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowPaymentContext(!showPaymentContext)}
                className="bg-white border text-center border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[var(--primary)] transition flex flex-col items-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <Zap size={20} />
                </div>
                <span className="font-semibold text-slate-800 text-sm">Add Funds</span>
              </button>
              
              <button className="bg-white border text-center border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-500 transition flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <span className="font-semibold text-slate-800 text-sm">Redeem</span>
              </button>
            </div>

            {/* Razorpay Mock */}
            {showPaymentContext && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass p-5">
                <h4 className="font-bold text-sm mb-3 text-slate-800">Quick Top-up (Razorpay)</h4>
                <div className="flex items-center gap-2 mb-4">
                  <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="input-field py-2 text-center" />
                  <span className="font-bold text-slate-500">INR</span>
                </div>
                <button onClick={startRazorpayPayment} className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                  Pay instantly
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <Shield size={10} /> Secure checkout via Razorpay Native
                </p>
              </motion.div>
            )}

            {/* History */}
            <div className="glass p-5">
              <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Recent Activity</h3>
              <div className="space-y-4">
                {rewardHistory.map(history => (
                  <div key={history.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{history.action}</p>
                      <p className="text-xs text-slate-400">{history.date}</p>
                    </div>
                    <span className={`font-bold text-sm ${history.type === 'earned' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {history.credits > 0 ? '+' : ''}{history.credits}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm font-semibold text-blue-500 hover:text-blue-600 flex items-center justify-center gap-1">
                View all History <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Column: Gamification / Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-1">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <Trophy size={40} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-emerald-800 mb-1">Weekly Civic Hero Challenge</h3>
                  <p className="text-sm text-emerald-600 mb-3">Earn 200 bonus credits by validating 5 incident reports correctly.</p>
                  <div className="w-full bg-white rounded-full h-2 mb-1">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <span className="text-xs font-bold text-emerald-700">3/5 Reports Validated</span>
                </div>
                <button className="md:ml-auto whitespace-nowrap px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
                  Validate Now
                </button>
              </div>
            </div>

            <div className="glass p-6">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <Trophy className="text-orange-500" size={20} /> City Leaderboard
              </h3>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Citizen</th>
                      <th>Reports Verified</th>
                      <th>Total Credits</th>
                      <th>Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user) => (
                      <tr key={user.rank} className={user.rank <= 3 ? 'bg-orange-50/30' : ''}>
                        <td className="font-bold text-slate-500">#{user.rank}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                              user.rank === 1 ? 'bg-gradient-primary' : 
                              user.rank === 2 ? 'bg-slate-400' : 'bg-orange-400'
                            }`}>
                              {user.avatar}
                            </div>
                            <span className="font-semibold text-slate-700">{user.name}</span>
                          </div>
                        </td>
                        <td className="text-emerald-600 font-medium">{user.reports} valid</td>
                        <td className="font-bold text-slate-800">{user.credits.toLocaleString()} pts</td>
                        <td>
                          <span className={`badge uppercase ${
                            user.badge === 'platinum' ? 'bg-gradient-primary text-white' :
                            user.badge === 'gold' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {user.badge}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
