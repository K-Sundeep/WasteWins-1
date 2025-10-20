// Global type definitions for WasteWins

export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  totalDonations: number;
  totalWeight: number;
  joinedAt: string;
}

export interface Donation {
  id: string;
  userId: string;
  category: string;
  weight: number;
  items: string;
  pickupType: 'pickup' | 'dropoff';
  address: string;
  timeSlot?: string;
  distanceKm?: number;
  pickupLocation?: PickupLocation;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  carbonSaved?: number;
  points?: number;
}

export interface PickupLocation {
  id: string;
  name?: string;
  lat: number;
  lon: number;
  operator?: string;
  phone?: string;
  openingHours?: string;
  services?: string[];
  distance?: number;
  formattedDistance?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface CommunityImpact {
  totalDonations: number;
  totalWeight: number;
  carbonSaved: number;
  treesEquivalent: number;
  activeUsers: number;
  partnerFactories: number;
  jobsCreated: number;
  energySaved: number;
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  name: string;
  waste: number;
  products: number;
}

export interface PersonalImpact {
  totalWeight: number;
  pointsEarned: number;
  carbonSaved: number;
  productsMade: number;
  donationBreakdown: DonationBreakdown[];
}

export interface DonationBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherData {
  temperatureC?: number;
  precipitationProb?: number;
  summary?: string;
}

export interface AqiData {
  aqi?: number;
  category?: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous' | 'Unknown';
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  requireAuth?: boolean;
}

// Environment variables type
export interface ImportMetaEnv {
  readonly VITE_CLIMATIQ_API_KEY?: string;
  readonly VITE_MAPBOX_TOKEN?: string;
  readonly VITE_DEFAULT_PICKUP_DISTANCE_KM?: string;
  readonly VITE_FREE_ONLY_MODE?: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
