import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Map, Activity, Gift } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-dark text-white">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[rgba(255,107,53,0.15)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[rgba(14,165,233,0.15)] blur-[120px] pointer-events-none" />
      
      {/* Navbar overlay */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Zap size={22} className="text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>ResQNav</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link href="/map" className="hover:text-white transition">Live Map</Link>
          <Link href="/settings" className="hover:text-white transition">Features</Link>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-8 mt-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur text-sm font-medium mb-4 mix-blend-screen shadow-[0_0_15px_rgba(255,107,53,0.3)]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live traffic orchestration active
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Next-Gen Emergency <br />
            <span className="gradient-text">Traffic Routing</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The intelligent traffic orchestration platform that turns standard navigation into a 
            high-priority, life-saving green corridor for emergency vectors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
            <Link href="/emergency">
              <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all card-hover">
                Book Ambulance <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-8 py-4 rounded-xl glass-dark font-semibold text-lg hover:bg-white/10 transition-colors">
                Open Dashboard
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Floating feature cards */}
      <div className="absolute bottom-10 w-full px-6 flex justify-center gap-6 hidden lg:flex opacity-90 z-10">
        <FeatureCard icon={<Map className="text-blue-400" />} title="Dynamic Corridors" desc="AI reroutes normal traffic instantly" />
        <FeatureCard icon={<Activity className="text-emerald-400" />} title="Live V2X Sync" desc="Communicating directly with smart signals" />
        <FeatureCard icon={<Shield className="text-purple-400" />} title="Blockchain Audits" desc="Immutable reports and verification" />
        <FeatureCard icon={<Gift className="text-orange-400" />} title="Civic Rewards" desc="Gamified payouts for cooperation" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-dark p-5 w-64 card-hover flex gap-4 items-start border border-white/5 border-t-white/10">
      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-slate-400 leading-snug">{desc}</p>
      </div>
    </div>
  );
}
