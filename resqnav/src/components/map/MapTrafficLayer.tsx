'use client';

import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export function MapTrafficLayer() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Add Live Google Maps Traffic Layer
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    return () => {
      trafficLayer.setMap(null);
    };
  }, [map]);

  return null;
}
