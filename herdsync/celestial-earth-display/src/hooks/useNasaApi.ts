import { useQuery } from '@tanstack/react-query';
import type { NeoFeedResponse, NeoLookupResponse, ProcessedAsteroid, RiskLevel, DashboardStats } from '@/types/nasa';

const NASA_API_KEY = 'dEatTCNojYvnRNbE76XnCpTOmwXzAb6apV3q8uau';
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Calculate risk level based on multiple factors
function calculateRiskLevel(asteroid: {
  isHazardous: boolean;
  diameter: number;
  missDistance: number;
  velocity: number;
}): { level: RiskLevel; score: number } {
  let score = 0;

  // Hazardous status adds significant score
  if (asteroid.isHazardous) score += 40;

  // Diameter scoring (larger = more dangerous)
  if (asteroid.diameter > 1000) score += 30;
  else if (asteroid.diameter > 500) score += 20;
  else if (asteroid.diameter > 100) score += 10;
  else if (asteroid.diameter > 50) score += 5;

  // Miss distance scoring (closer = more dangerous)
  if (asteroid.missDistance < 1000000) score += 25;
  else if (asteroid.missDistance < 5000000) score += 15;
  else if (asteroid.missDistance < 10000000) score += 8;

  // Velocity scoring (faster = more dangerous)
  if (asteroid.velocity > 30) score += 15;
  else if (asteroid.velocity > 20) score += 10;
  else if (asteroid.velocity > 10) score += 5;

  let level: RiskLevel;
  if (score >= 70) level = 'critical';
  else if (score >= 45) level = 'high';
  else if (score >= 25) level = 'moderate';
  else level = 'low';

  return { level, score };
}

// Process raw NASA data into our format
function processAsteroids(data: NeoFeedResponse): ProcessedAsteroid[] {
  const asteroids: ProcessedAsteroid[] = [];

  Object.values(data.near_earth_objects).forEach((dayAsteroids) => {
    dayAsteroids.forEach((neo) => {
      const closeApproach = neo.close_approach_data[0];
      if (!closeApproach) return;

      const diameter = (neo.estimated_diameter.meters.estimated_diameter_min + neo.estimated_diameter.meters.estimated_diameter_max) / 2;
      const velocity = parseFloat(closeApproach.relative_velocity.kilometers_per_second);
      const missDistance = parseFloat(closeApproach.miss_distance.kilometers);
      const missDistanceLunar = parseFloat(closeApproach.miss_distance.lunar);

      const { level, score } = calculateRiskLevel({
        isHazardous: neo.is_potentially_hazardous_asteroid,
        diameter,
        missDistance,
        velocity,
      });

      asteroids.push({
        id: neo.id,
        name: neo.name.replace(/[()]/g, ''),
        diameter,
        velocity,
        missDistance,
        missDistanceLunar,
        isHazardous: neo.is_potentially_hazardous_asteroid,
        closeApproachDate: closeApproach.close_approach_date,
        riskLevel: level,
        riskScore: score,
        nasaUrl: neo.nasa_jpl_url,
      });
    });
  });

  // Sort by risk score (highest first)
  return asteroids.sort((a, b) => b.riskScore - a.riskScore);
}

// Calculate dashboard statistics
function calculateStats(asteroids: ProcessedAsteroid[]): DashboardStats {
  if (asteroids.length === 0) {
    return {
      totalAsteroids: 0,
      hazardousCount: 0,
      averageVelocity: 0,
      closestApproach: 0,
    };
  }

  const hazardousCount = asteroids.filter((a) => a.isHazardous).length;
  const totalVelocity = asteroids.reduce((sum, a) => sum + a.velocity, 0);
  const closestApproach = Math.min(...asteroids.map((a) => a.missDistance));

  return {
    totalAsteroids: asteroids.length,
    hazardousCount,
    averageVelocity: totalVelocity / asteroids.length,
    closestApproach,
  };
}

// Fetch NEO feed for date range
async function fetchNeoFeed(startDate: string, endDate: string): Promise<NeoFeedResponse> {
  const response = await fetch(
    `${BASE_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`NASA API error: ${response.status}`);
  }

  return response.json();
}

// Fetch specific asteroid by ID
async function fetchAsteroidById(id: string): Promise<NeoLookupResponse> {
  const response = await fetch(`${BASE_URL}/neo/${id}?api_key=${NASA_API_KEY}`);

  if (!response.ok) {
    throw new Error(`NASA API error: ${response.status}`);
  }

  return response.json();
}

// Hook for fetching NEO feed
export function useNeoFeed(days: number = 7) {
  const today = new Date();
  const startDate = formatDate(today);
  const endDate = formatDate(new Date(today.getTime() + days * 24 * 60 * 60 * 1000));

  return useQuery({
    queryKey: ['neoFeed', startDate, endDate],
    queryFn: async () => {
      const data = await fetchNeoFeed(startDate, endDate);
      const asteroids = processAsteroids(data);
      const stats = calculateStats(asteroids);
      return { asteroids, stats, elementCount: data.element_count };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}

// Hook for fetching specific asteroid
export function useAsteroidLookup(id: string | null) {
  return useQuery({
    queryKey: ['asteroid', id],
    queryFn: () => fetchAsteroidById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// Hook for today's asteroids only
export function useTodayNeo() {
  const today = formatDate(new Date());
  
  return useQuery({
    queryKey: ['neoToday', today],
    queryFn: async () => {
      const data = await fetchNeoFeed(today, today);
      const asteroids = processAsteroids(data);
      const stats = calculateStats(asteroids);
      return { asteroids, stats };
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}
