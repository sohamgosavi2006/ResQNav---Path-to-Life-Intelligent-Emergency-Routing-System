'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, AlertTriangle, MessageSquare, BarChart2,
  Gift, Shield, Settings, ChevronLeft, ChevronRight, Zap, Bell, User
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Home', icon: Zap },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/map', label: 'Live Map', icon: Map },
  { href: '/emergency', label: 'Emergency', icon: AlertTriangle },
  { href: '/chatbot', label: 'AI Assistant', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/rewards', label: 'Rewards', icon: Gift },
  { href: '/blockchain', label: 'Blockchain', icon: Shield },
  { href: '/settings', label: 'Settings', icon: Settings },
];

import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, userCredits, activeEmergencies, setSidebarOpen } = useAppStore() as any;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setSidebarOpen]);

  return (
    <>
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
      initial={false}
      animate={{ 
        width: sidebarOpen ? 200 : (isMobile ? 0 : 70),
        x: (isMobile && !sidebarOpen) ? -200 : 0
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 h-screen z-[60] flex flex-col overflow-hidden shadow-2xl glass-dark border-r-0 rounded-none border-y-0 border-l-0 ${isMobile && sidebarOpen ? 'w-[200px]' : ''}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/10">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          {activeEmergencies > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {activeEmergencies}
            </span>
          )}
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="text-white font-bold text-lg leading-none" style={{ fontFamily: 'Space Grotesk' }}>
                ResQNav
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--sidebar-text)' }}>
                Smart Traffic OS
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
            <div
                className={`relative flex items-center gap-3 mx-2 px-3 py-2 rounded-xl mb-1 cursor-pointer transition-all duration-200 group ${
                  isActive ? 'sidebar-glow' : 'hover:bg-white/5'
                }`}
                style={isActive ? { background: 'rgba(255,107,53,0.15)' } : {}}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)' }}
                  />
                )}
                <Icon
                  size={18}
                  style={{ flexShrink: 0, color: isActive ? 'var(--primary)' : 'var(--sidebar-text)', position: 'relative', zIndex: 1 }}
                />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap relative z-10"
                      style={{ color: isActive ? '#fff' : 'var(--sidebar-text)' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!sidebarOpen && (
                  <div className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Credits + Toggle */}
      <div className="border-t border-white/10 p-3">
        {sidebarOpen && (
          <div className="mb-3 px-2 py-2.5 rounded-xl" style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <div className="text-xs" style={{ color: 'var(--sidebar-text)' }}>Your Credits</div>
            <div className="text-lg font-bold text-white flex items-center gap-1">
              <Gift size={14} style={{ color: 'var(--primary)' }} />
              {userCredits.toLocaleString()}
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl transition-colors hover:bg-white/10"
          style={{ color: 'var(--sidebar-text)' }}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </motion.aside>
    </>
  );
}
