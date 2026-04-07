'use client';
import { useEffect, useState, useRef } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

export function AnimatedMarker({
  routeCoords,
  durationMs = 20000,
  children
}: {
  routeCoords: number[][],
  durationMs?: number,
  children: React.ReactNode
}) {
  const [position, setPosition] = useState({ lat: routeCoords[0][1], lng: routeCoords[0][0] });
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (routeCoords.length < 2) return;
    
    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      
      let totalLength = 0;
      const segments = [];
      for (let i = 0; i < routeCoords.length - 1; i++) {
        const dx = routeCoords[i+1][0] - routeCoords[i][0];
        const dy = routeCoords[i+1][1] - routeCoords[i][1];
        const len = Math.sqrt(dx*dx + dy*dy);
        segments.push({ len, dx, dy, startNode: routeCoords[i] });
        totalLength += len;
      }

      if (totalLength === 0) return;

      const targetLength = progress * totalLength;
      
      let currentLength = 0;
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (currentLength + seg.len >= targetLength || i === segments.length - 1) {
          const segProgress = seg.len === 0 ? 0 : (targetLength - currentLength) / seg.len;
          const currentLng = seg.startNode[0] + seg.dx * segProgress;
          const currentLat = seg.startNode[1] + seg.dy * segProgress;
          setPosition({ lat: currentLat, lng: currentLng });
          break;
        }
        currentLength += seg.len;
      }
      
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        startTimeRef.current = time; // Loop
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [routeCoords, durationMs]);

  return (
    <AdvancedMarker position={position}>
      {children}
    </AdvancedMarker>
  );
}
