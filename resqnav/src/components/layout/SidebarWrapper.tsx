'use client';

import { useAppStore } from '@/lib/store';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useAppStore() as any;
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        // Use a slight delay to ensure store is ready if needed, 
        // but setSidebarOpen must be in store.
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const marginLeft = isHome ? 0 : 
                    isMobile ? 0 : 
                    (sidebarOpen ? 200 : 70);

  return (
    <div className="flex min-h-screen app-container overflow-x-hidden">
      <Sidebar />
      <main
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft }}
      >
        {children}
      </main>
    </div>
  );
}
