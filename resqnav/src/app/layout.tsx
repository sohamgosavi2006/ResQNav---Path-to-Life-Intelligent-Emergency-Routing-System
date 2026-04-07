import type { Metadata } from 'next';
import './globals.css';
import SidebarWrapper from '@/components/layout/SidebarWrapper';

export const metadata: Metadata = {
  title: 'ResQNav — Intelligent Traffic Orchestration',
  description: 'Real-time emergency response, AI routing, and smart city traffic management platform',
  keywords: 'emergency response, traffic management, ambulance routing, smart city, AI navigation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}
