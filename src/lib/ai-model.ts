/**
 * AI-Based Safety Scoring Model
 * Calculates safety scores using weighted factors:
 * - Police proximity (25%)
 * - Hospital proximity (20%)
 * - Time of day (15%)
 * - Crowd level (15%)
 * - Crime index (25%)
 */

export interface SafetyFactors {
  policeDistance: number; // meters
  hospitalDistance: number; // meters
  timeOfDay: number; // 0-23 hours
  crowdLevel: number; // 0-100 (estimated)
  crimeIndex: number; // 0-100 (simulated)
}

export interface SafetyScore {
  score: number; // 0-100
  factors: {
    policeScore: number;
    hospitalScore: number;
    timeScore: number;
    crowdScore: number;
    crimeScore: number;
  };
  breakdown: string;
}

/**
 * Normalize a value to 0-100 scale
 */
function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

/**
 * Calculate police proximity score (closer = safer)
 * 0m = 100, 5000m = 0
 */
function calculatePoliceScore(distanceMeters: number): number {
  return Math.max(0, 100 - (distanceMeters / 5000) * 100);
}

/**
 * Calculate hospital proximity score (closer = safer)
 * 0m = 100, 10000m = 0
 */
function calculateHospitalScore(distanceMeters: number): number {
  return Math.max(0, 100 - (distanceMeters / 10000) * 100);
}

/**
 * Calculate time of day score (nighttime = lower score)
 * 6am-6pm = 100, 10pm-4am = 30
 */
function calculateTimeScore(hour: number): number {
  if (hour >= 6 && hour < 18) return 100; // Daytime
  if (hour >= 18 && hour < 22) return 70; // Evening
  return 30; // Night
}

/**
 * Calculate crowd level score (more people = safer)
 * 0 people = 40, 100+ people = 100
 */
function calculateCrowdScore(crowdLevel: number): number {
  return Math.min(100, 40 + (crowdLevel * 0.6));
}

/**
 * Calculate crime index score (lower crime = higher score)
 * 0 crime = 100, 100 crime = 0
 */
function calculateCrimeScore(crimeIndex: number): number {
  return Math.max(0, 100 - crimeIndex);
}

/**
 * Calculate overall safety score using weighted factors
 */
export function calculateSafetyScore(factors: SafetyFactors): SafetyScore {
  const policeScore = calculatePoliceScore(factors.policeDistance);
  const hospitalScore = calculateHospitalScore(factors.hospitalDistance);
  const timeScore = calculateTimeScore(factors.timeOfDay);
  const crowdScore = calculateCrowdScore(factors.crowdLevel);
  const crimeScore = calculateCrimeScore(factors.crimeIndex);

  // Weighted calculation
  const score = Math.round(
    policeScore * 0.25 +
    hospitalScore * 0.2 +
    timeScore * 0.15 +
    crowdScore * 0.15 +
    crimeScore * 0.25
  );

  // Generate breakdown
  const breakdown = generateBreakdown({
    policeScore,
    hospitalScore,
    timeScore,
    crowdScore,
    crimeScore,
  });

  return {
    score: Math.max(0, Math.min(100, score)),
    factors: {
      policeScore: Math.round(policeScore),
      hospitalScore: Math.round(hospitalScore),
      timeScore: Math.round(timeScore),
      crowdScore: Math.round(crowdScore),
      crimeScore: Math.round(crimeScore),
    },
    breakdown,
  };
}

/**
 * Generate human-readable breakdown of safety factors
 */
function generateBreakdown(factors: {
  policeScore: number;
  hospitalScore: number;
  timeScore: number;
  crowdScore: number;
  crimeScore: number;
}): string {
  const parts: string[] = [];

  if (factors.policeScore > 70) parts.push("Good police coverage");
  else if (factors.policeScore > 40) parts.push("Moderate police presence");
  else parts.push("Limited police access");

  if (factors.timeScore > 80) parts.push("Safe daytime hours");
  else if (factors.timeScore > 50) parts.push("Evening hours");
  else parts.push("Night time - higher risk");

  if (factors.crimeScore > 70) parts.push("Low crime area");
  else if (factors.crimeScore > 40) parts.push("Moderate crime rate");
  else parts.push("Higher crime area");

  return parts.join(" • ");
}

/**
 * Simulate crowd level based on time of day and location type
 */
export function estimateCrowdLevel(hour: number, locationType: 'downtown' | 'residential' | 'commercial'): number {
  const baseLevel = {
    downtown: 70,
    commercial: 60,
    residential: 30,
  }[locationType];

  // Adjust for time of day
  if (hour >= 9 && hour < 17) return Math.min(100, baseLevel + 20); // Peak hours
  if (hour >= 17 && hour < 21) return Math.min(100, baseLevel + 10); // Evening
  return Math.max(10, baseLevel - 30); // Night

}

/**
 * Simulate crime index based on location and time
 */
export function simulateCrimeIndex(hour: number, locationType: 'downtown' | 'residential' | 'commercial'): number {
  const baseIndex = {
    downtown: 45,
    commercial: 35,
    residential: 20,
  }[locationType];

  // Increase crime at night
  if (hour >= 22 || hour < 4) return Math.min(100, baseIndex + 25);
  if (hour >= 4 && hour < 6) return Math.min(100, baseIndex + 15);
  return baseIndex;
}
