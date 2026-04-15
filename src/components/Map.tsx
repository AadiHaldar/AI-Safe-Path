import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';

interface MapProps {
  start: string;
  end: string;
  activeRouteId?: string;
  startCoords?: { lat: number; lng: number };
  endCoords?: { lat: number; lng: number };
  showHeatmap?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

export const Map: React.FC<MapProps> = ({ start, end, activeRouteId, startCoords, endCoords, showHeatmap = true }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  // Default to NYC if no coords provided
  const defaultStartCoords = startCoords || { lat: 40.758896, lng: -73.985130 };
  const defaultEndCoords = endCoords || { lat: 40.785091, lng: -73.968285 };

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }

      const apiKey = (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY || '';
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: defaultStartCoords,
        zoom: 13,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }],
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#000000' }, { lightness: 13 }],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.fill',
            stylers: [{ color: '#000000' }],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#144cba' }, { lightness: 14 }, { weight: 1.6 }],
          },
          {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [{ color: '#08304b' }],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#0c4ff0' }, { lightness: 21 }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{ color: '#000000' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#0b3d91' }, { lightness: 25 }],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry.fill',
            stylers: [{ color: '#000000' }],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#0b3d91' }, { lightness: 16 }],
          },
          {
            featureType: 'road.local',
            elementType: 'geometry',
            stylers: [{ color: '#000000' }],
          },
          {
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ color: '#146ff0' }],
          },
          {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ color: '#021019' }],
          },
        ],
      });

      setMap(newMap);
      setLoading(false);
    };

    loadGoogleMaps();
  }, []);

  // Update map with routes and markers
  useEffect(() => {
    if (!map) return;

    // Clear existing markers and polylines
    markersRef.current.forEach((marker) => marker.setMap(null));
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    // Add start marker
    const startMarker = new window.google.maps.Marker({
      position: defaultStartCoords,
      map,
      title: start,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#10b981',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
    });
    markersRef.current.push(startMarker);

    // Add end marker
    const endMarker = new window.google.maps.Marker({
      position: defaultEndCoords,
      map,
      title: end,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#ef4444',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
    });
    markersRef.current.push(endMarker);

    // Use Google Directions API to get actual routes
    const directionsService = new window.google.maps.DirectionsService();
    const startPos = defaultStartCoords;
    const endPos = defaultEndCoords;

    // Request 3 different routes with traffic awareness
    const routeConfigs = [
      { id: 'route-1', color: '#10b981', label: 'Safest', avoidHighways: false },
      { id: 'route-2', color: '#f59e0b', label: 'Balanced', avoidHighways: false },
      { id: 'route-3', color: '#ef4444', label: 'Least Traffic', avoidHighways: true },
    ];

    let routeIndex = 0;
    routeConfigs.forEach((config) => {
      directionsService.route(
        {
          origin: startPos,
          destination: endPos,
          travelMode: window.google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
          avoidHighways: config.avoidHighways,
        },
        (result: any, status: string) => {
          if (status === 'OK' && result.routes.length > routeIndex) {
            const route = result.routes[routeIndex];
            const polyline = new window.google.maps.Polyline({
              path: route.overview_path,
              geodesic: true,
              strokeColor: config.color,
              strokeOpacity: activeRouteId === config.id ? 1 : 0.6,
              strokeWeight: activeRouteId === config.id ? 8 : 5,
              map,
            });
            polylinesRef.current.push(polyline);
            routeIndex++;
          }
        }
      );
    });

    // Fit bounds
    const bounds = new window.google.maps.LatLngBounds();
    markersRef.current.forEach((marker) => bounds.extend(marker.getPosition()));
    map.fitBounds(bounds, { padding: 50 });

    // Add crime heatmap if enabled
    if (showHeatmap) {
      const crimeData = [
        { lat: defaultStartCoords.lat + 0.002, lng: defaultStartCoords.lng + 0.002, severity: 'high' },
        { lat: defaultStartCoords.lat - 0.003, lng: defaultStartCoords.lng + 0.001, severity: 'medium' },
        { lat: (defaultStartCoords.lat + defaultEndCoords.lat) / 2, lng: (defaultStartCoords.lng + defaultEndCoords.lng) / 2, severity: 'low' },
        { lat: defaultEndCoords.lat - 0.002, lng: defaultEndCoords.lng - 0.002, severity: 'medium' },
      ];

      crimeData.forEach((crime) => {
        const color = crime.severity === 'high' ? '#ef4444' : crime.severity === 'medium' ? '#f59e0b' : '#10b981';
        new window.google.maps.Circle({
          center: { lat: crime.lat, lng: crime.lng },
          radius: crime.severity === 'high' ? 300 : 200,
          map,
          fillColor: color,
          fillOpacity: 0.15,
          strokeColor: color,
          strokeOpacity: 0.3,
          strokeWeight: 1,
        });
      });
    }
  }, [map, activeRouteId, startCoords, endCoords, showHeatmap]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
      <div
        ref={mapRef}
        className="w-full h-full bg-zinc-950"
        style={{ minHeight: '500px' }}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-sm text-zinc-300">Loading map...</p>
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300">Live Map Active</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-lg p-3 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-zinc-300">Safest Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-zinc-300">Balanced Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-zinc-300">Least Traffic Route</span>
        </div>
      </div>
    </div>
  );
};
