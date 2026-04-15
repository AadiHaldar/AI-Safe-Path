import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Users, Cloud } from 'lucide-react';

interface SafetyHeatmapProps {
  map: any;
  startCoords: { lat: number; lng: number };
  endCoords: { lat: number; lng: number };
}

export const SafetyHeatmap: React.FC<SafetyHeatmapProps> = ({ map, startCoords, endCoords }) => {
  const heatmapRef = useRef<any>(null);
  const crimeMarkersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!map || !window.google?.maps) return;

    // Generate simulated crime hotspots around the route
    const crimeData = [
      { lat: startCoords.lat + 0.002, lng: startCoords.lng + 0.002, severity: 'high', incidents: 5 },
      { lat: startCoords.lat - 0.003, lng: startCoords.lng + 0.001, severity: 'medium', incidents: 2 },
      { lat: (startCoords.lat + endCoords.lat) / 2, lng: (startCoords.lng + endCoords.lng) / 2, severity: 'low', incidents: 1 },
      { lat: endCoords.lat - 0.002, lng: endCoords.lng - 0.002, severity: 'medium', incidents: 3 },
    ];

    // Clear existing markers
    crimeMarkersRef.current.forEach(marker => marker.setMap(null));
    crimeMarkersRef.current = [];

    // Add crime incident markers
    crimeData.forEach((crime) => {
      const color = crime.severity === 'high' ? '#ef4444' : crime.severity === 'medium' ? '#f59e0b' : '#10b981';
      const marker = new window.google.maps.Marker({
        position: { lat: crime.lat, lng: crime.lng },
        map,
        title: `${crime.incidents} incident(s) - ${crime.severity} severity`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: color,
          fillOpacity: 0.7,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="color: #000; padding: 8px;">
          <strong>${crime.incidents} Incident(s)</strong><br/>
          Severity: ${crime.severity}<br/>
          <small>Last 30 days</small>
        </div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      crimeMarkersRef.current.push(marker);
    });

    // Add crowd density visualization
    const crowdData = [
      { lat: startCoords.lat, lng: startCoords.lng, density: 'high' },
      { lat: (startCoords.lat + endCoords.lat) / 2, lng: (startCoords.lng + endCoords.lng) / 2, density: 'medium' },
      { lat: endCoords.lat, lng: endCoords.lng, density: 'low' },
    ];

    crowdData.forEach((crowd) => {
      const circle = new window.google.maps.Circle({
        center: { lat: crowd.lat, lng: crowd.lng },
        radius: crowd.density === 'high' ? 300 : crowd.density === 'medium' ? 200 : 100,
        map,
        fillColor: crowd.density === 'high' ? '#ef4444' : crowd.density === 'medium' ? '#f59e0b' : '#10b981',
        fillOpacity: 0.15,
        strokeColor: crowd.density === 'high' ? '#ef4444' : crowd.density === 'medium' ? '#f59e0b' : '#10b981',
        strokeOpacity: 0.3,
        strokeWeight: 1,
      });
    });
  }, [map, startCoords, endCoords]);

  return null;
};
