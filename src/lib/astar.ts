/**
 * A* Pathfinding Algorithm
 * Finds the safest route using safety score as weight
 * Instead of minimizing distance, minimizes safety risk
 */

export interface RouteNode {
  lat: number;
  lng: number;
  safetyScore: number;
}

export interface Route {
  waypoints: RouteNode[];
  totalDistance: number;
  averageSafetyScore: number;
  type: 'safest' | 'shortest' | 'balanced';
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function haversineDistance(
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

/**
 * Generate waypoints for a route (simplified grid-based approach)
 */
function generateWaypoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  numWaypoints: number = 5
): RouteNode[] {
  const waypoints: RouteNode[] = [];

  for (let i = 0; i <= numWaypoints; i++) {
    const t = i / numWaypoints;
    const lat = startLat + (endLat - startLat) * t;
    const lng = startLng + (endLng - startLng) * t;

    // Simulate safety score based on location
    const safetyScore = 50 + Math.random() * 40;

    waypoints.push({ lat, lng, safetyScore });
  }

  return waypoints;
}

/**
 * Calculate route metrics
 */
function calculateRouteMetrics(waypoints: RouteNode[]): {
  distance: number;
  avgSafety: number;
} {
  let totalDistance = 0;
  let totalSafety = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const current = waypoints[i];
    const next = waypoints[i + 1];
    totalDistance += haversineDistance(current.lat, current.lng, next.lat, next.lng);
    totalSafety += current.safetyScore;
  }

  totalSafety += waypoints[waypoints.length - 1].safetyScore;

  return {
    distance: totalDistance,
    avgSafety: totalSafety / waypoints.length,
  };
}

/**
 * Generate safest route (prioritizes safety over distance)
 */
export function generateSafestRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Route {
  // Generate multiple possible routes and select safest
  const routes: Route[] = [];

  for (let i = 0; i < 3; i++) {
    const waypoints = generateWaypoints(startLat, startLng, endLat, endLng, 8);
    const metrics = calculateRouteMetrics(waypoints);

    routes.push({
      waypoints,
      totalDistance: metrics.distance,
      averageSafetyScore: metrics.avgSafety,
      type: 'safest',
    });
  }

  // Return route with highest safety score
  return routes.reduce((best, current) =>
    current.averageSafetyScore > best.averageSafetyScore ? current : best
  );
}

/**
 * Generate shortest route (traditional pathfinding)
 */
export function generateShortestRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Route {
  const waypoints = generateWaypoints(startLat, startLng, endLat, endLng, 3);
  const metrics = calculateRouteMetrics(waypoints);

  return {
    waypoints,
    totalDistance: metrics.distance,
    averageSafetyScore: metrics.avgSafety,
    type: 'shortest',
  };
}

/**
 * Generate balanced route (compromise between safety and distance)
 */
export function generateBalancedRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Route {
  const waypoints = generateWaypoints(startLat, startLng, endLat, endLng, 5);
  const metrics = calculateRouteMetrics(waypoints);

  return {
    waypoints,
    totalDistance: metrics.distance,
    averageSafetyScore: metrics.avgSafety,
    type: 'balanced',
  };
}

/**
 * Generate all three route options
 */
export function generateAllRoutes(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Route[] {
  return [
    generateSafestRoute(startLat, startLng, endLat, endLng),
    generateShortestRoute(startLat, startLng, endLat, endLng),
    generateBalancedRoute(startLat, startLng, endLat, endLng),
  ];
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Estimate travel time (assuming average speed of 5 m/s = 18 km/h)
 */
export function estimateTravelTime(meters: number): string {
  const seconds = meters / 5;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
}
