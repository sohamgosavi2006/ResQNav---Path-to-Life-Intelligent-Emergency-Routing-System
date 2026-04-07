'use client';

import { Bell, Search, Zap, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { activeEmergencies, toggleSidebar } = useAppStore() as any;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/20 glass rounded-none border-t-0 border-x-0 relative z-10 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>
            {title}
          </h1>
          {subtitle && <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3" style={{ color: 'var(--text-secondary)' }} />
          <input
            className="input-field pl-9 w-52 h-9 text-sm"
            placeholder="Search locations, incidents..."
          />
        </div>

        {/* Emergency alert badge */}
        {activeEmergencies > 0 && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg, #EF4444, #F59E0B)' }}
          >
            <Zap size={12} />
            {activeEmergencies} Active Emergency
          </motion.div>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
