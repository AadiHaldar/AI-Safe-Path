/**
 * Google Maps Integration
 * Handles map display, route visualization, and marker management
 */

export interface MapLocation {
  lat: number;
  lng: number;
  name: string;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'police' | 'hospital' | 'unsafe' | 'start' | 'end';
  distance?: number;
}

export interface RoutePolyline {
  waypoints: Array<{ lat: number; lng: number }>;
  color: string;
  weight: number;
  type: 'safest' | 'shortest' | 'balanced';
}

/**
 * Load Google Maps API script
 */
export function loadGoogleMapsAPI(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));

    document.head.appendChild(script);
  });
}

/**
 * Initialize map on element
 */
export function initializeMap(
  elementId: string,
  center: MapLocation,
  zoom: number = 13
): google.maps.Map {
  const mapElement = document.getElementById(elementId);
  if (!mapElement) throw new Error(`Map element with id "${elementId}" not found`);

  return new (window as any).google.maps.Map(mapElement, {
    center: { lat: center.lat, lng: center.lng },
    zoom,
    styles: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
      },
    ],
  });
}

/**
 * Add marker to map
 */
export function addMarker(
  map: google.maps.Map,
  marker: MapMarker
): google.maps.Marker {
  const colors: Record<string, string> = {
    police: '#0066ff',
    hospital: '#ff0000',
    unsafe: '#ff6600',
    start: '#00cc00',
    end: '#ff0000',
  };

  const googleMarker = new (window as any).google.maps.Marker({
    position: { lat: marker.lat, lng: marker.lng },
    map,
    title: marker.title,
    icon: {
      path: (window as any).google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: colors[marker.type],
      fillOpacity: 0.8,
      strokeColor: '#ffffff',
      strokeWeight: 2,
    },
  });

  // Add info window
  const infoWindow = new (window as any).google.maps.InfoWindow({
    content: `
      <div style="color: #000; padding: 8px;">
        <strong>${marker.title}</strong>
        ${marker.distance ? `<br/>Distance: ${(marker.distance / 1000).toFixed(1)}km` : ''}
      </div>
    `,
  });

  googleMarker.addListener('click', () => {
    infoWindow.open(map, googleMarker);
  });

  return googleMarker;
}

/**
 * Draw polyline on map
 */
export function drawPolyline(
  map: google.maps.Map,
  polyline: RoutePolyline
): google.maps.Polyline {
  const colorMap: Record<string, string> = {
    safest: '#00cc00',
    shortest: '#0066ff',
    balanced: '#ffcc00',
  };

  return new (window as any).google.maps.Polyline({
    path: polyline.waypoints,
    geodesic: true,
    strokeColor: colorMap[polyline.type],
    strokeOpacity: 0.8,
    strokeWeight: polyline.weight,
    map,
  });
}

/**
 * Fit map bounds to show all markers and routes
 */
export function fitMapBounds(
  map: google.maps.Map,
  locations: Array<{ lat: number; lng: number }>
): void {
  if (locations.length === 0) return;

  const bounds = new (window as any).google.maps.LatLngBounds();
  locations.forEach((loc) => {
    bounds.extend({ lat: loc.lat, lng: loc.lng });
  });

  map.fitBounds(bounds, { padding: 50 });
}

/**
 * Geocode address to coordinates
 */
export async function geocodeAddress(address: string): Promise<MapLocation | null> {
  try {
    const geocoder = new (window as any).google.maps.Geocoder();
    const result = await new Promise<any>((resolve, reject) => {
      geocoder.geocode({ address }, (results: any[], status: string) => {
        if (status === 'OK') resolve(results[0]);
        else reject(new Error(`Geocoding failed: ${status}`));
      });
    });

    return {
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng(),
      name: result.formatted_address,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Get nearby places (police stations, hospitals)
 */
export async function getNearbyPlaces(
  map: google.maps.Map,
  location: MapLocation,
  placeType: 'police_station' | 'hospital',
  radius: number = 5000
): Promise<MapMarker[]> {
  try {
    const service = new (window as any).google.maps.places.PlacesService(map);
    const request = {
      location: { lat: location.lat, lng: location.lng },
      radius,
      type: placeType,
    };

    const results = await new Promise<any[]>((resolve, reject) => {
      service.nearbySearch(request, (results: any[], status: string) => {
        if (status === 'OK') resolve(results);
        else reject(new Error(`Places search failed: ${status}`));
      });
    });

    return results.map((place, index) => ({
      id: place.place_id,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      title: place.name,
      type: placeType === 'police_station' ? 'police' : 'hospital',
    }));
  } catch (error) {
    console.error('Places search error:', error);
    return [];
  }
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
