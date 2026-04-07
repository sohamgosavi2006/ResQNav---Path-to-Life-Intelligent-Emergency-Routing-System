import { create } from 'zustand';

interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppState {
  sidebarOpen: boolean;
  userCredits: number;
  activeEmergencies: number;
  smsPhone: string;
  smsAlertTypes: string[];
  alerts: Alert[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSmsPhone: (phone: string) => void;
  setSmsAlertTypes: (types: string[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  addCredits: (amount: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  userCredits: 1240,
  activeEmergencies: 3,
  smsPhone: '',
  smsAlertTypes: ['emergency', 'reroute'],
  alerts: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSmsPhone: (phone) => set({ smsPhone: phone }),
  setSmsAlertTypes: (types) => set({ smsAlertTypes: types }),
  addAlert: (alert) => set((s) => ({ alerts: [...s.alerts, alert] })),
  removeAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
  addCredits: (amount) => set((s) => ({ userCredits: s.userCredits + amount })),
}));
