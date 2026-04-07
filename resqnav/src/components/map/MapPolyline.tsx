'use client';

import { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export function MapPolyline({ 
  coordinates, 
  strokeColor = '#10B981', 
  strokeWeight = 6,
  dashed = false
}: { 
  coordinates: number[][], 
  strokeColor?: string, 
  strokeWeight?: number,
  dashed?: boolean
}) {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !window.google) return;

    const path = coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
    
    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: dashed ? 3 : 0,
    };

    const newPolyline = new google.maps.Polyline({
      path,
      strokeColor: dashed ? '#00000000' : strokeColor,
      strokeWeight,
      strokeOpacity: dashed ? 0 : 0.8,
      icons: dashed ? [{
        icon: { ...lineSymbol, strokeColor },
        offset: '0',
        repeat: '20px'
      }] : []
    });

    newPolyline.setMap(map);
    setPolyline(newPolyline);

    return () => {
      newPolyline.setMap(null);
    };
  }, [map, coordinates, strokeColor, strokeWeight, dashed]);
  
  return null;
}
