/**
 * Application-wide constants
 */

// Waste categories
export const WASTE_CATEGORIES = [
  { value: 'clothes', label: 'Clothes & Textiles', icon: '👕', color: 'from-blue-500 to-blue-600' },
  { value: 'biowaste', label: 'Bio-waste & Compost', icon: '🌱', color: 'from-green-500 to-green-600' },
  { value: 'plastic', label: 'Plastic & Packaging', icon: '♻️', color: 'from-purple-500 to-purple-600' },
  { value: 'books', label: 'Books & Paper', icon: '📚', color: 'from-amber-500 to-amber-600' },
  { value: 'electronics', label: 'Electronics', icon: '💻', color: 'from-indigo-500 to-indigo-600' },
  { value: 'glass', label: 'Glass', icon: '🍾', color: 'from-teal-500 to-teal-600' },
  { value: 'metal', label: 'Metal', icon: '🔧', color: 'from-gray-500 to-gray-600' },
] as const;

// Points system
export const POINTS_PER_KG = {
  clothes: 10,
  biowaste: 5,
  plastic: 15,
  books: 8,
  electronics: 20,
  glass: 7,
  metal: 12,
} as const;

// Carbon savings (kg CO2 per kg of waste recycled)
export const CARBON_SAVINGS_PER_KG = {
  clothes: 3.6,
  biowaste: 0.5,
  plastic: 2.0,
  books: 1.5,
  electronics: 4.0,
  glass: 0.3,
  metal: 1.8,
} as const;

// Donation status
export const DONATION_STATUS = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Time slots for pickup
export const TIME_SLOTS = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
] as const;

// Map settings
export const MAP_SETTINGS = {
  DEFAULT_CENTER: [20.5937, 78.9629] as [number, number], // Center of India
  DEFAULT_ZOOM: 13,
  SEARCH_RADIUS_METERS: 50000, // Increased from 10km to 50km for better coverage
  MAX_LOCATIONS_DISPLAY: 20,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    SIGNUP: '/auth/signup',
  },
  USER: {
    PROFILE: '/user/profile',
  },
  DONATIONS: '/donations',
  REWARDS: '/rewards',
  IMPACT: {
    COMMUNITY: '/impact/community',
  },
} as const;

// External API URLs
export const EXTERNAL_APIS = {
  OVERPASS: 'https://overpass-api.de/api/interpreter',
  NOMINATIM: 'https://nominatim.openstreetmap.org',
  OSRM: 'https://router.project-osrm.org',
  OPEN_METEO: 'https://api.open-meteo.com/v1/forecast',
  OPEN_AQ: 'https://api.openaq.org/v2/measurements',
} as const;

// Cache settings
export const CACHE_SETTINGS = {
  DISTANCE_CACHE_PREFIX: 'ww_dist_cache_',
  OSM_CACHE_TTL_MS: 3600000, // 1 hour
  WEATHER_CACHE_TTL_MS: 1800000, // 30 minutes
} as const;

// Validation rules
export const VALIDATION = {
  MIN_WEIGHT_KG: 0.1,
  MAX_WEIGHT_KG: 1000,
  MIN_ADDRESS_LENGTH: 5,
  MAX_ADDRESS_LENGTH: 200,
} as const;

// UI constants
export const UI = {
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_PWA: false,
  ENABLE_OFFLINE_MODE: false,
} as const;
