// Mock data for ResQNav platform

export const kpiData = {
  activeIncidents: 14,
  avgResponseTime: '4.2 min',
  vehiclesEnRoute: 7,
  reportsVerified: 238,
  greenCorridors: 3,
  signalsOverridden: 9,
};

export const recentAlerts = [
  { id: 1, type: 'accident', severity: 'high', location: 'MG Road & Brigade Junction', time: '2 min ago', verified: true },
  { id: 2, type: 'congestion', severity: 'medium', location: 'Outer Ring Road, Marathahalli', time: '5 min ago', verified: true },
  { id: 3, type: 'ambulance', severity: 'critical', location: 'Koramangala 5th Block', time: '8 min ago', verified: true },
  { id: 4, type: 'flood', severity: 'high', location: 'Hebbal Flyover', time: '12 min ago', verified: false },
  { id: 5, type: 'roadblock', severity: 'low', location: 'Whitefield Main Road', time: '18 min ago', verified: true },
];

export const ambulances = [
  { id: 'AMB-001', driver: 'Ravi Kumar', status: 'en-route', patient: 'Critical – Cardiac', eta: '3 min', from: 'St. Johns Hospital', to: 'Victoria Hospital', progress: 72, phone: '+91 98765 43210' },
  { id: 'AMB-002', driver: 'Priya Sharma', status: 'available', patient: null, eta: null, from: 'NIMHANS', to: null, progress: 0, phone: '+91 87654 32109' },
  { id: 'AMB-003', driver: 'Arun Singh', status: 'en-route', patient: 'Moderate – Fracture', eta: '7 min', from: 'Manipal Hospital', to: 'M.S. Ramaiah', progress: 45, phone: '+91 76543 21098' },
  { id: 'AMB-004', driver: 'Meena Patel', status: 'standby', patient: null, eta: null, from: 'Fortis Hospital', to: null, progress: 0, phone: '+91 65432 10987' },
];

export const trafficData = [
  { time: '08:00', flow: 420, incidents: 2, response: 6.1 },
  { time: '09:00', flow: 680, incidents: 5, response: 5.4 },
  { time: '10:00', flow: 540, incidents: 3, response: 4.8 },
  { time: '11:00', flow: 390, incidents: 1, response: 4.2 },
  { time: '12:00', flow: 520, incidents: 4, response: 4.9 },
  { time: '13:00', flow: 610, incidents: 6, response: 5.3 },
  { time: '14:00', flow: 480, incidents: 2, response: 4.1 },
  { time: '15:00', flow: 720, incidents: 8, response: 6.5 },
  { time: '16:00', flow: 890, incidents: 9, response: 7.2 },
  { time: '17:00', flow: 950, incidents: 12, response: 8.1 },
  { time: '18:00', flow: 820, incidents: 7, response: 6.8 },
  { time: '19:00', flow: 560, incidents: 3, response: 4.5 },
];

export const hotspots = [
  { zone: 'Silk Board', accidents: 28, congestion: 95, severity: 'critical' },
  { zone: 'Hebbal', accidents: 21, congestion: 82, severity: 'high' },
  { zone: 'Marathahalli', accidents: 19, congestion: 78, severity: 'high' },
  { zone: 'KR Puram', accidents: 14, congestion: 65, severity: 'medium' },
  { zone: 'Jayanagar', accidents: 9, congestion: 48, severity: 'medium' },
  { zone: 'Koramangala', accidents: 7, congestion: 41, severity: 'low' },
];

export const blockchainLedger = [
  { hash: '0x3a4f...d8e2', type: 'Incident Verified', location: 'MG Road', timestamp: '2026-04-07 13:42:11', status: 'confirmed', block: 194523 },
  { hash: '0x7c1b...a3f9', type: 'Emergency Route', location: 'Koramangala', timestamp: '2026-04-07 13:38:04', status: 'confirmed', block: 194520 },
  { hash: '0x2e8d...f1c7', type: 'Signal Override', location: 'Hebbal', timestamp: '2026-04-07 13:35:47', status: 'confirmed', block: 194518 },
  { hash: '0x9b5a...e4d1', type: 'Payment Settled', location: 'Whitefield', timestamp: '2026-04-07 13:31:22', status: 'confirmed', block: 194515 },
  { hash: '0x1f6e...b7c3', type: 'Report Rejected', location: 'Silk Board', timestamp: '2026-04-07 13:28:09', status: 'rejected', block: 194513 },
  { hash: '0x8d2c...3a6f', type: 'Ambulance Booked', location: 'Jayanagar', timestamp: '2026-04-07 13:24:55', status: 'confirmed', block: 194511 },
  { hash: '0x4f9e...c2b8', type: 'Incident Verified', location: 'BTM Layout', timestamp: '2026-04-07 13:20:33', status: 'confirmed', block: 194509 },
  { hash: '0x6a3d...7e5f', type: 'Reward Issued', location: 'Indiranagar', timestamp: '2026-04-07 13:17:18', status: 'confirmed', block: 194507 },
];

export const leaderboard = [
  { rank: 1, name: 'Aditya Nair', credits: 2840, reports: 47, avatar: 'AN', badge: 'platinum' },
  { rank: 2, name: 'Sunita Rao', credits: 2310, reports: 38, avatar: 'SR', badge: 'gold' },
  { rank: 3, name: 'Vikram Bose', credits: 1980, reports: 32, avatar: 'VB', badge: 'gold' },
  { rank: 4, name: 'Lakshmi P.', credits: 1540, reports: 26, avatar: 'LP', badge: 'silver' },
  { rank: 5, name: 'Rahul Joshi', credits: 1290, reports: 21, avatar: 'RJ', badge: 'silver' },
];

export const rewardHistory = [
  { id: 1, action: 'Verified accident report', credits: 50, date: '2026-04-07', type: 'earned' },
  { id: 2, action: 'Complied with rerouting', credits: 20, date: '2026-04-06', type: 'earned' },
  { id: 3, action: 'Ambulance booking discount', credits: -150, date: '2026-04-05', type: 'spent' },
  { id: 4, action: 'First report of the day bonus', credits: 30, date: '2026-04-05', type: 'earned' },
  { id: 5, action: 'Streak: 7 days active', credits: 100, date: '2026-04-04', type: 'earned' },
];

export const systemStatus = [
  { name: 'Kafka Event Stream', status: 'operational', latency: '12ms' },
  { name: 'AI Verification Engine', status: 'operational', latency: '48ms' },
  { name: 'GPS Signal Layer', status: 'operational', latency: '8ms' },
  { name: 'Signal Control API', status: 'degraded', latency: '320ms' },
  { name: 'Razorpay Gateway', status: 'operational', latency: '95ms' },
  { name: 'Twilio SMS', status: 'operational', latency: '210ms' },
  { name: 'Blockchain Node', status: 'operational', latency: '56ms' },
  { name: 'V2X Broadcast', status: 'offline', latency: '—' },
];

export const mapRoutes = [
  {
    id: 'route-1',
    type: 'emergency',
    from: [77.5946, 12.9716],
    to: [77.6101, 12.9815],
    waypoints: [[77.5990, 12.9750], [77.6045, 12.9780]],
    eta: '3 min',
    ambulance: 'AMB-001',
    color: '#10B981',
  },
  {
    id: 'route-2',
    type: 'reroute',
    from: [77.6080, 12.9652],
    to: [77.5900, 12.9600],
    color: '#0EA5E9',
    eta: '11 min',
  },
];

export const mapIncidents = [
  { id: 1, lng: 77.5946, lat: 12.9716, type: 'accident', severity: 'high', title: 'Multi-vehicle accident' },
  { id: 2, lng: 77.6200, lat: 12.9580, type: 'congestion', severity: 'medium', title: 'Peak hour congestion' },
  { id: 3, lng: 77.5800, lat: 12.9900, type: 'flood', severity: 'high', title: 'Waterlogging' },
  { id: 4, lng: 77.6350, lat: 12.9750, type: 'roadblock', severity: 'low', title: 'Road construction' },
];
