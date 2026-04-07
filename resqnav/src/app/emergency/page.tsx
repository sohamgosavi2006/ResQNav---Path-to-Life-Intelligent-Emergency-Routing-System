'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, FileText, CheckCircle2, Navigation, AlertCircle, Zap } from 'lucide-react';
import Script from 'next/script';
import Topbar from '@/components/layout/Topbar';
import { ambulances } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import toast, { Toaster } from 'react-hot-toast';

export default function EmergencyPage() {
  const [bookingStep, setBookingStep] = useState(1);
  const { userCredits, addCredits } = useAppStore();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!(window as any).Razorpay) {
      toast.error('Razorpay SDK failed to load. Please try again.');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_RON6tSrjBgbF6h',
      amount: 150 * 100, // INR 150 base dispatch fee
      currency: "INR",
      name: "ResQNav Emergency",
      description: "Priority Ambulance Dispatch",
      handler: function (response: any) {
        setBookingStep(2);
        toast.success(`Deployment Authorized. Reference: ${response.razorpay_payment_id}`);
        // Simulate routing delay
        setTimeout(() => {
          setBookingStep(3);
          toast.success('Ambulance dispatched successfully! Green corridor activated.');
        }, 2000);
      },
      prefill: {
        name: "Sokka Chandra",
        email: "sokka.chandra@resqnav.com",
        contact: "9999999999"
      },
      theme: { color: "#10B981" }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Topbar title="Emergency Response" subtitle="Ambulance booking and priority fleet management" />
      <Toaster position="top-right" />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* Booking Section */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
               <AlertCircle className="text-red-500" /> Dispatch Emergency Service
            </h2>

            <div className="glass p-6 relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-primary left-0" />
              
              {bookingStep === 1 && (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Pickup Location</label>
                    <input required type="text" className="input-field" placeholder="E.g. Koramangala 5th Block" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Destination Hospital (Optional)</label>
                    <input type="text" className="input-field" placeholder="E.g. St. Johns Hospital" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Nature</label>
                    <select required className="input-field appearance-none bg-white">
                      <option value="">Select urgency level</option>
                      <option value="critical">Critical (Cardiac, Stroke, Severe Trauma)</option>
                      <option value="high">High (Accident, Shortness of Breath)</option>
                      <option value="moderate">Moderate (Fracture, High Fever)</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-primary text-white font-bold text-lg shadow-md hover:shadow-lg transition">
                      Find Nearest Ambulance
                    </button>
                  </div>
                </form>
              )}

              {bookingStep === 2 && (
                <div className="py-8 text-center space-y-4">
                  <div className="pulse-ring mx-auto relative w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500 shadow-sm">
                    <Navigation className="text-blue-500" size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Routing Nearest Vehicle...</h3>
                  <p className="text-sm text-slate-500">Calculating AI green corridor vectors and securing preemptive signal overrides.</p>
                </div>
              )}

              {bookingStep === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">AMB-004 Dispatched</h3>
                    <p className="text-emerald-600 font-semibold mt-1 text-lg">ETA: 4 minutes</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-2 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-slate-500">Driver</span>
                      <span className="font-bold text-slate-700 flex items-center gap-1"><Phone size={14} /> Meena Patel</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b">
                      <span className="text-slate-500">Green Corridor</span>
                      <span className="font-bold text-emerald-600">Active</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500">Signals Cleared</span>
                      <span className="font-bold text-blue-600">3 intersections</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setBookingStep(1)}
                    className="w-full py-3 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] font-bold hover:bg-[rgba(255,107,53,0.05)] transition"
                  >
                    Book Another
                  </button>
                </motion.div>
              )}
            </div>
            
            {/* Payment / Insurance Info */}
            <div className="glass p-5 flex items-start gap-4">
              <div className="p-3 bg-purple-100/50 rounded-xl">
                <FileText className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">Smart Billing Active</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Charges will be processed securely post-trip via Razorpay. Your current balance of <span className="font-bold text-[var(--primary)]">{userCredits} Credits</span> can be applied for discounts.
                </p>
              </div>
            </div>
          </div>

          {/* Active Fleet Tracker */}
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
               <Navigation className="text-blue-500" /> Live Priority Fleet
            </h2>
            
            <div className="space-y-4">
              {ambulances.map((amb, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={amb.id} 
                  className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition ${amb.status === 'en-route' ? 'border-emerald-200 ring-1 ring-emerald-500/20' : 'border-slate-200'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        amb.status === 'en-route' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {amb.id.split('-')[1]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{amb.driver}</h3>
                        <div className="flex items-center gap-2 text-xs font-medium mt-0.5">
                          <span className={`badge ${amb.status === 'en-route' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                            {amb.status.toUpperCase()}
                          </span>
                          {amb.status === 'en-route' && (
                            <span className="text-emerald-500 flex items-center gap-1"><Clock size={12} /> ETA: {amb.eta}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition">
                      <Phone size={18} />
                    </button>
                  </div>

                  {amb.status === 'en-route' && (
                    <>
                      <div className="bg-slate-50 rounded-xl p-3 text-sm flex justify-between items-center mb-3">
                        <span className="text-slate-600 font-medium truncate max-w-[40%] text-right">{amb.from}</span>
                        <div className="flex-1 px-4 flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <div className="flex-1 border-t-2 border-dashed border-emerald-300 mx-1 relative">
                             <Navigation size={12} className="absolute -top-1.5 text-emerald-600" style={{ left: `${amb.progress}%` }} />
                          </div>
                          <div className="w-1.5 h-1.5 px-[3px] py-[3px] border border-emerald-500 rounded-full flex items-center justify-center" />
                        </div>
                        <span className="text-slate-600 font-medium truncate max-w-[40%]">{amb.to}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Priority: {amb.patient || 'Unknown'}
                        </span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                           <Zap size={12} /> Corridors Active
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
